import { supabase } from "@/lib/supabase";

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

    /**
     * 드라마별 리뷰 개수 통계 조회 (Top 5)
     */
    getReviewStats: async () => {
        const { data, error } = await supabase
            .from("import_batches")
            .select(`
                id,
                drama_title,
                drama_comments (count)
            `)
            .eq("status", "completed");

        if (error) throw error;

        const stats = data
            .map((item: any) => ({
                name: item.drama_title,
                count: item.drama_comments[0]?.count || 0
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return stats;
    },

    /**
     * 실시간 전체 리뷰, 오늘 유입 리뷰, 검토 대기 드라마, 주간 신규 드라마 수 집계
     */
    getReviewCounts: async () => {
        // 1. 전체 리뷰 수
        const { count: totalCount, error: totalError } = await supabase
            .from("drama_comments")
            .select("*", { count: 'exact', head: true });

        if (totalError) throw totalError;

        // 2. 오늘 유입 리뷰 수
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { count: todayCount, error: todayError } = await supabase
            .from("drama_comments")
            .select("*", { count: 'exact', head: true })
            .gte("created_at", today.toISOString());

        if (todayError) throw todayError;

        // 3. 검토 대기 드라마 수
        const { count: pendingCount, error: pendingError } = await supabase
            .from("import_batches")
            .select("*", { count: 'exact', head: true })
            .eq("status", "pending");

        if (pendingError) throw pendingError;

        // 4. 이번 주 신규 등록 드라마 수 (최근 7일)
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const { count: weeklyCount, error: weeklyError } = await supabase
            .from("import_batches")
            .select("*", { count: 'exact', head: true })
            .gte("created_at", lastWeek.toISOString());

        if (weeklyError) throw weeklyError;

        return {
            total: totalCount || 0,
            today: todayCount || 0,
            pending: pendingCount || 0,
            weekly: weeklyCount || 0
        };
    }
};
