<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('prospectos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre', 255);
            $table->string('giro', 100)->nullable()->comment('Ej: Clínica, Veterinaria, Consultorio Dental, Médico General');
            $table->string('categoria', 100)->nullable()->comment('Categoría de búsqueda original');
            $table->decimal('calificacion', 2, 1)->nullable()->comment('Rating de Google Maps (0.0-5.0)');
            $table->integer('num_resenas')->nullable()->comment('Número de reseñas');
            $table->text('direccion')->nullable();
            $table->string('telefono', 50)->nullable();
            $table->string('sitio_web', 500)->nullable();
            $table->text('horario')->nullable()->comment('Horario de atención');
            $table->string('coordenadas', 100)->nullable()->comment('lat,lng de Google Maps');
            $table->string('ciudad', 100)->nullable();
            $table->string('estado', 100)->nullable();
            $table->string('pais', 50)->default('México');
            $table->string('fuente', 50)->default('Google Maps');
            $table->string('url_maps', 500)->nullable()->comment('URL del lugar en Google Maps');
            $table->text('notas')->nullable()->comment('Notas adicionales del agente');
            $table->boolean('contactado')->default(false)->comment('0=No, 1=Sí');
            $table->dateTime('fecha_contacto')->nullable();
            $table->string('estatus', 50)->default('nuevo')->comment('nuevo, contactado, interesado, cliente, descartado');
            $table->dateTime('creado_en')->useCurrent();
            $table->dateTime('actualizado_en')->useCurrent()->useCurrentOnUpdate();

            $table->index('giro');
            $table->index('categoria');
            $table->index('ciudad');
            $table->index('estado');
            $table->index('estatus');
            $table->index('contactado');
            $table->unique('url_maps');
            $table->comment('Prospectos extraídos de Google Maps por Orion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prospectos');
    }
};
