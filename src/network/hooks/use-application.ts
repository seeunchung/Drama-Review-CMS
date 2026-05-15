import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationApi } from "../api/application";
import { uploadApi } from "../api/upload";
import { StandardEpisode } from "@/app/types/drama";

export function useApplications() {
    return useQuery({
        queryKey: ["applications"],
        queryFn: () => applicationApi.getApplications()
    });
}

export function useApplicationDetail(id: string) {
    return useQuery({
        queryKey: ["application", id],
        queryFn: () => applicationApi.getApplicationDetail(id),
        enabled: !!id
    });
}

/**
 * 사용자 신청 승인 및 데이터 마이그레이션 훅
 */
export function useApproveApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            applicationId,
            dramaTitle,
            episodes
        }: {
            applicationId: string;
            dramaTitle: string;
            episodes: StandardEpisode[];
        }) => {
            // 1. 마스터 배치 생성
            const batch = await uploadApi.createBatch(dramaTitle, "User Application");
            
            // 2. 에피소드 데이터 이관
            await uploadApi.insertEpisodes(batch.id, episodes);

            // 3. 신청 상태 완료 처리
            await applicationApi.updateStatus(applicationId, "completed");

            // 4. 로그 기록
            await uploadApi.logActivity(dramaTitle, episodes.length, batch.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
        }
    });
}

export function useRejectApplication() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: 'completed' | 'failed' }) => applicationApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
        }
    });
}
