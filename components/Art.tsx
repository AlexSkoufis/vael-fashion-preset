import Garment from './Garment';
import type { Product } from '@/lib/content';

/** A product's picture in one colour: its photo when it has one, the drawing otherwise. */
export default function Art({ product, colour = 0, className = '' }: { product: Product; colour?: number; className?: string }) {
  const src = product.images?.[colour] ?? product.images?.[0];
  if (src) return <img className={`photo ${className}`} src={src} alt="" loading="lazy" />;
  return <Garment kind={product.kind} colour={product.colours[colour].hex} className={className} />;
}

const paths = {
  search: 'M10.5 17a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13ZM20 20l-4.6-4.6',
  heart: 'M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z',
  bag: 'M5 8h14l-1 12H6L5 8ZM9 8V7a3 3 0 0 1 6 0v1',
  close: 'M6 6l12 12M18 6L6 18',
  arrow: 'M5 12h14M13 6l6 6l-6 6',
  minus: 'M6 12h12',
  plus: 'M6 12h12M12 6v12',
  check: 'M5 12.5l4.5 4.5L19 7.5',
};

export function Icon({ name, filled = false }: { name: keyof typeof paths; filled?: boolean }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" width="20" height="20" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
