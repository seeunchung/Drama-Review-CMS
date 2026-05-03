// Content Import 데모에서 공통으로 쓰는 타입 모음이다.
export type UploadStep = 'idle' | 'parsed' | 'validated' | 'reviewed' | 'saved'

export type RowStatus = 'valid' | 'error' | 'uploaded'

export type FilterMode = 'all' | 'error'

export type SortMode = 'seq' | 'title' | 'status'

export interface BulkUploadRow {
  id: string
  seq: number
  title: string
  distributor: string // 방영 플랫폼 (넷플릭스, Youku 등)
  rating: string // 관람 등급
  episode: string // 회차 (사용자 입력 원본 유지를 위해 string 사용)
  subtitle: string // 부제목
  runningTime: string // 러닝타임
  summary: string // 줄거리
  status: RowStatus
  errorMessages: string[] // 상세 검증 메시지
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
