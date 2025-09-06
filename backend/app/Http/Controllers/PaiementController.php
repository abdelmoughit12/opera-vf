<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Paiement;
use App\Models\TypePaiement;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
class PaiementController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $paiements = Paiement::with('typePaiement', 'vente.produit', 'vente.client')->get();
            return response()->json(['success' => true, 'data' => $paiements]);
        } catch (\Exception $e) {
            Log::error('Erreur PaiementController@index: '.$e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur lors de la récupération des paiements', 'error' => $e->getMessage()], 500);
        }
    }
}
