'use client';

import { motion } from 'framer-motion';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border)',
            padding: '3rem 1.5rem',
        }}>
            <div style={{
                maxWidth: '1100px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
            }}>
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    style={{
                        fontSize: '1.8rem',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    ARS
                </motion.div>

                {/* Nav Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}
                >
                    {['#about', '#skills', '#experience', '#projects', '#contact'].map((href) => (
                        <a
                            key={href}
                            href={href}
                            style={{
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'color 0.2s',
                                textTransform: 'capitalize',
                            }}
                            onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = 'var(--accent)')}
                            onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = 'var(--text-secondary)')}
                        >
                            {href.replace('#', '')}
                        </a>
                    ))}
                </motion.div>

                {/* Divider */}
                <div style={{
                    width: '100%',
                    height: '1px',
                    background: 'var(--border)',
                }} />

                {/* Copyright */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        textAlign: 'center',
                    }}
                >
                    © {year} Amith R Sulakhe. Built with Next.js, Tailwind CSS & Framer Motion. Made with ❤️ in Karnataka, India.
                </motion.p>
            </div>
        </footer>
    );
}
