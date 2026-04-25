import { supabase } from "@/lib/supabase";

/**
 * 리뷰 큐레이션(댓글 관리) 관련 API
 */
export const curationApi = {
    /**
     * 특정 드라마의 모든 댓글 조회
     */
    getCommentsByDrama: async (dramaId: string) => {
        const { data, error } = await supabase
            .from("drama_comments")
            .select("*")
            .eq("drama_id", dramaId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
    },

    /**
     * 댓글 상태 업데이트 (스포일러, 베스트 등)
     */
    updateCommentStatus: async (commentId: string, updates: Record<string, any>) => {
        const { data, error } = await supabase
            .from("drama_comments")
            .update(updates)
            .eq("id", commentId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },
};
