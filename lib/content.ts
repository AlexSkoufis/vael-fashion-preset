// Everything a shop owner edits lives in this file: brand details, the catalogue, the looks,
// the size chart and all the copy. Vael, its products, prices and reviews are fictional.
import type { GarmentKind } from '@/components/Garment';

export const brand = {
  name: 'Vael',
  line: 'Everyday tailoring',
  city: 'Lisbon',
  email: 'hello@vael.example',
  season: 'Autumn / Winter 26',
  // Prices are plain numbers in this currency, formatted for this locale.
  currency: 'USD',
  locale: 'en-US',
  // Orders at or above this value ship free; below it, `shipping` is added.
  freeShipping: 150,
  shipping: 8,
  // The one promo code the bag accepts in the demo.
  promo: { code: 'WELCOME10', percent: 10 },
};

export const announcements = [
  `Free shipping on orders over $${brand.freeShipping}`,
  'Free returns within 30 days',
  `New here? ${brand.promo.code} takes ${brand.promo.percent}% off your first order`,
];

export const nav = [
  { label: 'New in', href: '#shop', category: 'new' },
  { label: 'Shop', href: '#shop', category: 'all' },
  { label: 'Looks', href: '#looks' },
  { label: 'Size finder', href: '#fit' },
  { label: 'How we make', href: '#craft' },
];

export const hero = {
  title: ['Fewer,', 'better things', 'to wear.'],
  // The last line of the title is set in italic.
  lead: 'Twelve pieces a season, cut in Lisbon from wool, cotton and linen that get better with wear.',
  cta: 'Shop the collection',
  secondary: 'See the looks',
  // Three products shown beside the headline: [product id, colour index].
  featured: [['miro', 0], ['alba', 0], ['enzo', 0]] as [string, number][],
};

export const promises = ['Free shipping over $150', '30-day returns', 'Made in Portugal', 'Repairs for life', 'Plastic-free packaging'];

export const categories = [
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'knitwear', label: 'Knitwear' },
  { id: 'shirts', label: 'Shirts & tees' },
  { id: 'bottoms', label: 'Trousers' },
  { id: 'dresses', label: 'Dresses' },
  { id: 'accessories', label: 'Accessories' },
] as const;

export type CategoryId = (typeof categories)[number]['id'];

export const sizes = ['XS', 'S', 'M', 'L', 'XL'] as const;
const oneSize = ['One size'] as const;

// A small shared palette, so the same colour name always means the same colour.
const c = {
  ink: { name: 'Ink', hex: '#1F1E1C' },
  bone: { name: 'Bone', hex: '#E9E2D2' },
  white: { name: 'Chalk', hex: '#F6F4EE' },
  camel: { name: 'Camel', hex: '#B88B5A' },
  oat: { name: 'Oat', hex: '#D6C9AE' },
  olive: { name: 'Olive', hex: '#5F623F' },
  navy: { name: 'Navy', hex: '#222D47' },
  rust: { name: 'Rust', hex: '#A9492C' },
  grey: { name: 'Flint', hex: '#8B8B86' },
  chocolate: { name: 'Chocolate', hex: '#4C3528' },
  sky: { name: 'Sky', hex: '#A8BCD2' },
  butter: { name: 'Butter', hex: '#E6D28A' },
  sage: { name: 'Sage', hex: '#A2AC93' },
  burgundy: { name: 'Burgundy', hex: '#611C28' },
};

export type Colour = { name: string; hex: string };
export type Tag = 'New' | 'Bestseller' | 'Sale' | 'Low stock';

export type Product = {
  id: string;
  name: string;
  /** Which drawing to use. Ignored when `image` is set. */
  kind: GarmentKind;
  category: CategoryId;
  price: number;
  /** The earlier price, shown struck through. */
  was?: number;
  tag?: Tag;
  colours: Colour[];
  sizes: readonly string[];
  soldOut?: string[];
  blurb: string;
  fabric: string;
  fit: string;
  care: string;
  /** Optional photos, one per colour, in /public. When set they replace the drawing. */
  images?: string[];
  /** Ids of two products shown as "Pairs well with". */
  pairs: [string, string];
};

