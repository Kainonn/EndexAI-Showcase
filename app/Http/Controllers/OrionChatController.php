<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrionChatRequest;
use App\Models\OrionMemory;
use App\Models\OrionVisualState;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Throwable;

class OrionChatController extends Controller
{
    public function __invoke(OrionChatRequest $request): JsonResponse
    {
        $message = $request->string('message')->toString();
        // Implementation removed for confidentiality.
        $responseText = $this->generateShowcaseResponse($message);
        $visualState = $this->buildVisualStateFromText($message, $responseText);

        $this->persistExchange($request->user()->getAuthIdentifier(), $message, $responseText);

        return response()->json([
            'response' => $responseText,
            'orion' => $this->applyStoredVisualState($visualState),
        ]);
    }

    private function applyStoredVisualState(array $visualState): array
    {
        $stateKey = strtoupper((string) ($visualState['state'] ?? 'CALMA'));

        try {
            $storedState = OrionVisualState::query()
                ->active()
                ->where('state_key', $stateKey)
                ->first();
        } catch (Throwable $exception) {
            Log::warning('Could not load stored Orion visual state', [
                'state_key' => $stateKey,
                'error' => $exception->getMessage(),
            ]);

            return $visualState;
        }

        if ($storedState === null) {
            return $visualState;
        }

        return [
            'state' => $stateKey,
            'emotion' => (string) $storedState->emotion,
            'energy' => (float) $storedState->energy,
            'focus' => (string) ($visualState['focus'] ?? $storedState->focus),
            'intensity' => (float) $storedState->intensity,
            'animations' => $this->normalizeAnimationPayload($storedState->animations),
        ];
    }

    private function normalizeAnimationPayload(mixed $animations): array
    {
        $animationPayload = is_array($animations) ? $animations : [];

        return [
            'blink' => (bool) ($animationPayload['blink'] ?? true),
            'breath' => (bool) ($animationPayload['breath'] ?? true),
            'saccade' => (bool) ($animationPayload['saccade'] ?? true),
            'thinking' => (bool) ($animationPayload['thinking'] ?? false),
        ];
    }

