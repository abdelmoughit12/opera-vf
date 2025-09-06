<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Visiteur;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
class ClientController extends Controller
{
    /**
     * Récupérer tous les clients avec filtres et pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Client::query()
                ->leftJoin('Visiteur', 'Client.CIN', '=', 'Visiteur.CIN')
                ->select([
                    'Client.*',
                    'Visiteur.Nom as Nom_Visiteur',
                    'Visiteur.Prenom as Prenom_Visiteur',
                    'Visiteur.Telephone as Telephone_Visiteur'
                ]);

            // Filtres
            if ($request->has('Status')) {
                $query->where('Client.Status', $request->Status);
            }

            if ($request->has('Type_client')) {
                $query->where('Client.Type_Client', $request->Type_client);
            }

            if ($request->has('Club')) {
                $query->where('Client.Club', $request->Club);
            }

            // Recherche
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('Visiteur.Nom', 'like', "%{$search}%")
                      ->orWhere('Visiteur.Prenom', 'like', "%{$search}%")
                      ->orWhere('Client.Email', 'like', "%{$search}%")
                      ->orWhere('Visiteur.Telephone', 'like', "%{$search}%")
                      ->orWhere('Client.Code_Club', 'like', "%{$search}%")
                      ->orWhere('Client.CIN', 'like', "%{$search}%");
                });
            }

            // Tri
            $sortBy = $request->get('sort_by', 'Client.created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $clients = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $clients
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des clients',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer un client par ID
     */
    public function show($id): JsonResponse
    {
        try {
            $client = Client::query()
                ->leftJoin('visiteur', 'Client.CIN', '=', 'visiteur.CIN')
                ->select([
                    'Client.*',
                    'visiteur.Nom as Nom_Visiteur',
                    'visiteur.Prenom as Prenom_Visiteur',
                    'visiteur.Telephone as Telephone_Visiteur'
                ])
                ->where('Client.CIN', $id)
                ->first();

            if (!$client) {
                return response()->json([
                    'success' => false,
                    'message' => 'Client non trouvé'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $client
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Client non trouvé',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Créer un nouveau client
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'CIN' => 'required|string|unique:Client,CIN',
                'Club' => 'required|string',
                'Code_Club' => 'required|string|max:10',
                'Status' => 'required|in:actif,inactif,en_attente',
                'Type_Client' => 'required|in:standard,premium,vip',
                'Notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $client = Client::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Client créé avec succès',
                'data' => $client
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du client',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un client
     */
public function update(Request $request, $id): JsonResponse
{
    try {
        $client = Client::where('CIN', $id)->first();

        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            // Client fields - remove 'sometimes' for required fields that should always be present
            'CIN' => 'string', // Remove unique validation for updates, CIN shouldn't change
            'Club' => 'required|string',
            'Code_Club' => 'required|string|max:20', // Increased to accommodate longer codes
            'Status' => 'required|in:actif,inactif,en_attente',
            'Type_Client' => 'required|in:standard,premium,vip',
            'Email' => 'required|email',
            'telephone' => 'required|string', // This is required in frontend
            'Notes' => 'nullable|string',
            'Adresse' => 'nullable|string',
            'Date_Naissance' => 'nullable|date_format:Y-m-d', // More specific date format validation
            // Visiteur fields
            'nom' => 'required|string',
            'prenom' => 'required|string',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', [
                'errors' => $validator->errors(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors(),
                'received_data' => $request->all() // Add this for debugging
            ], 422);
        }

        // Séparer les données client et visiteur
        $clientData = $request->only([
            'Club', 'Code_Club', 'Status', 'Type_Client', 'Notes',
            'Email', 'Adresse', 'Date_Naissance'
        ]);

        // Remove empty/null values from clientData to avoid overwriting with nulls
        $clientData = array_filter($clientData, function($value) {
            return $value !== null && $value !== '';
        });

        $visiteurData = $request->only(['nom', 'prenom', 'telephone']);

        // Mettre à jour le client
        $client->update($clientData);

        // Mettre à jour le visiteur si des données sont fournies
        if (!empty($visiteurData)) {
            $visiteur = Visiteur::where('CIN', $id)->first();
            if ($visiteur) {
                // Mapper les noms de champs
                $visiteurUpdateData = [];
                if (isset($visiteurData['nom'])) {
                    $visiteurUpdateData['Nom'] = $visiteurData['nom'];
                }
                if (isset($visiteurData['prenom'])) {
                    $visiteurUpdateData['Prenom'] = $visiteurData['prenom'];
                }
                if (isset($visiteurData['telephone'])) {
                    $visiteurUpdateData['Telephone'] = $visiteurData['telephone'];
                }

                if (!empty($visiteurUpdateData)) {
                    $visiteur->update($visiteurUpdateData);
                }
            }
        }

        // Récupérer les données mises à jour avec la jointure
        $updatedClient = Client::query()
            ->leftJoin('visiteur', 'Client.CIN', '=', 'visiteur.CIN')
            ->select([
                'Client.*',
                'visiteur.Nom as Nom_Visiteur',
                'visiteur.Prenom as Prenom_Visiteur',
                'visiteur.Telephone as Telephone_Visiteur'
            ])
            ->where('Client.CIN', $id)
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Client mis à jour avec succès',
            'data' => $updatedClient
        ]);

    } catch (\Exception $e) {
        Log::error('Client update error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la mise à jour du client',
            'error' => $e->getMessage()
        ], 500);
    }
}
    /**
     * Supprimer un client
     */
    public function destroy($id): JsonResponse
    {
        try {
            $client = Client::where('CIN', $id)->first();

            if (!$client) {
                return response()->json([
                    'success' => false,
                    'message' => 'Client non trouvé'
                ], 404);
            }

            $client->delete();

            return response()->json([
                'success' => true,
                'message' => 'Client supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du client',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rechercher des clients
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $search = $request->get('search', '');
            $filters = $request->except(['search']);

            $query = Client::query()
                ->leftJoin('Visiteur', 'Client.CIN', '=', 'Visiteur.CIN')
                ->select([
                    'Client.*',
                    'Visiteur.Nom as Nom_Visiteur',
                    'Visiteur.Prenom as Prenom_Visiteur',
                    'Visiteur.Telephone as Telephone_Visiteur'
                ]);

            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('Visiteur.Nom', 'like', "%{$search}%")
                      ->orWhere('Visiteur.Prenom', 'like', "%{$search}%")
                      ->orWhere('Client.Email', 'like', "%{$search}%")
                      ->orWhere('Visiteur.Telephone', 'like', "%{$search}%")
                      ->orWhere('Client.Code_Club', 'like', "%{$search}%")
                      ->orWhere('Client.CIN', 'like', "%{$search}%");
                });
            }

            // Appliquer les filtres
            foreach ($filters as $key => $value) {
                if (!empty($value)) {
                    $query->where("Client.{$key}", $value);
                }
            }

            $clients = $query->get();

            return response()->json([
                'success' => true,
                'data' => $clients
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la recherche',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les statistiques des clients
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = [
                'total' => Client::count(),
                'actifs' => Client::where('Status', 'actif')->count(),
                'inactifs' => Client::where('Status', 'inactif')->count(),
                'en_attente' => Client::where('Status', 'en_attente')->count(),
                'par_type' => [
                    'standard' => Client::where('Type_Client', 'standard')->count(),
                    'premium' => Client::where('Type_Client', 'premium')->count(),
                    'vip' => Client::where('Type_Client', 'vip')->count(),
                ],
                'par_club' => Client::select('Club', DB::raw('count(*) as total'))
                    ->groupBy('Club')
                    ->get(),
                'inscriptions_mois' => Client::select(
                    DB::raw('MONTH(Date_Inscription) as mois'),
                    DB::raw('YEAR(Date_Inscription) as annee'),
                    DB::raw('count(*) as total')
                )
                    ->whereYear('Date_Inscription', date('Y'))
                    ->groupBy('mois', 'annee')
                    ->orderBy('mois')
                    ->get(),
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
}
