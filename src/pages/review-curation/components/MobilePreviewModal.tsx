import React from "react";
import { buildReviewAppPreviewUrl } from "@/lib/review-app";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dramaId: string | null;
  dramaTitle: string | null;
}

export const MobilePreviewModal: React.FC<Props> = ({ isOpen, onClose, dramaId, dramaTitle }) => {
  if (!isOpen || !dramaId) return null;

  const previewUrl = buildReviewAppPreviewUrl(dramaId);

  return (
    <div className="curation-preview-overlay" onClick={onClose}>
      <div className="curation-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="curation-preview-modal-header">
          <div>
            <div className="curation-preview-modal-title">리뷰사이트 프리뷰</div>
            <div className="curation-preview-modal-subtitle">
              {dramaTitle || "선택한 드라마"} 상세 페이지
            </div>
          </div>
          <button className="curation-preview-close-button" onClick={onClose}>
            닫기
          </button>
        </div>

        {previewUrl ? (
          <iframe
            className="curation-preview-modal-iframe"
            src={previewUrl}
            title={`Review app preview for ${dramaTitle || dramaId}`}
            loading="lazy"
          />
        ) : (
          <div className="curation-preview-modal-empty">
            리뷰 앱 URL 또는 드라마 ID가 없어 프리뷰를 열 수 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
