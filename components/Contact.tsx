'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export default function Contact() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });

    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        // Simulate sending
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSending(false);
        setSent(true);
    };

    const socials = [
        {
            label: 'Email',
            icon: '✉️',
            href: 'mailto:amithsulakhe2468@gmail.com',
            value: 'amithsulakhe2468@gmail.com',
            color: '#6366f1',
        },
        {
            label: 'GitHub',
            icon: '🐙',
            href: 'https://github.com/',
            value: 'github.com/amithsulakhe',
            color: '#8b5cf6',
        },
        {
            label: 'LinkedIn',
            icon: '💼',
            href: 'https://linkedin.com/',
            value: 'linkedin.com/in/amithsulakhe',
            color: '#06b6d4',
        },
    ];

    const inputStyle = {
        width: '100%',
        padding: '0.9rem 1.2rem',
        borderRadius: '12px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        fontSize: '0.95rem',
        outline: 'none',
        fontFamily: 'Inter, sans-serif',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxSizing: 'border-box' as const,
    };

    return (
        <section id="contact" style={{ padding: '100px 1.5rem' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
                        05 — Contact
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                    }}>
                        Let&apos;s <span className="gradient-text">Connect</span>
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        marginTop: '1rem',
                        fontSize: '1rem',
                        maxWidth: '500px',
                        margin: '1rem auto 0',
                    }}>
                        Have a project in mind or want to collaborate? I&apos;d love to hear from you.
                    </p>
                </motion.div>

                <div
                    ref={ref}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '3rem',
                        alignItems: 'start',
                    }}
                >
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <h3 style={{
                            fontSize: '1.3rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            marginBottom: '0.75rem',
                        }}>
                            Get in touch
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: 1.75,
                            marginBottom: '2rem',
                            fontSize: '0.95rem',
                        }}>
                            I&apos;m currently open to new opportunities and interesting projects.
                            Feel free to reach out — I&apos;ll respond within 24 hours.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {socials.map((s, i) => (
                                <motion.a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                                    whileHover={{ x: 6 }}
                                    className="glass-card"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '1rem 1.25rem',
                                        borderRadius: '14px',
                                        textDecoration: 'none',
                                        borderLeft: `3px solid ${s.color}`,
                                    }}
                                >
                                    <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                                            {s.label}
                                        </div>
                                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: s.color }}>
                                            {s.value}
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="glass-card"
                        style={{ borderRadius: '24px', padding: '2.5rem' }}
                    >
                        {sent ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ textAlign: 'center', padding: '2rem 0' }}
                            >
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                    Message Sent!
                                </h3>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    Thanks for reaching out. I&apos;ll get back to you soon!
                                </p>
                                <button
                                    onClick={() => { setSent(false); setFormData({ name: '', email: '', message: '' }); }}
                                    className="btn-primary"
                                    style={{ marginTop: '1.5rem' }}
                                >
                                    Send Another
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        Your Name
                                    </label>
                                    <motion.input
                                        whileFocus={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 3px rgba(99,102,241,0.15)' }}
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        Email Address
                                    </label>
                                    <motion.input
                                        whileFocus={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 3px rgba(99,102,241,0.15)' }}
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        Message
                                    </label>
                                    <motion.textarea
                                        whileFocus={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 3px rgba(99,102,241,0.15)' }}
                                        placeholder="Tell me about your project..."
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        style={{ ...inputStyle, resize: 'vertical' as const }}
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    disabled={sending}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary"
                                    style={{
                                        width: '100%',
                                        justifyContent: 'center',
                                        fontSize: '1rem',
                                        padding: '0.9rem',
                                        opacity: sending ? 0.7 : 1,
                                        cursor: sending ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {sending ? (
                                        <>
                                            <span>Sending</span>
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            >
                                                ⟳
                                            </motion.span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <span>✉️</span>
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
