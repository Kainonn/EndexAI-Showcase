<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrionMemory extends Model
{
    protected $table = 'orion_memories';

    protected $fillable = [
        'platform',
        'platform_user_id',
        'user_name',
        'laravel_user_id',
        'role',
        'content',
        'tools_used',
    ];

    protected $casts = [
        'tools_used' => 'array',
    ];

    public function laravelUser(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'laravel_user_id');
    }
}
