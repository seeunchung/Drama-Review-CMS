import { supabase } from "@/lib/supabase";
import { 
    DramaApplicationEntity, 
    EpisodeApplicationEntity 
} from "@/app/types/drama";

/**
 * 사용자 신청 관리 관련 API
 */
export const applicationApi = {
    /**
     * 신청 내역 목록 조회
     */
    getApplications: async () => {
        const { data, error } = await supabase
            .from("drama_applications")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data as DramaApplicationEntity[];
    },

    /**
     * 신청 상세 정보 조회 (마스터 + 에피소드)
     */
    getApplicationDetail: async (id: string) => {
        // 1. 마스터 정보 조회
        const { data: master, error: masterError } = await supabase
            .from("drama_applications")
            .select("*")
            .eq("id", id)
            .single();

        if (masterError) throw masterError;

        // 2. 에피소드 목록 조회
        const { data: episodes, error: episodesError } = await supabase
            .from("episode_applications")
            .select("*")
            .eq("application_id", id)
            .order("episode_no", { ascending: true });

        if (episodesError) throw episodesError;

        return {
            master: master as DramaApplicationEntity,
            episodes: episodes as EpisodeApplicationEntity[]
        };
    },

    /**
     * 신청 상태 변경 (승인/거절)
     */
    updateStatus: async (id: string, status: 'completed' | 'failed') => {
        // Supabase에서 UUID 비교를 위해 id가 정확한지 확인
        const { error } = await supabase
            .from("drama_applications")
            .update({ status: status })
            .eq("id", id);

        if (error) {
            console.error("Supabase update error:", error);
            throw error;
        }
    }
};
