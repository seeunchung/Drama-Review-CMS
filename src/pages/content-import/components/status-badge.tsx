import type { RowStatus } from '../types/content-import'

interface StatusBadgeProps {
  status: RowStatus
}

// 테이블의 상태값을 짧은 시각 단위로 묶는다.
const statusLabelMap = {
  valid: '정상',
  error: '에러',
  uploaded: '업로드 완료',
} as const

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-${status}`}>
      {statusLabelMap[status]}
    </span>
  )
}

export { StatusBadge }
