import React, { useState, useMemo } from "react";
import { ProjectHeader } from "@/components/layout";
import { ReviewStatsCards } from "./components/ReviewStatsCards";
import { EpisodeFilter } from "./components/EpisodeFilter";
import { CommentGrid } from "./components/CommentGrid";
import { ActionPanel } from "./components/ActionPanel";
import { MobilePreviewModal } from "./components/MobilePreviewModal";
import { MOCK_COMMENTS, MOCK_STATS } from "./mocks/review-curation";
import { DramaComment } from "./types/review-curation";
import "./styles.css";

const DRAMAS = [
  { id: 1, title: "화서인: 생사의 수레바퀴" },
  { id: 2, title: "장가행 (The Long Ballad)" },
  { id: 3, title: "삼생삼세 십리도화" },
];

const ReviewCurationPage: React.FC = () => {
  const [selectedDramaId, setSelectedDramaId] = useState<number>(DRAMAS[0].id);
  const [comments, setComments] = useState<DramaComment[]>(MOCK_COMMENTS);
  const [activeEpisode, setActiveEpisode] = useState<number | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filter episodes based on selected drama (Mock logic)
  const episodes = useMemo(() => {
    // 실제 데이터라면 dramaId로 필터링하겠지만, 여기선 데모를 위해 고정된 리스트를 보여줍니다.
    const set = new Set(MOCK_COMMENTS.map(c => c.episode_no));
    return Array.from(set).sort((a, b) => a - b);
  }, []);

  // Filtered comments based on drama and episode
  const filteredComments = useMemo(() => {
    // 드라마 선택에 따라 다른 댓글을 보여주는 척 하기 위해 dramaId를 조건으로 사용 가능
    return activeEpisode 
      ? comments.filter(c => c.episode_no === activeEpisode)
      : comments;
  }, [comments, activeEpisode, selectedDramaId]);

  const selectedComment = useMemo(() => {
    return comments.find(c => c.id === selectedCommentId) || null;
  }, [comments, selectedCommentId]);

  // Handlers
  const handleDramaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDramaId(Number(e.target.value));
    setActiveEpisode(null);
    setSelectedCommentId(null);
  };

  const handleToggleSpoiler = (id: number) => {
    setComments(prev => prev.map(c => 
      c.id === id ? { ...c, is_spoiler: !c.is_spoiler } : c
    ));
    console.log(`Comment ${id} spoiler status toggled`);
  };

  const handleToggleBest = (id: number) => {
    setComments(prev => prev.map(c => 
      c.id === id ? { ...c, is_best: !c.is_best } : c
    ));
    console.log(`Comment ${id} best status toggled`);
  };

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
            {DRAMAS.map(drama => (
              <option key={drama.id} value={drama.id}>{drama.title}</option>
            ))}
          </select>
        </div>

        <ReviewStatsCards stats={MOCK_STATS} />
        
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
            onToggleSpoiler={handleToggleSpoiler}
            onToggleBest={handleToggleBest}
            onOpenPreview={() => setIsPreviewOpen(true)}
          />
        </div>
      </div>

      <MobilePreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        comment={selectedComment}
      />
    </main>
  );
};

export default ReviewCurationPage;
