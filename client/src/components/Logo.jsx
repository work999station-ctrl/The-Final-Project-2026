import { useState } from 'react';

/**
 * Modern animated logo for stage.io
 * - Geometric "bridge" mark made of two interlocking rounded shapes
 * - Continuous gradient flow + idle pulse
 * - Hover: mark rotates 180°, dot bounces, wordmark shifts color
 * - Auto dark-mode support
 */
const Logo = ({ size = 40, showWordmark = true, className = '', onClick }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`logo-root inline-flex items-center gap-2.5 cursor-pointer select-none ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            role="img"
            aria-label="stage.io"
        >
            {/* ── Mark ────────────────────────────────────────────────────────── */}
            <div className="logo-mark-wrap" style={{ width: size, height: size }}>
                <svg
                    viewBox="0 0 48 48"
                    width={size}
                    height={size}
                    xmlns="http://www.w3.org/2000/svg"
                    className="logo-mark"
                    style={{
                        transform: hovered ? 'rotate(180deg) scale(1.05)' : 'rotate(0deg) scale(1)',
                    }}
                >
                    <defs>
                        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366F1">
                                <animate attributeName="stop-color"
                                    values="#6366F1; #818CF8; #06B6D4; #818CF8; #6366F1"
                                    dur="6s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="50%" stopColor="#818CF8">
                                <animate attributeName="stop-color"
                                    values="#818CF8; #A855F7; #6366F1; #A855F7; #818CF8"
                                    dur="6s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" stopColor="#06B6D4">
                                <animate attributeName="stop-color"
                                    values="#06B6D4; #6366F1; #818CF8; #6366F1; #06B6D4"
                                    dur="6s" repeatCount="indefinite" />
                            </stop>
                        </linearGradient>

                        <linearGradient id="logo-grad-soft" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.55" />
                            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.85" />
                        </linearGradient>

                        <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Outer rounded square — main brand color */}
                    <rect
                        x="4" y="4" width="40" height="40"
                        rx="12" ry="12"
                        fill="url(#logo-grad)"
                        filter="url(#logo-glow)"
                    />

                    {/* Inner cut "S/bridge" formed by two arcs */}
                    {/* Top arc — connecting two pillars */}
                    <path
                        d="M 12 20 Q 24 8 36 20"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.95"
                    />
                    {/* Bottom arc */}
                    <path
                        d="M 12 28 Q 24 40 36 28"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                        opacity="0.95"
                    />
                    {/* Vertical bridge / center pillar */}
                    <line
                        x1="24" y1="14" x2="24" y2="34"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.95"
                    />

                    {/* Animated orbit dot */}
                    <circle r="2.2" fill="white" filter="url(#logo-glow)">
                        <animateMotion
                            dur="4s"
                            repeatCount="indefinite"
                            path="M 24 14 Q 36 24 24 34 Q 12 24 24 14 Z"
                        />
                    </circle>
                </svg>
            </div>

            {/* ── Wordmark ────────────────────────────────────────────────────── */}
            {showWordmark && (
                <div className="flex items-baseline">
                    <span className="logo-wordmark text-2xl font-black tracking-tight leading-none">
                        stage
                    </span>
                    <span className="logo-dot text-2xl font-black leading-none"
                        style={{
                            color: '#6366F1',
                            transform: hovered ? 'translateY(-3px) scale(1.15)' : 'translateY(0) scale(1)',
                            display: 'inline-block',
                            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}>
                        .
                    </span>
                    <span className="text-2xl font-black tracking-tight leading-none bg-gradient-to-r from-primary via-violet-500 to-cyan-400 bg-clip-text text-transparent">
                        io
                    </span>
                </div>
            )}

            <style>{`
                .logo-mark-wrap {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    flex-shrink: 0;
                }
                .logo-mark {
                    transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
                    will-change: transform;
                    filter: drop-shadow(0 4px 12px rgba(99, 102, 241, 0.4));
                }
                .logo-root:hover .logo-mark {
                    filter: drop-shadow(0 6px 18px rgba(99, 102, 241, 0.6));
                }
                .logo-wordmark {
                    color: #0F172A;
                    transition: color 0.3s ease;
                }
                :root.dark .logo-wordmark,
                .dark .logo-wordmark {
                    color: #FFFFFF;
                }
                @keyframes logo-idle-float {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-2px); }
                }
                .logo-mark-wrap {
                    animation: logo-idle-float 4s ease-in-out infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .logo-mark-wrap { animation: none; }
                    .logo-mark { transition: none; }
                }
            `}</style>
        </div>
    );
};

export default Logo;