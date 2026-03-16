'use client';

import { useEffect, useRef } from 'react';

interface Bubble {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    alpha: number;
    color: [number, number, number];
    life: number;       // 0 → 1 (normalized lifespan progress)
    maxLife: number;    // total frames to live
}

const PALETTE: [number, number, number][] = [
    [99, 102, 241],   // indigo
    [139, 92, 246],   // violet
    [6, 182, 212],    // cyan
    [168, 85, 247],   // purple
    [56, 189, 248],   // sky
];

export default function CursorEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(pointer: coarse)').matches) return; // skip mobile

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const bubbles: Bubble[] = [];
        let mouseX = -500;
        let mouseY = -500;
        let isMoving = false;
        let moveTimer: ReturnType<typeof setTimeout>;
        let rafId: number;

        const spawnBubble = () => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.4 + Math.random() * 1.2;
            const radius = 6 + Math.random() * 18;
            const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
            const maxLife = 60 + Math.floor(Math.random() * 80); // 1–2.5 seconds at 60fps

            // Spawn slightly scattered around cursor
            const scatter = radius * 0.5;
            bubbles.push({
                x: mouseX + (Math.random() - 0.5) * scatter,
                y: mouseY + (Math.random() - 0.5) * scatter,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 0.3, // slight upward bias
                radius,
                alpha: 1,
                color,
                life: 0,
                maxLife,
            });
        };

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMoving = true;
            clearTimeout(moveTimer);
            moveTimer = setTimeout(() => { isMoving = false; }, 100);
        };

        const onResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        let spawnAccum = 0;
        const SPAWN_EVERY = 3; // spawn a bubble every N frames while moving

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Spawn new bubbles while mouse is moving
            if (isMoving) {
                spawnAccum++;
                if (spawnAccum >= SPAWN_EVERY) {
                    spawnAccum = 0;
                    spawnBubble();
                    // Occasionally spawn 2 at once for density
                    if (Math.random() < 0.35) spawnBubble();
                }
            }

            // Update and draw bubbles
            for (let i = bubbles.length - 1; i >= 0; i--) {
                const b = bubbles[i];

                // Move
                b.x += b.vx;
                b.y += b.vy;
                b.vy += 0.012; // subtle gravity
                b.vx *= 0.995; // gentle air resistance
                b.life++;

                // Lifecycle alpha: ease-in then ease-out
                const progress = b.life / b.maxLife;
                if (progress < 0.15) {
                    b.alpha = progress / 0.15; // fade in
                } else {
                    b.alpha = 1 - (progress - 0.15) / 0.85; // fade out
                }
                b.alpha = Math.max(0, Math.min(1, b.alpha));

                // Remove dead bubbles
                if (b.life >= b.maxLife) {
                    bubbles.splice(i, 1);
                    continue;
                }

                const [r, g, v] = b.color;

                // Outer glow
                const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius * 2);
                grd.addColorStop(0, `rgba(${r},${g},${v},${b.alpha * 0.35})`);
                grd.addColorStop(1, `rgba(${r},${g},${v},0)`);
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                // Bubble body (semi-transparent filled circle)
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${v},${b.alpha * 0.18})`;
                ctx.fill();

                // Bubble border
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${r},${g},${v},${b.alpha * 0.7})`;
                ctx.lineWidth = 1.2;
                ctx.stroke();

                // Shine highlight
                ctx.beginPath();
                ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.35, b.radius * 0.22, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${b.alpha * 0.5})`;
                ctx.fill();
            }

            // Custom cursor dot + ring
            if (mouseX > 0) {
                // Ring
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, 14, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(99,102,241,0.65)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                // Dot
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99,102,241,1)';
                ctx.fill();
            }

            rafId = requestAnimationFrame(draw);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });
        rafId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(rafId);
            clearTimeout(moveTimer);
        };
    }, []);

    return (
        <>
            <style>{`body * { cursor: none !important; }`}</style>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 99999,
                }}
                aria-hidden="true"
            />
        </>
    );
}
