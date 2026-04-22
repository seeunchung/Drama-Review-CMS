import { UPLOAD_STEPS } from "@/pages/content-import/constants/upload-steps";
import type { UploadStep } from "@/pages/content-import/types/content-import";

interface UploadProgressStepperProps {
    currentStep: UploadStep;
}

// 현재 단계와 완료 단계를 동시에 보여주는 스테퍼다.
function UploadProgressStepper({ currentStep }: UploadProgressStepperProps) {
    const activeIndex = UPLOAD_STEPS.findIndex(
        (step) => step.key === currentStep,
    );

    return (
        <ul className="upload-stepper" aria-label="Upload workflow">
            {UPLOAD_STEPS.map((step, index) => {
                const isComplete = index < activeIndex;
                const isCurrent = index === activeIndex;

                return (
                    <li
                        className={`upload-step${
                            isComplete ? " is-complete" : ""
                        }${isCurrent ? " is-current" : ""}`}
                        key={step.key}
                    >
                        <span className="upload-step-index">{index + 1}</span>
                        <div className="upload-step-copy">
                            <strong>{step.label}</strong>
                            <small>{step.detail}</small>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

export { UploadProgressStepper };
