export default function CircuitBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-20">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(0, 229, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 229, 255, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            {/* Animated circuit SVG */}
            <svg
                className="absolute inset-0 h-full w-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient
                        id="circuit-gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            style={{ stopColor: '#00E5FF', stopOpacity: 0.3 }}
                        />
                        <stop
                            offset="100%"
                            style={{ stopColor: '#00E5FF', stopOpacity: 0.8 }}
                        />
                    </linearGradient>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Circuit paths */}
                <g
                    stroke="url(#circuit-gradient)"
                    strokeWidth="2"
                    fill="none"
                    filter="url(#glow)"
                >
                    {/* Horizontal lines */}
                    <line x1="0" y1="15%" x2="30%" y2="15%" className="circuit-line animate-circuit-1" />
                    <line x1="70%" y1="25%" x2="100%" y2="25%" className="circuit-line animate-circuit-2" />
                    <line x1="0" y1="75%" x2="25%" y2="75%" className="circuit-line animate-circuit-3" />
                    <line x1="75%" y1="85%" x2="100%" y2="85%" className="circuit-line animate-circuit-1" />

                    {/* Vertical lines */}
                    <line x1="20%" y1="0" x2="20%" y2="40%" className="circuit-line animate-circuit-2" />
                    <line x1="80%" y1="60%" x2="80%" y2="100%" className="circuit-line animate-circuit-3" />
                    <line x1="10%" y1="50%" x2="10%" y2="100%" className="circuit-line animate-circuit-1" />
                    <line x1="90%" y1="0" x2="90%" y2="50%" className="circuit-line animate-circuit-2" />

                    {/* Diagonal connections */}
                    <line x1="20%" y1="40%" x2="40%" y2="60%" className="circuit-line animate-circuit-3" />
                    <line x1="60%" y1="40%" x2="80%" y2="60%" className="circuit-line animate-circuit-1" />
                    <line x1="30%" y1="15%" x2="50%" y2="35%" className="circuit-line animate-circuit-2" />
                    <line x1="50%" y1="65%" x2="75%" y2="85%" className="circuit-line animate-circuit-3" />

                    {/* Circuit nodes */}
                    <circle cx="20%" cy="40%" r="4" fill="#00E5FF" className="animate-pulse-node-1" />
                    <circle cx="80%" cy="60%" r="4" fill="#00E5FF" className="animate-pulse-node-2" />
                    <circle cx="30%" cy="15%" r="3" fill="#00E5FF" className="animate-pulse-node-3" />
                    <circle cx="70%" cy="25%" r="3" fill="#00E5FF" className="animate-pulse-node-1" />
                    <circle cx="25%" cy="75%" r="3" fill="#00E5FF" className="animate-pulse-node-2" />
                    <circle cx="75%" cy="85%" r="4" fill="#00E5FF" className="animate-pulse-node-3" />
                    <circle cx="40%" cy="60%" r="3" fill="#00E5FF" className="animate-pulse-node-1" />
                    <circle cx="60%" cy="40%" r="3" fill="#00E5FF" className="animate-pulse-node-2" />
                </g>
            </svg>

            {/* Ambient glow effects */}
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] animate-float-1" />
            <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] animate-float-2" />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-gray-950/50" />

            <style>
                {`
                    @keyframes circuit-pulse-1 {
                        0%, 100% { opacity: 0.2; }
                        50% { opacity: 0.8; }
                    }

                    @keyframes circuit-pulse-2 {
                        0%, 100% { opacity: 0.3; }
                        50% { opacity: 0.9; }
                    }

                    @keyframes circuit-pulse-3 {
                        0%, 100% { opacity: 0.25; }
                        50% { opacity: 0.7; }
                    }

                    @keyframes node-pulse-1 {
                        0%, 100% { opacity: 0.4; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.5); }
                    }

                    @keyframes node-pulse-2 {
                        0%, 100% { opacity: 0.5; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.4); }
                    }

                    @keyframes node-pulse-3 {
                        0%, 100% { opacity: 0.3; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.3); }
                    }

                    @keyframes float-1 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(30px, -30px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                    }

                    @keyframes float-2 {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(-30px, 30px) scale(1.1); }
                        66% { transform: translate(20px, -20px) scale(0.9); }
                    }

                    .animate-circuit-1 {
                        animation: circuit-pulse-1 4s ease-in-out infinite;
                    }

                    .animate-circuit-2 {
                        animation: circuit-pulse-2 3s ease-in-out infinite 0.5s;
                    }

                    .animate-circuit-3 {
                        animation: circuit-pulse-3 3.5s ease-in-out infinite 1s;
                    }

                    .animate-pulse-node-1 {
                        animation: node-pulse-1 2s ease-in-out infinite;
                    }

                    .animate-pulse-node-2 {
                        animation: node-pulse-2 2.5s ease-in-out infinite 0.3s;
                    }

                    .animate-pulse-node-3 {
                        animation: node-pulse-3 3s ease-in-out infinite 0.6s;
                    }

                    .animate-float-1 {
                        animation: float-1 20s ease-in-out infinite;
                    }

                    .animate-float-2 {
                        animation: float-2 25s ease-in-out infinite;
                    }
                `}
            </style>
        </div>
    );
}
