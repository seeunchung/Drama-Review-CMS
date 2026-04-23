import { supabase } from "@/lib/supabase";

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
        const statusMessage = 
            status === "completed" ? "승인 완료" : 
            status === "failed" ? "승인 거절" : "검토 대기";

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
};
