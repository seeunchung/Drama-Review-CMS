import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toError } from "@/lib/error";
import {
    reviewApi,
    type BatchStatus,
    type EpisodeRecord,
    type ImportBatch,
} from "../api/review";

interface BatchDetailData {
    batch: ImportBatch;
    episodes: EpisodeRecord[];
}

export type ReviewActionResult =
    | { success: true }
    | { success: false; error: Error };

export type PosterUploadResult =
    | { success: true; publicUrl: string }
    | { success: false; error: Error };

/**
 * 배치 목록 조회를 위한 커스텀 훅
 */
export function useBatches() {
    const { 
        data: batches = [], 
        isLoading, 
        error, 
        refetch 
    } = useQuery({
        queryKey: ["batches"],
        queryFn: () => reviewApi.getBatches(),
    });

    return { batches, isLoading, error, refresh: refetch };
}

/**
 * 특정 배치 상세 및 에피소드 조회를 위한 커스텀 훅
 */
export function useBatchDetail(batchId: string | undefined) {
    const queryClient = useQueryClient();

    // 1. 배치 상세 정보 및 에피소드 조회
    const { 
        data, 
        isLoading, 
        error, 
        refetch 
    } = useQuery<BatchDetailData>({
        queryKey: ["batch-detail", batchId],
        queryFn: async () => {
            if (!batchId) throw new Error("Batch ID is required");
            const [batchData, episodesData] = await Promise.all([
                reviewApi.getBatchById(batchId),
                reviewApi.getEpisodesByBatch(batchId),
            ]);
            return { batch: batchData, episodes: episodesData };
        },
        enabled: !!batchId,
    });

    // 2. 배치 상태 업데이트 Mutation
    const mutation = useMutation({
        mutationFn: ({ status }: { status: BatchStatus }) => {
            if (!batchId || !data?.batch) throw new Error("Required data missing");
            return reviewApi.updateBatchStatus(batchId, data.batch.drama_title, status);
        },
        onSuccess: () => {
            // 상세 정보와 전체 목록 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ["batch-detail", batchId] });
            queryClient.invalidateQueries({ queryKey: ["batches"] });
        },
    });

    const updateStatus = async (status: BatchStatus): Promise<ReviewActionResult> => {
        try {
            await mutation.mutateAsync({ status });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: toError(error, "상태 업데이트에 실패했습니다."),
            };
        }
    };

    // 3. 포스터 업로드 Mutation
    const posterMutation = useMutation({
        mutationFn: (file: File) => {
            if (!batchId) throw new Error("Batch ID is required");
            return reviewApi.uploadPoster(batchId, file);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["batch-detail", batchId] });
            queryClient.invalidateQueries({ queryKey: ["batches"] });
        },
    });

    const uploadPoster = async (file: File): Promise<PosterUploadResult> => {
        try {
            const { publicUrl } = await posterMutation.mutateAsync(file);
            return { success: true, publicUrl };
        } catch (error) {
            return {
                success: false,
                error: toError(error, "포스터 업로드에 실패했습니다."),
            };
        }
    };

    return { 
        batch: data?.batch || null, 
        episodes: data?.episodes || [], 
        isLoading, 
        error, 
        updateStatus, 
        uploadPoster,
        isUploadingPoster: posterMutation.isPending,
        refresh: refetch 
    };
}
