<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Visiteur;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Client;
class VisiteurController extends Controller
{
    // Récupérer tous les clients avec filtres et pagination
   public function index(Request $request): JsonResponse
{
    try {
        $query = Visiteur::query();

        // Filtres
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }
        if ($request->filled('Source_d_information')) {
            $query->where('Source_d_information', 'like', '%' . $request->input('Source_d_information') . '%');
        }
        if ($request->filled('Date_Visite')) {
            $query->whereDate('Date_Visite', $request->input('Date_Visite'));
        }

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('Nom', 'like', "%{$search}%")
                  ->orWhere('Prenom', 'like', "%{$search}%")
                  ->orWhere('Telephone', 'like', "%{$search}%")
                  ->orWhere('CIN', 'like', "%{$search}%");
            });
        }

        // Tri sécurisé
        $allowedSortBy = ['created_at', 'Nom', 'Prenom', 'Date_Visite', 'status'];
        $sortBy = $request->get('sort_by', 'created_at');
        $sortBy = in_array($sortBy, $allowedSortBy) ? $sortBy : 'created_at';
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination sécurisée
        $perPage = min($request->get('per_page', 15), 100);
        $visiteurs = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $visiteurs
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la récupération des visiteurs',
            'error' => $e->getMessage()
        ], 500);
    }
}


    //Créer un nouveau client
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'CIN' => 'required|string|unique:visiteur,CIN',
                'Nom' => 'required|string|max:255',
                'Prenom' => 'required|string|max:255',
                'Telephone' => 'required|string|max:10',
                'Remarque' => 'nullable|string|max:255',
                'Date_Visite' => 'required|date',
                'status' => 'required|in:Nouveau,En cours,Converti,Perdu',
                'Commerciale' => 'required|string|max:155',
                'Transferer_Date' => 'nullable|date',
                'Source_d_information' => 'required|string|max:255',
                'Intérêt_principal_' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validatedData = $validator->validated();
            if (!isset($validatedData['status'])) {
                $validatedData['status'] = 'Nouveau';
            }

            $visiteur = Visiteur::create($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Visiteur créé avec succès',
                'data' => $visiteur
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du visiteur',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStatus(Request $request, $cin): JsonResponse
    {
        try {
            // Validation des données reçues
            $validator = Validator::make($request->all(), [
                'status' => 'required|in:Nouveau,En cours,Converti,Perdu'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Recherche du visiteur
            $visiteur = Visiteur::where('CIN', $cin)->first();

            if (!$visiteur) {
                return response()->json([
                    'success' => false,
                    'message' => 'Visiteur introuvable'
                ], 404);
            }

            // Mise à jour du statut
            $visiteur->status = $request->input('status');
            $visiteur->save();

            return response()->json([
                'success' => true,
                'message' => 'Statut mis à jour avec succès',
                'data' => $visiteur
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du statut',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function convertToClient(Request $request, $cin)
    {
        try {
            $visiteur = Visiteur::where('CIN', $cin)->firstOrFail();

            // Vérifier s’il est déjà client
            if (Client::where('CIN', $cin)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce visiteur est déjà client'
                ], 400);
            }

            // Validation des données nécessaires pour la conversion
           $validator = Validator::make($request->all(), [
                'Code_Club' => 'required|string|max:50',
                'Club' => 'required|string|max:100',
                'Email' => 'required|email|unique:Client,Email',
                'Sexe' => 'required|in:0,1,true,false',
                'Type_Client' => 'required|string|max:50',
                'Adresse' => 'required|string',
                'Status' => 'required|string|in:en_attente,actif,inactif,suspendu,resilié',
                'Date_Naissance' => 'required|date',
                'Notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données invalides',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();

            $client = Client::create([
                'CIN' => $visiteur->CIN,
                'Code_Club' => $validated['Code_Club'],
                'Club' => $validated['Club'],
                'Email' => $validated['Email'],
                'Sexe' => in_array($validated['Sexe'], ['1', 'true', 1, true]) ? 1 : 0,
                'Type_Client' => $validated['Type_Client'],
                'Date_Inscription' => now(),
                'Status' => $validated['Status'],
                'Adresse' => $validated['Adresse'],
                'Date_Naissance' => $validated['Date_Naissance'],
                'Notes' => $validated['Notes'] ?? null,
            ]);

            $visiteur->update(['status' => 'Converti']);

            return response()->json([
                'success' => true,
                'message' => 'Visiteur converti en client avec succès',
                'client'  => $client
            ], 201);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Visiteur introuvable'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la conversion : ' . $e->getMessage()
            ], 500);
        }
    }


}
