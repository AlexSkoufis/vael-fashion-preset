'use client';

import { useState } from 'react';
import { categories, products, sizes, type Product } from '@/lib/content';
import { money, useStore } from '@/lib/store';
import { useGoTo } from './Nav';
import Art, { Icon } from './Art';

const sorts = [
  { id: 'featured', label: 'Featured' },
  { id: 'new', label: 'Newest' },
  { id: 'low', label: 'Price: low to high' },
  { id: 'high', label: 'Price: high to low' },
];

/** Six tiles that jump to the shop with that category selected. */
export function Categories() {
  const goTo = useGoTo();
  return (
    <section className="cats">
      <div className="wrap">
        <div className="cats__grid">
          {categories.map((c) => {
            const list = products.filter((p) => p.category === c.id);
            return (
              <button type="button" className="cat" key={c.id} data-reveal onClick={() => goTo('#shop', c.id)}>
                <span className="cat__art"><Art product={list[0]} colour={list[0].colours.length - 1} /></span>
                <span className="cat__name">{c.label}</span>
                <span className="cat__count">{list.length}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product: p }: { product: Product }) {
  const { openQuick, add, setPanel, saved, toggleSave, size: mySize } = useStore();
  const [colour, setColour] = useState(0);
  const isSaved = saved.includes(p.id);

  const quickAdd = (size: string) => {
    add({ id: p.id, colour, size });
    setPanel('bag');
  };

  return (
    <article className="card">
      <div className="card__art">
        <button type="button" className="card__open" onClick={() => openQuick(p.id, colour)} aria-label={`${p.name} in ${p.colours[colour].name}. Quick view.`}>
          <Art product={p} colour={colour} />
        </button>
        {p.tag && <span className={`badge badge--${p.tag.toLowerCase().replace(' ', '-')}`}>{p.tag}</span>}
        <button type="button" className={`card__save${isSaved ? ' is-on' : ''}`} aria-pressed={isSaved} aria-label={isSaved ? `Remove ${p.name} from saved` : `Save ${p.name}`} onClick={() => toggleSave(p.id)}>
          <Icon name="heart" filled={isSaved} />
        </button>
        <div className="card__sizes">
          <span>Quick add</span>
          <div>
            {p.sizes.map((s) => (
              <button type="button" key={s} disabled={p.soldOut?.includes(s)} className={s === mySize ? 'is-mine' : undefined} onClick={() => quickAdd(s)} aria-label={`Add ${p.name}, size ${s}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card__info">
        <div>
          <h3>{p.name}</h3>
          <p>{p.colours[colour].name}</p>
        </div>
        <p className="card__price">
          {p.was && <s>{money(p.was)}</s>}
          <span className={p.was ? 'is-sale' : undefined}>{money(p.price)}</span>
        </p>
      </div>
      <div className="swatches">
        {p.colours.map((c, i) => (
          <button type="button" key={c.name} className={i === colour ? 'is-on' : undefined} style={{ background: c.hex }} aria-label={c.name} aria-pressed={i === colour} onClick={() => setColour(i)} />
        ))}
      </div>
    </article>
  );
}

/** The catalogue: category, size and sale filters, sorting, and the product grid. */
export default function Shop() {
  const { filter, setFilter, saved } = useStore();
  const [size, setSize] = useState<string | null>(null);
  const [sale, setSale] = useState(false);
  const [sort, setSort] = useState('featured');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New in' },
    ...categories,
    { id: 'saved', label: `Saved (${saved.length})` },
  ];

  let list = products.filter((p) => {
    if (filter === 'new' && p.tag !== 'New') return false;
    if (filter === 'saved' && !saved.includes(p.id)) return false;
    if (!['all', 'new', 'saved'].includes(filter) && p.category !== filter) return false;
    if (size && (!p.sizes.includes(size) || p.soldOut?.includes(size))) return false;
    if (sale && !p.was) return false;
    return true;
  });
  if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
  if (sort === 'new') list = [...list].sort((a, b) => Number(b.tag === 'New') - Number(a.tag === 'New'));

  const reset = () => {
    setFilter('all');
    setSize(null);
    setSale(false);
  };

  return (
    <section className="shop" id="shop">
      <div className="wrap">
        <header className="shop__head" data-reveal>
          <h2 className="h2">The <em>collection</em></h2>
          <p aria-live="polite">{list.length} {list.length === 1 ? 'piece' : 'pieces'}</p>
        </header>

        <div className="filters" data-reveal>
          <div className="chips" role="group" aria-label="Category">
            {tabs.map((t) => (
              <button type="button" key={t.id} className={filter === t.id ? 'is-on' : undefined} aria-pressed={filter === t.id} onClick={() => setFilter(t.id)}>{t.label}</button>
            ))}
          </div>

          <div className="filters__row">
            <div className="sizes" role="group" aria-label="Size in stock">
              <span>Size</span>
              {sizes.map((s) => (
                <button type="button" key={s} className={size === s ? 'is-on' : undefined} aria-pressed={size === s} onClick={() => setSize(size === s ? null : s)}>{s}</button>
              ))}
            </div>
            <label className="check">
              <input type="checkbox" checked={sale} onChange={(e) => setSale(e.target.checked)} />
              <span>On sale</span>
            </label>
            <label className="sort">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {sorts.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        {list.length > 0 ? (
          // The key restarts the fade-in whenever the filters change
          <div className="grid" key={`${filter}-${size}-${sale}-${sort}`}>
            {list.map((p, i) => (
              <div className="grid__item" key={p.id} style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="shop__empty">
            <p>{filter === 'saved' && saved.length === 0 ? 'You have not saved anything yet. Tap the heart on a piece to keep it here.' : 'Nothing matches those filters.'}</p>
            <button type="button" className="btn btn--line" onClick={reset}>Show everything</button>
          </div>
        )}
      </div>
    </section>
  );
}
