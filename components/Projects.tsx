'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const projects = [
    {
        title: 'Ask Ainstein Platform',
        description:
            'AI-powered smart educational platform with real-time chat, role-based dashboards, and optimized UI performance.',
        image: '/projects/ask-ainstein.png',
        tags: ['React', 'Next.js', 'OpenAI API', 'WebSockets', 'JWT', 'SSR'],
        color: '#6366f1',
        github: '#',
        live: '#',
    },
    {
        title: 'Candidate Interview Management System',
        description:
            'AI recruitment platform with Admin, Recruiter, Candidate, and Interview portals supporting complete hiring workflows.',
        image: '/projects/interview-platform.png',
        tags: ['Node.js', 'Express', 'MySQL', 'JWT', 'RBAC', 'REST API'],
        color: '#8b5cf6',
        github: '#',
        live: '#',
    },
    {
        title: 'Klimate Weather Analytics Platform',
        description:
            'Weather dashboard with real-time API integration, data visualization, and geolocation features.',
        image: '/projects/klimate.png',
        tags: ['React', 'Weather API', 'Charts', 'Geolocation', 'Tailwind'],
        color: '#06b6d4',
        github: '#',
        live: '#',
    },
];

function ProjectCard({ project, index, inView }: {
    project: typeof projects[0];
    index: number;
    inView: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            whileHover={{ y: -8 }}
            className="glass-card"
            style={{
                borderRadius: '24px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                borderTop: `3px solid ${project.color}`,
                cursor: 'default',
            }}
        >
            {/* Image */}
            <div style={{
                position: 'relative',
                height: '220px',
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${project.color}22, ${project.color}08)`,
            }}>
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={() => { }}
                />
                {/* Gradient overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(to bottom, transparent 40%, ${project.color}30)`,
                }} />
                {/* Fallback label if image missing */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    zIndex: -1,
                }}>
                    {index === 0 ? '🤖' : index === 1 ? '💼' : '🌤️'}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '0.75rem',
                }}>
                    {project.title}
                </h3>
                <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    marginBottom: '1.25rem',
                    flex: 1,
                }}>
                    {project.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            style={{
                                padding: '0.25rem 0.7rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                background: `${project.color}15`,
                                color: project.color,
                                border: `1px solid ${project.color}30`,
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <motion.a
                        href={project.github}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '0.6rem',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border)',
                            transition: 'all 0.2s',
                        }}
                    >
                        GitHub →
                    </motion.a>
                    <motion.a
                        href={project.live}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '0.6rem',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            background: `linear-gradient(135deg, ${project.color}, ${project.color}cc)`,
                            color: 'white',
                            border: 'none',
                            transition: 'all 0.2s',
                        }}
                    >
                        Live Demo ↗
                    </motion.a>
                </div>
            </div>
        </motion.div>
    );
}

export default function Projects() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section id="projects" style={{
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
                        04 — Projects
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                    }}>
                        Featured <span className="gradient-text">Work</span>
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        marginTop: '1rem',
                        fontSize: '1rem',
                    }}>
                        A selection of projects I&apos;ve built and contributed to.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div
                    ref={ref}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '2rem',
                    }}
                >
                    {projects.map((project, i) => (
                        <ProjectCard key={project.title} project={project} index={i} inView={inView} />
                    ))}
                </div>
            </div>
        </section>
    );
}
