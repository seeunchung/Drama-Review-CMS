import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadApi } from "../api";
import type { BulkUploadRow } from "@/pages/content-import/types/content-import";

interface UploadProgress {
    totalChunks: number;
    currentChunk: number;
    isUploading: boolean;
    progress: number;
}

/**
 * 대량 데이터 업로드를 처리하는 훅
 */
export function useBulkUpload() {
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
        totalChunks: 0,
        currentChunk: 0,
        isUploading: false,
        progress: 0,
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({
            rows,
            dramaTitle,
            fileName,
        }: {
            rows: BulkUploadRow[];
            dramaTitle: string;
            fileName: string;
        }) => {
            const validRows = rows.filter((row) => row.status === "valid");
            if (validRows.length === 0) return;

            // 1. 배치 생성 (기본 status: pending)
            const batchData = await uploadApi.createBatch(dramaTitle, fileName);
            const batchId = batchData.id;

            setUploadProgress({
                totalChunks: 1,
                currentChunk: 0,
                isUploading: true,
                progress: 0,
            });

            // 2. 단일 트랜잭션으로 대량 삽입
            await uploadApi.insertEpisodes(batchId, validRows);

            // 3. 활동 내역 로그 기록
            await uploadApi.logActivity(dramaTitle, validRows.length, batchId);

            setUploadProgress({
                totalChunks: 1,
                currentChunk: 1,
                isUploading: false,
                progress: 100,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["episodes"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
            queryClient.invalidateQueries({ queryKey: ["recent-activities"] });
        },
        onSettled: () => {
            setUploadProgress((prev) => ({ ...prev, isUploading: false }));
        },
    });

    const resetProgress = useCallback(() => {
        setUploadProgress({
            totalChunks: 0,
            currentChunk: 0,
            isUploading: false,
            progress: 0,
        });
    }, []);

    return {
        upload: mutation.mutateAsync,
        isError: mutation.isError,
        error: mutation.error,
        uploadProgress,
        resetProgress,
    };
}
