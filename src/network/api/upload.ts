import { supabase } from "@/lib/supabase";
import { StandardEpisode } from "@/app/types/drama";

/**
 * 업로드 관련 API
 */
export const uploadApi = {
    /**
     * 새로운 업로드 배치(Batch) 생성
     */
    createBatch: async (dramaTitle: string, fileName: string) => {
        const { data, error } = await supabase
            .from("import_batches")
            .insert({
                drama_title: dramaTitle,
                file_name: fileName,
                status: "pending", // 관리자 검토 대기 상태
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * 배치에 속한 에피소드 데이터들을  삽입 (단일 트랜잭션)
     */
    insertEpisodes: async (batchId: string, rows: StandardEpisode[]) => {
        const insertData = rows.map((row: any) => ({
            batch_id: batchId,
            seq: row.seq,
            title: row.title,
            distributor: row.distributor,
            rating: row.rating,
            episode: row.episode,
            subtitle: row.subtitle,
            running_time: row.runningTime || row.running_time,
            summary: row.summary,
            status: "uploaded",
        }));

        // Supabase insert는 기본적으로 단일 요청에 대해 원자성을 보장합니다.
        const { error } = await supabase.from("episodes").insert(insertData);

        if (error) throw error;
    },

    /**
     * 업로드 완료 활동 로그 기록
     */
    logActivity: async (dramaTitle: string, count: number, batchId: string) => {
        const { error } = await supabase.from("activities").insert({
            type: "upload",
            message: `'${dramaTitle}' ${count}개 에피소드 업로드 완료`,
            batch_id: batchId,
        });

        if (error) {
            console.warn("활동 로그 기록 중 오류가 발생했습니다:", error);
        }
    },
};
