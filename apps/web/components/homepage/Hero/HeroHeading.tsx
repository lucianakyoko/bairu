type HeroHeadingProps = {
  title: string;
  description: string;
};

export function HeroHeading({ title, description }: HeroHeadingProps) {
  return (
    <div className="space-y-6">
      <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-text">
        {title}
      </h1>
      <p className="max-w-2xl text-lg leading-8 text-text-muted">
        {description}
      </p>
    </div>
  );
}
