import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrionButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    children: React.ReactNode;
}

export function OrionButton({
    variant = 'primary',
    className,
    children,
    ...props
}: OrionButtonProps) {
    const variants = {
        primary:
            'bg-[#00E5FF] text-[#05070D] font-semibold tracking-wide hover:bg-[#00E5FF] hover:shadow-[0_0_12px_#00E5FF] transition-all duration-200',
        secondary:
            'bg-[#6C63FF] text-[#E6F1FF] font-semibold tracking-wide hover:bg-[#6C63FF] hover:shadow-[0_0_12px_#6C63FF] transition-all duration-200',
        outline:
            'border-2 border-[#00E5FF] bg-transparent text-[#00E5FF] font-semibold tracking-wide hover:bg-[#00E5FF]/10 hover:shadow-[0_0_8px_#00E5FF] transition-all duration-200',
        ghost:
            'bg-transparent text-[#7B8AA0] font-semibold tracking-wide hover:bg-[#1A2236] hover:text-[#E6F1FF] transition-all duration-200',
    };

    return (
        <Button className={cn(variants[variant], className)} {...props}>
            {children}
        </Button>
    );
}

interface OrionPillButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    children: React.ReactNode;
}

export function OrionPillButton({
    active = false,
    className,
    children,
    ...props
}: OrionPillButtonProps) {
    return (
        <button
            className={cn(
                'rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200',
                active
                    ? 'bg-[#00E5FF] text-[#05070D] shadow-[0_0_8px_#00E5FF]'
                    : 'border border-[#1A2236] bg-[#0B1020] text-[#7B8AA0] hover:border-[#00E5FF]/30 hover:text-[#E6F1FF]',
                className,
            )}
            {...props}
        >
            {children}
        </button>
    );
}
