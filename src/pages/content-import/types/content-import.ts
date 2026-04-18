// Content Import 데모에서 공통으로 쓰는 타입 모음이다.
export type UploadStep = 'idle' | 'parsed' | 'validated' | 'reviewed' | 'saved'

export type RowStatus = 'valid' | 'error' | 'uploaded'

export type FilterMode = 'all' | 'error'

export type SortMode = 'seq' | 'title' | 'status'

export interface BulkUploadRow {
  id: string
  seq: number
  title: string
  distributor: string // 배급사
  rating: string // 관람 등급
  status: RowStatus
  errorMessage?: string
}

export interface BulkUploadSummary {
  total: number
  valid: number
  error: number
  currentStep: UploadStep
}

export interface DemoSelectedFile {
  name: string
  size: number
  typeLabel: string
}
