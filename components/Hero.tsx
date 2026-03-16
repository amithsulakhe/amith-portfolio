'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Parallax3D } from '@/components/Parallax3D';

const FRAME_COUNT = 192;
const FRAME_PATHS: string[] = Array.from({ length: FRAME_COUNT }, (_, i) =>
    `/amith-frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.png`
);

// How many viewport heights the sticky section lasts (determines how long frames play)
const SCROLL_HEIGHT_VH = 280;

/* ─── Top loading progress bar ───────────────────────────────────── */
function TopLoader({ progress }: { progress: number }) {
    return (
        <div
            style={{
                position: 'fixed', top: 0, left: 0, right: 0,
                height: '3px', zIndex: 99999,
                background: 'rgba(99,102,241,0.12)',
                pointerEvents: 'none',
            }}
        >
            <div
                style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
                    transition: 'width 0.25s ease-out',
                    boxShadow: '0 0 12px rgba(99,102,241,0.8)',
                    borderRadius: '0 3px 3px 0',
                }}
            />
        </div>
    );
}

/* ─── Hero Section ───────────────────────────────────────────────── */
export default function Hero() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);

    // Smooth lerp: target is where scroll says we should be, current animates toward it
    const targetFrameRef = useRef(0);
    const currentFrameRef = useRef(0);
    const rafLoopRef = useRef<number>(0);
    const lastDrawnRef = useRef(-1);

    const [showResumePreview, setShowResumePreview] = useState(false);

    const [loadProgress, setLoadProgress] = useState(0);
    const [framesLoaded, setFramesLoaded] = useState(false);

    // ── Draw a frame to canvas, maintaining cover aspect ratio ───────
    const drawFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const img = imagesRef.current[Math.max(0, Math.min(FRAME_COUNT - 1, index))];
        if (!img?.complete || !img.naturalWidth) return;
        const cw = canvas.width;
        const ch = canvas.height;
        const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
        const dw = img.naturalWidth * scale;
        const dh = img.naturalHeight * scale;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }, []);

    // ── Resize canvas ─────────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            drawFrame(Math.round(currentFrameRef.current));
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        return () => ro.disconnect();
    }, [drawFrame]);

    // ── Preload all frames, track progress, lock scroll while loading ─
    useEffect(() => {
        if (typeof window === 'undefined') return;
        document.body.style.overflow = 'hidden';

        let loadedCount = 0;
        const images: HTMLImageElement[] = Array.from({ length: FRAME_COUNT }, (_, i) => {
            const img = new window.Image();
            img.onload = img.onerror = () => {
                loadedCount++;
                const pct = Math.round((loadedCount / FRAME_COUNT) * 100);
                setLoadProgress(pct);
                if (loadedCount === 1) drawFrame(0); // show first frame ASAP
                if (loadedCount >= FRAME_COUNT) {
                    setFramesLoaded(true);
                    document.body.style.overflow = '';
                    // Signal ChatUI that loading is complete
                    (window as { __heroLoaded?: boolean }).__heroLoaded = true;
                    window.dispatchEvent(new CustomEvent('heroLoaded'));
                }
            };
            img.src = FRAME_PATHS[i];
            return img;
        });
        imagesRef.current = images;

        return () => { document.body.style.overflow = ''; };
    }, [drawFrame]);

    // ── Smooth rAF loop: lerp currentFrame → targetFrame, redraw ─────
    useEffect(() => {
        if (!framesLoaded) return;

        const loop = () => {
            const diff = targetFrameRef.current - currentFrameRef.current;
            // Lerp speed: fast when far, glide when close
            currentFrameRef.current += diff * 0.18;

            const idx = Math.round(currentFrameRef.current);
            if (idx !== lastDrawnRef.current) {
                lastDrawnRef.current = idx;
                drawFrame(idx);
            }
            rafLoopRef.current = requestAnimationFrame(loop);
        };
        rafLoopRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafLoopRef.current);
    }, [framesLoaded, drawFrame]);

    // ── Scroll → target frame index ──────────────────────────────────
    useEffect(() => {
        if (!framesLoaded) return;

        const updateTarget = () => {
            const wrapper = wrapperRef.current;
            if (!wrapper) return;
            const rect = wrapper.getBoundingClientRect();
            const scrollRange = wrapper.offsetHeight - window.innerHeight;
            if (scrollRange <= 0) return;
            const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));
            targetFrameRef.current = progress * (FRAME_COUNT - 1);
        };

        updateTarget();
        window.addEventListener('scroll', updateTarget, { passive: true });
        window.addEventListener('resize', updateTarget);
        return () => {
            window.removeEventListener('scroll', updateTarget);
            window.removeEventListener('resize', updateTarget);
        };
    }, [framesLoaded]);

    return (
        <>
            {/* Top progress bar while loading */}
            {!framesLoaded && <TopLoader progress={loadProgress} />}

            {/* Loading overlay */}
            {!framesLoaded && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9998,
                        background: '#0a0a14',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '1rem',
                    }}
                >
                    <div style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em',
                    }}>
                        ARS
                    </div>
                    <div style={{
                        width: '160px', height: '2px',
                        background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%', width: `${loadProgress}%`,
                            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
                            transition: 'width 0.2s ease-out',
                        }} />
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', letterSpacing: '0.1em' }}>
                        {loadProgress}%
                    </p>
                </div>
            )}

            {/* ── Sticky scroll wrapper: user must scroll through this to advance frames ── */}
            <div
                ref={wrapperRef}
                style={{ height: `${SCROLL_HEIGHT_VH}vh`, position: 'relative' }}
            >
                <section
                    id="home"
                    style={{
                        height: '100vh',
                        position: 'sticky',
                        top: 0,
                        overflow: 'hidden',
                        borderRadius: '0 0 28px 28px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        cursor: 'default',
                    }}
                >
                    {/* Canvas: full-screen frame renderer */}
                    <canvas
                        ref={canvasRef}
                        aria-hidden="true"
                        style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            zIndex: 0,
                            display: 'block',
                        }}
                    />

                    {/* Left-side gradient for text legibility — kept light so the photo shows through */}
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute', inset: 0, zIndex: 1,
                            background:
                                'linear-gradient(100deg, rgba(4,4,16,0.62) 0%, rgba(4,4,16,0.35) 42%, transparent 68%)',
                        }}
                    />

                    {/* Top fade for navbar area */}
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute', top: 0, left: 0, right: 0,
                            height: '120px', zIndex: 2,
                            background: 'linear-gradient(to bottom, rgba(4,4,16,0.45), transparent)',
                        }}
                    />

                    {/* Bottom fade into next section */}
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            height: '140px', zIndex: 2,
                            background: 'linear-gradient(to top, rgba(4,4,16,0.7), transparent)',
                            borderRadius: '0 0 28px 28px',
                        }}
                    />

                    {/* ── Main text content ── */}
                    <Parallax3D
                        maxTilt={5}
                        perspective={1600}
                        smooth={0.1}
                        scale={1.005}
                        disableOnTouch={true}
                        style={{
                            position: 'relative', zIndex: 4,
                            maxWidth: '680px', width: '100%',
                            /* Push content below navbar + breathe room, keep it visible in viewport */
                            paddingTop: 'clamp(90px, 14vh, 140px)',
                            paddingBottom: 'clamp(60px, 8vh, 100px)',
                            paddingLeft: 'clamp(1.5rem, 5vw, 5rem)',
                            paddingRight: 'clamp(1.5rem, 5vw, 5rem)',
                            alignSelf: 'flex-start',
                        }}
                    >
                        <motion.p
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: framesLoaded ? 1 : 0, y: framesLoaded ? 0 : 20 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            style={{
                                color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 700,
                                letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '0.6rem',
                            }}
                        >
                            👋 Hello, I&apos;m
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: framesLoaded ? 1 : 0, y: framesLoaded ? 0 : 30 }}
                            transition={{ duration: 0.65, delay: 0.2 }}
                            style={{
                                fontSize: 'clamp(2.4rem, 6.5vw, 5rem)', fontWeight: 900,
                                lineHeight: 1.0, marginBottom: '0.5rem', color: '#fff',
                                wordBreak: 'break-word',
                                textShadow: '0 2px 24px rgba(0,0,0,0.7)',
                            }}
                        >
                            Amith R{' '}
                            <span className="gradient-text">Sulakhe</span>
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: framesLoaded ? 1 : 0, y: framesLoaded ? 0 : 20 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            style={{ marginBottom: '0.9rem' }}
                        >
                            <span style={{
                                display: 'inline-block', padding: '0.28rem 1rem',
                                borderRadius: '999px', background: 'rgba(99,102,241,0.18)',
                                border: '1px solid rgba(99,102,241,0.38)', color: '#a5b4fc',
                                fontSize: 'clamp(0.78rem, 1.6vw, 0.95rem)', fontWeight: 600,
                                backdropFilter: 'blur(8px)',
                            }}>
                                Full Stack Software Engineer
                            </span>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: framesLoaded ? 1 : 0, y: framesLoaded ? 0 : 20 }}
                            transition={{ duration: 0.6, delay: 0.38 }}
                            style={{
                                fontSize: 'clamp(0.85rem, 1.6vw, 1rem)',
                                color: 'rgba(255,255,255,0.65)', lineHeight: 1.75,
                                marginBottom: '1.5rem', maxWidth: '440px',
                            }}
                        >
                            Building scalable SaaS and AI-powered web applications using{' '}
                            <strong style={{ color: '#818cf8' }}>React</strong>,{' '}
                            <strong style={{ color: '#a78bfa' }}>Next.js</strong> and{' '}
                            <strong style={{ color: '#67e8f9' }}>Node.js</strong>.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: framesLoaded ? 1 : 0, y: framesLoaded ? 0 : 20 }}
                            transition={{ duration: 0.6, delay: 0.46 }}
                            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.4rem' }}
                        >
                            <a href="#projects" className="btn-primary" style={{ textDecoration: 'none' }}>
                                View Projects →
                            </a>
                            <button
                                type="button"
                                onClick={() => setShowResumePreview(true)}
                                className="btn-outline"
                                style={{ textDecoration: 'none', cursor: 'pointer' }}
                            >
                                📄 Preview Resume
                            </button>
                            <a href="#contact" className="btn-outline" style={{ textDecoration: 'none' }}>
                                ✉️ Contact Me
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: framesLoaded ? 1 : 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.4rem 1rem', background: 'rgba(0,0,0,0.32)',
                                border: '1px solid rgba(255,255,255,0.13)', borderRadius: '999px',
                                fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <span>📍</span>
                            <span>Karnataka, India</span>
                            <span style={{
                                width: '7px', height: '7px', background: '#22c55e',
                                borderRadius: '50%', display: 'inline-block',
                                boxShadow: '0 0 6px #22c55e',
                            }} />
                            <span style={{ color: '#4ade80', fontWeight: 600 }}>Available for hire</span>
                        </motion.div>
                    </Parallax3D>

                    {/* Scroll hint */}
                    {framesLoaded && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay: 1.4, duration: 0.8 }}
                            style={{
                                position: 'absolute', bottom: '2.2rem', left: '50%',
                                transform: 'translateX(-50%)', zIndex: 5,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                                pointerEvents: 'none',
                            }}
                        >
                            <span style={{
                                fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)',
                                letterSpacing: '0.15em', textTransform: 'uppercase',
                            }}>
                                Scroll Down
                            </span>
                            <motion.div
                                animate={{ y: [0, 7, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                style={{ color: 'rgba(99,102,241,0.8)', fontSize: '1.1rem' }}
                            >
                                ↓
                            </motion.div>
                        </motion.div>
                    )}
                </section>
            </div>

            {/* Resume preview overlay */}
            {showResumePreview && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 100000,
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                    }}
                    onClick={() => setShowResumePreview(false)}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: 'min(900px, 100%)',
                            height: 'min(80vh, 100%)',
                            background: '#050816',
                            borderRadius: '18px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                zIndex: 2,
                                display: 'flex',
                                gap: '0.5rem',
                            }}
                        >
                            <a
                                href="/resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline"
                                style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem', textDecoration: 'none' }}
                            >
                                Open in new tab
                            </a>
                            <button
                                type="button"
                                onClick={() => setShowResumePreview(false)}
                                style={{
                                    borderRadius: '999px',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    background: 'rgba(15,23,42,0.9)',
                                    color: '#e5e7eb',
                                    padding: '0.25rem 0.7rem',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                }}
                            >
                                ✕ Close
                            </button>
                        </div>
                        <iframe
                            src="/resume.pdf"
                            title="Amith R Sulakhe Resume"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                background: '#0b1120',
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
