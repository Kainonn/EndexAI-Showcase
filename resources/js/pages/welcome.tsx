import { Head, Link, usePage } from '@inertiajs/react';
import { useRef, useEffect, useCallback } from 'react';
import { dashboard, login, register } from '@/routes';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;
    const orionRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!containerRef.current || !orionRef.current?.contentWindow) return;
        const rect = containerRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const x = (e.clientX - cx) / (window.innerWidth / 2);
        const y = (e.clientY - cy) / (window.innerHeight / 2);
        orionRef.current.contentWindow.postMessage(
            { type: 'orion-face-mouse', x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) },
            '*',
        );
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
            ),
            title: 'Conversación con IA',
            description: 'Orion responde en español mexicano con personalidad propia. Usa modelos avanzados con routing inteligente.',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
            ),
            title: 'Multi-Canal',
            description: 'Arquitectura preparada para Discord, Telegram y web. En esta edición pública, la ejecución externa está simulada.',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.048.58.024 1.194-.14 1.743" />
                </svg>
            ),
            title: 'Herramientas',
            description: 'Módulos de extracción, análisis y automatización presentados con salidas mock seguras para portafolio.',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
            ),
            title: 'Memoria Persistente',
            description: 'Capa de memoria preservada a nivel arquitectónico con contenido sintético.',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
            ),
            title: 'Email Inteligente',
            description: 'Flujos de comunicación representados en modo demostración sin procesamiento real de correo.',
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
            ),
            title: 'Ecosistema Endex',
            description: 'Conocimiento integrado de EndexCare, EndexERP, EndexPOS, EndexSchool y más productos SaaS.',
        },
    ];

    return (
        <>
            <Head title="Endex — Orion AI">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
                <style>{`
                    @keyframes orion-breathe {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }
                    @keyframes orion-pulse {
                        0%, 100% { box-shadow: 0 0 8px rgba(0, 229, 255, 0.3); }
                        50% { box-shadow: 0 0 20px rgba(0, 229, 255, 0.6); }
                    }
                    .orion-core { animation: orion-pulse 4s infinite ease-in-out; }
                    .orion-breathe { animation: orion-breathe 6s infinite ease-in-out; }
                `}</style>
            </Head>
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Header */}
                <header className="w-full px-6 py-4 lg:px-12">
                    <nav className="mx-auto flex max-w-6xl items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src="/images/logo.png" alt="Endex" className="h-8" />
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-block rounded-lg bg-[#1b1b18] px-5 py-2 text-sm font-medium text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-block rounded-lg px-5 py-2 text-sm font-medium text-[#1b1b18] hover:bg-[#f5f5f4] dark:text-[#EDEDEC] dark:hover:bg-[#1a1a1a]"
                                    >
                                        Iniciar sesión
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-block rounded-lg bg-[#1b1b18] px-5 py-2 text-sm font-medium text-white hover:bg-black dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:bg-white"
                                        >
                                            Registrarse
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero */}
                <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 lg:py-24">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* Orion Animated Face - Large like chat view */}
                        <div ref={containerRef} className="mb-8 flex items-center justify-center">
                            <div className="orion-core orion-breathe relative">
                                <div
                                    className="relative aspect-square w-72 overflow-hidden rounded-2xl border border-[#00E5FF]/30 bg-[#040916]/90 shadow-[0_0_60px_rgba(0,229,255,0.3)] sm:w-80 lg:w-96"
                                    style={{
                                        background:
                                            'radial-gradient(circle at center, #0A0F1F 0%, #020308 100%)',
                                    }}
                                >
                                    <iframe
                                        ref={orionRef}
                                        src="/orion-face/index.html?embed=1"
                                        title="Orion AI"
                                        className="h-full w-full border-0"
                                        style={{ pointerEvents: 'none' }}
                                    />
                                </div>
                                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[#6C63FF]/25" />
                            </div>
                        </div>

                        <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-6xl">
                            Conoce a{' '}
                            <span className="bg-linear-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
                                Orion
                            </span>
                        </h1>
                        <p className="mx-auto mb-4 max-w-2xl text-lg text-[#706f6c] dark:text-[#A1A09A] lg:text-xl">
                            El asistente de inteligencia artificial de{' '}
                            <span className="font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Endex</span>.
                            Comportamiento autónomo, módulos integrados y memoria en modo showcase.
                        </p>
                        <p className="mx-auto mb-10 max-w-xl text-sm text-[#a1a09a] dark:text-[#706f6c]">
                            Edición pública: integraciones y lógica sensible sustituidas por simulación segura.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-xl hover:shadow-violet-500/30"
                                >
                                    Ir al Dashboard
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:shadow-xl hover:shadow-violet-500/30"
                                    >
                                        Comenzar
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 rounded-xl border border-[#e3e3e0] px-8 py-3 text-sm font-semibold text-[#1b1b18] transition hover:border-[#1b1b18] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#EDEDEC]"
                                        >
                                            Crear cuenta
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="px-6 pb-20 lg:px-12">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-12 text-center">
                            <h2 className="mb-3 text-2xl font-bold lg:text-3xl">
                                ¿Qué puede hacer Orion?
                            </h2>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Un asistente autónomo con módulos simulados y arquitectura integrable.
                            </p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group rounded-2xl border border-[#e3e3e0] bg-white p-6 transition hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/5 dark:border-[#2a2a28] dark:bg-[#161615] dark:hover:border-violet-500/40"
                                >
                                    <div className="mb-4 inline-flex rounded-xl bg-linear-to-br from-violet-500/10 to-cyan-500/10 p-3 text-violet-600 dark:from-violet-500/20 dark:to-cyan-500/20 dark:text-violet-400">
                                        {feature.icon}
                                    </div>
                                    <h3 className="mb-2 font-semibold">{feature.title}</h3>
                                    <p className="text-sm leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Models Section */}
                <section className="border-t border-[#e3e3e0] px-6 py-16 dark:border-[#2a2a28] lg:px-12">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-10 text-center">
                            <h2 className="mb-3 text-2xl font-bold lg:text-3xl">
                                Modelos de IA
                            </h2>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Router inteligente que selecciona el mejor modelo según tu mensaje.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                { name: 'showcase-general', use: 'Conversación general', color: 'from-violet-600 to-violet-400' },
                                { name: 'showcase-code', use: 'Código y programación', color: 'from-cyan-600 to-cyan-400' },
                                { name: 'showcase-vision', use: 'Visión e imágenes', color: 'from-pink-600 to-pink-400' },
                                { name: 'showcase-reasoning', use: 'Razonamiento lógico', color: 'from-amber-600 to-amber-400' },
                                { name: 'showcase-agent', use: 'Agente autónomo', color: 'from-emerald-600 to-emerald-400' },
                                { name: 'showcase-fast', use: 'Respuestas rápidas', color: 'from-blue-600 to-blue-400' },
                            ].map((model) => (
                                <div
                                    key={model.name}
                                    className="flex items-center gap-4 rounded-xl border border-[#e3e3e0] bg-white p-4 dark:border-[#2a2a28] dark:bg-[#161615]"
                                >
                                    <div className={`h-3 w-3 rounded-full bg-linear-to-r ${model.color}`} />
                                    <div>
                                        <p className="text-sm font-medium">{model.name}</p>
                                        <p className="text-xs text-[#a1a09a] dark:text-[#706f6c]">{model.use}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-[#e3e3e0] px-6 py-8 dark:border-[#2a2a28]">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="flex items-center gap-3">
                            <img src="/images/logo.png" alt="Endex" className="h-6 opacity-60" />
                            <span className="text-sm text-[#a1a09a] dark:text-[#706f6c]">
                                © {new Date().getFullYear()} Endex. Todos los derechos reservados.
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#a1a09a] dark:text-[#706f6c]">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                            Orion en modo showcase
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
