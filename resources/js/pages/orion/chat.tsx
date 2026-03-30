import { Head } from '@inertiajs/react';
import { Bot, Trash2, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { OrionButton } from '@/components/orion-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type ChatMessage = {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    platform?: string;
    user_name?: string | null;
};

type OrionEmotion =
    | 'calma'
    | 'pensando'
    | 'feliz'
    | 'confuso'
    | 'enojado'
    | 'dormido'
    | 'miedo'
    | 'sorpresa'
    | 'neutral';

type OrionVisualState = {
    state: string;
    emotion: OrionEmotion;
    energy: number;
    focus: string;
    intensity: number;
    animations: {
        blink: boolean;
        breath: boolean;
        saccade: boolean;
        thinking: boolean;
    };
};

type OrionPersistedState = {
    id: number;
    state_key: string;
    label: string;
    emotion: OrionEmotion;
    focus: string;
    energy: number;
    intensity: number;
    animations: {
        blink: boolean;
        breath: boolean;
        saccade: boolean;
        thinking: boolean;
    };
    is_system: boolean;
    is_active: boolean;
    description: string | null;
};

type OrionVisualStateForm = {
    state_key: string;
    label: string;
    emotion: OrionEmotion;
    focus: string;
    energy: string;
    intensity: string;
    description: string;
    animations: {
        blink: boolean;
        breath: boolean;
        saccade: boolean;
        thinking: boolean;
    };
};

const ORION_VISUAL_PROFILES: Record<string, OrionVisualState> = {
    CALMA: {
        state: 'CALMA',
        emotion: 'calma',
        energy: 0.43,
        focus: 'SYSTEM',
        intensity: 0.35,
        animations: {
            blink: true,
            breath: true,
            saccade: true,
            thinking: false,
        },
    },
    PENSANDO: {
        state: 'PENSANDO',
        emotion: 'pensando',
        energy: 0.75,
        focus: 'ANALYSIS',
        intensity: 0.72,
        animations: {
            blink: true,
            breath: true,
            saccade: true,
            thinking: true,
        },
    },
    ALERTA: {
        state: 'ALERTA',
        emotion: 'miedo',
        energy: 0.82,
        focus: 'SECURITY',
        intensity: 0.86,
        animations: {
            blink: true,
            breath: false,
            saccade: true,
            thinking: true,
        },
    },
    CONFUSO: {
        state: 'CONFUSO',
        emotion: 'confuso',
        energy: 0.55,
        focus: 'DIAGNOSTICS',
        intensity: 0.58,
        animations: {
            blink: true,
            breath: true,
            saccade: true,
            thinking: true,
        },
    },
    FELIZ: {
        state: 'FELIZ',
        emotion: 'feliz',
        energy: 0.52,
        focus: 'CONVERSATION',
        intensity: 0.48,
        animations: {
            blink: true,
            breath: true,
            saccade: true,
            thinking: false,
        },
    },
    DORMIDO: {
        state: 'DORMIDO',
        emotion: 'dormido',
        energy: 0.15,
        focus: 'IDLE',
        intensity: 0.2,
        animations: {
            blink: false,
            breath: true,
            saccade: false,
            thinking: false,
        },
    },
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orion Chat',
        href: '/orion',
    },
];

