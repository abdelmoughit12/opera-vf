<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class ClubController extends Controller
{
    /**
     * Afficher la liste des clubs
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Club::query();

            // Filtres
            if ($request->has('type') && $request->type !== 'all') {
                $query->where('Type_Club', $request->type);
            }

            if ($request->has('statut') && $request->statut !== 'all') {
                $query->where('Statut', $request->statut);
            }

            if ($request->has('ville')) {
                $query->where('Ville', 'like', '%' . $request->ville . '%');
            }

            if ($request->has('min_capacity')) {
                $query->where('Capacite_Max', '>=', $request->min_capacity);
            }

            if ($request->has('max_capacity')) {
                $query->where('Capacite_Max', '<=', $request->max_capacity);
            }

            // Recherche
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('Nom', 'like', '%' . $search . '%')
                      ->orWhere('Ville', 'like', '%' . $search . '%')
                      ->orWhere('Description', 'like', '%' . $search . '%');
                });
            }

            // Tri
            $sortBy = $request->get('sort_by', 'Nom');
            $sortOrder = $request->get('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $clubs = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $clubs
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des clubs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un club spécifique
     */
    public function show($id): JsonResponse
    {
        try {
            $club = Club::find($id);

            if (!$club) {
                return response()->json([
                    'success' => false,
                    'message' => 'Club non trouvé'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $club
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du club',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Créer un nouveau club
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validation des données
            $validator = Validator::make($request->all(), [
                'Nom' => 'required|string|max:100|unique:Club,Nom',
                'Adresse' => 'required|string|max:255',
                'Ville' => 'required|string|max:100',
                'Code_Postal' => 'required|string|max:10',
                'Telephone' => 'required|string|max:20',
                'Email' => 'required|email|max:100|unique:Club,Email',
                'Type_Club' => 'required|string|in:standard,premium,vip,familial,sportif,bienetre',
                'Statut' => 'required|string|in:actif,inactif,maintenance,ferme',
                'Capacite_Max' => 'required|integer|min:1|max:10000',
                'Date_Creation' => 'required|date',
                'Description' => 'nullable|string',
                'Site_Web' => 'nullable|url|max:255',
                'Horaires_Ouverture' => 'nullable|string|max:10',
                'Horaires_Fermeture' => 'nullable|string|max:10',
                'Services' => 'nullable|string',
                'Notes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données de validation invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Générer un ID unique pour le club
            $validated = $validator->validated();
            $validated['ID_Club'] = 'CLUB_' . strtoupper(substr($validated['Nom'], 0, 3)) . '_' . time();
            $validated['Code'] = 'C' . str_pad(Club::count() + 1, 4, '0', STR_PAD_LEFT);

            // Créer le club
            $club = Club::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Club créé avec succès',
                'data' => $club
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du club',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un club
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $club = Club::find($id);

            if (!$club) {
                return response()->json([
                    'success' => false,
                    'message' => 'Club non trouvé'
                ], 404);
            }

            // Validation des données
            $validator = Validator::make($request->all(), [
                'Nom' => 'sometimes|required|string|max:100|unique:Club,Nom,' . $id . ',ID_Club',
                'Adresse' => 'sometimes|required|string|max:255',
                'Ville' => 'sometimes|required|string|max:100',
                'Code_Postal' => 'sometimes|required|string|max:10',
                'Telephone' => 'sometimes|required|string|max:20',
                'Email' => 'sometimes|required|email|max:100|unique:Club,Email,' . $id . ',ID_Club',
                'Type_Club' => 'sometimes|required|string|in:standard,premium,vip,familial,sportif,bienetre',
                'Statut' => 'sometimes|required|string|in:actif,inactif,maintenance,ferme',
                'Capacite_Max' => 'sometimes|required|integer|min:1|max:10000',
                'Date_Creation' => 'sometimes|required|date',
                'Description' => 'nullable|string',
                'Site_Web' => 'nullable|url|max:255',
                'Horaires_Ouverture' => 'nullable|string|max:10',
                'Horaires_Fermeture' => 'nullable|string|max:10',
                'Services' => 'nullable|string',
                'Notes' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données de validation invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Mettre à jour le club
            $club->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'Club mis à jour avec succès',
                'data' => $club
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du club',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un club
     */
    public function destroy($id): JsonResponse
    {
        try {
            $club = Club::find($id);

            if (!$club) {
                return response()->json([
                    'success' => false,
                    'message' => 'Club non trouvé'
                ], 404);
            }

            // Vérifier s'il y a des clients associés
            $clientsCount = DB::table('Client')->where('Code_Club', $club->Code_Club)->count();

            if ($clientsCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de supprimer le club car il a des clients associés',
                    'clients_count' => $clientsCount
                ], 400);
            }

            // Supprimer le club
            $club->delete();

            return response()->json([
                'success' => true,
                'message' => 'Club supprimé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du club',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques des clubs
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = [
                'total' => Club::count(),
                'par_type' => Club::selectRaw('Type_Club, COUNT(*) as count')
                    ->groupBy('Type_Club')
                    ->get(),
                'par_statut' => Club::selectRaw('Statut, COUNT(*) as count')
                    ->groupBy('Statut')
                    ->get(),
                'par_ville' => Club::selectRaw('Ville, COUNT(*) as count')
                    ->groupBy('Ville')
                    ->orderBy('count', 'desc')
                    ->limit(10)
                    ->get(),
                'capacite_totale' => Club::sum('Capacite_Max'),
                'capacite_moyenne' => Club::avg('Capacite_Max'),
                'clubs_actifs' => Club::where('Statut', 'actif')->count(),
                'clubs_inactifs' => Club::where('Statut', 'inactif')->count(),
                'clubs_maintenance' => Club::where('Statut', 'maintenance')->count(),
                'clubs_fermes' => Club::where('Statut', 'ferme')->count()
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
     * Vérifier la disponibilité d'un nom de club
     */
    public function checkName(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:100',
                'exclude_id' => 'nullable|integer'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données de validation invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $query = Club::where('Nom', $request->nom);

            if ($request->has('exclude_id')) {
                $query->where('ID_Club', '!=', $request->exclude_id);
            }

            $exists = $query->exists();

            return response()->json([
                'success' => true,
                'data' => [
                    'nom' => $request->nom,
                    'disponible' => !$exists,
                    'message' => $exists ? 'Ce nom est déjà utilisé' : 'Ce nom est disponible'
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la vérification du nom',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Rechercher des clubs
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'q' => 'required|string|min:2',
                'type' => 'nullable|string',
                'ville' => 'nullable|string',
                'statut' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données de validation invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $query = Club::query();

            // Recherche textuelle
            $searchTerm = $request->q;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('Nom', 'like', '%' . $searchTerm . '%')
                  ->orWhere('Ville', 'like', '%' . $searchTerm . '%')
                  ->orWhere('Description', 'like', '%' . $searchTerm . '%')
                  ->orWhere('Services', 'like', '%' . $searchTerm . '%');
            });

            // Filtres additionnels
            if ($request->has('type')) {
                $query->where('Type_Club', $request->type);
            }

            if ($request->has('ville')) {
                $query->where('Ville', 'like', '%' . $request->ville . '%');
            }

            if ($request->has('statut')) {
                $query->where('Statut', $request->statut);
            }

            $clubs = $query->limit(20)->get();

            return response()->json([
                'success' => true,
                'data' => $clubs,
                'total' => $clubs->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la recherche',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
