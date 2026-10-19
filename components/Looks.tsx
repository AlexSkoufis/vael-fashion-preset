'use client';

import { useState } from 'react';
import { looks } from '@/lib/content';
import { money, productById, useStore } from '@/lib/store';
import Art, { Icon } from './Art';

/** Three outfits. Pick a size for each piece and add the whole look to the bag at once. */
export default function Looks() {
  const { add, setPanel, openQuick, size: mySize } = useStore();
  const [active, setActive] = useState(0);
  // Sizes the visitor has chosen here, by product id.
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const look = looks.items[active];

  const pieces = look.pieces.map(([id, colour]) => {
    const p = productById(id);
    const available = p.sizes.filter((s) => !p.soldOut?.includes(s));
    const fallback = mySize && available.includes(mySize) ? mySize : available[Math.min(2, available.length - 1)];
    return { p, colour, available, size: chosen[id] ?? fallback };
  });
  const total = pieces.reduce((sum, x) => sum + x.p.price, 0);

  const addLook = () => {
    pieces.forEach((x) => add({ id: x.p.id, colour: x.colour, size: x.size }));
    setPanel('bag');
  };

  return (
    <section className="looks" id="looks">
      <div className="wrap">
        <header className="looks__head">
          <div data-reveal>
            <p className="eyebrow"><i />{looks.eyebrow}</p>
            <h2 className="h2">{looks.title}</h2>
          </div>
          <p data-reveal>{looks.text}</p>
        </header>

        <div className="looks__tabs" role="tablist" aria-label="Looks" data-reveal>
          {looks.items.map((l, i) => (
            <button type="button" role="tab" key={l.id} id={`look-tab-${l.id}`} aria-selected={i === active} aria-controls="look-panel" className={i === active ? 'is-on' : undefined} onClick={() => setActive(i)}>
              <span>0{i + 1}</span>{l.name}
            </button>
          ))}
        </div>

        <div className="look" id="look-panel" role="tabpanel" aria-labelledby={`look-tab-${look.id}`} data-reveal>
          <div className={`look__stage look__stage--${pieces.length}`} key={look.id}>
            {pieces.map((x, i) => (
              <button type="button" className="look__piece" key={x.p.id} style={{ animationDelay: `${i * 90}ms` }} onClick={() => openQuick(x.p.id, x.colour)} aria-label={`View ${x.p.name}`}>
                <Art product={x.p} colour={x.colour} />
              </button>
            ))}
          </div>

          <div className="look__list">
            <p className="look__text">{look.text}</p>
            <ul>
              {pieces.map((x) => (
                <li key={x.p.id}>
                  <span className="look__thumb"><Art product={x.p} colour={x.colour} /></span>
                  <span className="look__name">
                    <strong>{x.p.name}</strong>
                    <small>{x.p.colours[x.colour].name} · {money(x.p.price)}</small>
                  </span>
                  {x.p.sizes.length > 1 ? (
                    <select aria-label={`Size for ${x.p.name}`} value={x.size} onChange={(e) => setChosen({ ...chosen, [x.p.id]: e.target.value })}>
                      {x.available.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  ) : (
                    <span className="look__one">{x.size}</span>
                  )}
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn--paper btn--wide" onClick={addLook}>
              Add the look<span>{money(total)}</span>
            </button>
            <p className="look__note"><Icon name="check" />{pieces.length} pieces, each returnable on its own</p>
          </div>
        </div>
      </div>
    </section>
  );
}
