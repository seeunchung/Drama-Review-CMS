import {
  UploadDropzone,
  SelectedFileBar,
  UploadFilterBar,
  UploadProgressStepper,
  UploadResultTable,
  UploadStatsCards
} from '../components'
import type {
  BulkUploadRow,
  BulkUploadSummary,
  DemoSelectedFile,
  FilterMode,
  SortMode,
} from '../types'

interface UploadWorkspaceProps {
  headingKicker?: string
  headingTitle?: string
  headingDescription?: string
  file: DemoSelectedFile | null
  summary: BulkUploadSummary
  rows: BulkUploadRow[]
  filterMode: FilterMode
  sortMode: SortMode
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  onFilterChange: (mode: FilterMode) => void
  onSortChange: (mode: SortMode) => void
  onDownload: () => void
  onSave: () => void
  onAutoClean?: () => void
  isSaving?: boolean
  canDownload: boolean
  canSave: boolean
  canClean?: boolean
}

// 업로드 데모의 핵심 기능 블록만 한 화면에 조합한다.
function UploadWorkspace({
  headingKicker,
  headingTitle,
  headingDescription,
  file,
  summary,
  rows,
  filterMode,
  sortMode,
  onFileSelect,
  onFileRemove,
  onFilterChange,
  onSortChange,
  onDownload,
  onSave,
  onAutoClean,
  isSaving = false,
  canDownload,
  canSave,
  canClean = false,
}: UploadWorkspaceProps) {
  return (
    <section className="workspace-section panel fade-up" id="workflow">
      {/* 상세 화면에서는 필요할 때만 제목 블록을 노출한다. */}
      {(headingKicker || headingTitle || headingDescription) && (
        <div className="section-heading">
          <div>
            {headingKicker && <span className="section-kicker">{headingKicker}</span>}
            {headingTitle && <h2>{headingTitle}</h2>}
          </div>
          {headingDescription && <p>{headingDescription}</p>}
        </div>
      )}

      <div className="workspace-top-grid">
        <div className="workspace-upload-column">
          <UploadDropzone onFileSelect={onFileSelect} />
          <SelectedFileBar file={file} onRemove={onFileRemove} />
        </div>
        <UploadStatsCards summary={summary} />
      </div>

      <UploadProgressStepper currentStep={summary.currentStep} />

      <UploadFilterBar
        filterMode={filterMode}
        sortMode={sortMode}
        visibleCount={rows.length}
        totalCount={summary.total}
        canDownload={canDownload}
        canSave={canSave}
        canClean={canClean}
        isSaving={isSaving}
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        onDownload={onDownload}
        onSave={onSave}
        onAutoClean={onAutoClean}
      />

      <UploadResultTable rows={rows} />
    </section>
  )
}

export { UploadWorkspace }
