import { Form, Head, Link } from '@inertiajs/react';
import { useRef } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import NeuralNetworkBackground, {
    type NeuralNetworkRef,
} from '../../components/neural-network-background';
import { home, register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const neuralNetworkRef = useRef<NeuralNetworkRef>(null);

    const handleLogin = () => {
        // Trigger neural network energy wave on login
        neuralNetworkRef.current?.triggerEnergyWave();
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
            <Head title="Log in to Orion" />

            {/* Animated neural network background */}
            <NeuralNetworkBackground ref={neuralNetworkRef} />

            {/* Login card */}
            <div className="relative z-10 w-full max-w-md">
                {/* Orion branding header */}
                <div className="mb-8 flex flex-col items-center gap-6">
                    <Link href={home()} className="group flex flex-col items-center gap-4">
                        {/* Logo with enhanced glow effect */}
                        <div className="relative">
                            {/* Animated glow rings */}
                            <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-500/40 blur-2xl" />
                            <div className="absolute inset-0 animate-ping rounded-full bg-cyan-400/20 blur-xl" style={{ animationDuration: '3s' }} />
                            
                            {/* Floating particles */}
                            <div className="absolute -left-4 -top-4 h-2 w-2 animate-bounce rounded-full bg-cyan-400 blur-sm" style={{ animationDelay: '0s', animationDuration: '2s' }} />
                            <div className="absolute -right-4 top-0 h-1.5 w-1.5 animate-bounce rounded-full bg-blue-400 blur-sm" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }} />
                            <div className="absolute -bottom-2 left-0 h-1 w-1 animate-bounce rounded-full bg-cyan-300 blur-sm" style={{ animationDelay: '1s', animationDuration: '3s' }} />
                            <div className="absolute -right-2 -bottom-4 h-1.5 w-1.5 animate-bounce rounded-full bg-blue-300 blur-sm" style={{ animationDelay: '1.5s', animationDuration: '2.2s' }} />
                            
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

                {/* Login form card */}
                <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-gray-950/90 via-gray-900/85 to-gray-950/90 p-8 shadow-[0_0_80px_rgba(0,229,255,0.25),0_0_30px_rgba(0,153,255,0.15)] backdrop-blur-2xl">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-semibold text-white">
                            Access Control
                        </h2>
                        <p className="mt-1 text-sm text-gray-400">
                            Enter your credentials to continue
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-center text-sm font-medium text-green-400">
                            {status}
                        </div>
                    )}

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-gray-300">
                                            Email address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="email@example.com"
                                            className="border-cyan-500/30 bg-gray-900/50 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/30"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-gray-300">
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs text-cyan-400 hover:text-cyan-300"
                                                    tabIndex={5}
                                                >
                                                    Forgot password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            className="border-cyan-500/30 bg-gray-900/50 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/30"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="border-cyan-500/30 data-[state=checked]:bg-cyan-500"
                                        />
                                        <Label htmlFor="remember" className="text-sm text-gray-300">
                                            Remember me
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        onClick={handleLogin}
                                        className="mt-2 w-full bg-gradient-to-r from-cyan-600 to-blue-600 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all hover:from-cyan-500 hover:to-blue-500 hover:shadow-cyan-500/50"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && <Spinner />}
                                        Initiate Access
                                    </Button>
                                </div>

                                {canRegister && (
                                    <div className="mt-2 text-center text-sm text-gray-400">
                                        New user?{' '}
                                        <TextLink
                                            href={register()}
                                            tabIndex={5}
                                            className="font-medium text-cyan-400 hover:text-cyan-300"
                                        >
                                            Create account
                                        </TextLink>
                                    </div>
                                )}
                            </>
                        )}
                    </Form>
                </div>

                {/* Footer text */}
                <p className="mt-6 text-center text-xs text-gray-500">
                    Powered by Endex AI Technology
                </p>
            </div>
        </div>
    );
}
