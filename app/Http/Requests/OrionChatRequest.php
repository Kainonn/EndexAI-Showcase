<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrionChatRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'message' => ['required', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'message.required' => 'Escribe un mensaje para Orion.',
            'message.max' => 'Tu mensaje no puede superar los 2000 caracteres.',
        ];
    }
}
