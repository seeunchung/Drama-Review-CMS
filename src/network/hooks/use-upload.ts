import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadApi } from "../api/upload";
import type { BulkUploadRow } from "@/pages/content-import/types/content-import";

interface UploadProgress {
    totalChunks: number;
    currentChunk: number;
    isUploading: boolean;
    progress: number;
}

/**
 * 대량 데이터 업로드를 청크 단위로 처리하는 훅
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
            chunkSize = 10,
        }: {
            rows: BulkUploadRow[];
            dramaTitle: string;
            fileName: string;
            chunkSize?: number;
        }) => {
            const validRows = rows.filter((row) => row.status === "valid");
            if (validRows.length === 0) return;

            // 1. 배치 생성
            const batchData = await uploadApi.createBatch(dramaTitle, fileName);
            const batchId = batchData.id;

            // 2. 데이터를 청크 단위로 나누기
            const chunks = [];
            for (let i = 0; i < validRows.length; i += chunkSize) {
                chunks.push(validRows.slice(i, i + chunkSize));
            }

            setUploadProgress({
                totalChunks: chunks.length,
                currentChunk: 0,
                isUploading: true,
                progress: 0,
            });

            // 3. 순차적으로 업로드 진행
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];

                await uploadApi.insertEpisodes(batchId, chunk);

                // 시각적 피드백을 위한 의도적인 딜레이 (UX 최적화)
                await new Promise((resolve) => setTimeout(resolve, 600));

                // 진행 상태 업데이트
                setUploadProgress((prev) => ({
                    ...prev,
                    currentChunk: i + 1,
                    progress: Math.round(((i + 1) / chunks.length) * 100),
                }));
            }

            // 4. 활동 내역 로그 기록
            await uploadApi.logActivity(dramaTitle, validRows.length, batchId);
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
