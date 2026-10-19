'use client';

import { useState, type FormEvent } from 'react';
import { brand, categories, footer, newsletter } from '@/lib/content';
import { useGoTo } from './Nav';
import { Icon } from './Art';

/** Newsletter sign-up, shop and help links, payment methods and the wordmark. */
export default function Footer() {
  const [joined, setJoined] = useState(false);
  const goTo = useGoTo();

  // Demo only: send the address to your email platform here.
  const join = (e: FormEvent) => {
    e.preventDefault();
    setJoined(true);
  };

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="news">
          <div>
            <h2 className="h2">{newsletter.title}</h2>
            <p>{newsletter.text}</p>
          </div>
          {joined ? (
            <p className="news__done" role="status"><Icon name="check" />You are on the list. Use {brand.promo.code} at checkout.</p>
          ) : (
            <form className="news__form" onSubmit={join}>
              <input type="email" required placeholder="Email address" aria-label="Email address" autoComplete="email" />
              <button type="submit" className="btn btn--paper">Sign up<Icon name="arrow" /></button>
            </form>
          )}
        </div>

        <div className="footer__cols">
          <div>
            <h3>Shop</h3>
            {categories.map((c) => <button type="button" key={c.id} onClick={() => goTo('#shop', c.id)}>{c.label}</button>)}
          </div>
          <div>
            <h3>Help</h3>
            {footer.help.map((l) => <a key={l} href="#top">{l}</a>)}
          </div>
          <div>
            <h3>{brand.name}</h3>
            {footer.company.map((l) => <a key={l} href="#top">{l}</a>)}
          </div>
          <div>
            <h3>Contact</h3>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <p>{brand.line}, designed in {brand.city}.</p>
            <ul className="pay" aria-label="Payment methods">
              {footer.payments.map((p) => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </div>

        <p className="footer__mark" aria-hidden="true">{brand.name}</p>

        <div className="footer__base">
          <p>© {new Date().getFullYear()} {brand.name}. {footer.note}</p>
          <p><a href="#top">Privacy</a><a href="#top">Terms</a><a href="#top">Cookies</a></p>
        </div>
      </div>
    </footer>
  );
}
