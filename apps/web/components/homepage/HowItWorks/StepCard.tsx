import type { Step } from './data';

interface StepCardProps {
  step: Step;
}

export function StepCard({ step }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-md">
        {step.number}
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>

        <p className="text-base leading-7 text-text-muted">
          {step.description}
        </p>
      </div>
    </div>
  );
}
