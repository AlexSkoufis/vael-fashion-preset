'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, MQ } from '@/lib/motion';

/**
 * Mount once. Every element with a `data-reveal` attribute fades and rises into place the first
 * time it scrolls into view; elements entering together are staggered. Add `data-reveal` to
 * anything new and it joins in. Without motion (or JavaScript) everything is simply visible.
 */
export default function Reveal() {
  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) return;
    const els = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    gsap.set(els, { autoAlpha: 0, y: 28 });
    const triggers = ScrollTrigger.batch(els, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, overwrite: true }),
    });
    return () => {
      triggers.forEach((t) => t.kill());
      gsap.set(els, { clearProps: 'all' });
    };
  }, []);
  return null;
}

/** A number that counts up from zero the first time it is seen. */
export function Count({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (!ref.current || !window.matchMedia(MQ.motion).matches || to === 0) return;
    const state = { n: 0 };
    setValue(0);
    const tween = gsap.to(state, {
      n: to,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => setValue(Math.round(state.n)),
      scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [to]);

  return <span ref={ref}>{value}{suffix}</span>;
}
