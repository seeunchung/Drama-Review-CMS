import { useQuery } from "@tanstack/react-query";
import { homeApi } from "../api/home";

/**
 * 홈페이지 대시보드 데이터를 관리하는 훅
 */
export function useHomeData() {
    // 1. 통계 데이터 가져오기
    const statsQuery = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: () => homeApi.getStats(),
    });

    // 2. 최근 활동 내역 가져오기
    const activitiesQuery = useQuery({
        queryKey: ["recent-activities"],
        queryFn: () => homeApi.getRecentActivities(),
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
