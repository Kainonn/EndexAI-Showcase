import { Head } from '@inertiajs/react';
import { OrionPillButton } from '@/components/orion-button';
import { OrionChatArea } from '@/components/orion-chat-area';
import { OrionCoreHeader } from '@/components/orion-core-header';
import { OrionTelemetryPanel } from '@/components/orion-telemetry-panel';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Orion Core Header */}
                <OrionCoreHeader />

                {/* Main Grid */}
                <div className="grid flex-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                    {/* Left Sidebar - Telemetry */}
                    <OrionTelemetryPanel />

                    {/* Main Content - Chat */}
                    <div className="space-y-6">
                        <OrionChatArea />

                        {/* Quick Actions */}
                        <Card className="border-[#1A2236] bg-[#0B1020] p-6">
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#7B8AA0]">
                                Quick Actions
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <OrionPillButton>View Agents</OrionPillButton>
                                <OrionPillButton>System Logs</OrionPillButton>
                                <OrionPillButton>Run Diagnostics</OrionPillButton>
                                <OrionPillButton>Deploy Update</OrionPillButton>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
