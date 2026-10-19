import { craft, reviews } from '@/lib/content';
import { Count } from './Reveal';

const Stars = ({ n }: { n: number }) => (
  <span className="stars" role="img" aria-label={`${n} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, i) => <i key={i} className={i < n ? 'is-on' : undefined}>★</i>)}
  </span>
);

/** How the clothes are made, in numbers and materials, followed by customer reviews. */
export default function Craft() {
  return (
    <section className="craft" id="craft">
      <div className="wrap">
        <div className="craft__head">
          <p className="eyebrow" data-reveal><i />{craft.eyebrow}</p>
          <h2 className="h2 h2--xl" data-reveal>{craft.title}</h2>
          <p data-reveal>{craft.text}</p>
        </div>

        <dl className="facts-row">
          {craft.facts.map((f) => (
            <div key={f.label} data-reveal>
              <dt><Count to={f.value} suffix={f.suffix} /></dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>

        <ul className="materials">
          {craft.materials.map((m, i) => (
            <li key={m.name} data-reveal>
              <span>0{i + 1}</span>
              <h3>{m.name}</h3>
              <p className="materials__from">{m.from}</p>
              <p>{m.text}</p>
            </li>
          ))}
        </ul>

        <div className="reviews">
          <div className="reviews__score" data-reveal>
            <strong>{reviews.rating}</strong>
            <Stars n={Math.round(reviews.rating)} />
            <p>From {reviews.count.toLocaleString('en-US')} verified reviews</p>
          </div>
          {reviews.items.map((r) => (
            <figure className="review" key={r.name} data-reveal>
              <Stars n={r.stars} />
              <blockquote>{r.text}</blockquote>
              <figcaption><strong>{r.name}</strong><span>Bought the {r.product}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
