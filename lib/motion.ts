'use client';

import { useEffect, useLayoutEffect, useState, type DependencyList, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: 'expo.out', duration: 1.1 });
}

export { gsap, ScrollTrigger, SplitText };

export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 1024px)',
  fine: '(hover: hover) and (pointer: fine)',
};

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** GSAP setup scoped to `scope`, reverted on unmount; waits for webfonts so measurements are final. */
export function useGsap(scope: RefObject<HTMLElement | null>, setup: () => void, deps: DependencyList = []) {
  useIsoLayoutEffect(() => {
    if (!scope.current) return;
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    const run = () => {
      if (cancelled || !scope.current) return;
      ctx = gsap.context(setup, scope);
      ScrollTrigger.refresh();
    };
    if (document.fonts?.status === 'loaded') run();
    else document.fonts.ready.then(run);
    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(MQ.reduced);
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);
  return reduced;
}

/** True while the element is (nearly) on screen — used to pause canvas loops off-screen. */
export function useInView(ref: RefObject<Element | null>, margin = '100px') {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: margin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, margin]);
  return inView;
}

/** Canvas sized to its CSS box at a capped device-pixel-ratio. Returns the 2D context and CSS size. */
export function fitCanvas(canvas: HTMLCanvasElement, maxDpr = 1.75) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: width, h: height };
}

/** Deterministic PRNG so server and client render the same numbers. */
export function rng(seed = 7) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