export const products: Product[] = [
  {
    id: 'alba', name: 'Alba Wool Coat', kind: 'coat', category: 'outerwear', price: 420, tag: 'Bestseller',
    colours: [c.camel, c.ink, c.olive], sizes, soldOut: ['XS'],
    blurb: 'A double-breasted coat that falls just below the knee, with a soft shoulder and room for a knit underneath.',
    fabric: '90% recycled wool, 10% cashmere. Fully lined in cupro.',
    fit: 'Relaxed. Take your usual size, or one down for a closer fit.',
    care: 'Dry clean only. Brush after wear and hang on a wide hanger.',
    pairs: ['miro', 'enzo'],
  },
  {
    id: 'miro', name: 'Miro Lambswool Crew', kind: 'knit', category: 'knitwear', price: 185, tag: 'New',
    colours: [c.rust, c.oat, c.navy, c.sage], sizes,
    blurb: 'A mid-weight crew neck knitted in one piece, so there are no side seams to twist or rub.',
    fabric: '100% lambswool from Biella, Italy.',
    fit: 'Regular. Sits at the hip.',
    care: 'Hand wash cold or use a wool cycle. Dry flat.',
    pairs: ['alba', 'cala'],
  },
  {
    id: 'rue', name: 'Rue Oxford Shirt', kind: 'shirt', category: 'shirts', price: 135, tag: 'Bestseller',
    colours: [c.white, c.sky, c.butter], sizes,
    blurb: 'The shirt we started with. Heavy oxford cloth, a soft collar and a chest pocket that actually holds a phone.',
    fabric: '100% organic cotton oxford, 170 gsm.',
    fit: 'Regular through the body with a slightly longer back.',
    care: 'Machine wash at 30°C. Iron while damp.',
    pairs: ['enzo', 'port'],
  },
  {
    id: 'enzo', name: 'Enzo Pleated Trouser', kind: 'trousers', category: 'bottoms', price: 165,
    colours: [c.ink, c.camel, c.grey], sizes,
    blurb: 'A single pleat, a high rise and a straight leg that breaks once on the shoe.',
    fabric: '98% wool flannel, 2% elastane.',
    fit: 'High rise, straight leg. Hems are left long for tailoring.',
    care: 'Dry clean, or steam between wears.',
    pairs: ['rue', 'ines'],
  },
  {
    id: 'lia', name: 'Lia Slip Dress', kind: 'dress', category: 'dresses', price: 210, tag: 'New',
    colours: [c.burgundy, c.ink, c.sage], sizes,
    blurb: 'Cut on the bias so it moves with you, with narrow adjustable straps and a hem that sits mid-calf.',
    fabric: '100% sandwashed silk.',
    fit: 'Skims the body. Take your usual size.',
    care: 'Hand wash cold with silk detergent. Do not wring.',
    pairs: ['vera', 'port'],
  },
  {
    id: 'noa', name: 'Noa Twill Overshirt', kind: 'shirt', category: 'shirts', price: 175, tag: 'New',
    colours: [c.olive, c.chocolate, c.ink], sizes,
    blurb: 'Heavier than a shirt, lighter than a jacket. Wear it open over a tee or buttoned under a coat.',
    fabric: '100% cotton twill, 320 gsm, garment dyed.',
    fit: 'Boxy. Size down if you are between sizes.',
    care: 'Machine wash at 30°C. The colour softens with every wash.',
    pairs: ['sol', 'cala'],
  },
  {
    id: 'vera', name: 'Vera Trench', kind: 'coat', category: 'outerwear', price: 340, was: 425, tag: 'Sale',
    colours: [c.oat, c.navy], sizes, soldOut: ['XL'],
    blurb: 'A lighter coat for the months that cannot decide. Water-repellent, unlined and easy to pack.',
    fabric: '100% cotton gabardine with a PFC-free finish.',
    fit: 'Relaxed, with a dropped shoulder.',
    care: 'Dry clean. Re-proof once a year.',
    pairs: ['lia', 'ines'],
  },
  {
    id: 'ines', name: 'Ines Merino Crew', kind: 'knit', category: 'knitwear', price: 160,
    colours: [c.grey, c.ink, c.burgundy], sizes,
    blurb: 'A fine-gauge layer that works under a jacket and does not itch. The one that goes in every suitcase.',
    fabric: '100% extra-fine merino, 16.5 micron.',
    fit: 'Close to the body. Size up for a looser fit.',
    care: 'Machine wash on a wool cycle. Dry flat.',
    pairs: ['enzo', 'vera'],
  },
  {
    id: 'sol', name: 'Sol Heavy Tee', kind: 'tee', category: 'shirts', price: 60,
    colours: [c.white, c.ink, c.sage, c.rust], sizes,
    blurb: 'A proper T-shirt: dense jersey, a neck that keeps its shape and a hem that stays where it is.',
    fabric: '100% organic cotton jersey, 240 gsm.',
    fit: 'Boxy with a dropped shoulder.',
    care: 'Machine wash at 30°C. Do not tumble dry.',
    pairs: ['noa', 'enzo'],
  },
  {
    id: 'cala', name: 'Cala Wide Trouser', kind: 'trousers', category: 'bottoms', price: 150, tag: 'Low stock',
    colours: [c.bone, c.chocolate], sizes, soldOut: ['L', 'XL'],
    blurb: 'A wide, easy leg in washed linen with an elasticated back, so it sits flat at the front.',
    fabric: '100% European linen, 250 gsm.',
    fit: 'Wide leg, mid rise. Runs slightly large.',
    care: 'Machine wash at 30°C. Line dry and let it crease.',
    pairs: ['sol', 'miro'],
  },
  {
    id: 'ona', name: 'Ona Linen Dress', kind: 'dress', category: 'dresses', price: 190, was: 240, tag: 'Sale',
    colours: [c.butter, c.bone], sizes, soldOut: ['XS', 'S'],
    blurb: 'A strappy summer dress with deep side pockets, in the last of this year’s linen.',
    fabric: '100% European linen.',
    fit: 'Loose through the body. Size down for a neater fit.',
    care: 'Machine wash at 30°C. Line dry.',
    pairs: ['port', 'noa'],
  },
  {
    id: 'port', name: 'Port Canvas Tote', kind: 'tote', category: 'accessories', price: 85,
    colours: [c.bone, c.olive, c.ink], sizes: oneSize,
    blurb: 'A bag for the market, the office and the weekend. Fits a 16-inch laptop and stands up on its own.',
    fabric: '100% cotton canvas, 510 gsm, with an inside zip pocket.',
    fit: '42 × 38 × 14 cm. Handle drop 26 cm.',
    care: 'Spot clean with a damp cloth.',
    pairs: ['rue', 'lia'],
  },
];

