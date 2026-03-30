import { Link } from '@inertiajs/react';
import NeuralNetworkBackground from '@/components/neural-network-background';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
            {/* Animated neural network background */}
            <NeuralNetworkBackground />

            {/* Content */}
            <div className="relative z-10 w-full max-w-md">
                {/* Orion branding header */}
                <div className="mb-8 flex flex-col items-center gap-6">
                    <Link href={home()} className="group flex flex-col items-center gap-4">
                        {/* Logo with enhanced glow effect */}
                        <div className="relative">
                            <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-500/40 blur-2xl" />
                            <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400/20 blur-xl" style={{ animationDuration: '3s' }} />
                            <img
                                src="/images/logo.png"
                                alt="Endex"
                                className="relative h-16 w-16 animate-[spin_20s_linear_infinite] transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>

                        {/* Orion title */}
                        <div className="flex flex-col items-center gap-1">
                            <h1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                                ORION
                            </h1>
                            <p className="text-sm font-medium text-cyan-400/80">
                                Artificial Intelligence System
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-950/90 via-gray-900/85 to-gray-950/90 p-8 shadow-[0_0_80px_rgba(0,229,255,0.25),0_0_30px_rgba(0,153,255,0.15)] backdrop-blur-2xl">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-semibold text-white">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">
                            {description}
                        </p>
                    </div>
                    <div className="[&_label]:text-gray-300 [&_input]:border-cyan-500/30 [&_input]:bg-gray-900/50 [&_input]:text-white [&_input]:placeholder:text-gray-500 [&_input]:focus:border-cyan-400 [&_input]:focus:ring-cyan-400/30 [&_a]:text-cyan-400 [&_a]:hover:text-cyan-300 [&_.text-muted-foreground]:text-gray-400">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-gray-500">
                    Powered by Endex AI Technology
                </p>
            </div>
        </div>
    );
}
