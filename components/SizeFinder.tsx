'use client';

import { useState } from 'react';
import { fit, sizeChart } from '@/lib/content';
import { useStore } from '@/lib/store';
import { Icon } from './Art';

const CM_PER_INCH = 2.54;

/** Chest measurement and fit preference in, a size out. The result is remembered across the shop. */
export default function SizeFinder() {
  const { size: saved, setSize } = useStore();
  const [chest, setChest] = useState(96);
  const [pref, setPref] = useState(0);
  const [inches, setInches] = useState(false);

  const min = sizeChart[0].chest[0];
  const max = sizeChart[sizeChart.length - 1].chest[1];
  // The row whose range holds the measurement, then one up or down for the preferred fit.
  const base = Math.max(0, sizeChart.findIndex((r) => chest <= r.chest[1]));
  const index = Math.min(sizeChart.length - 1, Math.max(0, base + pref));
  const row = sizeChart[index];
  const show = (cm: number) => (inches ? `${(cm / CM_PER_INCH).toFixed(1)}″` : `${cm} cm`);
  const range = ([a, b]: number[]) => (inches ? `${Math.round(a / CM_PER_INCH)}–${Math.round(b / CM_PER_INCH)}″` : `${a}–${b}`);

  return (
    <section className="fit" id="fit">
      <div className="wrap fit__in">
        <div className="fit__copy" data-reveal>
          <p className="eyebrow"><i />{fit.eyebrow}</p>
          <h2 className="h2">{fit.title}</h2>
          <p>{fit.text}</p>
        </div>

        <div className="finder" data-reveal>
          <div className="finder__form">
            <div className="finder__row">
              <label htmlFor="chest">Chest</label>
              <div className="toggle" role="group" aria-label="Units">
                <button type="button" className={!inches ? 'is-on' : undefined} aria-pressed={!inches} onClick={() => setInches(false)}>cm</button>
                <button type="button" className={inches ? 'is-on' : undefined} aria-pressed={inches} onClick={() => setInches(true)}>in</button>
              </div>
            </div>
            <output className="finder__value" htmlFor="chest">{show(chest)}</output>
            <input id="chest" type="range" min={min} max={max} value={chest} aria-valuetext={show(chest)} onChange={(e) => setChest(Number(e.target.value))} style={{ '--fill': `${((chest - min) / (max - min)) * 100}%` } as React.CSSProperties} />

            <p className="finder__label">How do you like it to sit?</p>
            <div className="toggle toggle--wide" role="group" aria-label="Fit preference">
              {fit.prefs.map((p) => (
                <button type="button" key={p.id} className={pref === p.id ? 'is-on' : undefined} aria-pressed={pref === p.id} onClick={() => setPref(p.id)}>{p.label}</button>
              ))}
            </div>
          </div>

          <div className="finder__result">
            <p>Your size</p>
            <strong key={row.size} aria-live="polite">{row.size}</strong>
            <button type="button" className={`btn ${saved === row.size ? 'btn--line' : 'btn--ink'}`} onClick={() => setSize(saved === row.size ? null : row.size)}>
              {saved === row.size ? <><Icon name="check" />Saved as your size</> : `Remember ${row.size} for me`}
            </button>
            <small>{saved === row.size ? 'It is preselected on every product. Tap again to forget it.' : 'We will preselect it on every product.'}</small>
          </div>

          <table className="chart">
            <caption>Body measurements{inches ? ', inches' : ', cm'}</caption>
            <thead><tr><th scope="col">Size</th><th scope="col">Chest</th><th scope="col">Waist</th></tr></thead>
            <tbody>
              {sizeChart.map((r, i) => (
                <tr key={r.size} className={i === index ? 'is-on' : undefined}>
                  <th scope="row">{r.size}</th><td>{range(r.chest)}</td><td>{range(r.waist)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
