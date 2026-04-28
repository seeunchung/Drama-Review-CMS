import type { FilterMode, SortMode } from "@/pages/content-import/types/content-import";

interface UploadFilterBarProps {
    filterMode: FilterMode;
    sortMode: SortMode;
    visibleCount: number;
    totalCount: number;
    canDownload: boolean;
    canSave: boolean;
    isSaving?: boolean;
    onFilterChange: (mode: FilterMode) => void;
    onSortChange: (mode: SortMode) => void;
    onDownload: () => void;
    onSave: () => void;
}

// 테이블 필터, 정렬, 액션 버튼을 한 줄에 묶는다.
function UploadFilterBar({
    filterMode,
    sortMode,
    visibleCount,
    totalCount,
    canDownload,
    canSave,
    isSaving = false,
    onFilterChange,
    onSortChange,
    onDownload,
    onSave,
}: UploadFilterBarProps) {
    return (
        <div className="upload-filter-bar">
            <div className="upload-filter-group">
                <button
                    className={`filter-chip${filterMode === "all" ? " is-active" : ""}`}
                    type="button"
                    onClick={() => onFilterChange("all")}
                >
                    전체 보기
                </button>
                <button
                    className={`filter-chip${filterMode === "error" ? " is-active" : ""}`}
                    type="button"
                    onClick={() => onFilterChange("error")}
                >
                    에러 행만 보기
                </button>
                <span className="filter-count">
                    {totalCount}건 중 {visibleCount}건 표시
                </span>
            </div>

            <div className="upload-filter-actions">
                <label className="filter-select">
                    <span>정렬</span>
                    <select
                        value={sortMode}
                        onChange={(event) =>
                            onSortChange(event.target.value as SortMode)
                        }
                    >
                        <option value="seq">순번</option>
                        <option value="title">제목</option>
                        <option value="status">상태</option>
                    </select>
                </label>

                <button
                    className="filter-button filter-button-secondary"
                    type="button"
                    disabled={!canDownload}
                    onClick={onDownload}
                >
                    CSV 다운로드
                </button>
                <button
                    className="filter-button filter-button-primary"
                    type="button"
                    disabled={!canSave}
                    onClick={onSave}
                >
                    {isSaving ? "저장 중..." : "저장하기"}
                </button>
            </div>
        </div>
    );
}

export { UploadFilterBar };