    private function normalizeVisualState(array $orionPayload, string $message, ?string $responseText): array
    {
        $fallback = $this->buildVisualStateFromText($message, $responseText);

        $allowedEmotions = [
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

        $emotion = isset($orionPayload['emotion']) ? mb_strtolower((string) $orionPayload['emotion']) : $fallback['emotion'];
        if (! in_array($emotion, $allowedEmotions, true)) {
            $emotion = $fallback['emotion'];
        }

        $state = isset($orionPayload['state'])
            ? strtoupper((string) $orionPayload['state'])
            : (string) $fallback['state'];

        $focus = isset($orionPayload['focus'])
            ? strtoupper((string) $orionPayload['focus'])
            : (string) $fallback['focus'];

        $energyValue = is_numeric($orionPayload['energy'] ?? null)
            ? (float) $orionPayload['energy']
            : (float) $fallback['energy'];
        $energy = round(max(0.0, min(1.0, $energyValue)), 2);

        $intensityValue = is_numeric($orionPayload['intensity'] ?? null)
            ? (float) $orionPayload['intensity']
            : (float) ($fallback['intensity'] ?? 0.35);
        $intensity = round(max(0.0, min(1.0, $intensityValue)), 2);

        $fallbackAnimations = is_array($fallback['animations'] ?? null) ? $fallback['animations'] : [];
        $animationPayload = is_array($orionPayload['animations'] ?? null)
            ? $orionPayload['animations']
            : [];

        $animations = [
            'blink' => (bool) ($animationPayload['blink'] ?? $fallbackAnimations['blink'] ?? true),
            'breath' => (bool) ($animationPayload['breath'] ?? $fallbackAnimations['breath'] ?? true),
            'saccade' => (bool) ($animationPayload['saccade'] ?? $fallbackAnimations['saccade'] ?? true),
            'thinking' => (bool) ($animationPayload['thinking'] ?? $fallbackAnimations['thinking'] ?? false),
        ];

        return [
            'state' => $state,
            'emotion' => $emotion,
            'energy' => $energy,
            'focus' => $focus,
            'intensity' => $intensity,
            'animations' => $animations,
        ];
    }

    private function generateShowcaseResponse(string $message): string
    {
        $normalized = mb_strtolower($message);

        if (str_contains($normalized, 'pipeline') || str_contains($normalized, 'flujo')) {
            return 'Showcase: Orion detecta intencion, planifica tareas y entrega un resumen analitico con salidas mock. Implementation removed for confidentiality.';
        }

        if (str_contains($normalized, 'analisis') || str_contains($normalized, 'analysis')) {
            return 'Showcase: Orion completo una fase de analisis con datos simulados y recomendaciones de negocio de ejemplo. Implementation removed for confidentiality.';
        }

        if (str_contains($normalized, 'automat') || str_contains($normalized, '/tool')) {
            return 'Showcase: Orion ejecutaria automatizaciones mediante conectores desacoplados; esta version publica solo devuelve resultados simulados. Implementation removed for confidentiality.';
        }

        return 'Showcase Orion: solicitud recibida. Este repositorio conserva arquitectura y flujo autonomo con logica sensible sustituida por mocks seguros. Implementation removed for confidentiality.';
    }

    private function buildVisualStateFromText(string $message, ?string $responseText): array
    {
        $messageText = mb_strtolower($message);
        $response = mb_strtolower($responseText ?? '');

        $state = 'CALMA';
        $emotion = 'calma';
        $focus = 'SYSTEM';
        $energy = 0.43;
        $intensity = 0.35;
        $animations = [
            'blink' => true,
            'breath' => true,
            'saccade' => true,
            'thinking' => false,
        ];

        if (str_contains($response, 'base de datos')) {
            $state = 'PENSANDO';
            $emotion = 'pensando';
            $focus = 'DATABASE';
            $energy = 0.68;
            $intensity = 0.62;
            $animations['thinking'] = true;
        }

        if (str_contains($messageText, '/tool') || str_contains($messageText, 'help')) {
            $focus = 'SYSTEM';
        }

        if (str_contains($messageText, 'error') || str_contains($response, 'error') || str_contains($response, '⚠️')) {
            $state = 'CONFUSO';
            $emotion = 'confuso';
            $focus = 'DIAGNOSTICS';
            $energy = 0.55;
            $intensity = 0.58;
            $animations['thinking'] = true;
        }

        if (str_contains($response, 'genial') || str_contains($response, 'excelente') || str_contains($response, 'listo')) {
            $state = 'FELIZ';
            $emotion = 'feliz';
            $energy = 0.52;
            $intensity = 0.48;
        }

        return [
            'state' => $state,
            'emotion' => $emotion,
            'energy' => $energy,
            'focus' => $focus,
            'intensity' => $intensity,
            'animations' => $animations,
        ];
    }

    private function persistExchange(int|string $userId, string $userMessage, string $assistantReply): void
    {
        try {
            OrionMemory::insert([
                [
                    'platform'           => 'web',
                    'platform_user_id'   => (string) $userId,
                    'laravel_user_id'    => (int) $userId,
                    'user_name'          => null,
                    'role'               => 'user',
                    'content'            => $userMessage,
                    'tools_used'         => null,
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ],
                [
                    'platform'           => 'web',
                    'platform_user_id'   => (string) $userId,
                    'laravel_user_id'    => (int) $userId,
                    'user_name'          => null,
                    'role'               => 'assistant',
                    'content'            => $assistantReply,
                    'tools_used'         => null,
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ],
            ]);
        } catch (Throwable $exception) {
            Log::warning('Could not persist Orion chat exchange', [
                'error' => $exception->getMessage(),
            ]);
        }
    }

    private function extractBridgePayload(string $stdout, string $stderr): ?array
    {
        $candidates = [];

        if ($stdout !== '') {
            $candidates[] = $stdout;
        }

        if ($stderr !== '') {
            $candidates[] = $stderr;
        }

        foreach ($candidates as $candidate) {
            $decoded = json_decode($candidate, true);
            if (is_array($decoded)) {
                return $decoded;
            }

            $lines = preg_split('/\R+/', $candidate) ?: [];
            foreach (array_reverse($lines) as $line) {
                $line = trim($line);
                if ($line === '') {
                    continue;
                }

                $decodedLine = json_decode($line, true);
                if (is_array($decodedLine)) {
                    return $decodedLine;
                }
            }

            $length = strlen($candidate);
            for ($i = $length - 1; $i >= 0; $i--) {
                if ($candidate[$i] !== '{') {
                    continue;
                }

                $jsonFragment = substr($candidate, $i);
                $decodedFragment = json_decode($jsonFragment, true);
                if (is_array($decodedFragment)) {
                    return $decodedFragment;
                }
            }
        }

        return null;
    }
}
