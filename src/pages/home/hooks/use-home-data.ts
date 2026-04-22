import { useQuery } from "@tanstack/react-query";
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
 * 홈페이지 대시보드 데이터를 가져오는 훅
 */
export function useHomeData() {
    // 1. 통계 데이터 가져오기
    const statsQuery = useQuery<DashboardStats>({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("dashboard_stats")
                .select("*")
                .single();

            if (error) throw error;
            return data;
        },
    });

    // 2. 최근 활동 내역 가져오기 (최신순 10건)
    const activitiesQuery = useQuery<ActivityLog[]>({
        queryKey: ["recent-activities"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("activities")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(10);

            if (error) throw error;
            return data;
        },
    });

    return {
        stats: statsQuery.data,
        activities: activitiesQuery.data,
        isLoading: statsQuery.isLoading || activitiesQuery.isLoading,
        isError: statsQuery.isError || activitiesQuery.isError,
        refetch: () => {
            statsQuery.refetch();
            activitiesQuery.refetch();
        },
    };
}
