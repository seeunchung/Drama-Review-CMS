import { supabase } from "@/lib/supabase";
import { STATUS_LABELS } from "@/app/project-meta";

export type BatchStatus = "pending" | "completed" | "failed";

/**
 * 메타데이터 검토 관련 API
 */
export const reviewApi = {
    /**
     * 모든 배치(드라마) 목록 조회
     */
    getBatches: async () => {
        const { data, error } = await supabase
            .from("import_batches")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    },

    /**
     * 특정 배치의 상세 정보 조회
     */
    getBatchById: async (batchId: string) => {
        const { data, error } = await supabase
            .from("import_batches")
            .select("*")
            .eq("id", batchId)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * 특정 배치에 속한 모든 에피소드 조회
     */
    getEpisodesByBatch: async (batchId: string) => {
        const { data, error } = await supabase
            .from("episodes")
            .select("*")
            .eq("batch_id", batchId)
            .order("seq", { ascending: true });

        if (error) throw error;
        return data;
    },

    /**
     * 배치의 상태를 업데이트하고 활동 로그를 기록
     */
    updateBatchStatus: async (batchId: string, dramaTitle: string, status: BatchStatus) => {
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
    uploadPoster: async (batchId: string, file: File) => {
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

        const fileExt = file.name.split('.').pop();
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
};
