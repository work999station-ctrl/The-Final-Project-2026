/**
 * Animated Algerian flag — official colors & geometry
 * - Green / white halves
 * - Red crescent + 5-point star (centered)
 * - Continuous flutter wave animation via CSS skew
 */
const AlgeriaFlag = ({ size = 18, className = '' }) => (
    <span className={`flag-wrap inline-block ${className}`} style={{ width: size * 1.5, height: size }}>
        <svg
            viewBox="0 0 60 40"
            width={size * 1.5}
            height={size}
            xmlns="http://www.w3.org/2000/svg"
            className="flag-svg block"
            aria-label="Algerian flag"
        >
            <defs>
                {/* Subtle shadow gradient to enhance wave illusion */}
                <linearGradient id="flag-shade" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="rgba(0,0,0,0.18)" />
                    <stop offset="20%"  stopColor="rgba(0,0,0,0)" />
                    <stop offset="50%"  stopColor="rgba(255,255,255,0.15)" />
                    <stop offset="80%"  stopColor="rgba(0,0,0,0)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
                    <animate attributeName="x1" values="-50%; 50%; -50%" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="x2" values="50%; 150%; 50%" dur="3s" repeatCount="indefinite" />
                </linearGradient>
                <clipPath id="flag-clip">
                    <rect width="60" height="40" rx="2" />
                </clipPath>
            </defs>

            <g clipPath="url(#flag-clip)">
                {/* Left green half — official #006233 */}
                <rect x="0" y="0" width="30" height="40" fill="#006233" />
                {/* Right white half */}
                <rect x="30" y="0" width="30" height="40" fill="#FFFFFF" />

                {/* Red crescent + star — official #D21034 */}
                <g fill="#D21034">
                    {/* Crescent: outer circle + inner offset circle (eraser effect with white) */}
                    <circle cx="30" cy="20" r="8" />
                    <circle cx="32" cy="20" r="6.4" fill="#FFFFFF" />
                    {/* 5-point star — pointing up, centered to the right of crescent */}
                    <polygon points="36,15.4 37.18,18.96 40.93,18.96 37.88,21.16 39.05,24.72 36,22.52 32.95,24.72 34.12,21.16 31.07,18.96 34.82,18.96" />
                </g>

                {/* Wave shading overlay (animated highlight) */}
                <rect x="0" y="0" width="60" height="40" fill="url(#flag-shade)" pointerEvents="none" />
            </g>
        </svg>
        <style>{`
            @keyframes flag-flutter {
                0%, 100% { transform: skewY(0deg) scaleY(1); }
                25%      { transform: skewY(-2deg) scaleY(0.97); }
                50%      { transform: skewY(0deg) scaleY(1.02); }
                75%      { transform: skewY(2deg) scaleY(0.97); }
            }
            .flag-wrap {
                vertical-align: middle;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.25));
                transform-origin: left center;
                animation: flag-flutter 2.4s ease-in-out infinite;
                will-change: transform;
            }
            @media (prefers-reduced-motion: reduce) {
                .flag-wrap { animation: none; }
            }
        `}</style>
    </span>
);

export default AlgeriaFlag;
