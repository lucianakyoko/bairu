import { BusinessProfilePreview } from '@/components/homepage/Hero/BusinessProfilePreview';

export function HeroPreview() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="w-full max-w-md rotate-2 transition-transform duration-300 hover:rotate-0">
        <BusinessProfilePreview />
      </div>
    </div>
  );
}
