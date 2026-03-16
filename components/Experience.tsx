'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const experiences = [
    {
        role: 'Front End Software Engineer',
        company: 'Ask Ainstein',
        period: 'Apr 2025 – Present',
        type: 'Full-time',
        color: '#6366f1',
        points: [
            'Leading frontend architecture for AI-powered educational SaaS platform',
            'Integrated OpenAI Realtime APIs and WebSockets for live interactions',
            'Improved performance by 40% using SSR and code splitting techniques',
            'Designed reusable UI component library adopted across the platform',
            'Implemented role-based UI rendering using JWT token claims',
        ],
        tags: ['React', 'Next.js', 'OpenAI API', 'WebSockets', 'JWT'],
    },
    {
        role: 'Full Stack Developer',
        company: 'Novelti Solutions',
        period: 'Feb 2024 – Mar 2025',
        type: 'Full-time',
        color: '#8b5cf6',
        points: [
            'Developed AI-powered recruitment platform with 5 distinct portals',
            'Built REST APIs using Node.js and Express with clean architecture',
            'Implemented JWT RBAC authentication securing multi-tenant access',
            'Optimized MySQL queries improving overall performance by 25%',
            'Implemented scalable backend architecture for high-traffic scenarios',
        ],
        tags: ['Node.js', 'Express', 'MySQL', 'JWT', 'REST APIs'],
    },
];

export default function Experience() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="experience" style={{ padding: '100px 1.5rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <p style={{
                        color: 'var(--accent)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginBottom: '0.75rem',
                    }}>
                        03 — Experience
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                    }}>
                        Work <span className="gradient-text">History</span>
                    </h2>
                </motion.div>

                {/* Timeline */}
                <div ref={ref} style={{ position: 'relative' }}>
                    {/* Vertical line */}
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={inView ? { scaleY: 1 } : {}}
                        transition={{ duration: 1, delay: 0.2 }}
                        style={{
                            position: 'absolute',
                            left: '28px',
                            top: '0',
                            bottom: '0',
                            width: '2px',
                            background: 'linear-gradient(to bottom, var(--accent), var(--accent-2), transparent)',
                            transformOrigin: 'top',
                        }}
                    />

                    {experiences.map((exp, i) => (
                        <motion.div
                            key={exp.company}
                            initial={{ opacity: 0, x: -40 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.2 + 0.2 }}
                            style={{
                                display: 'flex',
                                gap: '2rem',
                                marginBottom: '3rem',
                                position: 'relative',
                            }}
                        >
                            {/* Dot */}
                            <div style={{
                                flexShrink: 0,
                                width: '58px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                paddingTop: '1.5rem',
                            }}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={inView ? { scale: 1 } : {}}
                                    transition={{ duration: 0.4, delay: i * 0.2 + 0.1 }}
                                    style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        background: exp.color,
                                        border: `3px solid var(--bg)`,
                                        boxShadow: `0 0 15px ${exp.color}80`,
                                        zIndex: 2,
                                        position: 'relative',
                                    }}
                                />
                            </div>

                            {/* Card */}
                            <div
                                className="glass-card"
                                style={{
                                    flex: 1,
                                    borderRadius: '20px',
                                    padding: '2rem',
                                    borderLeft: `3px solid ${exp.color}`,
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '0.75rem',
                                    marginBottom: '1rem',
                                }}>
                                    <div>
                                        <h3 style={{
                                            fontSize: '1.2rem',
                                            fontWeight: 700,
                                            color: 'var(--text-primary)',
                                            marginBottom: '0.25rem',
                                        }}>
                                            {exp.role}
                                        </h3>
                                        <p style={{
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            color: exp.color,
                                        }}>
                                            {exp.company}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '0.35rem 0.9rem',
                                            borderRadius: '8px',
                                            fontSize: '0.78rem',
                                            fontWeight: 600,
                                            background: `${exp.color}20`,
                                            color: exp.color,
                                            border: `1px solid ${exp.color}40`,
                                            marginBottom: '0.3rem',
                                        }}>
                                            {exp.period}
                                        </span>
                                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{exp.type}</p>
                                    </div>
                                </div>

                                <ul style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    marginBottom: '1.25rem',
                                }}>
                                    {exp.points.map((pt, pi) => (
                                        <li key={pi} style={{
                                            display: 'flex',
                                            gap: '0.75rem',
                                            marginBottom: '0.6rem',
                                            fontSize: '0.9rem',
                                            color: 'var(--text-secondary)',
                                            lineHeight: 1.6,
                                        }}>
                                            <span style={{ color: exp.color, flexShrink: 0, marginTop: '3px' }}>▸</span>
                                            <span>{pt}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {exp.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            style={{
                                                padding: '0.25rem 0.7rem',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                background: 'var(--bg-secondary)',
                                                color: 'var(--text-secondary)',
                                                border: '1px solid var(--border)',
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
