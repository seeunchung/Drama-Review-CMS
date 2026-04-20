import type { DemoSelectedFile } from '../types/content-import'

interface SelectedFileBarProps {
  file: DemoSelectedFile | null
  onRemove: () => void
}

// 파일 크기를 짧게 읽히는 형태로 바꾼다.
function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`
}

// 선택된 파일 컨텍스트를 업로드 영역 아래에서 계속 유지한다.
function SelectedFileBar({ file, onRemove }: SelectedFileBarProps) {
  if (!file) {
    return (
      <div className="selected-file-bar is-empty">
        <span>아직 선택된 파일이 없습니다.</span>
      </div>
    )
  }

  return (
    <div className="selected-file-bar">
      <div className="selected-file-copy">
        <span className="selected-file-pill">{file.typeLabel}</span>
        <strong>{file.name}</strong>
        <small>{formatFileSize(file.size)}</small>
      </div>

      <button className="selected-file-remove" type="button" onClick={onRemove} aria-label="파일 제거">
        ✕
      </button>
    </div>
  )
}

export { SelectedFileBar }
