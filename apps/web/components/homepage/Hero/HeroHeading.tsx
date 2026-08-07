type HeroHeadingProps = {
  title: string;
  description: string;
};

export function HeroHeading({ title, description }: HeroHeadingProps) {
  return (
    <div className="space-y-6">
      <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text">
        {title}
      </h1>
      <p className="max-w-2xl text-base leading-7 sm:text-lg sm:leading-8 text-text-muted">
        {description}
      </p>
    </div>
  );
}
