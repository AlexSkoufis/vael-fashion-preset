import { useId, type ReactNode } from 'react';

export type GarmentKind = 'coat' | 'knit' | 'shirt' | 'tee' | 'trousers' | 'dress' | 'tote';

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (hex: string, to: string, t: number) => {
  const a = rgb(hex);
  const b = rgb(to);
  return `#${a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
};
const luminance = (hex: string) => {
  const [r, g, b] = rgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

type Shape = {
  /** The outline, filled with the product colour. */
  body: string;
  /** Shapes drawn behind the body (bag handles). */
  under?: (deep: string) => ReactNode;
  /** The inside of a neckline, filled darker. */
  inside?: string;
  /** Extra panels filled with the product colour and outlined (collars, lapels, pockets). */
  panels?: string[];
  /** Seams and stitching, drawn as thin lines. */
  seams: string[];
  /** Fainter lines (creases and folds). */
  folds?: string[];
  /** Buttons as [x, y, radius]. */
  buttons?: [number, number, number][];
};

const ribs = (from: number, to: number, y1: number, y2: number) =>
  Array.from({ length: Math.floor((to - from) / 12) + 1 }, (_, i) => `M${from + i * 12} ${y1}V${y2}`).join('');

// Every garment is drawn in a 400 × 480 box as if laid flat, front up.
const shapes: Record<GarmentKind, Shape> = {
  tee: {
    body: 'M146 62Q200 92 254 62L326 92L372 176L318 204L298 168L300 404Q200 416 100 404L102 168L82 204L28 176L74 92Z',
    inside: 'M146 62Q200 92 254 62Q200 72 146 62Z',
    seams: ['M139 65Q200 106 261 65', 'M36 166L88 194', 'M364 166L312 194', 'M101 392Q200 404 299 392', 'M100 84Q92 130 102 168', 'M300 84Q308 130 298 168'],
  },
  knit: {
    body: 'M150 60Q200 84 250 60L318 86Q350 100 358 150L384 384L334 394L304 196L304 416Q200 426 96 416L96 196L66 394L16 384L42 150Q50 100 82 86Z',
    inside: 'M150 60Q200 84 250 60Q200 68 150 60Z',
    seams: ['M141 64Q200 102 259 64', 'M96 396Q200 406 304 396', 'M19 364L69 374', 'M381 364L331 374', 'M96 196Q84 140 100 92', 'M304 196Q316 140 300 92'],
    folds: [ribs(104, 296, 400, 418), 'M26 368L24 384M38 370L36 387M50 372L48 389M362 370L364 387M350 372L352 389M374 368L376 384'],
  },
  shirt: {
    body: 'M156 56L244 56L316 84Q346 98 354 148L378 380L332 390L304 196L306 400Q256 426 200 416Q144 426 94 400L96 196L68 390L22 380L46 148Q54 98 84 84Z',
    inside: 'M156 56L200 98L244 56Q200 66 156 56Z',
    panels: ['M156 56L200 98L170 124L146 70Z', 'M244 56L200 98L230 124L254 70Z', 'M226 180h44v40l-22 10l-22-10Z'],
    seams: ['M193 104V417', 'M207 104V417', 'M26 360L72 370', 'M374 360L328 370', 'M96 196Q84 140 100 90', 'M304 196Q316 140 300 90'],
    buttons: [[200, 132, 3.4], [200, 186, 3.4], [200, 240, 3.4], [200, 294, 3.4], [200, 348, 3.4], [200, 398, 3.4]],
  },
  coat: {
    body: 'M152 44L248 44L318 74Q348 88 354 140L376 372L328 382L306 190L314 462L86 462L94 190L72 382L24 372L46 140Q52 88 82 74Z',
    inside: 'M152 44L200 200L248 44Q200 58 152 44Z',
    panels: ['M152 44L200 200L158 150L168 134L136 116L140 58Z', 'M248 44L200 200L242 150L232 134L264 116L260 58Z', 'M112 322h54v15h-54Z', 'M234 322h54v15h-54Z'],
    seams: ['M200 200V462', 'M94 190Q80 130 98 82', 'M306 190Q320 130 302 82', 'M28 352L74 362', 'M372 352L326 362'],
    buttons: [[176, 244, 5], [224, 244, 5], [176, 302, 5], [224, 302, 5]],
  },
  trousers: {
    body: 'M118 36L282 36L288 76L306 456L218 456L200 164L182 456L94 456L112 76Z',
    seams: ['M113 70L287 70', 'M200 70V164', 'M212 70V130Q212 148 200 152', 'M150 70Q144 110 114 124', 'M250 70Q256 110 286 124', 'M95 440L181 440', 'M219 440L305 440', 'M140 36V70M148 36V70M252 36V70M260 36V70'],
    folds: ['M152 128L138 440', 'M248 128L262 440'],
    buttons: [[206, 53, 3.4]],
  },
  dress: {
    body: 'M158 30L170 30L180 108Q200 124 220 108L230 30L242 30L262 124Q254 190 270 238L326 448Q200 472 74 448L130 238Q146 190 138 124Z',
    seams: ['M140 196Q200 210 260 196', 'M78 436Q200 460 322 436'],
    folds: ['M170 208Q160 330 140 454', 'M230 208Q240 330 260 454', 'M200 206V462'],
  },
  tote: {
    body: 'M84 190L316 190L334 446L66 446Z',
    under: (deep) => <path d="M140 204Q136 70 200 70Q264 70 260 204" fill="none" stroke={deep} strokeWidth="15" />,
    panels: ['M126 190h28v44h-28Z', 'M246 190h28v44h-28Z', 'M182 304h36v16h-36Z'],
    seams: ['M83 212L317 212', 'M126 190l28 44M154 190l-28 44M246 190l28 44M274 190l-28 44'],
  },
};

/**
 * A product drawn in code and tinted with `colour`, so one drawing serves every colourway.
 * To use photography instead, give a product `images` in lib/content.ts.
 */
export default function Garment({ kind, colour, className = '' }: { kind: GarmentKind; colour: string; className?: string }) {
  const id = useId();
  const s = shapes[kind];
  const dark = luminance(colour) < 0.22;
  const seam = dark ? mix(colour, '#ffffff', 0.3) : mix(colour, '#000000', 0.32);
  const deep = mix(colour, '#000000', dark ? 0.45 : 0.3);

  return (
    <svg className={`garment ${className}`} viewBox="0 0 400 480" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={dark ? 0.16 : 0.34} />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {s.under?.(deep)}
      <path d={s.body} fill={colour} />
      {s.inside && <path d={s.inside} fill={deep} />}
      <path d={s.body} fill={`url(#${id})`} />
      <g fill={colour} stroke={seam} strokeWidth="1.8" strokeLinejoin="round">
        {s.panels?.map((d) => <path key={d} d={d} />)}
      </g>
      <g fill="none" stroke={seam} strokeWidth="1.8" strokeLinecap="round">
        {s.seams.map((d) => <path key={d} d={d} />)}
        <g opacity="0.5">{s.folds?.map((d) => <path key={d} d={d} />)}</g>
      </g>
      {s.buttons?.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={deep} stroke={seam} strokeWidth="1" />)}
      <path d={s.body} fill="none" stroke={seam} strokeWidth="1.2" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}
