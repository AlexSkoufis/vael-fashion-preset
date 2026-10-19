'use client';

import { useEffect, useRef, useState } from 'react';
import { announcements, brand, categories, nav, products } from '@/lib/content';
import { money, totals, useStore } from '@/lib/store';
import { scrollToTarget } from './SmoothScroll';
import Art, { Icon } from './Art';

/** Sets the shop filter (when the link has one) and scrolls to the section. */
export function useGoTo() {
  const { setFilter, setPanel } = useStore();
  return (href: string, filter?: string) => {
    if (filter) setFilter(filter);
    setPanel(null);
    // Wait a frame so a panel that was open has released the scroll lock.
    requestAnimationFrame(() => scrollToTarget(href, { offset: -90 }));
  };
}

function Search() {
  const { panel, setPanel, openQuick } = useStore();
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const goTo = useGoTo();
  const open = panel === 'search';

  useEffect(() => {
    if (open) input.current?.focus();
    else setQuery('');
  }, [open]);

  const q = query.trim().toLowerCase();
  const label = (id: string) => categories.find((c) => c.id === id)?.label ?? '';
  const results = q
    ? products.filter((p) => [p.name, label(p.category), p.fabric, ...p.colours.map((c) => c.name)].join(' ').toLowerCase().includes(q))
    : products.filter((p) => p.tag === 'Bestseller' || p.tag === 'New').slice(0, 4);

  return (
    <div className={`search${open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Search" aria-hidden={!open} inert={!open}>
      <div className="wrap">
        <form className="search__bar" role="search" onSubmit={(e) => e.preventDefault()}>
          <Icon name="search" />
          <input ref={input} type="search" placeholder="Search coats, knitwear, linen…" aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="button" className="iconbtn" aria-label="Close search" onClick={() => setPanel(null)}><Icon name="close" /></button>
        </form>

        <p className="search__label" aria-live="polite">
          {q ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${query.trim()}”` : 'Popular right now'}
        </p>

        {results.length > 0 ? (
          <div className="search__results" data-lenis-prevent>
            {results.map((p) => (
              <button type="button" key={p.id} className="hit" onClick={() => openQuick(p.id)}>
                <span className="hit__art"><Art product={p} /></span>
                <span><strong>{p.name}</strong><small>{label(p.category)}</small></span>
                <span>{money(p.price)}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="search__empty">
            Nothing matches that. Try a fabric or a colour, or{' '}
            <button type="button" className="link" onClick={() => goTo('#shop', 'all')}>browse everything</button>.
          </p>
        )}
      </div>
    </div>
  );
}

/** Announcement strip, navigation with search, saved items and bag, and the mobile menu. */
export default function Nav() {
  const { panel, setPanel, cart, saved } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [note, setNote] = useState(0);
  const goTo = useGoTo();
  const count = totals(cart, false).count;
  const menu = panel === 'menu';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const timer = setInterval(() => setNote((n) => (n + 1) % announcements.length), 4200);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <header className={`top${scrolled ? ' is-scrolled' : ''}${menu ? ' is-menu' : ''}`}>
        <div className="announce">
          <p key={note}>{announcements[note]}</p>
        </div>

        <div className="wrap nav">
          <button type="button" className="nav__toggle" aria-label="Menu" aria-expanded={menu} aria-controls="menu" onClick={() => setPanel(menu ? null : 'menu')}>
            <span /><span />
          </button>

          <nav className="nav__links" aria-label="Main">
            {nav.map((l) => (
              <a key={l.label} href={l.href} onClick={(e) => { e.preventDefault(); goTo(l.href, l.category); }}>{l.label}</a>
            ))}
          </nav>

          <a className="logo" href="#top" aria-label={`${brand.name} home`}>{brand.name}</a>

          <div className="nav__actions">
            <button type="button" className="iconbtn" aria-label="Search" onClick={() => setPanel('search')}><Icon name="search" /></button>
            <button type="button" className="iconbtn" aria-label={`Saved items, ${saved.length}`} onClick={() => goTo('#shop', 'saved')}>
              <Icon name="heart" filled={saved.length > 0} />
              {saved.length > 0 && <span className="pip">{saved.length}</span>}
            </button>
            <button type="button" className="iconbtn" aria-label={`Bag, ${count} ${count === 1 ? 'item' : 'items'}`} onClick={() => setPanel('bag')}>
              <Icon name="bag" />
              {count > 0 && <span className="pip pip--ink" key={count}>{count}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className={`menu${menu ? ' is-open' : ''}`} id="menu" aria-hidden={!menu} inert={!menu}>
        <nav aria-label="Menu">
          {nav.map((l) => (
            <a key={l.label} href={l.href} onClick={(e) => { e.preventDefault(); goTo(l.href, l.category); }}>{l.label}</a>
          ))}
        </nav>
        <div className="menu__cats">
          {categories.map((c) => (
            <button type="button" key={c.id} onClick={() => goTo('#shop', c.id)}>{c.label}</button>
          ))}
        </div>
        <p>{brand.line} from {brand.city}</p>
      </div>

      <Search />
    </>
  );
}
