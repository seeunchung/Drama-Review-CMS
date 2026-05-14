interface UploadProgressBarProps {
    progress: number;
    onClose?: () => void;
}

/**
 * 화면 하단에 고정되어 업로드 진행 상황을 보여주는 바 컴포넌트
 */
export function UploadProgressBar({
    progress,
    onClose,
}: UploadProgressBarProps) {
    // progress가 100에 도달하면 완료 상태로 간주
    const isComplete = progress === 100;

    return (
        <div className={`upload-progress-toast ${isComplete ? "is-complete" : ""}`}>
            <div className="progress-toast-header">
                <div className="progress-info">
                    <strong>
                        {isComplete
                            ? "데이터 저장 완료"
                            : "데이터 저장 중..."}
                    </strong>
                    <span className="progress-percentage">{progress}%</span>
                </div>
                {isComplete && (
                    <button 
                        className="progress-close" 
                        onClick={onClose}
                        title="닫기"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="progress-bar-track">
                <div
                    className="progress-bar-fill"
                    style={{ 
                        width: `${progress}%`,
                        transition: isComplete ? "none" : "width 0.4s ease" 
                    }}
                />
            </div>

            <p className="progress-footnote">
                {isComplete 
                    ? "저장되었습니다."
                    : "저장 중입니다."}
            </p>
        </div>
    );
}
