'use client';

import { useRef } from 'react';
import { brand, hero, promises } from '@/lib/content';
import { money, productById, useStore } from '@/lib/store';
import { gsap, MQ, useGsap } from '@/lib/motion';
import { useGoTo } from './Nav';
import Art, { Icon } from './Art';

/** Headline beside three featured pieces that drift at different speeds as you scroll. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { openQuick } = useStore();
  const goTo = useGoTo();

  useGsap(root, () => {
    gsap.matchMedia().add(`${MQ.motion} and ${MQ.desktop}`, () => {
      gsap.utils.toArray<HTMLElement>('.piece').forEach((el, i) => {
        gsap.to(el, {
          yPercent: [-16, 8, -26][i],
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    });
  });

  return (
    <section className="hero" id="top" ref={root}>
      <div className="wrap hero__in">
        <div className="hero__copy">
          <p className="eyebrow"><i />{brand.season}</p>
          <h1 className="hero__title">
            {hero.title.map((line, i) => (
              <span className="line" key={line}>
                <span style={{ animationDelay: `${0.1 + i * 0.1}s` }}>{i === hero.title.length - 1 ? <em>{line}</em> : line}</span>
              </span>
            ))}
          </h1>
          <p className="hero__lead">{hero.lead}</p>
          <div className="hero__cta">
            <button type="button" className="btn btn--ink" onClick={() => goTo('#shop', 'all')}>{hero.cta}<Icon name="arrow" /></button>
            <button type="button" className="btn btn--line" onClick={() => goTo('#looks')}>{hero.secondary}</button>
          </div>
        </div>

        <div className="hero__pieces">
          {hero.featured.map(([id, colour], i) => {
            const p = productById(id);
            return (
              <button type="button" className={`piece piece--${i + 1}`} key={id} onClick={() => openQuick(id, colour)} aria-label={`${p.name}, ${money(p.price)}. Quick view.`}>
                <span className="piece__art"><Art product={p} colour={colour} /></span>
                <span className="piece__tag"><strong>{p.name}</strong><span>{money(p.price)}</span></span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[...promises, ...promises, ...promises].map((t, i) => <span key={i}>{t}<i /></span>)}
        </div>
      </div>
    </section>
  );
}
