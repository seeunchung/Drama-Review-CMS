import { supabase } from "@/lib/supabase";

export interface DashboardStats {
    weekly_new_series: number;
    pending_reviews: number;
    active_reviewers: number;
    integrity_errors: number;
}

export interface ActivityLog {
    id: string;
    created_at: string;
    type: string;
    message: string;
    user_name: string;
}

/**
 * 홈페이지 대시보드 관련 API
 */
export const homeApi = {
    /**
     * 대시보드 통계 데이터 조회
     */
    getStats: async () => {
        const { data, error } = await supabase
            .from("dashboard_stats")
            .select("*")
            .single();

        if (error) throw error;
        return data as DashboardStats;
    },

    /**
     * 최근 활동 내역 조회
     */
    getRecentActivities: async (limit = 10) => {
        const { data, error } = await supabase
            .from("activities")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data as ActivityLog[];
    },
};
