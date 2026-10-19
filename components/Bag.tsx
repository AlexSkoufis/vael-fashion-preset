'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { brand } from '@/lib/content';
import { lineKey, money, productById, totals, useStore, type Line } from '@/lib/store';
import { useGoTo } from './Nav';
import Art, { Icon } from './Art';

/**
 * Where a real shop hands over to its payment provider. In the demo nothing is charged:
 * the bag is emptied and a confirmation is shown. See "Connecting a checkout" in the README.
 */
async function checkout(cart: Line[], promo: boolean) {
  await new Promise((r) => setTimeout(r, 900));
  return { ok: true, items: totals(cart, promo).count, total: totals(cart, promo).total };
}

/** The bag drawer: lines, a free-shipping meter, a promo code and the totals. */
export default function Bag() {
  const { panel, setPanel, cart, promo, setQty, applyPromo, clear, openQuick } = useStore();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ items: number; total: number } | null>(null);
  const drawer = useRef<HTMLElement>(null);
  const goTo = useGoTo();
  const open = panel === 'bag';
  const t = totals(cart, promo);

  useEffect(() => {
    if (open) drawer.current?.focus();
    else setDone(null);
  }, [open]);

  const submitCode = (e: FormEvent) => {
    e.preventDefault();
    setCodeError(!applyPromo(code));
  };

  const pay = async () => {
    setBusy(true);
    const result = await checkout(cart, promo);
    setBusy(false);
    if (!result.ok) return;
    setDone(result);
    clear();
  };

  return (
    <div className={`drawer${open ? ' is-open' : ''}`} aria-hidden={!open} inert={!open}>
      <div className="scrim" onClick={() => setPanel(null)} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Your bag" tabIndex={-1} ref={drawer}>
        <header className="drawer__head">
          <h2>Your bag <span>{t.count}</span></h2>
          <button type="button" className="iconbtn" aria-label="Close bag" onClick={() => setPanel(null)}><Icon name="close" /></button>
        </header>

        {done ? (
          <div className="drawer__empty">
            <span className="tick"><Icon name="check" /></span>
            <h3>Thank you.</h3>
            <p>This is a demo, so nothing was charged. In a live shop your {done.items === 1 ? 'piece' : `${done.items} pieces`} ({money(done.total)}) would now be on the way to your payment provider.</p>
            <button type="button" className="btn btn--line" onClick={() => setPanel(null)}>Keep browsing</button>
          </div>
        ) : cart.length === 0 ? (
          <div className="drawer__empty">
            <h3>Your bag is empty.</h3>
            <p>Start with the pieces people come back for.</p>
            <button type="button" className="btn btn--ink" onClick={() => goTo('#shop', 'all')}>Shop the collection<Icon name="arrow" /></button>
          </div>
        ) : (
          <>
            <div className="meter">
              <p>{t.toFreeShipping > 0 ? <>You are <strong>{money(t.toFreeShipping)}</strong> away from free shipping</> : <>You have <strong>free shipping</strong></>}</p>
              <div className="meter__bar"><i style={{ transform: `scaleX(${Math.min(1, 1 - t.toFreeShipping / brand.freeShipping)})` }} /></div>
            </div>

            <ul className="lines" data-lenis-prevent>
              {cart.map((l) => {
                const p = productById(l.id);
                const key = lineKey(l);
                return (
                  <li className="line-item" key={key}>
                    <button type="button" className="line-item__art" onClick={() => openQuick(l.id, l.colour)} aria-label={`View ${p.name}`}><Art product={p} colour={l.colour} /></button>
                    <div className="line-item__body">
                      <p><strong>{p.name}</strong><span>{money(p.price * l.qty)}</span></p>
                      <p className="line-item__meta">{p.colours[l.colour].name} · {l.size}</p>
                      <div className="line-item__foot">
                        <div className="stepper stepper--sm">
                          <button type="button" aria-label={`One fewer ${p.name}`} onClick={() => setQty(key, l.qty - 1)}><Icon name="minus" /></button>
                          <span>{l.qty}</span>
                          <button type="button" aria-label={`One more ${p.name}`} disabled={l.qty === 9} onClick={() => setQty(key, l.qty + 1)}><Icon name="plus" /></button>
                        </div>
                        <button type="button" className="link" onClick={() => setQty(key, 0)}>Remove</button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="drawer__foot">
              {promo ? (
                <p className="promo-on"><Icon name="check" />{brand.promo.code} applied: {brand.promo.percent}% off</p>
              ) : (
                <form className="promo" onSubmit={submitCode}>
                  <input type="text" placeholder={`Promo code (try ${brand.promo.code})`} aria-label="Promo code" aria-invalid={codeError} value={code} onChange={(e) => { setCode(e.target.value); setCodeError(false); }} />
                  <button type="submit" className="btn btn--line btn--sm">Apply</button>
                  {codeError && <p className="field__error" role="alert">That code is not valid.</p>}
                </form>
              )}

              <dl className="sum">
                <div><dt>Subtotal</dt><dd>{money(t.subtotal)}</dd></div>
                {t.discount > 0 && <div><dt>Discount</dt><dd>−{money(t.discount)}</dd></div>}
                <div><dt>Shipping</dt><dd>{t.shipping === 0 ? 'Free' : money(t.shipping)}</dd></div>
                <div className="sum__total"><dt>Total</dt><dd>{money(t.total)}</dd></div>
              </dl>

              <button type="button" className="btn btn--ink btn--wide" disabled={busy} onClick={pay}>{busy ? 'One moment…' : 'Checkout'}<span>{money(t.total)}</span></button>
              <p className="drawer__small">Taxes included. Free returns within 30 days.</p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
