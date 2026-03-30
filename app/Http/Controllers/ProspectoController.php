<?php

namespace App\Http\Controllers;

use App\Models\Prospecto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ProspectoController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('q'));
        $estatus = trim((string) $request->string('estatus'));

        $query = Prospecto::query()
            ->when($search !== '', function ($builder) use ($search) {
                $builder->where(function ($inner) use ($search) {
                    $inner->where('nombre', 'like', "%{$search}%")
                        ->orWhere('giro', 'like', "%{$search}%")
                        ->orWhere('categoria', 'like', "%{$search}%")
                        ->orWhere('ciudad', 'like', "%{$search}%")
                        ->orWhere('estado', 'like', "%{$search}%");
                });
            })
            ->when($estatus !== '', function ($builder) use ($estatus) {
                $builder->where('estatus', $estatus);
            })
            ->orderByDesc('id');

        $prospectos = $query
            ->paginate(10)
            ->withQueryString();

        $response = Inertia::render('prospectos/index', [
            'filters' => [
                'q' => $search,
                'estatus' => $estatus,
            ],
            'prospectos' => $prospectos->through(fn (Prospecto $prospecto) => [
                'id' => $prospecto->id,
                'nombre' => $prospecto->nombre,
                'giro' => $prospecto->giro,
                'categoria' => $prospecto->categoria,
                'calificacion' => $prospecto->calificacion,
                'num_resenas' => $prospecto->num_resenas,
                'direccion' => $prospecto->direccion,
                'ciudad' => $prospecto->ciudad,
                'estado' => $prospecto->estado,
                'telefono' => $prospecto->telefono,
                'sitio_web' => $prospecto->sitio_web,
                'horario' => $prospecto->horario,
                'notas' => $prospecto->notas,
                'estatus' => $prospecto->estatus,
                'url_maps' => $prospecto->url_maps,
            ]),
        ])->toResponse($request);

        $response->headers->set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        $response->headers->set('Pragma', 'no-cache');
        $response->headers->set('Expires', '0');

        return $response;
    }

    public function update(Request $request, Prospecto $prospecto): JsonResponse
    {
        $data = $request->validate([
            'estatus' => ['nullable', 'in:nuevo,contactado,interesado,cliente,descartado'],
            'notas' => ['nullable', 'string', 'max:10000'],
        ]);

        if (array_key_exists('estatus', $data)) {
            $prospecto->estatus = $data['estatus'] ?: 'nuevo';
        }

        if (array_key_exists('notas', $data)) {
            $prospecto->notas = $data['notas'];
        }

        $prospecto->save();

        return response()->json([
            'ok' => true,
            'id' => $prospecto->id,
            'estatus' => $prospecto->estatus,
            'notas' => $prospecto->notas,
        ]);
    }
}
