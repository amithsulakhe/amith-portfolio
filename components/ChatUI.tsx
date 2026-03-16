"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendMessageToBot, HistoryMessage } from "../services/ChatService";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

const SUGGESTED_QUESTIONS = [
    "What are Amith's top skills?",
    "Where has Amith worked?",
    "What is Amith's educational background?",
];

type ProjectCard = { title: string; description: string; link?: string };

/* ─── Robot FAB ─── */
function RobotFAB({ onOpen }: { onOpen: () => void }) {
    const cardRef = useRef<HTMLButtonElement>(null);

    // Smooth pupil lerp
    const targetPupil = useRef({ lx: 0, ly: 0, rx: 0, ry: 0 });
    const currentPupil = useRef({ lx: 0, ly: 0, rx: 0, ry: 0 });
    const rafRef = useRef<number>(0);
    const [pupil, setPupil] = useState({ lx: 0, ly: 0, rx: 0, ry: 0 });

    // Blink
    const [blink, setBlink] = useState(false);
    const [hoverBtn, setHoverBtn] = useState(false);

    // ── rAF lerp loop for pupils
    useEffect(() => {
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const loop = () => {
            const c = currentPupil.current;
            const tg = targetPupil.current;
            const next = {
                lx: lerp(c.lx, tg.lx, 0.1),
                ly: lerp(c.ly, tg.ly, 0.1),
                rx: lerp(c.rx, tg.rx, 0.1),
                ry: lerp(c.ry, tg.ry, 0.1),
            };
            currentPupil.current = next;
            setPupil({ ...next });
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    // ── Mouse eye tracking — eyes look forward when cursor is far
    useEffect(() => {
        const move = (e: MouseEvent) => {
            const el = cardRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            if (Math.hypot(e.clientX - cx, e.clientY - cy) > 280) {
                targetPupil.current = { lx: 0, ly: 0, rx: 0, ry: 0 };
                return;
            }
            const scale = r.width / 134;
            const lEx = r.left + (22 / 62) * r.width, eyeY = r.top + (24 / 72) * r.height * 0.68;
            const rEx = r.left + (40 / 62) * r.width;
            const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(mx, v));
            const off = (ex: number, ey: number) => {
                const dx = e.clientX - ex, dy = e.clientY - ey;
                const d = Math.hypot(dx, dy) || 1, max = 2.0 * scale;
                return { x: clamp((dx / d) * max, -max, max), y: clamp((dy / d) * max, -max, max) };
            };
            const l = off(lEx, eyeY), rv = off(rEx, eyeY);
            targetPupil.current = { lx: l.x, ly: l.y, rx: rv.x, ry: rv.y };
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);

    // ── Natural random blinking
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        const schedule = () => {
            timeout = setTimeout(() => {
                setBlink(true);
                setTimeout(() => { setBlink(false); schedule(); }, 130);
            }, 2000 + Math.random() * 3000);
        };
        schedule();
        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            <style>{`
              @keyframes bot-float {
                0%,100% { transform: translateY(0px); }
                50%      { transform: translateY(-6px); }
              }
              @keyframes fab-glow {
                0%,100% { box-shadow: 0 0 0 0 rgba(168,85,247,0.5), 0 16px 48px rgba(0,0,0,0.55); }
                55%      { box-shadow: 0 0 0 9px rgba(168,85,247,0), 0 16px 48px rgba(0,0,0,0.55); }
              }
              /* Arm wave — left arm goes up while right goes down, alternating */
              @keyframes arm-l {
                0%,100% { transform: translateY(0px);  }
                50%      { transform: translateY(-5px); }
              }
              @keyframes arm-r {
                0%,100% { transform: translateY(0px); }
                50%      { transform: translateY(5px); }
              }
              .chat-fab-card {
                animation: fab-glow 2.8s ease-in-out infinite;
                transition: transform 0.22s ease;
              }
              .chat-fab-card:hover { animation: none !important; transform: scale(1.04) !important; }
              .bot-float  { animation: bot-float 3.2s ease-in-out infinite; }
              .bot-arm-l  { animation: arm-l 1.6s ease-in-out infinite; transform-origin: center center; transform-box: fill-box; }
              .bot-arm-r  { animation: arm-r 1.6s ease-in-out infinite; transform-origin: center center; transform-box: fill-box; }
              .fab-tooltip {
                position: absolute; bottom: calc(100% + 8px); left: 50%;
                transform: translateX(-50%);
                background: #1e1b4b; color: #e2e8f0;
                font-size: 11px; font-weight: 500; white-space: nowrap;
                padding: 5px 10px; border-radius: 8px;
                border: 1px solid rgba(168,85,247,0.35);
                box-shadow: 0 4px 16px rgba(0,0,0,0.4);
                pointer-events: none;
                opacity: 0; transition: opacity 0.18s ease;
              }
              .fab-start-btn:hover .fab-tooltip { opacity: 1; }
            `}</style>

            <button
                ref={cardRef}
                onClick={onOpen}
                aria-label="Ask about Amith R Sulakhe"
                className="chat-fab-card"
                style={{
                    position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
                    width: "134px", padding: "18px 12px 14px",
                    borderRadius: "24px", border: "none",
                    background: "#0d0d1a",
                    cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
                    boxSizing: "border-box",
                }}
            >
                {/* Gradient border */}
                <span aria-hidden style={{
                    position: "absolute", inset: 0, borderRadius: "24px", zIndex: 0,
                    background: "linear-gradient(135deg,#ec4899 0%,#a855f7 50%,#6366f1 100%)",
                    padding: "2px",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                }} />

                {/* Robot */}
                <span className="bot-float" style={{ display: "block", position: "relative", zIndex: 1 }}>
                    <svg width="64" height="74" viewBox="0 0 62 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Antenna */}
                        <line x1="31" y1="1" x2="31" y2="11" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx="31" cy="3" r="3" fill="#a855f7"/>
                        {/* Head */}
                        <rect x="11" y="11" width="40" height="27" rx="10" fill="#1e1b4b"/>
                        <rect x="11" y="11" width="40" height="27" rx="10" stroke="#6366f1" strokeWidth="1.5"/>
                        {/* Eye sockets */}
                        <circle cx="22" cy="24" r="5.5" fill="#06b6d4"/>
                        <circle cx="40" cy="24" r="5.5" fill="#06b6d4"/>
                        {blink ? (
                            /* Closed eyelids */
                            <>
                                <rect x="16.5" y="22.5" width="11" height="3" rx="1.5" fill="#1e1b4b"/>
                                <rect x="34.5" y="22.5" width="11" height="3" rx="1.5" fill="#1e1b4b"/>
                            </>
                        ) : (
                            <>
                                <circle cx="22" cy="24" r="3"   fill="#e0f7ff"/>
                                <circle cx="40" cy="24" r="3"   fill="#e0f7ff"/>
                                <circle cx={22 + pupil.lx} cy={24 + pupil.ly} r="1.4" fill="#0369a1"/>
                                <circle cx={40 + pupil.rx} cy={24 + pupil.ry} r="1.4" fill="#0369a1"/>
                                <circle cx={21 + pupil.lx * 0.4} cy={22.5 + pupil.ly * 0.4} r="0.7" fill="white" opacity="0.9"/>
                                <circle cx={39 + pupil.rx * 0.4} cy={22.5 + pupil.ry * 0.4} r="0.7" fill="white" opacity="0.9"/>
                            </>
                        )}
                        {/* Mouth */}
                        <path d="M23 32 Q31 37 39 32" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        {/* Body */}
                        <rect x="16" y="40" width="30" height="22" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5"/>
                        {/* Chest light */}
                        <circle cx="31" cy="51" r="4" fill="#a855f7" opacity="0.85"/>
                        <circle cx="31" cy="51" r="2" fill="#e879f9"/>
                        {/* Arms — continuously wave up/down in opposite phase */}
                        <rect className="bot-arm-l" x="3"  y="43" width="11" height="7" rx="3.5" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.2"/>
                        <rect className="bot-arm-r" x="48" y="43" width="11" height="7" rx="3.5" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.2"/>
                        {/* Shadow */}
                        <ellipse cx="31" cy="68" rx="15" ry="2.5" fill="#a855f7" opacity="0.15"/>
                    </svg>
                </span>

                {/* Start chat button with tooltip */}
                <span
                    className="fab-start-btn"
                    style={{ position: "relative", width: "100%", zIndex: 1 }}
                    onMouseEnter={() => setHoverBtn(true)}
                    onMouseLeave={() => setHoverBtn(false)}
                >
                    <span className="fab-tooltip">Ask anything about Amith R Sulakhe</span>
                    <span style={{
                        display: "block", width: "100%", textAlign: "center",
                        padding: "8px 0", borderRadius: "12px",
                        background: "#fff", color: "#1e1b4b",
                        fontSize: "13px", fontWeight: 700,
                        boxShadow: hoverBtn
                            ? "0 0 0 2px #a855f7, 0 4px 16px rgba(168,85,247,0.35)"
                            : "0 2px 12px rgba(168,85,247,0.25)",
                        transition: "box-shadow 0.18s ease",
                        userSelect: "none",
                    }}>
                        Start chat
                    </span>
                </span>
            </button>
        </>
    );
}

const MARKDOWN_COMPONENTS = {
    p: ({ children }: { children?: React.ReactNode }) => <p className="my-1 text-slate-300 leading-relaxed">{children}</p>,
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="text-slate-200 font-semibold">{children}</strong>,
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 underline break-all">
            {children}
        </a>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => <ul className="my-2 ml-1 p-0 list-none">{children}</ul>,
    ol: ({ children }: { children?: React.ReactNode }) => <ol className="my-2 ml-1 pl-5 text-slate-300">{children}</ol>,
    li: ({ children }: { children?: React.ReactNode }) => (
        <li className="flex gap-2 mb-1.5 items-start">
            <span className="text-violet-400 font-bold mt-0.5 shrink-0">•</span>
            <span className="text-slate-300">{children}</span>
        </li>
    ),
};

// ─── Markdown Renderer (react-markdown + remark-gfm) ──────────────────────────
function MarkdownMessage({ content, className }: { content: string; className?: string }) {
    return (
        <div className={`text-[13.5px] ${className ?? ""}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
                {content}
            </ReactMarkdown>
        </div>
    );
}

// ─── Parse assistant content for optional PROJECTS_JSON block ─────────────────
function parseAssistantContent(content: string): { intro: string; projects: ProjectCard[] } | null {
    const marker = "PROJECTS_JSON:";
    const idx = content.indexOf(marker);
    if (idx === -1) return null;
    const intro = content.slice(0, idx).trim();
    const jsonStr = content.slice(idx + marker.length).trim();
    try {
        const projects = JSON.parse(jsonStr) as unknown;
        if (!Array.isArray(projects)) return null;
        const valid = projects.every(
            (p): p is ProjectCard =>
                p && typeof p === "object" && typeof (p as ProjectCard).title === "string" && typeof (p as ProjectCard).description === "string"
        );
        if (!valid) return null;
        return { intro, projects: projects as ProjectCard[] };
    } catch {
        return null;
    }
}

// ─── Horizontal scrolling project cards (dark theme, 2nd card style) ──────────
const PROJECT_ICONS = ["🚀", "✨", "📦", "🛠️", "💡", "🎯"];
const CARD_WIDTH = 260;
const CARD_GAP = 12;

function ProjectCards({ projects }: { projects: ProjectCard[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir === "left" ? -(CARD_WIDTH + CARD_GAP) : CARD_WIDTH + CARD_GAP, behavior: "smooth" });
    };

    return (
        <div className="mt-3 -mx-1">
            <div
                ref={scrollRef}
                className="chat-project-cards overflow-x-auto overflow-y-hidden flex-nowrap [scrollbar-width:thin] scroll-smooth"
            >
                <div className="flex gap-3 pb-2 min-w-0 px-0.5">
                    {projects.map((p, i) => {
                        const icon = PROJECT_ICONS[i % PROJECT_ICONS.length];
                        const cardContent = (
                            <>
                                {/* Header: circular icon + title (2nd card style) */}
                                <div className="flex items-center gap-3 p-3 pb-2">
                                    <div className="shrink-0 w-10 h-10 rounded-full bg-violet-600/80 flex items-center justify-center text-xl border border-violet-400/20">
                                        <span aria-hidden>{icon}</span>
                                    </div>
                                    <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 min-w-0">
                                        {p.title}
                                    </h3>
                                </div>
                                {/* Content: description + tags/chips */}
                                <div className="flex flex-col flex-1 min-w-0 px-3 pb-3 pt-0">
                                    <div className="text-[12px] text-slate-400 leading-relaxed wrap-anywhere overflow-hidden line-clamp-3 min-h-0 [&_p]:text-slate-400 [&_p]:my-0 [&_strong]:text-slate-300 [&_a]:text-violet-400 [&_a]:underline">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
                                            {p.description}
                                        </ReactMarkdown>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {p.link ? (
                                            <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-violet-950/70 text-violet-200 text-xs font-medium border border-violet-500/30 group-hover:bg-violet-500/30 group-hover:text-white group-hover:border-violet-400/50 transition-all">
                                                View project
                                                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </>
                        );
                        const baseClasses =
                            "shrink-0 flex flex-col text-left rounded-xl w-[260px] min-h-[180px] group transition-all duration-200 " +
                            "bg-slate-900/95 border border-violet-500/20 shadow-lg shadow-black/20 " +
                            "hover:border-violet-400/40 hover:shadow-violet-500/10";
                        if (p.link) {
                            return (
                                <a
                                    key={i}
                                    href={p.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={baseClasses}
                                >
                                    {cardContent}
                                </a>
                            );
                        }
                        return (
                            <div key={i} className={baseClasses}>
                                {cardContent}
                            </div>
                        );
                    })}
                </div>
            </div>
            {projects.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-2.5">
                    <button
                        type="button"
                        onClick={() => scroll("left")}
                        aria-label="Scroll left"
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white border border-slate-600/50 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => scroll("right")}
                        aria-label="Scroll right"
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white border border-slate-600/50 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Assistant message body: markdown or intro + project cards ──────────────
function AssistantMessageBody({ content }: { content: string }) {
    const parsed = parseAssistantContent(content);
    if (parsed && parsed.projects.length > 0) {
        return (
            <>
                {parsed.intro && <MarkdownMessage content={parsed.intro} />}
                <ProjectCards projects={parsed.projects} />
            </>
        );
    }
    return <MarkdownMessage content={content} />;
}

// ─── Typing Dots ─────────────────────────────────────────────────────────────
const TypingDots = () => (
    <div style={{ display: "flex", gap: "5px", padding: "12px 16px", alignItems: "center" }}>
        {[0, 150, 300].map((delay, i) => (
            <span
                key={i}
                style={{
                    width: "7px", height: "7px", borderRadius: "50%", display: "inline-block",
                    background: i === 0 ? "#a78bfa" : i === 1 ? "#9333ea" : "#6366f1",
                    animation: "bounce 1s ease-in-out infinite",
                    animationDelay: `${delay}ms`,
                }}
            />
        ))}
    </div>
);

// ─── Bot Avatar ───────────────────────────────────────────────────────────────
const BotAvatar = () => (
    <div style={{
        width: "30px", height: "30px", borderRadius: "10px", flexShrink: 0,
        background: "linear-gradient(135deg,#7c3aed,#4338ca)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 3px 10px rgba(124,58,237,0.35)",
    }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13c-.83 0-1.5.67-1.5 1.5S6.67 16 7.5 16 9 15.33 9 14.5 8.33 13 7.5 13m9 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5M3 21a1 1 0 0 1-1-1v-1a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v1a1 1 0 0 1-1 1H3z" />
        </svg>
    </div>
);

const UserAvatar = () => (
    <div style={{
        width: "30px", height: "30px", borderRadius: "10px", flexShrink: 0,
        background: "linear-gradient(135deg,#334155,#1e293b)",
        display: "flex", alignItems: "center", justifyContent: "center",
    }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const WELCOME_MSG: Message = {
    id: "welcome",
    role: "assistant",
    content: "Hi there! 👋 I'm Amith's AI assistant. I **remember our full conversation**, so feel free to ask follow-up questions!\n\nAsk me anything about his skills, experience, or background.",
};

const STORAGE_KEY = "amith_chat_messages";

export default function ChatUI() {
    const [isOpen, setIsOpen] = useState(false);
    // Hide FAB until hero loading screen finishes
    const [isFabVisible, setIsFabVisible] = useState(false);

    useEffect(() => {
        // Already loaded before this component mounted
        if ((window as { __heroLoaded?: boolean }).__heroLoaded) {
            setIsFabVisible(true);
            return;
        }
        const handler = () => setIsFabVisible(true);
        window.addEventListener("heroLoaded", handler);
        return () => window.removeEventListener("heroLoaded", handler);
    }, []);
    const [messages, setMessages] = useState<Message[]>(() => {
        // Load from localStorage on first render (client only)
        if (typeof window !== "undefined") {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) return JSON.parse(stored) as Message[];
            } catch {
                // ignore parse errors
            }
        }
        return [WELCOME_MSG];
    });
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Persist messages to localStorage on every change
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        }
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
    }, [isOpen]);

    const clearChat = () => {
        setMessages([WELCOME_MSG]);
        if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    };

    const sendMessage = async (text: string) => {
        const q = text.trim();
        if (!q || isLoading) return;

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: q };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);
        setError(null);

        try {
            // Build history from all messages EXCEPT the welcome message
            const history: HistoryMessage[] = messages
                .filter((m) => m.id !== "welcome")
                .map((m) => ({ role: m.role, content: m.content }));

            const res = await sendMessageToBot(q, history);
            setMessages((prev) => [
                ...prev,
                { id: (Date.now() + 1).toString(), role: "assistant", content: res.answer },
            ]);
        } catch (e: unknown) {
            setError((e as Error).message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const showSuggestions = messages.length === 1 && !isLoading;

    return (
        <>
            <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.2); border-radius: 4px; }
        .chat-messages::-webkit-scrollbar-track { background: transparent; }
        .chat-project-cards::-webkit-scrollbar { height: 5px; }
        .chat-project-cards::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 4px; }
        .chat-project-cards::-webkit-scrollbar-track { background: transparent; }
      `}</style>

            {/* ─── Chat FAB — hidden until hero loading completes ─── */}
            {isFabVisible && (
                isOpen ? (
                    <button
                        onClick={() => setIsOpen(false)}
                        aria-label="Close chat"
                        style={{
                            position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
                            width: "52px", height: "52px", borderRadius: "50%", border: "none",
                            background: "linear-gradient(135deg,#a855f7,#6366f1)",
                            boxShadow: "0 4px 20px rgba(124,58,237,0.45)",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s ease",
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                ) : (
                    <RobotFAB onOpen={() => setIsOpen(true)} />
                )
            )}

            {/* ─── Chat Window ─── */}
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "90px",
                        right: "16px",
                        width: "min(390px, calc(100vw - 32px))",
                        height: "min(580px, calc(100dvh - 108px))",
                        zIndex: 9998,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "22px",
                        overflow: "hidden",
                        background: "#0d0d1a",
                        border: "1px solid rgba(124,58,237,0.15)",
                        boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                        animation: "slideUp 0.3s ease",
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: "14px 16px",
                        background: "linear-gradient(135deg, #14103a 0%, #0e0b28 100%)",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        display: "flex", alignItems: "center", gap: "12px",
                        flexShrink: 0,
                    }}>
                        <div style={{
                            width: "40px", height: "40px", borderRadius: "13px",
                            background: "linear-gradient(135deg,#7c3aed,#4338ca)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 4px 15px rgba(124,58,237,0.4)", flexShrink: 0,
                        }}>
                            <svg width="21" height="21" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13c-.83 0-1.5.67-1.5 1.5S6.67 16 7.5 16 9 15.33 9 14.5 8.33 13 7.5 13m9 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5M3 21a1 1 0 0 1-1-1v-1a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v1a1 1 0 0 1-1 1H3z" />
                            </svg>
                        </div>
                        <div style={{ flex: 1, overflow: "hidden" }}>
                            <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "14px" }}>Amith&apos;s AI Assistant</div>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
                                <span style={{ color: "#34d399", fontSize: "11px", fontWeight: 600 }}>Online</span>
                                <span style={{ color: "rgba(255,255,255,0.22)", fontSize: "11px", marginLeft: "3px" }}>· Remembers conversation</span>
                            </div>
                        </div>
                        {/* Clear button */}
                        <button
                            onClick={clearChat}
                            title="Clear chat history"
                            style={{
                                width: "30px", height: "30px", borderRadius: "10px",
                                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                                cursor: "pointer", display: "flex", alignItems: "center",
                                justifyContent: "center", flexShrink: 0,
                            }}
                            onMouseEnter={(e) => { (e.currentTarget).style.background = "rgba(239,68,68,0.15)"; (e.currentTarget).style.borderColor = "rgba(239,68,68,0.3)"; }}
                            onMouseLeave={(e) => { (e.currentTarget).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget).style.borderColor = "rgba(255,255,255,0.08)"; }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4h6v2" />
                            </svg>
                        </button>
                        {/* Close button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                width: "30px", height: "30px", borderRadius: "10px",
                                background: "rgba(255,255,255,0.07)", border: "none", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        className="chat-messages"
                        style={{
                            flex: 1, overflowY: "auto",
                            padding: "16px 14px", display: "flex", flexDirection: "column", gap: "14px",
                        }}
                    >
                        {messages.map((msg) => (
                            <div key={msg.id} style={{
                                display: "flex", gap: "10px",
                                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                                alignItems: "flex-end",
                            }}>
                                {msg.role === "assistant" ? <BotAvatar /> : <UserAvatar />}
                                <div style={{
                                    maxWidth: "76%",
                                    padding: msg.role === "user" ? "10px 14px" : "12px 14px",
                                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                    background: msg.role === "user"
                                        ? "linear-gradient(135deg,#7c3aed,#4338ca)"
                                        : "rgba(255,255,255,0.06)",
                                    border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.07)" : "none",
                                    boxShadow: msg.role === "user" ? "0 4px 15px rgba(124,58,237,0.3)" : "none",
                                    wordBreak: "break-word",
                                }}>
                                    {msg.role === "user" ? (
                                        <p style={{ margin: 0, color: "#fff", fontSize: "13.5px", lineHeight: "1.6" }}>
                                            {msg.content}
                                        </p>
                                    ) : (
                                        <AssistantMessageBody content={msg.content} />
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                                <BotAvatar />
                                <div style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    borderRadius: "18px 18px 18px 4px",
                                }}>
                                    <TypingDots />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div style={{
                                padding: "10px 14px", borderRadius: "12px",
                                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                                color: "#f87171", fontSize: "12px", textAlign: "center",
                            }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Suggested Questions */}
                    {showSuggestions && (
                        <div style={{ padding: "0 14px 12px", flexShrink: 0 }}>
                            <p style={{
                                color: "rgba(255,255,255,0.28)", fontSize: "10px",
                                textTransform: "uppercase", letterSpacing: "0.09em",
                                fontWeight: 700, marginBottom: "8px",
                            }}>
                                Quick Questions
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {SUGGESTED_QUESTIONS.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(q)}
                                        style={{
                                            textAlign: "left", padding: "9px 13px", borderRadius: "11px",
                                            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                                            color: "rgba(255,255,255,0.62)", fontSize: "12.5px", cursor: "pointer",
                                            transition: "all 0.18s",
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget).style.background = "rgba(124,58,237,0.14)";
                                            (e.currentTarget).style.borderColor = "rgba(124,58,237,0.4)";
                                            (e.currentTarget).style.color = "#e2e8f0";
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget).style.background = "rgba(255,255,255,0.04)";
                                            (e.currentTarget).style.borderColor = "rgba(255,255,255,0.08)";
                                            (e.currentTarget).style.color = "rgba(255,255,255,0.62)";
                                        }}
                                    >
                                        <span style={{ color: "#a78bfa", marginRight: "8px", fontWeight: 700 }}>→</span>
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div style={{
                        padding: "12px 14px 14px",
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        flexShrink: 0,
                        background: "#0d0d1a",
                    }}>
                        <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                            style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.09)",
                                borderRadius: "14px",
                                padding: "7px 7px 7px 14px",
                                transition: "border-color 0.2s",
                            }}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about Amith..."
                                disabled={isLoading}
                                style={{
                                    flex: 1, background: "transparent", border: "none", outline: "none",
                                    color: "#f1f5f9", fontSize: "13.5px", caretColor: "#a78bfa",
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                style={{
                                    width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0,
                                    background: !input.trim() || isLoading
                                        ? "rgba(124,58,237,0.25)"
                                        : "linear-gradient(135deg,#7c3aed,#4338ca)",
                                    border: "none", cursor: input.trim() && !isLoading ? "pointer" : "default",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.2s",
                                    boxShadow: !input.trim() || isLoading ? "none" : "0 4px 12px rgba(124,58,237,0.4)",
                                }}
                            >
                                {isLoading ? (
                                    <svg style={{ animation: "spin 0.9s linear infinite" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                    </svg>
                                ) : (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                                    </svg>
                                )}
                            </button>
                        </form>
                      
                    </div>
                </div>
            )}
        </>
    );
}
