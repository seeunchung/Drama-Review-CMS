import { useState, useEffect, useCallback } from "react";
import { reviewApi, type BatchStatus } from "../api/review";

/**
 * 배치 목록 조회를 위한 커스텀 훅
 */
export function useBatches() {
    const [batches, setBatches] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadBatches = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await reviewApi.getBatches();
            setBatches(data);
        } catch (err: any) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBatches();
    }, [loadBatches]);

    return { batches, isLoading, error, refresh: loadBatches };
}

/**
 * 특정 배치 상세 및 에피소드 조회를 위한 커스텀 훅
 */
export function useBatchDetail(batchId: string | undefined) {
    const [batch, setBatch] = useState<any>(null);
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadDetail = useCallback(async () => {
        if (!batchId) return;
        try {
            setIsLoading(true);
            const [batchData, episodesData] = await Promise.all([
                reviewApi.getBatchById(batchId),
                reviewApi.getEpisodesByBatch(batchId),
            ]);
            setBatch(batchData);
            setEpisodes(episodesData);
        } catch (err: any) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [batchId]);

    useEffect(() => {
        loadDetail();
    }, [loadDetail]);

    const updateStatus = async (status: BatchStatus) => {
        if (!batchId || !batch) return;
        try {
            await reviewApi.updateBatchStatus(batchId, batch.drama_title, status);
            await loadDetail(); // 상태 업데이트 후 다시 로드
            return { success: true };
        } catch (err: any) {
            setError(err);
            return { success: false, error: err };
        }
    };

    return { batch, episodes, isLoading, error, updateStatus, refresh: loadDetail };
}
