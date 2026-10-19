'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, MQ } from '@/lib/motion';

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

/** Scroll to an element or y position, via Lenis when active, natively otherwise. */
export function scrollToTarget(target: string | number | HTMLElement, opts: { offset?: number; immediate?: boolean } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: opts.offset ?? 0, immediate: opts.immediate, duration: 1.4 });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  const y = typeof el === 'number' ? el : (el?.getBoundingClientRect().top ?? 0) + window.scrollY;
  window.scrollTo({ top: y + (opts.offset ?? 0), behavior: opts.immediate ? 'auto' : 'smooth' });
}

/**
 * Light Lenis smoothing driven by the GSAP ticker. Short lerp keeps it responsive;
 * touch devices keep native scrolling; reduced-motion users get no smoothing at all.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia(MQ.motion).matches) return;
    lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, anchors: { offset: 0 }, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add('lenis-on');
    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
      document.documentElement.classList.remove('lenis-on');
    };
  }, []);
  return null;
}
