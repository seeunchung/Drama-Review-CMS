import { create } from 'zustand'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (isLoading: boolean) => void
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

/**
 * 전역 인증 상태를 관리하는 Zustand 스토어입니다.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setLoading: (isLoading) => set({ isLoading }),

  /**
   * 로그아웃 처리
   */
  signOut: async () => {
    set({ isLoading: true })
    try {
      await supabase.auth.signOut()
      set({ user: null, session: null })
    } finally {
      set({ isLoading: false })
    }
  },

  /**
   * 앱 초기화 시 현재 세션 확인
   */
  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ 
        session, 
        user: session?.user ?? null, 
        initialized: true,
        isLoading: false 
      })

      // 인증 상태 변경 리스너 등록
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null, isLoading: false })
      })
    } catch (error) {
      console.error('Auth initialization error:', error)
      set({ initialized: true, isLoading: false })
    }
  },
}))
