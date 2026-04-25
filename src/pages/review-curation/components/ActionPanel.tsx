import React from "react";
import { DramaComment } from "../types/review-curation";

interface Props {
  comment: DramaComment | null;
  onToggleSpoiler: (id: number) => void;
  onToggleBest: (id: number) => void;
  onOpenPreview: () => void;
}

export const ActionPanel: React.FC<Props> = ({ 
  comment, 
  onToggleSpoiler, 
  onToggleBest, 
  onOpenPreview 
}) => {
  if (!comment) {
    return (
      <div className="panel action-panel">
        <div style={{ color: 'var(--ink-soft)', textAlign: 'center', marginTop: '40px' }}>
          댓글을 선택하면 상세 정보가 표시됩니다.
        </div>
      </div>
    );
  }

  return (
    <div className="panel action-panel">
      <div className="detail-header">
        <div className="detail-user">{comment.user_nickname}</div>
        <div className="detail-meta">
          {comment.episode_no}화 • {new Date(comment.created_at).toLocaleString()}
        </div>
      </div>
      
      <div className="detail-content">{comment.content}</div>
      
      <div className="action-buttons">
        <button 
          className={`btn-toggle ${comment.is_spoiler ? 'active-spoiler' : ''}`}
          onClick={() => onToggleSpoiler(comment.id)}
        >
          {comment.is_spoiler ? '스포일러 해제' : '스포일러 지정'}
        </button>
        <button 
          className={`btn-toggle ${comment.is_best ? 'active-best' : ''}`}
          onClick={() => onToggleBest(comment.id)}
        >
          {comment.is_best ? '베스트 해제' : '베스트 선정'}
        </button>
        
        {comment.is_best && (
          <button className="btn-preview" onClick={onOpenPreview}>
            모바일 프리뷰 보기
          </button>
        )}
      </div>
    </div>
  );
};
