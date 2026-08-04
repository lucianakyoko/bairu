import { steps } from './data';
import { StepCard } from './StepCard';
import { StepConnector } from './StepConnector';

export function StepsTimeline() {
  return (
    <>
      {/* Mobile */}

      <div className="space-y-4 lg:hidden mt-6">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col gap-6">
            <StepCard step={step} />

            {index < steps.length - 1 && <StepConnector vertical />}
          </div>
        ))}
      </div>

      {/* Desktop */}

      <div className="hidden items-start lg:flex mt-8 w-full">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="flex flex-1 items-start gap-6 justify-center"
          >
            <div className="flex-1">
              <StepCard step={step} />
            </div>

            {index < steps.length - 1 && <StepConnector />}
          </div>
        ))}
      </div>
    </>
  );
}
