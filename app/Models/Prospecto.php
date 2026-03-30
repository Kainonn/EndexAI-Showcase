<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prospecto extends Model
{
    protected $table = 'prospectos';

    public const CREATED_AT = 'creado_en';
    public const UPDATED_AT = 'actualizado_en';

    protected $fillable = [
        'nombre',
        'giro',
        'categoria',
        'calificacion',
        'num_resenas',
        'direccion',
        'telefono',
        'sitio_web',
        'horario',
        'coordenadas',
        'ciudad',
        'estado',
        'pais',
        'fuente',
        'url_maps',
        'notas',
        'contactado',
        'fecha_contacto',
        'estatus',
    ];

    protected function casts(): array
    {
        return [
            'calificacion' => 'float',
            'num_resenas' => 'integer',
            'contactado' => 'boolean',
            'fecha_contacto' => 'datetime',
            'creado_en' => 'datetime',
            'actualizado_en' => 'datetime',
        ];
    }
}
