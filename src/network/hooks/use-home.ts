import { useQuery } from "@tanstack/react-query";
import { homeApi } from "../api/home";

/**
 * 홈페이지 대시보드 데이터를 관리하는 훅
 */
export function useHomeData() {
    // 1. 최근 활동 내역 가져오기
    const activitiesQuery = useQuery({
        queryKey: ["recent-activities"],
        queryFn: () => homeApi.getRecentActivities(),
    });

    // 2. 리뷰 통계 차트 데이터 가져오기
    const reviewStatsQuery = useQuery({
        queryKey: ["review-stats"],
        queryFn: () => homeApi.getReviewStats(),
    });

    // 3. 실시간 리뷰 수 집계 데이터 가져오기
    const reviewCountsQuery = useQuery({
        queryKey: ["review-counts"],
        queryFn: () => homeApi.getReviewCounts(),
    });

    return {
        activities: activitiesQuery.data,
        chartData: reviewStatsQuery.data || [],
        reviewCounts: reviewCountsQuery.data || { total: 0, today: 0, pending: 0, weekly: 0 },
        isLoading: activitiesQuery.isLoading || reviewStatsQuery.isLoading || reviewCountsQuery.isLoading,
        isError: activitiesQuery.isError || reviewStatsQuery.isError || reviewCountsQuery.isError,
        refresh: () => {
            activitiesQuery.refetch();
            reviewStatsQuery.refetch();
            reviewCountsQuery.refetch();
        },
    };
}
