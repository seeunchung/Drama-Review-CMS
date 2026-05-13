import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi, curationApi, type ImportBatch, type CommentStatusUpdates } from "../api";
import { DramaComment } from "@/pages/review-curation/types/review-curation";
import { useModalStore } from "@/app/store";

export function useReviewCuration() {
  const queryClient = useQueryClient();
  const { alert: modalAlert } = useModalStore();
  const [selectedDramaId, setSelectedDramaId] = useState<string>("");

  // 1. 드라마 목록 조회 (승인 완료된 것만)
  const { data: dramas = [] } = useQuery<ImportBatch[]>({
    queryKey: ["dramas", "approved"],
    queryFn: async (): Promise<ImportBatch[]> => {
      const data = await reviewApi.getBatches();
      return data.filter((drama) => drama.status === "completed");
    },
  });

  const activeDramaId =
    selectedDramaId && dramas.some((drama) => drama.id === selectedDramaId)
      ? selectedDramaId
      : dramas[0]?.id || "";

  // 2. 선택된 드라마의 댓글 조회
  const { 
    data: comments = [], 
    isLoading, 
    error 
  } = useQuery<DramaComment[]>({
    queryKey: ["comments", activeDramaId],
    queryFn: () => curationApi.getCommentsByDrama(activeDramaId),
    enabled: !!activeDramaId,
  });

  // 3. 댓글 상태 업데이트 Mutation
  const mutation = useMutation({
    mutationFn: ({ commentId, updates }: { commentId: string; updates: CommentStatusUpdates }) => 
      curationApi.updateCommentStatus(commentId, updates),
    
    // Optimistic Update (낙관적 업데이트)
    onMutate: async ({ commentId, updates }) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey: ["comments", activeDramaId] });

      // 이전 값 저장 (에러 시 롤백용)
      const previousComments = queryClient.getQueryData<DramaComment[]>(["comments", activeDramaId]);

      // 캐시 데이터 즉시 업데이트
      queryClient.setQueryData<DramaComment[]>(["comments", activeDramaId], (old) => 
        old?.map(c => String(c.id) === commentId ? { ...c, ...updates } : c)
      );

      return { previousComments };
    },
    
    // 에러 발생 시 롤백
    onError: async (_err, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", activeDramaId], context.previousComments);
      }
      await modalAlert("상태 업데이트에 실패했습니다.");
    },
    
    // 성공 혹은 에러 후 데이터 최신화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", activeDramaId] });
    },
  });

  const toggleStatus = (commentId: string, field: "is_spoiler" | "is_best") => {
    const target = comments.find(c => String(c.id) === commentId);
    if (!target) return;

    const nextValue = !target[field];
    const updates: CommentStatusUpdates =
      field === "is_spoiler"
        ? { is_spoiler: nextValue }
        : { is_best: nextValue };

    mutation.mutate({ 
      commentId, 
      updates,
    });
  };

  return {
    dramas,
    selectedDramaId: activeDramaId,
    setSelectedDramaId,
    comments,
    isLoading,
    error,
    toggleStatus
  };
}
