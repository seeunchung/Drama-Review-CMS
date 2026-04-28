import { create } from 'zustand'

type ModalType = 'alert' | 'confirm'

interface ModalOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: ModalType
}

interface ModalState {
  isOpen: boolean
  options: ModalOptions
  resolve: (value: boolean) => void
  
  /**
   * 알림 모달을 띄웁니다.
   */
  alert: (options: ModalOptions | string) => Promise<boolean>
  
  /**
   * 확인/취소 모달을 띄웁니다.
   */
  confirm: (options: ModalOptions | string) => Promise<boolean>
  
  /**
   * 모달을 닫고 결과를 반환합니다.
   */
  close: (result: boolean) => void
}

const defaultOptions: ModalOptions = {
  title: '알림',
  message: '',
  confirmText: '확인',
  cancelText: '취소',
  type: 'alert'
}

export const useModalStore = create<ModalState>((set, get) => ({
  isOpen: false,
  options: defaultOptions,
  resolve: () => {},

  alert: (options) => {
    const mergedOptions = typeof options === 'string' 
      ? { ...defaultOptions, message: options, type: 'alert' as const }
      : { ...defaultOptions, ...options, type: 'alert' as const }
    
    set({ isOpen: true, options: mergedOptions })
    
    return new Promise((resolve) => {
      set({ resolve })
    })
  },

  confirm: (options) => {
    const mergedOptions = typeof options === 'string' 
      ? { ...defaultOptions, title: '확인', message: options, type: 'confirm' as const }
      : { ...defaultOptions, title: '확인', ...options, type: 'confirm' as const }
    
    set({ isOpen: true, options: mergedOptions })
    
    return new Promise((resolve) => {
      set({ resolve })
    })
  },

  close: (result) => {
    const { resolve } = get()
    set({ isOpen: false })
    // 약간의 애니메이션 시간을 벌어준 뒤 resolve 호출
    setTimeout(() => {
      resolve(result)
    }, 200)
  }
}))
