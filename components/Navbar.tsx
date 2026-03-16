'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                padding: '0 1.5rem',
                backdropFilter: 'blur(16px)',
                backgroundColor: scrolled
                    ? 'rgba(10, 10, 15, 0.92)'
                    : 'transparent',
                borderBottom: scrolled ? '1px solid var(--border)' : 'none',
                transition: 'background-color 0.3s ease, border-bottom 0.3s ease',
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '70px',
            }}>
                {/* Logo */}
                <motion.a
                    href="#home"
                    whileHover={{ scale: 1.05 }}
                    style={{
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    ARS
                </motion.a>

                {/* Desktop Links */}
                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    alignItems: 'center',
                }} className="nav-links-desktop">
                    {navLinks.map((link) => (
                        <motion.a
                            key={link.href}
                            href={link.href}
                            whileHover={{ y: -2 }}
                            style={{
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'color 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                (e.target as HTMLAnchorElement).style.color = 'var(--accent)';
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLAnchorElement).style.color = 'var(--text-secondary)';
                            }}
                        >
                            {link.label}
                        </motion.a>
                    ))}

                    {/* Theme Toggle */}
                    <motion.button
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: '50%',
                            width: '38px',
                            height: '38px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                        }}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </motion.button>

                    <motion.a
                        href="#contact"
                        className="btn-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', textDecoration: 'none' }}
                    >
                        Hire Me
                    </motion.a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        fontSize: '1.5rem',
                    }}
                    className="mobile-menu-btn"
                    aria-label="Toggle mobile menu"
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            overflow: 'hidden',
                            background: 'var(--bg-secondary)',
                            borderTop: '1px solid var(--border)',
                            padding: '1rem 0',
                        }}
                        className="mobile-menu"
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    display: 'block',
                                    padding: '0.75rem 1.5rem',
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                        <div style={{ padding: '0.75rem 1.5rem', display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={toggleTheme}
                                style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '50%',
                                    width: '36px', height: '36px',
                                    cursor: 'pointer', fontSize: '1rem',
                                }}
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
        </motion.nav>
    );
}
