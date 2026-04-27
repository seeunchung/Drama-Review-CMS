import { useToastStore, type ToastType } from "@/app/store/use-toast-store";
import './styles.css'

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success':
      return (
        <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    case 'error':
      return (
        <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )
    default:
      return (
        <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )
  }
}

export const GlobalToast = () => {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="global-toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item is-${toast.type}`}>
          <ToastIcon type={toast.type} />
          <div className="toast-message">{toast.message}</div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
