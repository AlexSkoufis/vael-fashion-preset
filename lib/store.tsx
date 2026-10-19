'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { brand, products, type Product } from './content';
import { getLenis } from '@/components/SmoothScroll';

/** One row in the bag: a product in one colour and one size. */
export type Line = { id: string; colour: number; size: string; qty: number };
export type Panel = 'bag' | 'search' | 'menu' | null;
/** A category id, or one of the three special filters. */
export type Filter = string;

type Saved = { cart: Line[]; saved: string[]; size: string | null; promo: boolean };
type Quick = { id: string; colour: number } | null;

type Store = Saved & {
  panel: Panel;
  setPanel: (p: Panel) => void;
  quick: Quick;
  openQuick: (id: string, colour?: number) => void;
  closeQuick: () => void;
  filter: Filter;
  setFilter: (f: Filter) => void;
  add: (line: Omit<Line, 'qty'>, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  toggleSave: (id: string) => void;
  setSize: (size: string | null) => void;
  applyPromo: (code: string) => boolean;
  clear: () => void;
};

const KEY = 'vael-store';
const empty: Saved = { cart: [], saved: [], size: null, promo: false };
const Ctx = createContext<Store | null>(null);

export const productById = (id: string) => products.find((p) => p.id === id) as Product;
export const lineKey = (l: Omit<Line, 'qty'>) => `${l.id}|${l.colour}|${l.size}`;

const format = new Intl.NumberFormat(brand.locale, { style: 'currency', currency: brand.currency, maximumFractionDigits: 0 });
const formatCents = new Intl.NumberFormat(brand.locale, { style: 'currency', currency: brand.currency });
export const money = (n: number) => (Number.isInteger(n) ? format : formatCents).format(n);

export function totals(cart: Line[], promo: boolean) {
  const subtotal = cart.reduce((sum, l) => sum + productById(l.id).price * l.qty, 0);
  const discount = promo ? Math.round(subtotal * brand.promo.percent) / 100 : 0;
  const goods = subtotal - discount;
  const shipping = subtotal === 0 || goods >= brand.freeShipping ? 0 : brand.shipping;
  return {
    count: cart.reduce((sum, l) => sum + l.qty, 0),
    subtotal,
    discount,
    shipping,
    total: goods + shipping,
    toFreeShipping: Math.max(0, brand.freeShipping - goods),
  };
}

/**
 * The shop's state: bag, saved items, the visitor's size and which panel is open.
 * The bag, saved items and size are kept in localStorage so they survive a reload.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Saved>(empty);
  const [loaded, setLoaded] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [quick, setQuick] = useState<Quick>(null);
  const [filter, setFilter] = useState<Filter>('all');

  // Read after mount, so the server-rendered page and the first client render match.
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null') as Partial<Saved> | null;
      if (raw) {
        setData({
          ...empty,
          ...raw,
          // Drop anything that is no longer in the catalogue.
          cart: (raw.cart ?? []).filter((l) => productById(l.id)),
          saved: (raw.saved ?? []).filter((id) => productById(id)),
        });
      }
    } catch {
      // Storage can be blocked or hold something unreadable; the shop works without it.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      // See above.
    }
  }, [data, loaded]);

  // While a panel is open the page behind it does not scroll, and Escape closes it.
  const locked = panel !== null || quick !== null;
  useEffect(() => {
    if (!locked) return;
    document.documentElement.classList.add('is-locked');
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setQuick(null);
      setPanel(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('is-locked');
      getLenis()?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [locked]);

  const add = useCallback((line: Omit<Line, 'qty'>, qty = 1) => {
    setData((d) => {
      const key = lineKey(line);
      const found = d.cart.some((l) => lineKey(l) === key);
      const cart = found
        ? d.cart.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(9, l.qty + qty) } : l))
        : [...d.cart, { ...line, qty }];
      return { ...d, cart };
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setData((d) => ({
      ...d,
      cart: qty <= 0 ? d.cart.filter((l) => lineKey(l) !== key) : d.cart.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(9, qty) } : l)),
    }));
  }, []);

  const toggleSave = useCallback((id: string) => {
    setData((d) => ({ ...d, saved: d.saved.includes(id) ? d.saved.filter((s) => s !== id) : [...d.saved, id] }));
  }, []);

  const setSize = useCallback((size: string | null) => setData((d) => ({ ...d, size })), []);

  const applyPromo = useCallback((code: string) => {
    const ok = code.trim().toUpperCase() === brand.promo.code;
    if (ok) setData((d) => ({ ...d, promo: true }));
    return ok;
  }, []);

  const clear = useCallback(() => setData((d) => ({ ...d, cart: [], promo: false })), []);

  const openQuick = useCallback((id: string, colour = 0) => {
    setPanel(null);
    setQuick({ id, colour });
  }, []);
  const closeQuick = useCallback(() => setQuick(null), []);

  const value = useMemo<Store>(
    () => ({ ...data, panel, setPanel, quick, openQuick, closeQuick, filter, setFilter, add, setQty, toggleSave, setSize, applyPromo, clear }),
    [data, panel, quick, openQuick, closeQuick, filter, add, setQty, toggleSave, setSize, applyPromo, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const store = useContext(Ctx);
  if (!store) throw new Error('useStore must be used inside <StoreProvider>');
  return store;
}
