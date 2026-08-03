import { steps } from './data';
import { StepCard } from './StepCard';
import { StepConnector } from './StepConnector';

export function StepsTimeline() {
  return (
    <>
      {/* Mobile */}

      <div className="space-y-4 lg:hidden">
        {steps.map((step, index) => (
          <div key={step.number}>
            <StepCard step={step} />

            {index < steps.length - 1 && <StepConnector vertical />}
          </div>
        ))}
      </div>

      {/* Desktop */}

      <div className="hidden items-start lg:flex">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-1 items-start">
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