// Outfits in the "Looks" section: [product id, colour index] from the outer layer inwards.
export const looks = {
  eyebrow: 'The looks',
  title: 'Put together for you.',
  text: 'Three ways to wear this season. Choose your sizes and add the whole look in one go.',
  items: [
    { id: 'walk', name: 'The long walk', text: 'A coat that does the work, over wool and flannel.',
      pieces: [['alba', 0], ['miro', 1], ['enzo', 0]] as [string, number][] },
    { id: 'office', name: 'Office, loosely', text: 'An overshirt instead of a blazer, and linen that is allowed to crease.',
      pieces: [['noa', 0], ['rue', 0], ['cala', 0], ['port', 0]] as [string, number][] },
    { id: 'dark', name: 'After dark', text: 'Silk under gabardine, for dinner that turns into something else.',
      pieces: [['vera', 1], ['lia', 0], ['port', 2]] as [string, number][] },
  ],
};

// Body chest measurement in centimetres for each size. The size finder reads this table.
export const sizeChart = [
  { size: 'XS', chest: [80, 87], waist: [64, 71] },
  { size: 'S', chest: [88, 93], waist: [72, 77] },
  { size: 'M', chest: [94, 99], waist: [78, 83] },
  { size: 'L', chest: [100, 107], waist: [84, 91] },
  { size: 'XL', chest: [108, 118], waist: [92, 102] },
];

export const fit = {
  eyebrow: 'Size finder',
  title: 'Find your size in ten seconds.',
  text: 'Measure around the fullest part of your chest, tell us how you like things to sit, and we will remember your size across the shop.',
  prefs: [
    { id: -1, label: 'Closer' },
    { id: 0, label: 'Regular' },
    { id: 1, label: 'Looser' },
  ],
};

export const craft = {
  eyebrow: 'How we make',
  title: 'Made slowly, a few hours from where we design it.',
  text: 'Every piece is cut and sewn in three family-run workshops in northern Portugal. We make small runs, publish what each one costs to produce, and mend what we sell.',
  facts: [
    { value: 3, suffix: '', label: 'Workshops, all within 320 km of our studio' },
    { value: 12, suffix: '', label: 'Pieces a season, and nothing made to be marked down' },
    { value: 94, suffix: '%', label: 'Natural or recycled fibres across the collection' },
    { value: 100, suffix: '%', label: 'Of repairs free, for as long as you own the piece' },
  ],
  materials: [
    { name: 'Lambswool', from: 'Biella, Italy', text: 'Spun and dyed by a mill that has done only this since 1913.' },
    { name: 'Organic cotton', from: 'Izmir, Türkiye', text: 'Rain-fed and certified organic, woven into oxford and twill in Portugal.' },
    { name: 'Linen', from: 'Normandy, France', text: 'Grown without irrigation and stone-washed for softness from day one.' },
  ],
};

export const reviews = {
  rating: 4.8,
  count: 2140,
  items: [
    { name: 'Hannah R.', product: 'Alba Wool Coat', stars: 5, text: 'Third winter in it and it looks better than the day it arrived. The size finder got me into a medium, which was right.' },
    { name: 'Tomás V.', product: 'Rue Oxford Shirt', stars: 5, text: 'I have bought four. The collar sits properly without a tie, which is rarer than it should be.' },
    { name: 'Priya S.', product: 'Lia Slip Dress', stars: 4, text: 'Beautiful silk and a very easy return when I needed the next size up. The second one is perfect.' },
  ],
};

export const newsletter = {
  title: 'Ten percent off your first order.',
  text: 'One email a month: new pieces, restocks and the occasional workshop visit. No daily discounts.',
};

export const footer = {
  help: ['Shipping', 'Returns & exchanges', 'Size guide', 'Repairs', 'Contact'],
  company: ['Our story', 'Workshops', 'Journal', 'Careers', 'Stockists'],
  payments: ['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Klarna'],
  note: 'Vael is a fictional brand created for this template. Products, prices and reviews are placeholders.',
};
