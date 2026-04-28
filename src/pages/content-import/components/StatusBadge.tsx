import type { RowStatus } from '@/pages/content-import/types/content-import'
import { UPLOAD_STATUS_LABELS } from '@/app/project-meta'

interface StatusBadgeProps {
  status: RowStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-${status}`}>
      {UPLOAD_STATUS_LABELS[status] || status}
    </span>
  )
}

export { StatusBadge }
