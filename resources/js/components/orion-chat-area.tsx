import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
}

interface OrionChatAreaProps {
    messages?: ChatMessage[];
    className?: string;
}

const defaultMessages: ChatMessage[] = [
    {
        id: '1',
        role: 'user',
        content: 'Show me the system status overview.',
        timestamp: '14:32',
    },
    {
        id: '2',
        role: 'assistant',
        content:
            'All systems are operating at optimal capacity. Current load is at 23% with 12 active servers processing 45.2K messages. Energy consumption is nominal at 0.43 units.',
        timestamp: '14:32',
    },
    {
        id: '3',
        role: 'user',
        content: 'What agents are currently active?',
        timestamp: '14:35',
    },
    {
        id: '4',
        role: 'assistant',
        content:
            'Currently tracking 8 active agents across the network. All agents are responding within normal parameters. Would you like detailed metrics on any specific agent?',
        timestamp: '14:35',
    },
];

export function OrionChatArea({
    messages = defaultMessages,
    className,
}: OrionChatAreaProps) {
    return (
        <div className={cn('space-y-4', className)}>
            <div className="mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#7B8AA0]">
                    AI Assistant
                </h2>
            </div>

            <div className="space-y-3 rounded-xl border border-[#1A2236] bg-[#0B1020]/50 p-4 backdrop-blur-sm">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={cn(
                            'flex gap-3',
                            message.role === 'user'
                                ? 'justify-end'
                                : 'justify-start',
                        )}
                    >
                        {message.role === 'assistant' && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#00E5FF]/30 to-[#6C63FF]/30">
                                <Bot className="text-[#00E5FF]" size={16} />
                            </div>
                        )}

                        <div
                            className={cn(
                                'max-w-[80%] rounded-lg px-4 py-3',
                                message.role === 'user'
                                    ? 'bg-[#1E293B] text-[#E6F1FF]'
                                    : 'border-l-[3px] border-l-[#00E5FF] bg-[#0F2538] text-[#E6F1FF]',
                            )}
                        >
                            <p className="text-sm leading-relaxed">
                                {message.content}
                            </p>
                            {message.timestamp && (
                                <p className="mt-1 text-xs text-[#7B8AA0]">
                                    {message.timestamp}
                                </p>
                            )}
                        </div>

                        {message.role === 'user' && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E293B]">
                                <User className="text-[#7B8AA0]" size={16} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input area */}
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Ask Orion anything..."
                    className="flex-1 rounded-lg border border-[#1A2236] bg-[#0B1020] px-4 py-3 text-sm text-[#E6F1FF] placeholder-[#7B8AA0] outline-none transition-all focus:border-[#00E5FF]/50 focus:ring-2 focus:ring-[#00E5FF]/20"
                />
                <button className="rounded-lg bg-[#00E5FF] px-6 py-3 font-semibold text-[#05070D] transition-all duration-200 hover:shadow-[0_0_12px_#00E5FF]">
                    Send
                </button>
            </div>
        </div>
    );
}
