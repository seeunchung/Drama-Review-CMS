import { useMemo, useState } from "react";
import { ProjectHeader } from "@/components/layout";
import { useDramaExcelParsing } from "@/pages/content-import/hooks/use-drama-excel-parsing";
import { useBulkUpload } from "@/network/hooks/use-upload";
import { UploadWorkspace } from "@/pages/content-import/sections/UploadWorkspace";
import { UploadProgressBar } from "@/pages/content-import/components/UploadProgressBar";
import { useModalStore } from "@/app/store/use-modal-store";
import { useToastStore } from "@/app/store/use-toast-store";
import { ADMIN_TASKS } from "@/app/project-meta";
import { getErrorMessage } from "@/lib/error";
import { extractNumbers, isNumeric, validateRowFields, applyCollectionValidation } from "@/pages/content-import/utils/validation";
import type {
    BulkUploadRow,
    BulkUploadSummary,
    DemoSelectedFile,
    FilterMode,
    SortMode,
} from "@/pages/content-import/types/content-import";
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

    const { parseExcel } = useDramaExcelParsing();
    const { upload, uploadProgress, resetProgress } = useBulkUpload();
    const { alert: modalAlert } = useModalStore();
    const toast = useToastStore();

    // 메타데이터 정보 추출
    const pageMeta = ADMIN_TASKS.find(t => t.id === "content-import");

    //숫자 자동 변환
    const handleAutoClean = () => {
        if (rows.length === 0) return;

        // 1. 정제가 필요한 행이 있는지 먼저 확인
        const needsCleaning = rows.some(
            (row) => !isNumeric(row.episode) || (row.rating && !isNumeric(row.rating))
        );

        if (!needsCleaning) {
            toast.success("변환할 데이터가 없습니다. (모든 숫자가 올바른 형식입니다)");
            return;
        }

        // 2. 숫자 추출 및 개별 행 검증 다시 수행
        let updatedRows = rows.map((row) => {
            const cleanedEpisode = extractNumbers(row.episode);
            const cleanedRating = extractNumbers(row.rating);

            const errorMessages = validateRowFields({
                title: row.title,
                baseTitle: rows[0]?.title || "",
                rawEpisode: cleanedEpisode,
                rating: cleanedRating,
                summary: row.summary,
            });

            return {
                ...row,
                episode: cleanedEpisode,
                rating: cleanedRating,
                status: (errorMessages.length > 0 ? "error" : "valid") as any,
                errorMessages,
            };
        });

        // 2. 전체 컬렉션 검증 다시 수행
        updatedRows = applyCollectionValidation(updatedRows);

        setRows(updatedRows);
        toast.success("등급 및 회차 데이터의 숫자를 자동으로 정제했습니다.");
    };

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
            setCurrentStep("parsed");
            const parsedData = await parseExcel(file);
            
            setCurrentStep("validated");
            await new Promise((resolve) => setTimeout(resolve, 500));
            
            setRows(parsedData);
            setCurrentStep("reviewed");
            
            const errorCount = parsedData.filter(r => r.status === 'error').length;
            if (errorCount > 0) {
                toast.error(`데이터 검증 결과 ${errorCount}건의 오류가 발견되었습니다.`);
            } else {
                toast.success("파일 파싱 및 데이터 검증이 완료되었습니다.");
            }
        } catch (error) {
            console.error("Parsing error:", error);
            setCurrentStep("idle");
            const errorMsg = getErrorMessage(
                error,
                "엑셀 파일 파싱 중 오류가 발생했습니다.",
            );
            setBatchError(errorMsg);
            toast.error(errorMsg);
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
            toast.error("업로드할 파일 상태를 확인해주세요.");
            return;
        }

        const hasErrorRows = rows.some((row) => row.status === "error");
        if (hasErrorRows) {
            await modalAlert("검토 결과 에러가 포함된 행이 있습니다. 모든 에러를 수정한 후 다시 업로드해주세요.");
            return;
        }

        const uniqueTitles = Array.from(new Set(rows.map((r) => r.title)));
        if (uniqueTitles.length > 1) {
            toast.error("한 번에 하나의 드라마만 업로드 가능합니다.");
            return;
        }

        const dramaTitle = uniqueTitles[0];
        const fileName = selectedFile.name;

        try {
            await upload({
                rows: rows,
                dramaTitle: dramaTitle,
                fileName: fileName,
                chunkSize: 10,
            });

            setCurrentStep("saved");
            setRows((prev) =>
                prev.map((row) => ({ ...row, status: "uploaded" })),
            );
            toast.success(`'${dramaTitle}' 에피소드 업로드가 완료되었습니다.`);
        } catch (error) {
            console.error("Save error:", error);
            toast.error(getErrorMessage(error, "DB 저장 중 오류가 발생했습니다."));
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
                title={pageMeta?.title || "콘텐츠 등록"}
                description={pageMeta?.description || ""}
                tags={pageMeta?.tags || []}
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
                onAutoClean={handleAutoClean}
                isSaving={isUploading}
                canDownload={visibleRows.length > 0 && !isUploading}
                canClean={summary.total > 0 && !isUploading}
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
