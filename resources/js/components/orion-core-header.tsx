import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';

interface OrionStatus {
    state: string;
    energy: number;
    focus: string;
    emotion?: string;
    intensity?: number;
    animations?: {
        blink: boolean;
        breath: boolean;
        saccade: boolean;
        thinking: boolean;
    };
}

interface OrionCoreHeaderProps {
    status?: OrionStatus;
    showIndicators?: boolean;
}

export function OrionCoreHeader({
    status = {
        state: 'CALM',
        energy: 0.43,
        focus: 'SYSTEM',
        emotion: 'calma',
        intensity: 0.35,
        animations: {
            blink: true,
            breath: true,
            saccade: true,
            thinking: false,
        },
    },
    showIndicators = true,
}: OrionCoreHeaderProps) {
    const faceFrameRef = useRef<HTMLIFrameElement | null>(null);

    useEffect(() => {
        const mappedEmotion = (status.emotion ?? status.state).toLowerCase();

        faceFrameRef.current?.contentWindow?.postMessage(
            {
                type: 'orion-face-emotion',
                emotion: mappedEmotion,
            },
            window.location.origin,
        );

        faceFrameRef.current?.contentWindow?.postMessage(
            {
                type: 'orion-face-opts',
                opts: {
                    ...(status.animations ?? {
                        blink: true,
                        breath: true,
                        saccade: true,
                        thinking: false,
                    }),
                    intensity: status.intensity ?? 0.35,
                },
            },
            window.location.origin,
        );
    }, [status.animations, status.emotion, status.intensity, status.state]);

    return (
        <div
            className="relative overflow-hidden rounded-2xl"
            style={{
                background:
                    'radial-gradient(circle at center, #0A0F1F 0%, #020308 100%)',
            }}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwRTVGRiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] bg-repeat" />
            </div>

            {/* Main content container */}
            <div className="relative flex h-full items-center justify-between px-6 py-6">
                {/* Left side - Orion Avatar */}
                <div className="flex items-center gap-6">
                    <div className="orion-core orion-breathe relative">
                        <div className="relative aspect-square h-48 overflow-hidden rounded-2xl border border-[#00E5FF]/30 bg-[#040916]/90 shadow-[0_0_35px_rgba(0,229,255,0.22)]">
                            <iframe
                                ref={faceFrameRef}
                                src="/orion/face?embed=1"
                                title="Orion Face"
                                className="h-full w-full"
                            />
                        </div>
                        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-[#6C63FF]/25" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-semibold tracking-wide text-[#E6F1FF]">
                            ORION
                        </h1>
                        <p className="text-sm tracking-wide text-[#7B8AA0]">
                            Central AI Intelligence System
                        </p>
                        <div className="mt-1 flex gap-2">
                            <Badge
                                variant="outline"
                                className="border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]"
                            >
                                ACTIVE
                            </Badge>
                            <Badge
                                variant="outline"
                                className="border-[#6C63FF]/30 bg-[#6C63FF]/10 text-[#6C63FF]"
                            >
                                ONLINE
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Right side - Status indicators */}
                {showIndicators && (
                    <div className="flex flex-col items-end gap-3">
                        <div className="rounded-lg border border-[#1A2236] bg-[#0B1020]/80 px-4 py-2 backdrop-blur-sm">
                            <div className="text-xs tracking-wider text-[#7B8AA0]">
                                STATE
                            </div>
                            <div className="text-lg font-semibold tracking-wide text-[#00E5FF]">
                                {status.state}
                            </div>
                        </div>

                        <div className="rounded-lg border border-[#1A2236] bg-[#0B1020]/80 px-4 py-2 backdrop-blur-sm">
                            <div className="text-xs tracking-wider text-[#7B8AA0]">
                                ENERGY
                            </div>
                            <div className="text-lg font-semibold tracking-wide text-[#6C63FF]">
                                {status.energy.toFixed(2)}
                            </div>
                        </div>

                        <div className="rounded-lg border border-[#1A2236] bg-[#0B1020]/80 px-4 py-2 backdrop-blur-sm">
                            <div className="text-xs tracking-wider text-[#7B8AA0]">
                                FOCUS
                            </div>
                            <div className="text-lg font-semibold tracking-wide text-[#00E5FF]">
                                {status.focus}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
