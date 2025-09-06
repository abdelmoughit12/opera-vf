<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Produit;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProduitController extends Controller
{
    /**
     * Récupérer tous les produits avec filtres et pagination
     */
  public function index(Request $request): JsonResponse
{
    try {
        Log::info('=== DEBUT RECUPERATION PRODUITS ===');
        Log::info('Request parameters:', $request->all());

        $query = Produit::query();
        Log::info('Query initiale créée');

        // Récupérer d'abord toutes les catégories disponibles
        $categories = Produit::distinct()->pluck('Categorie')->filter()->values();
        Log::info('Catégories disponibles:', ['categories' => $categories]);

        // Filtres
        if ($request->filled('categorie')) {
            Log::info('Filtre catégorie appliqué:', ['categorie' => $request->categorie]);
            $query->where('Categorie', $request->categorie);
        }

        if ($request->filled('statut')) {
            Log::info('Filtre statut appliqué:', ['statut' => $request->statut]);
            $query->where('Statut', $request->statut);
        }

        if ($request->filled('stock')) {
            Log::info('Filtre stock appliqué:', ['stock' => $request->stock]);
            if ($request->stock === 'disponible') {
                $query->where('Stock', '>', 0);
            } elseif ($request->stock === 'rupture') {
                $query->where('Stock', '<=', 0);
            } elseif ($request->stock === 'faible') {
                $query->where('Stock', '<=', 10)->where('Stock', '>', 0);
            }
        }

        if ($request->filled('prix_min')) {
            Log::info('Filtre prix_min appliqué:', ['prix_min' => $request->prix_min]);
            $query->where('Prix', '>=', $request->prix_min);
        }

        if ($request->filled('prix_max')) {
            Log::info('Filtre prix_max appliqué:', ['prix_max' => $request->prix_max]);
            $query->where('Prix', '<=', $request->prix_max);
        }

        // Recherche
        if ($request->filled('search')) {
            Log::info('Recherche appliquée:', ['search' => $request->search]);
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('Nom_Produit', 'like', "%{$search}%")
                  ->orWhere('Description', 'like', "%{$search}%")
                  ->orWhere('Categorie', 'like', "%{$search}%");
            });
        }

        // Tri
        $sortBy = $request->get('sort_by', 'Nom_Produit');
        $sortOrder = $request->get('sort_order', 'asc');
        Log::info('Tri appliqué:', ['sort_by' => $sortBy, 'sort_order' => $sortOrder]);
        $query->orderBy($sortBy, $sortOrder);

        // Récupération des résultats
        Log::info('Exécution de la requête SQL');
        Log::info('SQL Query:', ['query' => $query->toSql(), 'bindings' => $query->getBindings()]);

        // Pagination
        $perPage = min($request->get('per_page', 15), 100);
        Log::info('Pagination:', ['per_page' => $perPage]);

        $produits = $query->paginate($perPage);

        Log::info('Produits récupérés:', [
            'total' => $produits->total(),
            'count' => $produits->count(),
            'per_page' => $produits->perPage(),
            'current_page' => $produits->currentPage()
        ]);

        // Log des premiers produits pour vérification
        if ($produits->count() > 0) {
            Log::info('Premier produit:', $produits->first()->toArray());
        }

        Log::info('=== FIN RECUPERATION PRODUITS ===');

        return response()->json([
            'success' => true,
            'data' => $produits,
            'categories' => $categories, // Ajout des catégories dans la réponse
            'debug' => [
                'total_count' => $produits->total(),
                'current_page' => $produits->currentPage(),
                'per_page' => $produits->perPage(),
                'filters_applied' => $request->only(['categorie', 'statut', 'stock', 'prix_min', 'prix_max', 'search'])
            ]
        ], 200);

    } catch (\Exception $e) {
        Log::error('ERREUR lors de la récupération des produits:', [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
            'request_data' => $request->all()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la récupération des produits',
            'error' => $e->getMessage(),
            'debug' => [
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]
        ], 500);
    }
}

    /**
     * Récupérer un produit par ID
     */
    public function show($id): JsonResponse
    {
        try {
            Log::info('=== DEBUT RECUPERATION PRODUIT UNIQUE ===');
            Log::info('ID recherché:', ['id' => $id]);

            $produit = Produit::find($id);

            if (!$produit) {
                Log::warning('Produit non trouvé:', ['id' => $id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Produit non trouvé'
                ], 404);
            }

            Log::info('Produit trouvé:', $produit->toArray());
            Log::info('=== FIN RECUPERATION PRODUIT UNIQUE ===');

            return response()->json([
                'success' => true,
                'data' => $produit
            ]);

        } catch (\Exception $e) {
            Log::error('ERREUR lors de la récupération du produit:', [
                'id' => $id,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du produit',
                'error' => $e->getMessage(),
                'debug' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500);
        }
    }

    /**
     * Créer un nouveau produit
     */
    public function store(Request $request): JsonResponse
    {
        try {
            Log::info('=== DEBUT CREATION PRODUIT ===');
            Log::info('Données reçues:', $request->all());

            $validator = Validator::make($request->all(), [
                'Nom_Produit' => 'required|string|max:100',
                'Description' => 'nullable|string',
                'Prix' => 'required|numeric|min:0',
                'Stock' => 'required|integer|min:0',
                'Categorie' => 'required|string|max:50',
                'Statut' => 'sometimes|string|in:actif,inactif,rupture,brouillon',
                'Image_URL' => 'nullable|url',
                'Duree_Mois' => 'nullable|numeric|min:0|max:120',
                'Type_Abonnement' => 'nullable|string|max:50',
                'Conditions' => 'nullable|string',
                'Avantages' => 'nullable|string',
                'Restrictions' => 'nullable|string',
                'Notes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                Log::warning('Validation échouée:', [
                    'errors' => $validator->errors()->toArray(),
                    'data' => $request->all()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();
            $validated['Statut'] = $validated['Statut'] ?? 'actif';
            $validated['Duree_Mois'] = $validated['Duree_Mois'] ?? 1.0;

            Log::info('Données validées:', $validated);

            $produit = Produit::create($validated);

            Log::info('Produit créé avec succès:', [
                'id' => $produit->ID_Produit,
                'produit' => $produit->toArray()
            ]);
            Log::info('=== FIN CREATION PRODUIT ===');

            return response()->json([
                'success' => true,
                'message' => 'Produit créé avec succès',
                'data' => $produit
            ], 201);

        } catch (\Exception $e) {
            Log::error('ERREUR lors de la création du produit:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du produit',
                'error' => $e->getMessage(),
                'debug' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500);
        }
    }

    /**
     * Mettre à jour un produit
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            Log::info('=== DEBUT MISE A JOUR PRODUIT ===');
            Log::info('ID:', ['id' => $id]);
            Log::info('Données reçues:', $request->all());

            $produit = Produit::find($id);

            if (!$produit) {
                Log::warning('Produit non trouvé pour mise à jour:', ['id' => $id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Produit non trouvé'
                ], 404);
            }

            Log::info('Produit avant mise à jour:', $produit->toArray());

            $validator = Validator::make($request->all(), [
                'Nom_Produit' => 'sometimes|required|string|max:100',
                'Description' => 'nullable|string',
                'Prix' => 'sometimes|required|numeric|min:0',
                'Stock' => 'sometimes|required|integer|min:0',
                'Categorie' => 'sometimes|required|string|max:50',
                'Statut' => 'sometimes|string|in:actif,inactif,rupture,brouillon',
                'Image_URL' => 'nullable|url',
                'Duree_Mois' => 'nullable|numeric|min:0|max:120',
                'Type_Abonnement' => 'nullable|string|max:50',
                'Conditions' => 'nullable|string',
                'Avantages' => 'nullable|string',
                'Restrictions' => 'nullable|string',
                'Notes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                Log::warning('Validation échouée lors de la mise à jour:', [
                    'errors' => $validator->errors()->toArray(),
                    'data' => $request->all(),
                    'id' => $id
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();
            Log::info('Données validées pour mise à jour:', $validated);

            $produit->update($validated);

            Log::info('Produit après mise à jour:', $produit->fresh()->toArray());
            Log::info('=== FIN MISE A JOUR PRODUIT ===');

            return response()->json([
                'success' => true,
                'message' => 'Produit mis à jour avec succès',
                'data' => $produit->fresh()
            ]);

        } catch (\Exception $e) {
            Log::error('ERREUR lors de la mise à jour du produit:', [
                'id' => $id,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du produit',
                'error' => $e->getMessage(),
                'debug' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500);
        }
    }

    /**
     * Supprimer un produit
     */
    public function destroy($id): JsonResponse
    {
        try {
            Log::info('=== DEBUT SUPPRESSION PRODUIT ===');
            Log::info('ID à supprimer:', ['id' => $id]);

            $produit = Produit::find($id);

            if (!$produit) {
                Log::warning('Produit non trouvé pour suppression:', ['id' => $id]);
                return response()->json([
                    'success' => false,
                    'message' => 'Produit non trouvé'
                ], 404);
            }

            Log::info('Produit à supprimer:', $produit->toArray());

            // Vérifier s'il y a des ventes associées
            $ventesCount = $produit->ventes()->count();
            Log::info('Nombre de ventes associées:', ['count' => $ventesCount]);

            if ($ventesCount > 0) {
                Log::warning('Suppression bloquée - ventes associées:', [
                    'id' => $id,
                    'ventes_count' => $ventesCount
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer ce produit car il a des ventes associées'
                ], 400);
            }

            $produit->delete();

            Log::info('Produit supprimé avec succès:', ['id' => $id]);
            Log::info('=== FIN SUPPRESSION PRODUIT ===');

            return response()->json([
                'success' => true,
                'message' => 'Produit supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            Log::error('ERREUR lors de la suppression du produit:', [
                'id' => $id,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du produit',
                'error' => $e->getMessage(),
                'debug' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500);
        }
    }

    /**
     * Récupérer les statistiques des produits
     */
    public function stats(): JsonResponse
    {
        try {
            Log::info('=== DEBUT STATISTIQUES PRODUITS ===');

            $stats = [
                'total' => Produit::count(),
                'actifs' => Produit::where('Statut', 'actif')->count(),
                'en_stock' => Produit::where('Stock', '>', 0)->count(),
                'rupture' => Produit::where('Stock', '<=', 0)->count(),
                'stock_faible' => Produit::where('Stock', '<=', 10)->where('Stock', '>', 0)->count(),
                'valeur_stock' => Produit::sum(DB::raw('Prix * Stock')),
                'par_categorie' => Produit::selectRaw('Categorie, COUNT(*) as count')
                    ->groupBy('Categorie')
                    ->get()
            ];

            Log::info('Statistiques calculées:', $stats);
            Log::info('=== FIN STATISTIQUES PRODUITS ===');

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('ERREUR lors de la récupération des statistiques:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage(),
                'debug' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]
            ], 500);
        }
    }
}
