import { useMemo, useState } from "react";
import { ProjectHeader } from "../../components/layout/project-header";
import { useDramaExcelParsing } from "./hooks/use-drama-excel-parsing";
import { useBulkUpload } from "./hooks/use-bulk-upload";
import { UploadWorkspace } from "./sections/upload-workspace";
import { UploadProgressBar } from "./components/upload-progress-bar";
import type {
    BulkUploadRow,
    BulkUploadSummary,
    DemoSelectedFile,
    FilterMode,
    SortMode,
} from "./types/content-import";
import "./styles.css";

const statusSortRank = {
    error: 0,
    valid: 1,
    uploaded: 2,
} as const;

function createFileLabel(fileName: string) {
    const extension = fileName.split(".").pop()?.toUpperCase();
    return extension && extension.length > 0 ? extension : "FILE";
}

function downloadRowsAsCsv(rows: BulkUploadRow[]) {
    const header = [
        "순번",
        "제목",
        "OTT",
        "등급",
        "회차",
        "부제목",
        "러닝타임",
        "상태",
        "에러메시지",
    ];

    const lines = rows.map((row) => {
        const rowValues = [
            row.seq,
            row.title,
            row.distributor,
            row.rating,
            row.episode,
            row.subtitle,
            row.runningTime,
            row.status,
            row.errorMessages.join(" | "),
        ];
        return rowValues
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(",");
    });

    // \n 부분을 명확하게 이스케이프 처리하여 합칩니다.
    const csvContent = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "중드_회차데이터_검토결과.csv";
    link.click();
    window.URL.revokeObjectURL(url);
}

function ContentImportPage() {
    const [selectedFile, setSelectedFile] = useState<DemoSelectedFile | null>(
        null,
    );
    const [rows, setRows] = useState<BulkUploadRow[]>([]);
    const [filterMode, setFilterMode] = useState<FilterMode>("all");
    const [sortMode, setSortMode] = useState<SortMode>("seq");
    const [currentStep, setCurrentStep] =
        useState<BulkUploadSummary["currentStep"]>("idle");
    const [batchError, setBatchError] = useState<string | null>(null);

    const { parseExcel, isParsing } = useDramaExcelParsing();
    const { upload, uploadProgress, resetProgress } = useBulkUpload();

    const handleFileSelect = async (file: File) => {
        setSelectedFile({
            name: file.name,
            size: file.size,
            typeLabel: createFileLabel(file.name),
        });
        setCurrentStep("idle");
        setBatchError(null);
        resetProgress();

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setCurrentStep("parsed");

            const parsedData = await parseExcel(file);

            await new Promise((resolve) => setTimeout(resolve, 800));
            setCurrentStep("validated");

            await new Promise((resolve) => setTimeout(resolve, 500));
            setRows(parsedData);
            setCurrentStep("reviewed");
        } catch (error: any) {
            console.error("Parsing error:", error);
            setCurrentStep("idle");
            setBatchError(
                error.message || "엑셀 파일 파싱 중 오류가 발생했습니다.",
            );
            setRows([]);
        }
    };

    const handleFileRemove = () => {
        setSelectedFile(null);
        setRows([]);
        setCurrentStep("idle");
        setBatchError(null);
        resetProgress();
    };

    const handleSave = async () => {
        if (!selectedFile || rows.length === 0 || batchError) {
            alert("파일 상태를 확인해주세요.");
            return;
        }

        // 1. 에러가 포함된 행이 있는지 최종 확인
        const hasErrorRows = rows.some((row) => row.status === "error");
        if (hasErrorRows) {
            alert("검토 결과 에러가 포함된 행이 있습니다. 모든 에러를 수정한 후 다시 업로드해주세요.");
            return;
        }

        // 2. 모든 행의 드라마 제목이 동일한지 최종 확인
        const uniqueTitles = Array.from(new Set(rows.map((r) => r.title)));
        if (uniqueTitles.length > 1) {
            alert(`한 파일에 여러 드라마 제목이 섞여 있습니다: ${uniqueTitles.join(", ")}\n한 번에 하나의 드라마만 업로드 가능합니다.`);
            return;
        }

        const dramaTitle = uniqueTitles[0];
        const fileName = selectedFile.name;

        try {
            await upload({
                rows: rows,
                dramaTitle: dramaTitle,
                fileName: fileName,
                chunkSize: 5,
            });

            setCurrentStep("saved");
            setRows((prev) =>
                prev.map((row) => ({ ...row, status: "uploaded" })),
            );
        } catch (error) {
            console.error("Save error:", error);
            alert("DB 저장 중 오류가 발생했습니다.");
        }
    };

    const visibleRows = useMemo(() => {
        let result = [...rows];
        if (filterMode === "error") {
            result = result.filter((row) => row.status === "error");
        }
        if (sortMode === "title") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortMode === "status") {
            result.sort(
                (a, b) => statusSortRank[a.status] - statusSortRank[b.status],
            );
        } else {
            result.sort((a, b) => a.seq - b.seq);
        }
        return result;
    }, [rows, filterMode, sortMode]);

    const summary: BulkUploadSummary = useMemo(() => {
        return {
            total: rows.length,
            valid: rows.filter((r) => r.status !== "error").length,
            error: rows.filter((r) => r.status === "error").length,
            currentStep,
        };
    }, [rows, currentStep]);

    const isUploading =
        uploadProgress.isUploading ||
        (uploadProgress.progress > 0 && uploadProgress.progress < 100);

    return (
        <main className="content-import-page">
            <ProjectHeader
                title="콘텐츠 등록"
                description="방영 플랫폼별 중국 드라마 회차 데이터 대량 업로드 및 내용 검토"
                tags={["대량 업로드"]}
            />

            {batchError && (
                <div className="batch-error-message">
                    <p>⚠️ {batchError}</p>
                    <button
                        onClick={handleFileRemove}
                        aria-label="오류 메시지 닫기"
                    >
                        ✕
                    </button>
                </div>
            )}

            <UploadWorkspace
                file={selectedFile}
                summary={summary}
                rows={visibleRows}
                filterMode={filterMode}
                sortMode={sortMode}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                onFilterChange={setFilterMode}
                onSortChange={setSortMode}
                onDownload={() => downloadRowsAsCsv(visibleRows)}
                onSave={handleSave}
                isSaving={isUploading}
                canDownload={visibleRows.length > 0 && !isUploading}
                canSave={
                    summary.total > 0 &&
                    (currentStep === "reviewed" || currentStep === "saved") &&
                    !isUploading &&
                    !batchError
                }
            />

            {(isUploading || uploadProgress.progress > 0) && (
                <UploadProgressBar
                    progress={uploadProgress.progress}
                    currentChunk={uploadProgress.currentChunk}
                    totalChunks={uploadProgress.totalChunks}
                    isUploading={isUploading}
                    onClose={resetProgress}
                />
            )}
        </main>
    );
}

export { ContentImportPage };