export default function OrionChatPage() {
    const defaultVisualStateForm: OrionVisualStateForm = {
        state_key: '',
        label: '',
        emotion: 'calma',
        focus: 'SYSTEM',
        energy: '0.43',
        intensity: '0.35',
        description: '',
        animations: {
            blink: true,
            breath: true,
            saccade: true,
            thinking: false,
        },
    };

    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [isClearingHistory, setIsClearingHistory] = useState(false);
    const [visualState, setVisualState] = useState<OrionVisualState>(
        ORION_VISUAL_PROFILES.CALMA,
    );
    const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
    const [isQuickOpsOpen, setIsQuickOpsOpen] = useState(false);
    const [isVisualStatesOpen, setIsVisualStatesOpen] = useState(false);
    const [isLoadingStates, setIsLoadingStates] = useState(false);
    const [isSavingState, setIsSavingState] = useState(false);
    const [statesError, setStatesError] = useState<string | null>(null);
    const [orionStates, setOrionStates] = useState<OrionPersistedState[]>([]);
    const [editingStateId, setEditingStateId] = useState<number | null>(null);
    const [stateForm, setStateForm] = useState<OrionVisualStateForm>(
        defaultVisualStateForm,
    );
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

    const quickCommands = [
        '/tool database stats',
        'cuantos prospectos tenemos?',
        '/tool help',
    ];

    const csrfToken = document
        .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
        ?.getAttribute('content');

    const stateEmotionOptions: OrionEmotion[] = [
        'calma',
        'pensando',
        'feliz',
        'confuso',
        'enojado',
        'dormido',
        'miedo',
        'sorpresa',
        'neutral',
    ];

    function resetStateForm() {
        setStateForm(defaultVisualStateForm);
        setEditingStateId(null);
    }

    function hydrateFormFromState(orionState: OrionPersistedState) {
        setEditingStateId(orionState.id);
        setStateForm({
            state_key: orionState.state_key,
            label: orionState.label,
            emotion: orionState.emotion,
            focus: orionState.focus,
            energy: String(orionState.energy),
            intensity: String(orionState.intensity),
            description: orionState.description ?? '',
            animations: {
                blink: orionState.animations.blink,
                breath: orionState.animations.breath,
                saccade: orionState.animations.saccade,
                thinking: orionState.animations.thinking,
            },
        });
    }

    function applyPersistedState(orionState: OrionPersistedState) {
        applyVisualState({
            state: orionState.state_key,
            emotion: orionState.emotion,
            focus: orionState.focus,
            energy: orionState.energy,
            intensity: orionState.intensity,
            animations: orionState.animations,
        });
    }

    async function loadOrionStates() {
        setIsLoadingStates(true);
        setStatesError(null);

        try {
            const response = await fetch('/orion/states', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });

            const payload = await response.json();

            if (!response.ok || !Array.isArray(payload.data)) {
                throw new Error(payload.message ?? 'No se pudieron cargar los estados.');
            }

            setOrionStates(payload.data as OrionPersistedState[]);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Error al cargar estados visuales.';
            setStatesError(message);
        } finally {
            setIsLoadingStates(false);
        }
    }

    async function saveOrionState(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSavingState(true);
        setStatesError(null);

        const payload = {
            state_key: stateForm.state_key.trim().toUpperCase(),
            label: stateForm.label.trim(),
            emotion: stateForm.emotion,
            focus: stateForm.focus.trim().toUpperCase(),
            energy: Number(stateForm.energy),
            intensity: Number(stateForm.intensity),
            description: stateForm.description.trim() || null,
            animations: stateForm.animations,
            is_active: true,
        };

        try {
            const endpoint = editingStateId
                ? `/orion/states/${editingStateId}`
                : '/orion/states';

            const response = await fetch(endpoint, {
                method: editingStateId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify(payload),
            });

            const body = await response.json();

            if (!response.ok) {
                const validationMessage =
                    body.errors && typeof body.errors === 'object'
                        ? Object.values(body.errors)[0]?.[0]
                        : null;

                throw new Error(
                    validationMessage ?? body.message ?? 'No se pudo guardar el estado.',
                );
            }

            resetStateForm();
            await loadOrionStates();

            if (body.data) {
                applyPersistedState(body.data as OrionPersistedState);
            }
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Error al guardar el estado.';
            setStatesError(message);
        } finally {
            setIsSavingState(false);
        }
    }

    async function deleteOrionState(orionState: OrionPersistedState) {
        if (orionState.is_system) {
            return;
        }

        setStatesError(null);

        try {
            const response = await fetch(`/orion/states/${orionState.id}`, {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
            });

            const body = await response.json();

            if (!response.ok) {
                throw new Error(body.message ?? 'No se pudo eliminar el estado.');
            }

            if (editingStateId === orionState.id) {
                resetStateForm();
            }

            await loadOrionStates();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Error al eliminar el estado.';
            setStatesError(message);
        }
    }

    async function loadChatHistory() {
        setIsLoadingHistory(true);

        try {
            const response = await fetch('/orion/history', {
                headers: { Accept: 'application/json' },
            });

            const payload = await response.json();

            if (response.ok && Array.isArray(payload.data)) {
                const history = (payload.data as { id: number; role: string; content: string; platform?: string; user_name?: string | null }[]).map((m) => ({
                    id: m.id,
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                    platform: m.platform,
                    user_name: m.user_name,
                }));

                setMessages(
                    history.length > 0
                        ? history
                        : [
                              {
                                  id: 0,
                                  role: 'assistant' as const,
                                  content:
                                      'Hola, soy Orion. ¿Qué necesitas hoy? Puedo ayudarte con ideas, código, research o cualquier duda.',
                              },
                          ],
                );
            }
        } catch {
            // silently fall back to welcome message
            setMessages([
                {
                    id: 0,
                    role: 'assistant',
                    content:
                        'Hola, soy Orion. ¿Qué necesitas hoy? Puedo ayudarte con ideas, código, research o cualquier duda.',
                },
            ]);
        } finally {
            setIsLoadingHistory(false);
        }
    }

    async function clearHistory() {
        if (isClearingHistory) return;
        setIsClearingHistory(true);

        try {
            await fetch('/orion/history', {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
            });

            setMessages([
                {
                    id: 0,
                    role: 'assistant',
                    content:
                        'Historial borrado. ¿En qué puedo ayudarte?',
                },
            ]);
        } finally {
            setIsClearingHistory(false);
        }
    }

    function setVisualProfile(profileKey: string) {
        const profile = ORION_VISUAL_PROFILES[profileKey] ?? ORION_VISUAL_PROFILES.CALMA;
        setVisualState(profile);
    }

    function applyVisualState(orionPayload: unknown) {
        if (!orionPayload || typeof orionPayload !== 'object') {
            return;
        }

        const payload = orionPayload as Partial<OrionVisualState>;
        const profileKey = (payload.state ?? 'CALMA').toUpperCase();
        const profile = ORION_VISUAL_PROFILES[profileKey] ?? ORION_VISUAL_PROFILES.CALMA;

        setVisualState({
            ...profile,
            state: profileKey,
            emotion: (payload.emotion as OrionEmotion) ?? profile.emotion,
            energy:
                typeof payload.energy === 'number'
                    ? Math.min(Math.max(payload.energy, 0), 1)
                    : profile.energy,
            focus: payload.focus ?? profile.focus,
            intensity:
                typeof payload.intensity === 'number'
                    ? Math.min(Math.max(payload.intensity, 0), 1)
                    : profile.intensity,
            animations: {
                ...profile.animations,
                ...(payload.animations ?? {}),
            },
        });
    }

    function detectAssistantEmotion(responseText: string): string {
        const text = responseText.toLowerCase();

        if (text.includes('⚠️') || text.includes('error') || text.includes('no pude')) {
            return 'confuso';
        }

        if (text.includes('base de datos') || text.includes('prospectos')) {
            return 'pensando';
        }

        if (text.includes('feliz') || text.includes('excelente') || text.includes('genial')) {
            return 'feliz';
        }

        return 'calma';
    }

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setVisualProfile('CALMA');
        }, 250);

        return () => window.clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        void loadChatHistory();
    }, []);

    useEffect(() => {
        void loadOrionStates();
    }, []);

    useEffect(() => {
        bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isSending]);

    async function dispatchMessage(rawMessage: string) {
        const trimmedMessage = rawMessage.trim();

        if (trimmedMessage.length === 0 || isSending) {
            return;
        }

        const userMessage: ChatMessage = {
            id: Date.now(),
            role: 'user',
            content: trimmedMessage,
        };

        setMessages((currentMessages) => [...currentMessages, userMessage]);
        setMessage('');
        setIsSending(true);
        setVisualProfile('PENSANDO');

        try {
            const response = await fetch('/orion/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify({ message: trimmedMessage }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(
                    payload.message ?? 'No pude conectar con Orion en este momento.',
                );
            }

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: payload.response,
                },
            ]);

            if (payload.orion) {
                applyVisualState(payload.orion);
            } else {
                const localEmotion = detectAssistantEmotion(payload.response);
                setVisualState((current) => ({
                    ...current,
                    state: localEmotion.toUpperCase(),
                    emotion: localEmotion as OrionEmotion,
                }));
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Ocurrió un error inesperado al hablar con Orion.';

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    id: Date.now() + 1,
                    role: 'assistant',
                    content: `⚠️ ${errorMessage}`,
                },
            ]);

            setVisualProfile('CONFUSO');
        } finally {
            setIsSending(false);

            window.setTimeout(() => {
                setVisualProfile('CALMA');
            }, 1200);
        }
    }

    async function sendMessage(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await dispatchMessage(message);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orion Chat" />
            <div className="flex h-full flex-1 flex-col overflow-hidden p-4 lg:p-6">
                <Card className="flex min-h-0 flex-1 flex-col border-[#1A2236] bg-[#0B1020]/80 backdrop-blur">
                    <CardHeader className="shrink-0 pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[#7B8AA0]">
                                Orion Core
                            </CardTitle>
                            <button
                                type="button"
                                onClick={() => void clearHistory()}
                                disabled={isClearingHistory || isSending}
                                title="Limpiar historial"
                                className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-[#7B8AA0] transition-colors hover:text-[#E6F1FF] disabled:opacity-40"
                            >
                                <Trash2 size={13} />
                                Limpiar
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
                        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-xl border border-[#1A2236] bg-[#0B1020]/50 p-4">
                            {isLoadingHistory ? (
                                <div className="flex flex-1 items-center justify-center text-sm text-[#7B8AA0]">
                                    Cargando historial...
                                </div>
                            ) : (
                                messages.map((chatMessage) => (
                                <div
                                    key={chatMessage.id}
                                    className={`flex gap-3 ${
                                        chatMessage.role === 'user'
                                            ? 'justify-end'
                                            : 'justify-start'
                                    }`}
                                >
                                    {chatMessage.role === 'assistant' && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#00E5FF]/30 to-[#6C63FF]/30">
                                            <Bot className="text-[#00E5FF]" size={16} />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-3 ${
                                            chatMessage.role === 'user'
                                                ? 'bg-[#1E293B] text-[#E6F1FF]'
                                                : 'border-l-[3px] border-l-[#00E5FF] bg-[#0F2538] text-[#E6F1FF]'
                                        }`}
                                    >
                                        {chatMessage.platform && chatMessage.platform !== 'web' && (
                                            <div className="mb-1 flex items-center gap-1.5">
                                                <span className="rounded-full border border-[#6C63FF]/40 bg-[#6C63FF]/10 px-2 py-0.5 text-[10px] capitalize text-[#6C63FF]">
                                                    {chatMessage.platform}
                                                </span>
                                                {chatMessage.user_name && (
                                                    <span className="text-[10px] text-[#7B8AA0]">{chatMessage.user_name}</span>
                                                )}
                                            </div>
                                        )}
                                        <p className="text-sm leading-relaxed">
                                            {chatMessage.content}
                                        </p>
                                    </div>

                                    {chatMessage.role === 'user' && (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E293B]">
                                            <User className="text-[#7B8AA0]" size={16} />
                                        </div>
                                    )}
                                </div>
                            )))}

                            {isSending && (
                                <div className="flex justify-start gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#00E5FF]/30 to-[#6C63FF]/30">
                                        <Bot className="text-[#00E5FF] animate-pulse" size={16} />
                                    </div>
                                    <div className="rounded-lg border-l-[3px] border-l-[#00E5FF] bg-[#0F2538] px-4 py-3 text-sm text-[#7B8AA0]">
                                        Orion está procesando...
                                    </div>
                                </div>
                            )}

                            <div ref={bottomAnchorRef} />
                        </div>

                        <form onSubmit={sendMessage} className="flex items-center gap-3">
                            <Input
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                placeholder="Ask Orion anything..."
                                disabled={isSending}
                                className="flex-1 rounded-lg border border-[#1A2236] bg-[#0B1020] text-sm text-[#E6F1FF] placeholder-[#7B8AA0] transition-all focus:border-[#00E5FF]/50 focus:ring-2 focus:ring-[#00E5FF]/20"
                            />
                            <OrionButton
                                type="submit"
                                disabled={isSending || message.trim().length === 0}
                                variant="primary"
                            >
                                Send
                            </OrionButton>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
