<?php

namespace App\Http\Controllers;

use App\Models\Rib;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class RibController extends Controller
{
    // Liste des RIB d'un client
   public function index(Request $request): JsonResponse
    {
        $cin = $request->query('cin');

        // Log côté serveur
        Log::info('Requête RIBs reçue', ['cin' => $cin]);

        $ribs = Rib::byClient($cin)->get();

        Log::info('RIBs trouvés', ['count' => $ribs->count(), 'ribs' => $ribs]);

        return response()->json($ribs);
    }
    // Afficher un RIB
    public function show($id): JsonResponse
    {
        $rib = Rib::findOrFail($id);
        return response()->json($rib);
    }

    // Ajouter un RIB
public function store(Request $request): JsonResponse
{
    try {
        $validated = $request->validate([
            'CIN' => 'required|string|exists:Client,CIN',
            'Banque' => 'required|string|max:100',
            'Agence' => 'nullable|string|max:100',
            'Compte' => 'required|string|max:100',
            'IBAN' => 'nullable|string|max:50',
            'BIC' => 'nullable|string|max:20',
            'Statut' => 'boolean',
        ]);

        $rib = Rib::create($validated);

        return response()->json($rib, 201);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        Log::error('Erreur lors de l\'ajout du RIB', ['error' => $e->getMessage()]);
        return response()->json(['message' => 'Erreur serveur lors de l\'ajout du RIB'], 500);
    }
}


    // Modifier un RIB
    public function update(Request $request, $id): JsonResponse
    {
        $rib = Rib::findOrFail($id);
        $validated = $request->validate([
            'Banque' => 'sometimes|string|max:100',
            'Agence' => 'sometimes|string|max:100',
            'Compte' => 'sometimes|string|max:100',
            'IBAN' => 'nullable|string|max:50',
            'BIC' => 'nullable|string|max:20',
            'Statut' => 'boolean',
        ]);
        $rib->update($validated);
        return response()->json($rib);
    }

    // Supprimer un RIB
 public function destroy($id): JsonResponse
{
    try {
        Log::info("Suppression RIB id=$id");
        $rib = Rib::findOrFail($id);
        $rib->delete();
        Log::info("RIB supprimé id=$id");
        return response()->json(['message' => 'RIB supprimé'], 200);
    } catch (\Exception $e) {
        Log::error('Erreur lors de la suppression du RIB', ['error' => $e->getMessage()]);
        return response()->json(['message' => 'Erreur serveur lors de la suppression du RIB'], 500);
    }
}


}
