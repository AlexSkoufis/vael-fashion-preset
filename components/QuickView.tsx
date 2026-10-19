'use client';

import { useEffect, useRef, useState } from 'react';
import { brand, categories } from '@/lib/content';
import { money, productById, useStore } from '@/lib/store';
import { useGoTo } from './Nav';
import Art, { Icon } from './Art';

/** The product sheet: colour, size, quantity, details and two pieces that go with it. */
export default function QuickView() {
  const { quick, openQuick, closeQuick, add, setPanel, size: mySize, saved, toggleSave } = useStore();
  const [colour, setColour] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [nudge, setNudge] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const goTo = useGoTo();

  // The last product stays rendered while the sheet slides out.
  const [shown, setShown] = useState(quick);
  useEffect(() => {
    if (!quick) return;
    const p = productById(quick.id);
    const only = p.sizes.length === 1 ? p.sizes[0] : null;
    const mine = mySize && p.sizes.includes(mySize) && !p.soldOut?.includes(mySize) ? mySize : null;
    setShown(quick);
    setColour(quick.colour);
    setSize(only ?? mine);
    setQty(1);
    setNudge(false);
    panel.current?.scrollTo(0, 0);
    panel.current?.focus();
  }, [quick, mySize]);

  const open = quick !== null;
  if (!shown) return null;
  const p = productById(shown.id);
  const isSaved = saved.includes(p.id);
  const category = categories.find((c) => c.id === p.category)?.label;

  const addToBag = () => {
    if (!size) {
      setNudge(true);
      return;
    }
    add({ id: p.id, colour, size }, qty);
    closeQuick();
    setPanel('bag');
  };

  return (
    <div className={`qv${open ? ' is-open' : ''}`} aria-hidden={!open} inert={!open}>
      <div className="scrim" onClick={closeQuick} />
      <div className="qv__panel" role="dialog" aria-modal="true" aria-label={p.name} tabIndex={-1} ref={panel} data-lenis-prevent>
        <button type="button" className="iconbtn qv__close" aria-label="Close" onClick={closeQuick}><Icon name="close" /></button>

        <div className="qv__art">
          <Art product={p} colour={colour} key={`${p.id}-${colour}`} />
          {p.tag && <span className={`badge badge--${p.tag.toLowerCase().replace(' ', '-')}`}>{p.tag}</span>}
        </div>

        <div className="qv__info">
          <p className="qv__cat">{category}</p>
          <h2>{p.name}</h2>
          <p className="qv__price">
            {p.was && <s>{money(p.was)}</s>}
            <span className={p.was ? 'is-sale' : undefined}>{money(p.price)}</span>
          </p>
          <p className="qv__blurb">{p.blurb}</p>

          <div className="field">
            <p className="field__label">Colour <span>{p.colours[colour].name}</span></p>
            <div className="swatches swatches--lg">
              {p.colours.map((c, i) => (
                <button type="button" key={c.name} className={i === colour ? 'is-on' : undefined} style={{ background: c.hex }} aria-label={c.name} aria-pressed={i === colour} onClick={() => setColour(i)} />
              ))}
            </div>
          </div>

          <div className="field">
            <p className="field__label">
              Size
              {mySize && p.sizes.includes(mySize) && <span>Your size is {mySize}</span>}
              <button type="button" className="link" onClick={() => { closeQuick(); goTo('#fit'); }}>Size finder</button>
            </p>
            <div className={`sizepick${nudge && !size ? ' is-nudge' : ''}`}>
              {p.sizes.map((s) => (
                <button type="button" key={s} disabled={p.soldOut?.includes(s)} className={s === size ? 'is-on' : undefined} aria-pressed={s === size} onClick={() => setSize(s)}>
                  {s}
                </button>
              ))}
            </div>
            {nudge && !size && <p className="field__error" role="alert">Choose a size to continue.</p>}
          </div>

          <div className="qv__buy">
            <div className="stepper">
              <button type="button" aria-label="One fewer" disabled={qty === 1} onClick={() => setQty(qty - 1)}><Icon name="minus" /></button>
              <span aria-live="polite">{qty}</span>
              <button type="button" aria-label="One more" disabled={qty === 9} onClick={() => setQty(qty + 1)}><Icon name="plus" /></button>
            </div>
            <button type="button" className="btn btn--ink btn--wide" onClick={addToBag}>Add to bag<span>{money(p.price * qty)}</span></button>
            <button type="button" className={`iconbtn iconbtn--ring${isSaved ? ' is-on' : ''}`} aria-pressed={isSaved} aria-label={isSaved ? 'Remove from saved' : 'Save for later'} onClick={() => toggleSave(p.id)}>
              <Icon name="heart" filled={isSaved} />
            </button>
          </div>
          <p className="qv__note">Free shipping over {money(brand.freeShipping)} · Free returns within 30 days</p>

          <div className="facts">
            <details open><summary>Fabric</summary><p>{p.fabric}</p></details>
            <details><summary>Fit</summary><p>{p.fit}</p></details>
            <details><summary>Care</summary><p>{p.care}</p></details>
          </div>

          <div className="pairs">
            <p className="field__label">Pairs well with</p>
            <div>
              {p.pairs.map((id) => {
                const other = productById(id);
                return (
                  <button type="button" className="hit" key={id} onClick={() => openQuick(id)}>
                    <span className="hit__art"><Art product={other} /></span>
                    <span><strong>{other.name}</strong><small>{other.colours[0].name}</small></span>
                    <span>{money(other.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
