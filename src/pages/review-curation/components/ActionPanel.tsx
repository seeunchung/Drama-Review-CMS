import React from "react";
import { DramaComment } from "../types/review-curation";

interface Props {
  comment: DramaComment | null;
  onToggleSpoiler: (id: string | number) => void;
  onToggleBest: (id: string | number) => void;
}

export const ActionPanel: React.FC<Props> = ({ 
  comment, 
  onToggleSpoiler, 
  onToggleBest
}) => {
  if (!comment) {
    return (
      <div className="panel curation-action-panel">
        <div className="curation-empty-state">
          댓글을 선택하면 상세 정보가 표시됩니다.
        </div>
      </div>
    );
  }

  return (
    <div className="panel curation-action-panel">
      <div className="curation-detail-header">
        <div className="curation-detail-user">{comment.user_nickname}</div>
        <div className="curation-detail-meta">
          {comment.episode_no}화 • {new Date(comment.created_at).toLocaleString()}
        </div>
      </div>
      
      <div className="curation-detail-content">{comment.content}</div>
      
      <div className="curation-action-buttons">
        <button 
          className={`curation-toggle-button ${comment.is_spoiler ? 'is-spoiler-active' : ''}`}
          onClick={() => onToggleSpoiler(comment.id)}
        >
          {comment.is_spoiler ? '스포일러 해제' : '스포일러 지정'}
        </button>
        <button 
          className={`curation-toggle-button ${comment.is_best ? 'is-best-active' : ''}`}
          onClick={() => onToggleBest(comment.id)}
        >
          {comment.is_best ? '베스트 해제' : '베스트 선정'}
        </button>
      </div>
    </div>
  );
};
