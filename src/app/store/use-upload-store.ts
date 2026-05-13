import { create } from "zustand";
import type {
    BulkUploadRow,
    BulkUploadSummary,
    DemoSelectedFile,
    FilterMode,
    SortMode,
} from "@/pages/content-import/types";

interface UploadState {
    // 데이터 상태
    selectedFile: DemoSelectedFile | null;
    rows: BulkUploadRow[];
    filterMode: FilterMode;
    sortMode: SortMode;
    currentStep: BulkUploadSummary["currentStep"];
    batchError: string | null;

    // 액션
    setSelectedFile: (file: DemoSelectedFile | null) => void;
    setRows: (rowsOrUpdater: BulkUploadRow[] | ((prev: BulkUploadRow[]) => BulkUploadRow[])) => void;
    setFilterMode: (mode: FilterMode) => void;
    setSortMode: (mode: SortMode) => void;
    setCurrentStep: (step: BulkUploadSummary["currentStep"]) => void;
    setBatchError: (error: string | null) => void;
    
    // 복합 액션
    reset: () => void;
}

/**
 * 콘텐츠 등록 페이지의 상태를 세션(메모리) 동안 유지하기 위한 스토어
 */
export const useUploadStore = create<UploadState>((set) => ({
    // 초기 상태
    selectedFile: null,
    rows: [],
    filterMode: "all",
    sortMode: "seq",
    currentStep: "idle",
    batchError: null,

    // 단순 액션
    setSelectedFile: (selectedFile) => set({ selectedFile }),
    setRows: (rowsOrUpdater) => 
        set((state) => ({ 
            rows: typeof rowsOrUpdater === 'function' ? rowsOrUpdater(state.rows) : rowsOrUpdater 
        })),
    setFilterMode: (filterMode) => set({ filterMode }),
    setSortMode: (sortMode) => set({ sortMode }),
    setCurrentStep: (currentStep) => set({ currentStep }),
    setBatchError: (batchError) => set({ batchError }),

    // 초기화
    reset: () => set({
        selectedFile: null,
        rows: [],
        filterMode: "all",
        sortMode: "seq",
        currentStep: "idle",
        batchError: null,
    }),
}));
