import { STATUS_LABELS } from '@/app/project-meta'

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // DB 상태값 그대로 사용 (label 매핑은 STATUS_LABELS 활용)
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`status-badge status-${status}`}>
      {label}
    </span>
  )
}
