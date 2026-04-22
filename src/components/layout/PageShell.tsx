import type { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
}

// 전체 화면의 최대 폭과 바깥 여백을 공통으로 맞춘다.
function PageShell({ children }: PageShellProps) {
  return <div className="page-shell">{children}</div>
}

export { PageShell }
