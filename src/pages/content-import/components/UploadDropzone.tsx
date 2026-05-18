import { useId, useState } from "react";

interface UploadDropzoneProps {
    onFileSelect: (file: File) => void;
}

// 드래그 앤 드롭과 일반 파일 선택을 한 컴포넌트로 묶는다.
function UploadDropzone({ onFileSelect }: UploadDropzoneProps) {
    const inputId = useId();
    const [isDragging, setIsDragging] = useState(false);

    // 실제로는 첫 파일 1건만 데모 상태로 넘긴다.
    const handleFileList = (files: FileList | null) => {
        const file = files?.[0];
        if (!file) {
            return;
        }
        onFileSelect(file);
    };

    return (
        <div
            className={`upload-dropzone${isDragging ? " is-dragging" : ""}`}
            onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
            }}
            onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
            }}
            onDragOver={(event) => {
                event.preventDefault();
            }}
            onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                handleFileList(event.dataTransfer.files);
            }}
        >
            <div className="upload-dropzone-copy">
                <span className="upload-dropzone-label">업로드 패널</span>
                <h3>엑셀 파일을 여기에 올려보세요</h3>
            </div>

            <label className="upload-dropzone-button" htmlFor={inputId}>
                파일 선택
            </label>
            <input
                id={inputId}
                className="sr-only"
                type="file"
                accept=".xlsx,.xls"
                onChange={(event) => {
                    handleFileList(event.target.files);
                    event.target.value = "";
                }}
            />

            <div className="upload-dropzone-footnote">
                <span>지원 포맷: `.xlsx`, `.xls`</span>
                <span className="upload-footnote-divider">|</span>
                <a
                    href="/samples/드라마정보업로드샘플.xlsx"
                    download
                    className="sample-download-link"
                >
                    샘플 양식 다운로드
                </a>
            </div>
        </div>
    );
}

export { UploadDropzone };
