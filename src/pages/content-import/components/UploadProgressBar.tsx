interface UploadProgressBarProps {
    progress: number;
    currentChunk: number;
    totalChunks: number;
    isUploading: boolean;
    onClose?: () => void;
}

/**
 * 화면 하단에 고정되어 업로드 진행 상황을 보여주는 바 컴포넌트
 */
export function UploadProgressBar({
    progress,
    currentChunk,
    totalChunks,
    isUploading,
    onClose,
}: UploadProgressBarProps) {
    const isComplete = progress === 100 && !isUploading;

    return (
        <div className={`upload-progress-toast ${isComplete ? "is-complete" : ""}`}>
            <div className="progress-toast-header">
                <div className="progress-info">
                    <strong>
                        {isComplete
                            ? "업로드 완료!"
                            : `데이터 저장 중... (${currentChunk}/${totalChunks})`}
                    </strong>
                    <span className="progress-percentage">{progress}%</span>
                </div>
                {isComplete && (
                    <button className="progress-close" onClick={onClose}>
                        ✕
                    </button>
                )}
            </div>

            <div className="progress-bar-track">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {!isComplete && (
                <p className="progress-footnote">
                    백엔드로 데이터를 나누어 전송하고 있습니다. 다른 작업을 계속할 수 있습니다.
                </p>
            )}
        </div>
    );
}
