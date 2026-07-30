import {
  siInstagram,
  siFacebook,
  siWhatsapp,
  siTiktok,
  siYoutube,
} from 'simple-icons';

const icons = {
  instagram: siInstagram,
  facebook: siFacebook,
  whatsapp: siWhatsapp,
  tiktok: siTiktok,
  youtube: siYoutube,
};

export type Brand =
  'instagram' | 'facebook' | 'whatsapp' | 'tiktok' | 'youtube';

interface BrandIconProps {
  brand: Brand;
  size?: number;
  className?: string;
}

export function BrandIcon({ brand, size = 32, className }: BrandIconProps) {
  const icon = icons[brand];

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={`#${icon.hex}`}
      className={className}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}
