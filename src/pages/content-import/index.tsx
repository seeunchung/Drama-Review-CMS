import { useEffect, useMemo, useState } from "react";
import { ProjectHeader } from "../../components/layout/project-header";
import { useDramaExcelParsing } from "./hooks/use-drama-excel-parsing";
import { UploadWorkspace } from "./sections/upload-workspace";
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

// 업로드 직후 선택된 파일 라벨을 화면용 형태로 정리한다.
function createFileLabel(fileName: string) {
    const extension = fileName.split(".").pop()?.toUpperCase();
    return extension && extension.length > 0 ? extension : "FILE";
}

// 현재 필터 결과를 바로 내려받아 볼 수 있게 CSV로 변환한다.
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
    const lines = rows.map((row) =>
        [
            row.seq,
            row.title,
            row.distributor,
            row.rating,
            row.episode,
            row.subtitle,
            row.runningTime,
            row.status,
            row.errorMessages.join(" | "),
        ]
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(","),
    );

    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
        type: "text/csv;charset=utf-8",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "중드_회차데이터_검토결과.csv";
    link.click();
    window.URL.revokeObjectURL(url);
}

// 중국 드라마 회차 메타데이터 대량 등록 상세 화면의 상태 전환과 테이블 시뮬레이션을 관리한다.
function ContentImportPage() {
    const [selectedFile, setSelectedFile] = useState<DemoSelectedFile | null>(
        null,
    );
    const [rows, setRows] = useState<BulkUploadRow[]>([]);
    const [filterMode, setFilterMode] = useState<FilterMode>("all");
    const [sortMode, setSortMode] = useState<SortMode>("seq");
    const [currentStep, setCurrentStep] =
        useState<BulkUploadSummary["currentStep"]>("idle");

    const { parseExcel, isParsing } = useDramaExcelParsing();

    const handleFileSelect = async (file: File) => {
        setSelectedFile({
            name: file.name,
            size: file.size,
            typeLabel: createFileLabel(file.name),
        });
        setCurrentStep("idle");

        try {
            // 단계별 시뮬레이션 효과를 위해 약간의 딜레이를 줌
            await new Promise((resolve) => setTimeout(resolve, 500));
            setCurrentStep("parsed");

            await new Promise((resolve) => setTimeout(resolve, 800));
            setCurrentStep("validated");

            const parsedData = await parseExcel(file);

            await new Promise((resolve) => setTimeout(resolve, 500));
            setRows(parsedData);
            setCurrentStep("reviewed");
        } catch (error) {
            console.error("Parsing error:", error);
            setCurrentStep("idle");
            alert("엑셀 파일 파싱 중 오류가 발생했습니다.");
        }
    };

    const handleFileRemove = () => {
        setSelectedFile(null);
        setRows([]);
        setCurrentStep("idle");
    };

    const handleSave = () => {
        setCurrentStep("saved");
        setRows((prev) =>
            prev.map((row) =>
                row.status === "error" ? row : { ...row, status: "uploaded" },
            ),
        );
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

    return (
        <main className="content-import-page">
            <ProjectHeader
                title="콘텐츠 등록"
                description="방영 플랫폼별 중국 드라마 회차 데이터 대량 업로드 및 내용 검토"
                tags={["대량 업로드"]}
            />

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
                canDownload={visibleRows.length > 0}
                canSave={summary.total > 0 && currentStep === "reviewed"}
            />
        </main>
    );
}

export { ContentImportPage };
