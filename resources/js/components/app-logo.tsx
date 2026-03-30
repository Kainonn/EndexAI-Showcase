import { Bot } from 'lucide-react';


export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-linear-to-br from-[#00E5FF] to-[#6C63FF] orion-glow">
                <Bot className="size-5 text-[#05070D]" strokeWidth={2.5} />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-semibold leading-tight tracking-wider text-[#00E5FF]">
                    ORION
                </span>
                <span className="truncate text-xs tracking-wide text-[#7B8AA0]">
                    AI Control Center
                </span>
            </div>
        </>
    );
}
