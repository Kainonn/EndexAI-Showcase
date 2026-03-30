<?php

namespace App\Http\Controllers;

use App\Models\OrionMemory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrionHistoryController extends Controller
{
    /**
     * Return up to 300 most recent memories across all platforms.
     *
     * Optional query param  ?platform=web|discord|telegram  to filter.
     */
    public function index(Request $request): JsonResponse
    {
        $query = OrionMemory::query()
            ->orderBy('created_at')
            ->limit(300);

        if ($request->filled('platform')) {
            $query->where('platform', $request->query('platform'));
        }

        $memories = $query->get([
            'id', 'platform', 'platform_user_id', 'user_name',
            'laravel_user_id', 'role', 'content', 'tools_used', 'created_at',
        ])->values();

        return response()->json(['data' => $memories]);
    }

    /**
     * Delete all memories for the current web user (leaves Discord/Telegram intact).
     * Pass  ?all=1  to wipe everything (admin use).
     */
    public function destroy(Request $request): JsonResponse
    {
        if ($request->boolean('all')) {
            OrionMemory::query()->delete();
        } else {
            OrionMemory::query()
                ->where('platform', 'web')
                ->where('laravel_user_id', $request->user()->getAuthIdentifier())
                ->delete();
        }

        return response()->json(['message' => 'Historial eliminado.']);
    }
}
