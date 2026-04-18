import { useEffect, useMemo, useRef, useState } from "react";
import { ProjectHeader } from "../../components/layout/project-header";
import {
    createBulkUploadMockRows,
    sampleFile,
} from "./mocks/content-import-data";
import { UploadWorkspace } from "./sections/upload-workspace";
import type {
    BulkUploadRow,
    BulkUploadSummary,
    DemoSelectedFile,
    FilterMode,
    SortMode,
} from "./types/content-import";
import "./styles.css";

// 상세 화면에서 기본, 에러 검토, 저장 완료 상태를 빠르게 바꿔본다.
type BulkScreenPreset = "default" | "errors" | "saved";

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

// 상태 프리셋마다 테이블 행 상태를 다시 구성한다.
function buildPresetRows(preset: BulkScreenPreset) {
    const nextRows = createBulkUploadMockRows();

    if (preset === "saved") {
        return nextRows.map((row) =>
            row.status === "error"
                ? row
                : { ...row, status: "uploaded" as const },
        );
    }

    return nextRows;
}

// 현재 필터 결과를 바로 내려받아 볼 수 있게 CSV로 변환한다.
function downloadRowsAsCsv(rows: BulkUploadRow[]) {
    const header = ["순번", "콘텐츠 제목", "배급사", "관람 등급", "상태", "에러메시지"];
    const lines = rows.map((row) =>
        [
            row.seq,
            row.title,
            row.distributor,
            row.rating,
            row.status,
            row.errorMessage ?? "",
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
    link.download = "영화메타데이터_검토결과.csv";
    link.click();
    window.URL.revokeObjectURL(url);
}

// 영화 메타데이터 대량 등록 상세 화면의 상태 전환과 테이블 시뮬레이션을 관리한다.
function ContentImportPage() {
    const [selectedFile, setSelectedFile] = useState<DemoSelectedFile | null>(
        sampleFile,
    );
    const [rows, setRows] = useState<BulkUploadRow[]>(() =>
        buildPresetRows("default"),
    );
    const [filterMode, setFilterMode] = useState<FilterMode>("all");
    const [sortMode, setSortMode] = useState<SortMode>("seq");
    const [currentStep, setCurrentStep] =
        useState<BulkUploadSummary["currentStep"]>("reviewed");
    const [preset, setPreset] = useState<BulkScreenPreset>("default");
    const timersRef = useRef<number[]>([]);

    // 비동기 시뮬레이션 타이머가 겹치지 않게 정리한다.
    const clearTimers = () => {
        timersRef.current.forEach((timer) => window.clearTimeout(timer));
        timersRef.current = [];
    };

    useEffect(() => {
        return () => {
            clearTimers();
        };
    }, []);

    const handleFileSelect = (file: File) => {
        clearTimers();
        setSelectedFile({
            name: file.name,
            size: file.size,
            typeLabel: createFileLabel(file.name),
        });
        setCurrentStep("idle");

        // 실제 파일 파싱 대신 시뮬레이션으로 단계를 넘긴다.
        const t1 = window.setTimeout(() => setCurrentStep("parsed"), 1000);
        const t2 = window.setTimeout(() => setCurrentStep("validated"), 2500);
        const t3 = window.setTimeout(() => {
            setCurrentStep("reviewed");
            setRows(createBulkUploadMockRows());
        }, 4000);

        timersRef.current = [t1, t2, t3];
    };

    const handleFileRemove = () => {
        clearTimers();
        setSelectedFile(null);
        setRows([]);
        setCurrentStep("idle");
    };

    const handleSave = () => {
        clearTimers();
        setCurrentStep("saved");
        setRows((prev) =>
            prev.map((row) =>
                row.status === "error" ? row : { ...row, status: "uploaded" },
            ),
        );
    };

    const handlePresetChange = (nextPreset: BulkScreenPreset) => {
        clearTimers();
        setPreset(nextPreset);
        setCurrentStep(nextPreset === "saved" ? "saved" : "reviewed");
        setRows(buildPresetRows(nextPreset));
        if (!selectedFile) setSelectedFile(sampleFile);
    };

    const visibleRows = useMemo(() => {
        let result = [...rows];

        if (filterMode === "error") {
            result = result.filter((row) => row.status === "error");
        }

        if (sortMode === "title") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortMode === "status") {
            result.sort((a, b) => statusSortRank[a.status] - statusSortRank[b.status]);
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
                title="Content Import Console"
                description="배급사 영화 메타데이터 대량 업로드 및 정합성 검토"
                tags={["영화 등록", "데이터 검증", "대량 업로드"]}
            />

            <div className="preset-toggle-bar panel">
                <span>데이터 시뮬레이션:</span>
                <button
                    className={preset === "default" ? "is-active" : ""}
                    onClick={() => handlePresetChange("default")}
                >
                    기본 결과
                </button>
                <button
                    className={preset === "errors" ? "is-active" : ""}
                    onClick={() => handlePresetChange("errors")}
                >
                    에러 집중
                </button>
                <button
                    className={preset === "saved" ? "is-active" : ""}
                    onClick={() => handlePresetChange("saved")}
                >
                    저장 완료
                </button>
            </div>

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
