import { supabase } from "@/lib/supabase";
import { STATUS_LABELS } from "@/app/project-meta";

export type BatchStatus = "pending" | "completed" | "failed";

export interface ImportBatch {
    id: string;
    created_at: string;
    drama_title: string;
    file_name: string;
    status: BatchStatus;
    poster_url: string | null;
}

export interface EpisodeRecord {
    id: number;
    batch_id: string;
    seq: number;
    title: string;
    distributor: string;
    rating: string;
    episode: number;
    subtitle: string | null;
    running_time: string;
    summary: string;
    status: string;
}

/**
 * 메타데이터 검토 관련 API
 */
export const reviewApi = {
    /**
     * 모든 배치(드라마) 목록 조회
     */
    getBatches: async (): Promise<ImportBatch[]> => {
        const { data, error } = await supabase
            .from("import_batches")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return (data ?? []) as ImportBatch[];
    },

    /**
     * 특정 배치의 상세 정보 조회
     */
    getBatchById: async (batchId: string): Promise<ImportBatch> => {
        const { data, error } = await supabase
            .from("import_batches")
            .select("*")
            .eq("id", batchId)
            .single();

        if (error) throw error;
        return data as ImportBatch;
    },

    /**
     * 특정 배치에 속한 모든 에피소드 조회
     */
    getEpisodesByBatch: async (batchId: string): Promise<EpisodeRecord[]> => {
        const { data, error } = await supabase
            .from("episodes")
            .select("*")
            .eq("batch_id", batchId)
            .order("seq", { ascending: true });

        if (error) throw error;
        return (data ?? []) as EpisodeRecord[];
    },

    /**
     * 배치의 상태를 업데이트하고 활동 로그를 기록
     */
    updateBatchStatus: async (
        batchId: string,
        dramaTitle: string,
        status: BatchStatus,
    ) => {
        // 1. 배치 상태 업데이트
        const { error: batchError } = await supabase
            .from("import_batches")
            .update({ status })
            .eq("id", batchId);

        if (batchError) throw batchError;

        // 2. 활동 로그 기록
        const statusMessage = STATUS_LABELS[status] || "처리됨";

        const { error: logError } = await supabase.from("activities").insert({
            type: "review",
            message: `'${dramaTitle}' 드라마 메타데이터 ${statusMessage} 처리됨`,
            batch_id: batchId,
        });

        if (logError) {
            console.warn("활동 로그 기록 중 오류 발생:", logError);
        }
        
        return { success: true };
    },

    /**
     * 드라마 포스터 업로드
     */
    uploadPoster: async (
        batchId: string,
        file: File,
    ): Promise<{ publicUrl: string }> => {
        // 1. 기존 포스터 정보 조회 (삭제를 위해)
        const { data: currentBatch } = await supabase
            .from("import_batches")
            .select("poster_url")
            .eq("id", batchId)
            .single();

        // 2. 기존 포스터가 있다면 Storage에서 삭제
        if (currentBatch?.poster_url) {
            try {
                // URL에서 파일명 추출 (예: .../posters/filename.jpg -> filename.jpg)
                const urlParts = currentBatch.poster_url.split('/');
                const oldFileName = urlParts[urlParts.length - 1];
                
                if (oldFileName) {
                    await supabase.storage
                        .from('posters')
                        .remove([oldFileName]);
                }
            } catch (error) {
                console.warn("이전 포스터 삭제 실패 (무시하고 진행):", error);
            }
        }

        const fileExt = file.name.split('.').pop() ?? "jpg";
        const fileName = `${batchId}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // 3. Supabase Storage에 새 파일 업로드
        const { error: uploadError } = await supabase.storage
            .from('posters')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 4. 업로드된 파일의 Public URL 가져오기
        const { data: { publicUrl } } = supabase.storage
            .from('posters')
            .getPublicUrl(filePath);

        // 5. import_batches 테이블의 poster_url 업데이트
        const { error: updateError } = await supabase
            .from("import_batches")
            .update({ poster_url: publicUrl })
            .eq("id", batchId);

        if (updateError) throw updateError;

        return { publicUrl };
    },

    /**
     * 특정 배치(드라마)와 연관된 모든 데이터 삭제
     */
    deleteBatch: async (
        batchId: string,
        dramaTitle: string,
    ): Promise<{ success: true }> => {
        // 1. 포스터 삭제를 위해 정보 조회
        const { data: batch } = await supabase
            .from("import_batches")
            .select("poster_url")
            .eq("id", batchId)
            .single();

        // 2. 포스터 파일 삭제
        if (batch?.poster_url) {
            try {
                const urlParts = batch.poster_url.split("/");
                const fileName = urlParts[urlParts.length - 1];
                if (fileName) {
                    await supabase.storage.from("posters").remove([fileName]);
                }
            } catch (error) {
                console.warn("포스터 파일 삭제 실패 (무시하고 진행):", error);
            }
        }

        // 4. 배치 삭제 (episodes, drama_comments는 CASCADE 설정에 의해 자동 삭제됨)
        const { error: deleteError } = await supabase
            .from("import_batches")
            .delete()
            .eq("id", batchId);

        if (deleteError) throw deleteError;

        // 5. 삭제 활동 로그 기록 (batch_id는 삭제되었으므로 null로 기록됨)
        const { error: logError } = await supabase.from("activities").insert({
            type: "review",
            message: `'${dramaTitle}' 드라마 및 관련 데이터가 삭제되었습니다.`,
            batch_id: null, // 데이터가 이미 삭제되었으므로 null 처리
        });

        if (logError) {
            console.warn("삭제 활동 로그 기록 중 오류 발생:", logError);
        }

        return { success: true };
    },
};
