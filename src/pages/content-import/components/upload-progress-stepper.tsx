import { uploadStepMeta } from '../mocks/content-import-data'
import type { UploadStep } from '../types/content-import'

interface UploadProgressStepperProps {
  currentStep: UploadStep
}

// 현재 단계와 완료 단계를 동시에 보여주는 스테퍼다.
function UploadProgressStepper({ currentStep }: UploadProgressStepperProps) {
  const activeIndex = uploadStepMeta.findIndex((step) => step.key === currentStep)

  return (
    <ol className="upload-stepper" aria-label="Upload workflow">
      {uploadStepMeta.map((step, index) => {
        const isComplete = index < activeIndex
        const isCurrent = index === activeIndex

        return (
          <li
            className={`upload-step${
              isComplete ? ' is-complete' : ''
            }${isCurrent ? ' is-current' : ''}`}
            key={step.key}
          >
            <span className="upload-step-index">{index + 1}</span>
            <div className="upload-step-copy">
              <strong>{step.label}</strong>
              <small>{step.detail}</small>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export { UploadProgressStepper }
