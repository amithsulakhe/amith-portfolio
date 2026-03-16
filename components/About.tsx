'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
    viewport: { once: true },
});

export default function About() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    const stats = [
        { value: '2+', label: 'Years Experience' },
        { value: '10+', label: 'Projects Built' },
        { value: '3+', label: 'AI Platforms' },
        { value: '100%', label: 'Passion' },
    ];

    return (
        <section id="about" style={{ padding: '100px 1.5rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* Section Header */}
                <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <p style={{
                        color: 'var(--accent)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginBottom: '0.75rem',
                    }}>
                        01 — About Me
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                    }}>
                        Who I <span className="gradient-text">Am</span>
                    </h2>
                </motion.div>

                <div style={{
                    display: 'flex',
                    gap: '4rem',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                }}>
                    {/* Text Content */}
                    <div ref={ref} style={{ flex: '1 1 400px' }}>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            style={{
                                fontSize: '1.05rem',
                                lineHeight: 1.85,
                                color: 'var(--text-secondary)',
                                marginBottom: '1.5rem',
                            }}
                        >
                            Full Stack Engineer with <strong style={{ color: 'var(--text-primary)' }}>2+ years of experience</strong> building
                            scalable AI-powered SaaS platforms using React.js, Next.js, and Node.js.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            style={{
                                fontSize: '1.05rem',
                                lineHeight: 1.85,
                                color: 'var(--text-secondary)',
                                marginBottom: '1.5rem',
                            }}
                        >
                            Experienced in modular frontend architecture, secure{' '}
                            <strong style={{ color: 'var(--accent)' }}>REST API development</strong>,{' '}
                            <strong style={{ color: 'var(--accent-2)' }}>JWT/RBAC authentication</strong>, and real-time systems
                            using WebSockets.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            style={{
                                fontSize: '1.05rem',
                                lineHeight: 1.85,
                                color: 'var(--text-secondary)',
                            }}
                        >
                            Passionate about building{' '}
                            <strong style={{ color: 'var(--accent-3)' }}>high-performance and scalable</strong> web applications
                            that solve real-world problems.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
                        >
                            <a href="#contact" className="btn-primary">Get In Touch →</a>
                            <a
                                href="mailto:amithsulakhe2468@gmail.com"
                                className="btn-outline"
                                style={{ textDecoration: 'none' }}
                            >
                                amithsulakhe2468@gmail.com
                            </a>
                        </motion.div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{
                        flex: '0 0 auto',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.25rem',
                    }}>
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={inView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                                className="glass-card"
                                style={{
                                    borderRadius: '16px',
                                    padding: '1.75rem 2rem',
                                    textAlign: 'center',
                                    minWidth: '140px',
                                }}
                            >
                                <div style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 900,
                                    background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    lineHeight: 1,
                                    marginBottom: '0.5rem',
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 500,
                                }}>
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
