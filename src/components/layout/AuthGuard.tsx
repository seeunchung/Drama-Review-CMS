import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/app/store/use-auth-store'
import { ROUTES } from '@/app/paths'

interface AuthGuardProps {
  children: ReactNode
}

/**
 * 인증 여부를 확인하여 보호된 라우트에 대한 접근을 제어하는 가드 컴포넌트입니다.
 */
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, isLoading, initialized } = useAuthStore()
  const location = useLocation()

  if (!initialized || isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'var(--bg-deep)',
        color: 'var(--ink-soft)'
      }}>
        인증 확인 중...
      </div>
    )
  }

  if (!user) {
    return <Navigate to={ROUTES.auth} state={{ from: location }} replace />
  }

  return <>{children}</>
}
