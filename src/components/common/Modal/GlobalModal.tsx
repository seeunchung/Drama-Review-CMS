import { useModalStore } from "@/app/store/use-modal-store";
import './styles.css'

export const GlobalModal = () => {
  const { isOpen, options, close } = useModalStore()

  // isOpen이 false이더라도 DOM에 잠시 남아있어야 애니메이션이 보입니다.
  // 하지만 여기서는 간단히 클래스로 제어합니다.
  if (!isOpen && !document.querySelector('.global-modal-overlay')) return null

  return (
    <div className={`global-modal-overlay ${isOpen ? 'is-open' : 'is-closing'}`}>
      <div className="global-modal-container panel">
        <div className="global-modal-header">
          <h2 className="global-modal-title">{options.title}</h2>
        </div>
        
        <div className="global-modal-body">
          <p className="global-modal-message">{options.message}</p>
        </div>

        <div className="global-modal-footer">
          {options.type === 'confirm' && (
            <button 
              className="global-modal-btn global-modal-btn-cancel" 
              onClick={() => close(false)}
            >
              {options.cancelText}
            </button>
          )}
          <button 
            className="global-modal-btn global-modal-btn-confirm" 
            onClick={() => close(true)}
          >
            {options.confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
