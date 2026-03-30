import {
    Activity,
    Bot,
    Database,
    MessageSquare,
    Server,
    Zap,
} from 'lucide-react';

import { Card } from '@/components/ui/card';

interface TelemetryData {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

interface OrionTelemetryPanelProps {
    data?: TelemetryData[];
}

const defaultData: TelemetryData[] = [
    {
        label: 'Servers',
        value: '12',
        icon: <Server size={20} />,
        color: '#00E5FF',
    },
    {
        label: 'Leads',
        value: '1,247',
        icon: <Database size={20} />,
        color: '#6C63FF',
    },
    {
        label: 'Agents',
        value: '8',
        icon: <Bot size={20} />,
        color: '#00E5FF',
    },
    {
        label: 'Messages',
        value: '45.2K',
        icon: <MessageSquare size={20} />,
        color: '#6C63FF',
    },
    {
        label: 'Status',
        value: 'Optimal',
        icon: <Activity size={20} />,
        color: '#00E5FF',
    },
    {
        label: 'Load',
        value: '23%',
        icon: <Zap size={20} />,
        color: '#6C63FF',
    },
];

export function OrionTelemetryPanel({ data = defaultData }: OrionTelemetryPanelProps) {
    return (
        <div className="space-y-4">
            <div className="mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#7B8AA0]">
                    System Telemetry
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {data.map((item, index) => (
                    <Card
                        key={index}
                        className="border-[#1A2236] bg-[#0B1020] p-4 transition-all duration-200 hover:border-[#00E5FF]/30 hover:bg-[#0F172A]"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="rounded-lg p-2"
                                    style={{
                                        backgroundColor: `${item.color}15`,
                                        color: item.color,
                                    }}
                                >
                                    {item.icon}
                                </div>
                                <span className="text-sm tracking-wide text-[#7B8AA0]">
                                    {item.label}
                                </span>
                            </div>
                            <span
                                className="text-lg font-semibold tracking-wide"
                                style={{ color: item.color }}
                            >
                                {item.value}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
