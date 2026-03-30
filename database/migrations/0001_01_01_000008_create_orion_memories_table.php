<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Replace the web-only table with a unified one for all platforms
        Schema::dropIfExists('orion_chat_messages');

        Schema::create('orion_memories', function (Blueprint $table) {
            $table->id();
            // Platform: web | discord | telegram
            $table->string('platform', 32)->default('web');
            // The user identifier on that platform (Discord snowflake, Telegram ID, or Laravel user ID)
            $table->string('platform_user_id', 64);
            $table->string('user_name', 120)->nullable();
            // Laravel user ID — populated only for web messages, nullable otherwise
            $table->unsignedBigInteger('laravel_user_id')->nullable()->index();
            $table->enum('role', ['user', 'assistant']);
            $table->text('content');
            $table->json('tools_used')->nullable();
            $table->timestamps();

            $table->index(['laravel_user_id', 'created_at']);
            $table->index(['platform', 'platform_user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orion_memories');

        Schema::create('orion_chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('role', ['user', 'assistant']);
            $table->text('content');
            $table->timestamps();
            $table->index(['user_id', 'created_at']);
        });
    }
};
