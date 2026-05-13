import React, { useState, useMemo } from "react";
import { ProjectHeader } from "@/components/layout";
import {
  ReviewStatsCards,
  EpisodeFilter,
  CommentGrid,
  ActionPanel,
  MobilePreviewModal,
  EpisodeTrendChart
} from "./components";
import { useReviewCuration } from "@/network/hooks";
import { useQueryModal } from "@/app/hooks";
import { ADMIN_TASKS } from "@/app/project-meta";
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

  // 메타데이터 정보 추출
  const pageMeta = ADMIN_TASKS.find(t => t.id === "review-curation");

  const [activeEpisode, setActiveEpisode] = useState<number | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string | number | null>(null);
  
  const { 
    isOpen: isPreviewOpen, 
    open: openPreview, 
    close: closePreview 
  } = useQueryModal('preview');

  // 회차 목록 추출
  const episodes = useMemo(() => {
    const set = new Set(comments.map(c => c.episode_no));
    return Array.from(set).sort((a, b) => a - b);
  }, [comments]);

  // 차트 데이터 계산 (회차별 리뷰 수)
  const chartData = useMemo(() => {
    if (episodes.length === 0) return [];
    
    // 1회부터 마지막 회차까지 연속된 데이터 생성
    const maxEp = Math.max(...episodes);
    const data = [];
    
    for (let i = 1; i <= maxEp; i++) {
      const count = comments.filter(c => c.episode_no === i).length;
      data.push({ episode: i, count });
    }
    
    return data;
  }, [comments, episodes]);

  // 선택된 회차의 댓글 필터링
  const filteredComments = useMemo(() => {
    return activeEpisode 
      ? comments.filter(c => c.episode_no === activeEpisode)
      : comments;
  }, [comments, activeEpisode]);

  const selectedComment = useMemo(() => {
    return comments.find(c => String(c.id) === String(selectedCommentId)) || null;
  }, [comments, selectedCommentId]);

  const stats = useMemo(() => ({
    totalComments: comments.length,
    spoilerReports: comments.filter(c => c.is_spoiler).length,
    bestSelections: comments.filter(c => c.is_best).length,
  }), [comments]);

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
        title={pageMeta?.title || "리뷰 큐레이션"} 
        description={pageMeta?.description || ""}
        tags={pageMeta?.tags || []}
      />
      
      <div className="review-curation-container">
        <div className="panel drama-selector-bar">
          <div className="selector-info">
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
        </div>

        <ReviewStatsCards stats={stats} />

        {/* 회차별 트렌드 차트 추가 */}
        <EpisodeTrendChart data={chartData} />
        
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
            selectedId={selectedCommentId}
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
