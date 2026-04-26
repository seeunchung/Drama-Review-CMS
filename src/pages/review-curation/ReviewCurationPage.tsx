import React, { useState, useMemo } from "react";
import { ProjectHeader } from "@/components/layout";
import { ReviewStatsCards } from "./components/ReviewStatsCards";
import { EpisodeFilter } from "./components/EpisodeFilter";
import { CommentGrid } from "./components/CommentGrid";
import { ActionPanel } from "./components/ActionPanel";
import { MobilePreviewModal } from "./components/MobilePreviewModal";
import { useReviewCuration } from "@/network/hooks/use-review-curation";
import { useQueryModal } from "@/app/hooks/use-query-modal";
import "./styles.css";

const ReviewCurationPage: React.FC = () => {
  const {
    dramas,
    selectedDramaId,
    setSelectedDramaId,
    comments,
    isLoading,
    toggleStatus
  } = useReviewCuration();

  const [activeEpisode, setActiveEpisode] = useState<number | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string | number | null>(null);
  
  // URL Query Parameter를 사용한 모달 상태 관리
  const { 
    isOpen: isPreviewOpen, 
    open: openPreview, 
    close: closePreview 
  } = useQueryModal('preview');

  // Filter episodes based on comments of selected drama
  const episodes = useMemo(() => {
    const set = new Set(comments.map(c => c.episode_no));
    return Array.from(set).sort((a, b) => a - b);
  }, [comments]);

  // Filtered comments based on episode
  const filteredComments = useMemo(() => {
    return activeEpisode 
      ? comments.filter(c => c.episode_no === activeEpisode)
      : comments;
  }, [comments, activeEpisode]);

  const selectedComment = useMemo(() => {
    return comments.find(c => String(c.id) === String(selectedCommentId)) || null;
  }, [comments, selectedCommentId]);

  // Stats calculation from real data
  const stats = useMemo(() => ({
    totalComments: comments.length,
    spoilerReports: comments.filter(c => c.is_spoiler).length,
    bestSelections: comments.filter(c => c.is_best).length,
  }), [comments]);

  // Handlers
  const handleDramaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDramaId(e.target.value);
    setActiveEpisode(null);
    setSelectedCommentId(null);
  };

  if (isLoading && dramas.length === 0) {
    return <div className="loading-container">데이터를 로드하는 중...</div>;
  }

  return (
    <main className="review-curation-page">
      <ProjectHeader 
        title="Review Curation Center" 
        description="드라마 회차별 댓글 관리 및 베스트 리뷰 선정 워크스페이스"
        tags={["Curation", "Review", "Admin"]}
      />
      
      <div className="review-curation-container">
        <div className="panel drama-selector-bar">
          <span className="selector-label">대상 드라마 선택</span>
          <select 
            className="drama-select" 
            value={selectedDramaId} 
            onChange={handleDramaChange}
          >
            {dramas.map(drama => (
              <option key={drama.id} value={drama.id}>{drama.drama_title}</option>
            ))}
          </select>
        </div>

        <ReviewStatsCards stats={stats} />
        
        <div className="curation-workspace">
          <EpisodeFilter 
            episodes={episodes}
            activeEpisode={activeEpisode}
            onSelect={(ep) => {
              setActiveEpisode(ep);
              setSelectedCommentId(null);
            }}
          />
          
          <CommentGrid 
            comments={filteredComments}
            selectedId={selectedCommentId as any}
            onSelect={(c) => setSelectedCommentId(c.id)}
          />
          
          <ActionPanel 
            comment={selectedComment}
            onToggleSpoiler={(id) => toggleStatus(String(id), "is_spoiler")}
            onToggleBest={(id) => toggleStatus(String(id), "is_best")}
            onOpenPreview={() => openPreview()}
          />
        </div>
      </div>

      <MobilePreviewModal 
        isOpen={isPreviewOpen}
        onClose={closePreview}
        comment={selectedComment}
      />
    </main>
  );
};

export default ReviewCurationPage;
