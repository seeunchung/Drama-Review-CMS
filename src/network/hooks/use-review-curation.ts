import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "../api/review";
import { curationApi } from "../api/curation";
import { DramaComment } from "@/pages/review-curation/types/review-curation";
import { useModalStore } from "@/app/store/use-modal-store";

export function useReviewCuration() {
  const queryClient = useQueryClient();
  const { alert: modalAlert } = useModalStore();
  const [selectedDramaId, setSelectedDramaId] = useState<string>("");

  // 1. 드라마 목록 조회 (승인 완료된 것만)
  const { data: dramas = [] } = useQuery({
    queryKey: ["dramas", "approved"],
    queryFn: async () => {
      const data = await reviewApi.getBatches();
      return data.filter((d: any) => d.status === "completed");
    },
  });

  // 드라마 목록이 로드되면 첫 번째 드라마를 자동 선택
  useEffect(() => {
    if (dramas.length > 0 && !selectedDramaId) {
      setSelectedDramaId(dramas[0].id);
    }
  }, [dramas, selectedDramaId]);

  // 2. 선택된 드라마의 댓글 조회
  const { 
    data: comments = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["comments", selectedDramaId],
    queryFn: () => curationApi.getCommentsByDrama(selectedDramaId),
    enabled: !!selectedDramaId,
  });

  // 3. 댓글 상태 업데이트 Mutation
  const mutation = useMutation({
    mutationFn: ({ commentId, updates }: { commentId: string; updates: Partial<DramaComment> }) => 
      curationApi.updateCommentStatus(commentId, updates),
    
    // Optimistic Update (낙관적 업데이트)
    onMutate: async ({ commentId, updates }) => {
      // 진행 중인 refetch 취소
      await queryClient.cancelQueries({ queryKey: ["comments", selectedDramaId] });

      // 이전 값 저장 (에러 시 롤백용)
      const previousComments = queryClient.getQueryData<DramaComment[]>(["comments", selectedDramaId]);

      // 캐시 데이터 즉시 업데이트
      queryClient.setQueryData<DramaComment[]>(["comments", selectedDramaId], (old) => 
        old?.map(c => String(c.id) === commentId ? { ...c, ...updates } : c)
      );

      return { previousComments };
    },
    
    // 에러 발생 시 롤백
    onError: async (_err, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(["comments", selectedDramaId], context.previousComments);
      }
      await modalAlert("상태 업데이트에 실패했습니다.");
    },
    
    // 성공 혹은 에러 후 데이터 최신화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", selectedDramaId] });
    },
  });

  const toggleStatus = (commentId: string, field: "is_spoiler" | "is_best") => {
    const target = comments.find(c => String(c.id) === commentId);
    if (!target) return;

    mutation.mutate({ 
      commentId, 
      updates: { [field]: !target[field] } 
    });
  };

  return {
    dramas,
    selectedDramaId,
    setSelectedDramaId,
    comments,
    isLoading,
    error,
    toggleStatus
  };
}
