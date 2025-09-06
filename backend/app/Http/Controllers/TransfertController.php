<?php

namespace App\Http\Controllers;

use App\Models\Transfert;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransfertController extends Controller
{
    /**
     * Récupérer tous les transferts avec filtres et pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Transfert::with(['clientSource', 'clientCible']);

            // Filtres
            if ($request->has('statut')) {
                $query->where('statut', $request->statut);
            }

            if ($request->has('client_id')) {
                $query->byClient($request->client_id);
            }

            if ($request->has('date_debut') && $request->has('date_fin')) {
                $query->byDateRange($request->date_debut, $request->date_fin);
            }

            // Tri
            $sortBy = $request->get('sort_by', 'date_transfert');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $transferts = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $transferts->items(),
                'pagination' => [
                    'current_page' => $transferts->currentPage(),
                    'last_page' => $transferts->lastPage(),
                    'per_page' => $transferts->perPage(),
                    'total' => $transferts->total(),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des transferts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer un transfert par ID
     */
    public function show($id): JsonResponse
    {
        try {
            $transfert = Transfert::with(['clientSource', 'clientCible'])->find($id);

            if (!$transfert) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transfert non trouvé'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $transfert
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du transfert',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer un nouveau transfert
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'client_source_id' => 'required|exists:clients,id',
                'client_cible_id' => 'required|exists:clients,id|different:client_source_id',
                'frais_transfert' => 'required|numeric|min:0',
                'message' => 'nullable|string|max:500',
                'statut' => 'sometimes|in:en_attente,validee,annulee'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Vérifier que le client source a un abonnement actif
            $clientSource = Client::find($request->client_source_id);
            if (!$clientSource || $clientSource->statut !== 'actif') {
                return response()->json([
                    'success' => false,
                    'message' => 'Le client source doit avoir un abonnement actif'
                ], 422);
            }

            // Vérifier que le client cible existe et est différent
            $clientCible = Client::find($request->client_cible_id);
            if (!$clientCible) {
                return response()->json([
                    'success' => false,
                    'message' => 'Client cible non trouvé'
                ], 422);
            }

            $transfert = Transfert::create([
                'client_source_id' => $request->client_source_id,
                'client_cible_id' => $request->client_cible_id,
                'frais_transfert' => $request->frais_transfert,
                'message' => $request->message,
                'statut' => $request->statut ?? 'en_attente',
                'date_transfert' => now()
            ]);

            // Charger les relations pour la réponse
            $transfert->load(['clientSource', 'clientCible']);

            return response()->json([
                'success' => true,
                'message' => 'Transfert créé avec succès',
                'data' => $transfert
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du transfert',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un transfert
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $transfert = Transfert::find($id);

            if (!$transfert) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transfert non trouvé'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'frais_transfert' => 'sometimes|numeric|min:0',
                'message' => 'nullable|string|max:500',
                'statut' => 'sometimes|in:en_attente,validee,annulee'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $transfert->update($request->only(['frais_transfert', 'message', 'statut']));

            // Charger les relations pour la réponse
            $transfert->load(['clientSource', 'clientCible']);

            return response()->json([
                'success' => true,
                'message' => 'Transfert mis à jour avec succès',
                'data' => $transfert
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du transfert',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un transfert
     */
    public function destroy($id): JsonResponse
    {
        try {
            $transfert = Transfert::find($id);

            if (!$transfert) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transfert non trouvé'
                ], 404);
            }

            // Vérifier que le transfert n'est pas encore validé
            if ($transfert->isValidee()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer un transfert validé'
                ], 422);
            }

            $transfert->delete();

            return response()->json([
                'success' => true,
                'message' => 'Transfert supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du transfert',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les transferts d'un client spécifique
     */
    public function getByClient($clientId): JsonResponse
    {
        try {
            $transferts = Transfert::with(['clientSource', 'clientCible'])
                ->byClient($clientId)
                ->orderBy('date_transfert', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $transferts
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des transferts du client',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rechercher des transferts
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $search = $request->get('search', '');
            $filters = $request->except(['search']);

            $query = Transfert::with(['clientSource', 'clientCible']);

            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('clientSource', function ($q) use ($search) {
                        $q->where('nom', 'like', "%{$search}%")
                          ->orWhere('prenom', 'like', "%{$search}%")
                          ->orWhere('Code_client', 'like', "%{$search}%");
                    })
                    ->orWhereHas('clientCible', function ($q) use ($search) {
                        $q->where('nom', 'like', "%{$search}%")
                          ->orWhere('prenom', 'like', "%{$search}%")
                          ->orWhere('Code_client', 'like', "%{$search}%");
                    })
                    ->orWhere('message', 'like', "%{$search}%");
                });
            }

            // Appliquer les filtres
            foreach ($filters as $key => $value) {
                if (!empty($value)) {
                    $query->where($key, $value);
                }
            }

            $transferts = $query->orderBy('date_transfert', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $transferts
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la recherche des transferts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les statistiques des transferts
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = [
                'total' => Transfert::count(),
                'par_statut' => [
                    'en_attente' => Transfert::where('statut', 'en_attente')->count(),
                    'validee' => Transfert::where('statut', 'validee')->count(),
                    'annulee' => Transfert::where('statut', 'annulee')->count(),
                ],
                'par_mois' => Transfert::select(
                    DB::raw('MONTH(date_transfert) as mois'),
                    DB::raw('YEAR(date_transfert) as annee'),
                    DB::raw('count(*) as total')
                )
                    ->whereYear('date_transfert', date('Y'))
                    ->groupBy('mois', 'annee')
                    ->orderBy('mois')
                    ->get(),
                'frais_total' => Transfert::where('statut', 'validee')->sum('frais_transfert'),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Valider un transfert
     */
    public function validateTransfert($id): JsonResponse
    {
        try {
            $transfert = Transfert::with(['clientSource', 'clientCible'])->find($id);

            if (!$transfert) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transfert non trouvé'
                ], 404);
            }

            if ($transfert->isValidee()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le transfert est déjà validé'
                ], 422);
            }

            if ($transfert->isAnnulee()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de valider un transfert annulé'
                ], 422);
            }

            DB::beginTransaction();

            try {
                // Mettre à jour le statut du transfert
                $transfert->update([
                    'statut' => 'validee',
                    'date_validation' => now()
                ]);

                // Bloquer le client source
                $transfert->clientSource->update(['statut' => 'bloque']);

                // Activer le client cible s'il était inactif
                if ($transfert->clientCible->statut === 'inactif') {
                    $transfert->clientCible->update(['statut' => 'actif']);
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Transfert validé avec succès',
                    'data' => $transfert
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la validation du transfert',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Annuler un transfert
     */
    public function cancelTransfert($id): JsonResponse
    {
        try {
            $transfert = Transfert::find($id);

            if (!$transfert) {
                return response()->json([
                    'success' => false,
                    'message' => 'Transfert non trouvé'
                ], 404);
            }

            if ($transfert->isValidee()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible d\'annuler un transfert validé'
                ], 422);
            }

            if ($transfert->isAnnulee()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le transfert est déjà annulé'
                ], 422);
            }

            $transfert->update(['statut' => 'annulee']);

            return response()->json([
                'success' => true,
                'message' => 'Transfert annulé avec succès',
                'data' => $transfert
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'annulation du transfert',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 