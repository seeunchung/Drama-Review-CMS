import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import type { BulkUploadRow } from "../types/content-import";

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

            // 1. import_batches 레코드 생성 (Master 데이터)
            const { data: batchData, error: batchError } = await supabase
                .from("import_batches")
                .insert({
                    drama_title: dramaTitle,
                    file_name: fileName,
                    status: "pending",
                })
                .select()
                .single();

            if (batchError) throw batchError;
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

                // DB 컬럼명에 맞춰 데이터 변환 및 batch_id 추가
                const insertData = chunk.map((row) => ({
                    batch_id: batchId,
                    seq: row.seq,
                    title: row.title,
                    distributor: row.distributor,
                    rating: row.rating,
                    episode: row.episode,
                    subtitle: row.subtitle,
                    running_time: row.runningTime,
                    summary: row.summary,
                    status: "uploaded",
                }));

                const { error } = await supabase
                    .from("episodes")
                    .insert(insertData);

                if (error) throw error;

                // 시각적 효과를 위한 의도적인 딜레이 (데모용)
                await new Promise((resolve) => setTimeout(resolve, 800));

                // 진행 상태 업데이트
                setUploadProgress((prev) => ({
                    ...prev,
                    currentChunk: i + 1,
                    progress: Math.round(((i + 1) / chunks.length) * 100),
                }));
            }

            // 4. 활동 내역(activities)에 로그 기록
            const { error: activityError } = await supabase.from("activities").insert({
                type: "upload",
                message: `'${dramaTitle}' ${validRows.length}개 에피소드 업로드 완료`,
                batch_id: batchId,
            });

            if (activityError) {
                console.warn("활동 로그 기록 중 오류가 발생했습니다:", activityError);
                // 로그 기록 실패가 전체 업로드 실패는 아니므로 throw는 하지 않습니다.
            }
        },
        onSuccess: () => {
            // 업로드 성공 시 관련 쿼리 무효화 (필요시)
            queryClient.invalidateQueries({ queryKey: ["episodes"] });
        },
        onSettled: () => {
            // 최종적으로 상태 초기화는 하지 않고, UI에서 완료 상태를 유지하도록 함
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
