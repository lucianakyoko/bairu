interface StepConnectorProps {
  vertical?: boolean;
}

export function StepConnector({ vertical = false }: StepConnectorProps) {
  if (vertical) {
    return <div className="mx-auto h-16 w-px bg-border lg:hidden" />;
  }

  return <div className="hidden h-px flex-1 bg-border lg:block" />;
}
