import React from "react";
import { DramaComment } from "../types/review-curation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  comment: DramaComment | null;
}

export const MobilePreviewModal: React.FC<Props> = ({ isOpen, onClose, comment }) => {
  if (!isOpen || !comment) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="mobile-simulator" onClick={e => e.stopPropagation()}>
        <div className="simulator-screen">
          <div className="simulator-header">에피소드 상세</div>
          <div className="simulator-content">
            <div className="best-badge">BEST COMMENT</div>
            <div className="mobile-comment-card">
              <div className="mobile-user">{comment.user_nickname}</div>
              <div className="mobile-text">{comment.content}</div>
              <div style={{ marginTop: '12px', color: 'var(--accent-gold)', fontSize: '12px' }}>
                {"★".repeat(comment.rating)}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 'auto', padding: '20px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: '12px' }}>
            모바일 앱 실제 적용 화면 예시입니다.
          </div>
        </div>
      </div>
    </div>
  );
};
