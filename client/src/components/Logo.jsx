import { useState } from 'react';
import logoImage from '../assets/logo.png';

/**
 * Official logo for stage.io
 * - Uses the real logo.png asset as the mark
 * - Idle float animation + hover scale
 * - Dot bounce on wordmark hover
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
                <img
                    src={logoImage}
                    alt="stage.io"
                    className="logo-mark"
                    style={{
                        width: size,
                        height: size,
                        objectFit: 'contain',
                        transform: hovered ? 'scale(1.08)' : 'scale(1)',
                    }}
                />
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