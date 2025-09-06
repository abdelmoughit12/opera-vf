<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vente;
use App\Models\Client;
use App\Models\Produit;
use App\Models\Paiement;
use App\Models\TypePaiement;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
class VenteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Vente::with(['client', 'produit', 'paiements.typePaiement']);

            if ($request->filled('client_id')) {
                $query->where('CIN', $request->client_id);
            }

            if ($request->filled('produit_id')) {
                $query->where('ID_Produit', $request->produit_id);
            }

            if ($request->filled('date_debut')) {
                $query->whereDate('Date_Vente', '>=', $request->date_debut);
            }

            if ($request->filled('date_fin')) {
                $query->whereDate('Date_Vente', '<=', $request->date_fin);
            }

            if ($request->filled('statut')) {
                $query->where('Statut', $request->statut);
            }

            // Pagination
            $perPage = min($request->get('per_page', 15), 100);
            $ventes = $query->orderBy('Date_Vente', 'desc')->paginate($perPage);

            return response()->json(['success' => true, 'data' => $ventes], 200);
        } catch (\Exception $e) {
            Log::error('Erreur VenteController@index: '.$e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération des ventes', 'error' => $e->getMessage()], 500);
        }
    }

public function store(Request $request): JsonResponse
{
    try {
        DB::beginTransaction();

        // Log brut des données reçues
        Log::info('VenteController@store - données reçues : ', $request->all());

        $validator = Validator::make($request->all(), [
            'CIN' => 'required|string|exists:Client,CIN',
            'ID_Produit' => 'required|integer|exists:Produit,ID_Produit',
            'Quantite' => 'required|integer|min:1',
            'Prix_Unitaire' => 'required|numeric|min:0',
            'Remise' => 'nullable|numeric|min:0|max:100',
            'ID_Type_Paiement' => 'required|integer|exists:Type_Paiement,ID_Type_Paiement',
            'Statut_Paiement' => 'required|string|in:paye,en_attente,annule',
            'Notes' => 'nullable|string',
            'Date_Vente' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            // Log des erreurs de validation
            Log::warning('VenteController@store - validation échouée : ', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        Log::info('VenteController@store - données validées : ', $validated);

        // Vérifier le stock
        $produit = Produit::findOrFail($validated['ID_Produit']);
        Log::info("Produit trouvé : ID={$produit->ID_Produit}, Stock={$produit->Stock}");

        if ($produit->Stock < $validated['Quantite']) {
            Log::warning('VenteController@store - stock insuffisant');
            return response()->json(['success' => false, 'message' => 'Stock insuffisant'], 400);
        }

        $montantHT = $validated['Quantite'] * $validated['Prix_Unitaire'];
        $remise = $validated['Remise'] ?? 0;
        $montantRemise = ($montantHT * $remise) / 100;
        $montantTTC = $montantHT - $montantRemise;

        Log::info("Montants calculés : HT={$montantHT}, Remise={$montantRemise}, TTC={$montantTTC}");

        $vente = Vente::create([
            'CIN' => $validated['CIN'],
            'ID_Produit' => $validated['ID_Produit'],
            'Quantite' => $validated['Quantite'],
            'Prix_Unitaire' => $validated['Prix_Unitaire'],
            'Montant_HT' => $montantHT,
            'Remise' => $remise,
            'Montant_Remise' => $montantRemise,
            'Montant_TTC' => $montantTTC,
            'Statut' => 'confirmee',
            'Date_Vente' => $validated['Date_Vente'] ?? now(),
            'Notes' => $validated['Notes'] ?? null,
        ]);

        Log::info('Vente créée : ', $vente->toArray());

        $produit->decrement('Stock', $validated['Quantite']);
        Log::info("Stock mis à jour pour le produit ID={$produit->ID_Produit}");

      if ($validated['Statut_Paiement'] === 'paye') {
           $uuidPaiement = uniqid('PAY-');

         if ($validated['Statut_Paiement'] === 'paye') {
    $uuidPaiement = uniqid('PAY-');

    // Get the type_paiement name from TypePaiement model
    $typePaiement = TypePaiement::findOrFail($validated['ID_Type_Paiement']);

    $paiement = Paiement::create([
        'ID_Paiement' => $uuidPaiement,
        'ID_Ventes' => $vente->ID_Ventes,
        'type_paiement' => $typePaiement->Nom_Type ?? 'Type_' . $validated['ID_Type_Paiement'], // Use the actual type name
        'Date_paiement' => now()->format('Y-m-d'), // Note: lowercase 'p' and date format
        'Montant' => $montantTTC,
        'compte' => 1,
        'Banque' => $request->banque ?? null,
        'status' => true,
        // Remove ID_Type_Paiement and Mode_Paiement if they don't exist in the original table
        // Unless you've successfully run the migration that adds them
    ]);

    Log::info('Paiement créé : ', $paiement->toArray());
}

            Log::info('Paiement créé : ', $paiement->toArray());
        }



        DB::commit();

        $vente->load(['client', 'produit', 'paiements.typePaiement']);
        Log::info('Vente finalisée avec relations : ', $vente->toArray());

        return response()->json(['success' => true, 'message' => 'Vente créée', 'data' => $vente], 201);
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Erreur VenteController@store: '.$e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la création de la vente',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
