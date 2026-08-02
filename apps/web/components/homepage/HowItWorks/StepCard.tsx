import type { Step } from './data';

interface StepCardProps {
  step: Step;
}

export function StepCard({ step }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-sm">
        {step.number}
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>

        <p className="text-sm leading-7 text-muted-foreground">
          {step.description}
        </p>
      </div>
    </div>
  );
}
