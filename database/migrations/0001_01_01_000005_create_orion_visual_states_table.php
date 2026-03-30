<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orion_visual_states', function (Blueprint $table) {
            $table->id();
            $table->string('state_key', 32)->unique();
            $table->string('label', 120);
            $table->string('emotion', 32);
            $table->string('focus', 48)->default('SYSTEM');
            $table->decimal('energy', 4, 2)->default(0.43);
            $table->decimal('intensity', 4, 2)->default(0.35);
            $table->json('animations');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_system')->default(false);
            $table->timestamps();

            $table->index(['is_active', 'state_key']);
        });

        DB::table('orion_visual_states')->insert([
            [
                'state_key' => 'CALMA',
                'label' => 'Calma',
                'emotion' => 'calma',
                'focus' => 'SYSTEM',
                'energy' => 0.43,
                'intensity' => 0.35,
                'animations' => json_encode([
                    'blink' => true,
                    'breath' => true,
                    'saccade' => true,
                    'thinking' => false,
                ], JSON_THROW_ON_ERROR),
                'description' => 'Estado base operativo.',
                'is_active' => true,
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'state_key' => 'PENSANDO',
                'label' => 'Pensando',
                'emotion' => 'pensando',
                'focus' => 'ANALYSIS',
                'energy' => 0.75,
                'intensity' => 0.72,
                'animations' => json_encode([
                    'blink' => true,
                    'breath' => true,
                    'saccade' => true,
                    'thinking' => true,
                ], JSON_THROW_ON_ERROR),
                'description' => 'Razonamiento profundo.',
                'is_active' => true,
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'state_key' => 'ALERTA',
                'label' => 'Alerta',
                'emotion' => 'miedo',
                'focus' => 'SECURITY',
                'energy' => 0.82,
                'intensity' => 0.86,
                'animations' => json_encode([
                    'blink' => true,
                    'breath' => false,
                    'saccade' => true,
                    'thinking' => true,
                ], JSON_THROW_ON_ERROR),
                'description' => 'Modo de alta vigilancia.',
                'is_active' => true,
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'state_key' => 'CONFUSO',
                'label' => 'Confuso',
                'emotion' => 'confuso',
                'focus' => 'DIAGNOSTICS',
                'energy' => 0.55,
                'intensity' => 0.58,
                'animations' => json_encode([
                    'blink' => true,
                    'breath' => true,
                    'saccade' => true,
                    'thinking' => true,
                ], JSON_THROW_ON_ERROR),
                'description' => 'Modo de diagnóstico y recuperación.',
                'is_active' => true,
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'state_key' => 'FELIZ',
                'label' => 'Feliz',
                'emotion' => 'feliz',
                'focus' => 'CONVERSATION',
                'energy' => 0.52,
                'intensity' => 0.48,
                'animations' => json_encode([
                    'blink' => true,
                    'breath' => true,
                    'saccade' => true,
                    'thinking' => false,
                ], JSON_THROW_ON_ERROR),
                'description' => 'Interacción positiva y relajada.',
                'is_active' => true,
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'state_key' => 'DORMIDO',
                'label' => 'Dormido',
                'emotion' => 'dormido',
                'focus' => 'IDLE',
                'energy' => 0.15,
                'intensity' => 0.20,
                'animations' => json_encode([
                    'blink' => false,
                    'breath' => true,
                    'saccade' => false,
                    'thinking' => false,
                ], JSON_THROW_ON_ERROR),
                'description' => 'Estado de baja actividad.',
                'is_active' => true,
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orion_visual_states');
    }
};
