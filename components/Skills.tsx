'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const skillGroups = [
    {
        category: 'Frontend',
        icon: '🎨',
        color: '#6366f1',
        skills: ['React.js', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Material UI'],
    },
    {
        category: 'Backend',
        icon: '⚙️',
        color: '#8b5cf6',
        skills: ['Node.js', 'Express.js', 'REST APIs', 'JWT Authentication', 'WebSockets'],
    },
    {
        category: 'Database',
        icon: '🗄️',
        color: '#06b6d4',
        skills: ['MySQL', 'MongoDB'],
    },
    {
        category: 'Cloud',
        icon: '☁️',
        color: '#10b981',
        skills: ['AWS EC2', 'AWS S3', 'CloudFront', 'IAM'],
    },
    {
        category: 'DevOps',
        icon: '🔧',
        color: '#f59e0b',
        skills: ['Docker', 'GitHub Actions'],
    },
];

export default function Skills() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="skills" style={{
            padding: '100px 1.5rem',
            background: 'var(--bg-secondary)',
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
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
                        02 — Skills
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                    }}>
                        Tech <span className="gradient-text">Stack</span>
                    </h2>
                </motion.div>

                {/* Skill Group Cards */}
                <div
                    ref={ref}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {skillGroups.map((group, gi) => (
                        <motion.div
                            key={group.category}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: gi * 0.1 }}
                            className="glass-card"
                            style={{ borderRadius: '20px', padding: '2rem' }}
                        >
                            {/* Category Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    background: `${group.color}22`,
                                    border: `1px solid ${group.color}44`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                }}>
                                    {group.icon}
                                </div>
                                <span style={{
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                }}>
                                    {group.category}
                                </span>
                            </div>

                            {/* Skill Tags */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                                {group.skills.map((skill, si) => (
                                    <motion.span
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{ duration: 0.4, delay: gi * 0.1 + si * 0.05 }}
                                        whileHover={{ scale: 1.08, y: -2 }}
                                        style={{
                                            padding: '0.35rem 0.85rem',
                                            borderRadius: '8px',
                                            fontSize: '0.82rem',
                                            fontWeight: 600,
                                            background: `${group.color}15`,
                                            border: `1px solid ${group.color}30`,
                                            color: group.color,
                                            cursor: 'default',
                                            transition: 'all 0.2s ease',
                                            display: 'inline-block',
                                        }}
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
