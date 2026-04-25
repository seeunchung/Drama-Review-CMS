import React from "react";
import { DramaComment } from "../types/review-curation";

interface Props {
  comments: DramaComment[];
  selectedId: number | null;
  onSelect: (comment: DramaComment) => void;
}

export const CommentGrid: React.FC<Props> = ({ comments, selectedId, onSelect }) => {
  return (
    <div className="panel comment-grid-container">
      <div className="grid-header">
        <div>회차</div>
        <div>작성자</div>
        <div>내용</div>
        <div>별점</div>
        <div>상태</div>
      </div>
      <div className="grid-body">
        {comments.map(comment => (
          <div 
            key={comment.id}
            className={`comment-row 
              ${selectedId === comment.id ? 'selected' : ''} 
              ${comment.is_spoiler ? 'is-spoiler' : ''} 
              ${comment.is_best ? 'is-best' : ''}`
            }
            onClick={() => onSelect(comment)}
          >
            <div>{comment.episode_no}화</div>
            <div className="cell-content">{comment.user_nickname}</div>
            <div className="cell-content">{comment.content}</div>
            <div className="rating-stars">{"★".repeat(comment.rating)}</div>
            <div>
              {comment.is_best && <span style={{color: 'var(--accent-gold)', fontWeight: 'bold'}}>Best</span>}
              {comment.is_spoiler && <span style={{color: 'var(--brand-red)', marginLeft: '8px'}}>Spoiler</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
