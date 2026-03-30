<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class OrionVisualState extends Model
{
    protected $fillable = [
        'state_key',
        'label',
        'emotion',
        'focus',
        'energy',
        'intensity',
        'animations',
        'description',
        'is_active',
        'is_system',
    ];

    protected function casts(): array
    {
        return [
            'energy' => 'float',
            'intensity' => 'float',
            'animations' => 'array',
            'is_active' => 'boolean',
            'is_system' => 'boolean',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
