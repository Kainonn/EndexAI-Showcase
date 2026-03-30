<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrionVisualStateRequest;
use App\Http\Requests\UpdateOrionVisualStateRequest;
use App\Models\OrionVisualState;
use Illuminate\Http\JsonResponse;

class OrionVisualStateController extends Controller
{
    public function index(): JsonResponse
    {
        $states = OrionVisualState::query()
            ->orderByDesc('is_system')
            ->orderBy('state_key')
            ->get();

        return response()->json([
            'data' => $states,
        ]);
    }

    public function store(StoreOrionVisualStateRequest $request): JsonResponse
    {
        $state = OrionVisualState::query()->create($request->validated());

        return response()->json([
            'data' => $state,
        ], 201);
    }

    public function update(UpdateOrionVisualStateRequest $request, OrionVisualState $orionVisualState): JsonResponse
    {
        if ($orionVisualState->is_system) {
            return response()->json([
                'message' => 'Los estados del sistema no se pueden editar.',
            ], 403);
        }

        $orionVisualState->update($request->validated());

        return response()->json([
            'data' => $orionVisualState->fresh(),
        ]);
    }

    public function destroy(OrionVisualState $orionVisualState): JsonResponse
    {
        if ($orionVisualState->is_system) {
            return response()->json([
                'message' => 'Los estados del sistema no se pueden eliminar.',
            ], 403);
        }

        $orionVisualState->delete();

        return response()->json([
            'message' => 'Estado eliminado correctamente.',
        ]);
    }
}
