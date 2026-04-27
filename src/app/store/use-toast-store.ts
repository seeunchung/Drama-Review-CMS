import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastState {
  toasts: ToastItem[]
  
  /**
   * 토스트를 추가합니다.
   */
  addToast: (message: string, type?: ToastType, duration?: number) => void
  
  /**
   * 특정 토스트를 제거합니다.
   */
  removeToast: (id: string) => void
  
  /**
   * 편의 함수들
   */
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastItem = { id, message, type, duration }
    
    set((state) => ({ toasts: [...state.toasts, newToast] }))

    // 자동 삭제 타이머
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, duration)
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
  },

  success: (message, duration) => get().addToast(message, 'success', duration),
  error: (message, duration) => get().addToast(message, 'error', duration),
  info: (message, duration) => get().addToast(message, 'info', duration),
}))
