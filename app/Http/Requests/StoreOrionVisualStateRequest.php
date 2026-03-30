<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrionVisualStateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'state_key' => strtoupper((string) $this->input('state_key')),
            'emotion' => mb_strtolower((string) $this->input('emotion')),
            'focus' => strtoupper((string) $this->input('focus', 'SYSTEM')),
        ]);
    }

    public function rules(): array
    {
        return [
            'state_key' => ['required', 'string', 'max:32', 'regex:/^[A-Z0-9_]+$/', 'unique:orion_visual_states,state_key'],
            'label' => ['required', 'string', 'max:120'],
            'emotion' => ['required', 'string', Rule::in(['calma', 'pensando', 'feliz', 'confuso', 'enojado', 'dormido', 'miedo', 'sorpresa', 'neutral'])],
            'focus' => ['required', 'string', 'max:48'],
            'energy' => ['required', 'numeric', 'min:0', 'max:1'],
            'intensity' => ['required', 'numeric', 'min:0', 'max:1'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['sometimes', 'boolean'],
            'animations' => ['required', 'array'],
            'animations.blink' => ['required', 'boolean'],
            'animations.breath' => ['required', 'boolean'],
            'animations.saccade' => ['required', 'boolean'],
            'animations.thinking' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'state_key.regex' => 'El state_key solo acepta letras mayúsculas, números y guion bajo.',
            'energy.max' => 'La energía debe estar entre 0 y 1.',
            'intensity.max' => 'La intensidad debe estar entre 0 y 1.',
            'animations.required' => 'Debes definir la configuración de animaciones.',
        ];
    }
}
