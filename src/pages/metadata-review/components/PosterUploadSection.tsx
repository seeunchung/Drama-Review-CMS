import React, { useRef } from "react";

interface PosterUploadSectionProps {
    posterUrl: string | null;
    isUploading: boolean;
    disabled?: boolean;
    onUpload: (file: File) => Promise<void>;
}

export function PosterUploadSection({
    posterUrl,
    isUploading,
    disabled,
    onUpload,
}: PosterUploadSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && !disabled) {
            await onUpload(file);
        }
    };

    const triggerUpload = () => {
        if (disabled) return;
        fileInputRef.current?.click();
    };

    return (
        <section className={`metadata-review-poster-section ${disabled ? 'is-disabled' : ''}`}>
            <div className="metadata-review-poster-preview">
                {posterUrl ? (
                    <img src={posterUrl} alt="드라마 포스터" />
                ) : (
                    <div className="metadata-review-poster-empty">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                            />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>포스터 없음</span>
                    </div>
                )}
            </div>

            <div className="metadata-review-poster-info">
                <h3>드라마 포스터 관리</h3>
                <p>
                    리뷰 사이트의 메인 및 상세 페이지에 노출될 드라마 대표
                    포스터 이미지를 관리합니다.
                    <br />
                    권장 비율은 2:3이며, 고화질 이미지를 권장합니다.
                </p>

                <div className="metadata-review-poster-controls">
                    <input
                        type="file"
                        accept="image/*"
                        className="metadata-review-poster-input"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={disabled}
                    />
                    <button
                        className="btn-primary metadata-review-poster-trigger"
                        onClick={triggerUpload}
                        disabled={isUploading || disabled}
                        title={disabled ? "승인 거절된 상태에서는 포스터를 수정할 수 없습니다." : ""}
                    >
                        {isUploading
                            ? "업로드 중..."
                            : posterUrl
                            ? "포스터 변경"
                              : "포스터 업로드"}
                    </button>
                    <span className="metadata-review-poster-hint">
                        {disabled 
                            ? "❌ 승인 거절된 데이터는 포스터 수정을 할 수 없습니다." 
                            : "JPG, PNG, WEBP 지원 (최대 5MB)"}
                    </span>
                </div>
            </div>
        </section>
    );
}
