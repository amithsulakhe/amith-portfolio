'use client';

import { useRef, useState, useCallback, useEffect, type ReactNode } from 'react';

interface Parallax3DProps {
  children: ReactNode;
  /** Max tilt in degrees (default 12) */
  maxTilt?: number;
  /** Perspective in px (default 1200) */
  perspective?: number;
  /** Smoothing 0–1, higher = smoother (default 0.15) */
  smooth?: number;
  /** Scale on hover (default 1.02) */
  scale?: number;
  /** Disable on touch devices */
  disableOnTouch?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Parallax3D({
  children,
  maxTilt = 12,
  perspective = 1200,
  smooth = 0.15,
  scale = 1.02,
  disableOnTouch = true,
  className = '',
  style = {},
}: Parallax3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const current = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const isTouchRef = useRef(false);
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    isTouchRef.current = window.matchMedia('(pointer: coarse)').matches;
  }

  const animate = useCallback(() => {
    current.current.x += (target.current.x - current.current.x) * smooth;
    current.current.y += (target.current.y - current.current.y) * smooth;
    const el = ref.current;
    if (el && !isTouchRef.current) {
      const { x, y } = current.current;
      const s = isHovered ? scale : 1;
      el.style.transform = `perspective(${perspective}px) rotateX(${-y}deg) rotateY(${x}deg) scale3d(${s}, ${s}, ${s})`;
    }
    rafId.current = requestAnimationFrame(animate);
  }, [perspective, smooth, scale, isHovered]);

  useEffect(() => {
    if (disableOnTouch && isTouchRef.current) return;
    rafId.current = requestAnimationFrame(animate);
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, [animate, disableOnTouch]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disableOnTouch && isTouchRef.current) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const x = (e.clientX - rect.left - w / 2) / (w / 2);
      const y = (e.clientY - rect.top - h / 2) / (h / 2);
      target.current.x = x * maxTilt;
      target.current.y = y * maxTilt;
    },
    [maxTilt, disableOnTouch]
  );

  const onMouseLeave = useCallback(() => {
    target.current.x = 0;
    target.current.y = 0;
    setIsHovered(false);
  }, []);

  const onMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </div>
  );
}

/** Single layer with a depth factor for multi-layer parallax (e.g. background -0.5, foreground 1.5) */
interface ParallaxLayerProps {
  children: ReactNode;
  depth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxLayer({ children, depth = 1, className = '', style = {} }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const current = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const smooth = 0.08;

  useEffect(() => {
    const parent = ref.current?.closest('[data-parallax-container]') as HTMLDivElement | null;
    parentRef.current = parent;
    if (!parent) return;

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const x = (e.clientX - rect.left - w / 2) / (w / 2);
      const y = (e.clientY - rect.top - h / 2) / (h / 2);
      target.current.x = x * 20 * depth;
      target.current.y = y * 20 * depth;
    };

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * smooth;
      current.current.y += (target.current.y - current.current.y) * smooth;
      const el = ref.current;
      if (el) {
        el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      requestAnimationFrame(animate);
    };

    parent.addEventListener('mousemove', onMove, { passive: true });
    let raf = requestAnimationFrame(animate);
    return () => {
      parent.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [depth]);

  return (
    <div ref={ref} className={className} style={{ ...style, willChange: 'transform' }}>
      {children}
    </div>
  );
}
