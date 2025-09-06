<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\Users;
use Laravel\Pail\ValueObjects\Origin\Console;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Connexion utilisateur
     */




public function login(Request $request)
{
    try {
        // 1. Validation basique
        if (!$request->email || !$request->password) {
            return response()->json([
                'message' => 'Email et mot de passe requis',
                'success' => false
            ], 400);
        }

        // 2. Recherche de l'utilisateur
        $user = Users::where('email', $request->email)
                   ->where('password', $request->password)
                   ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Identifiants incorrects',
                'success' => false
            ], 401);
        }

        // 3. Retourner la réponse sans session
        return response()->json([
            'message' => 'Connexion réussie',
            'success' => true,
            'user' => $user
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur serveur',
            'error' => $e->getMessage(),
            'success' => false
        ], 500);
    }
}


    /**
     * Inscription utilisateur
      */
    // public function register(Request $request)
    // {
    //     try {
    //         // Validation des données
    //         $validator = Validator::make($request->all(), [
    //             'name' => 'required|string|max:255',
    //             'email' => 'required|string|email|max:255|unique:users',
    //             'password' => 'required|string|min:6|confirmed',
    //         ]);

    //         if ($validator->fails()) {
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'Données invalides',
    //                 'errors' => $validator->errors()
    //             ], 422);
    //         }

    //         // Création de l'utilisateur
    //         $user = User::create([
    //             'name' => $request->name,
    //             'email' => $request->email,
    //             'password' => Hash::make($request->password),
    //         ]);

    //         // Création du token
    //         $token = $user->createToken('auth_token')->plainTextToken;

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Inscription réussie',
    //             'token' => $token,
    //             'user' => [
    //                 'id' => $user->id,
    //                 'name' => $user->name,
    //                 'email' => $user->email,
    //                 'created_at' => $user->created_at,
    //             ]
    //         ], 201);

    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Erreur serveur lors de l\'inscription',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    // /**
    //  * Déconnexion utilisateur
    //  */
    public function logout(Request $request)
    {
        try {
            // Supprimer le token actuel s'il existe
            $token = $request->user()?->currentAccessToken();
            if ($token) {
                $token->delete();
            }

            return response()->json([
                'success' => true,
                'message' => 'Déconnexion réussie'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la déconnexion',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // /**
    //  * Récupérer l'utilisateur actuel
    //  */
    // public function me(Request $request)
    // {
    //     return response()->json([
    //         'success' => true,
    //         'user' => $request->user()
    //     ]);
    // }

    /**
     * Mot de passe oublié (optionnel)
     */
    // public function forgotPassword(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'email' => 'required|email|exists:users,email',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Email invalide',
    //             'errors' => $validator->errors()
    //         ], 422);
    //     }

    //     // Ici vous pourriez implémenter l'envoi d'email
    //     // Pour l'instant, on retourne juste un message de succès

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Instructions envoyées par email'
    //     ], 200);
    // }

    /**
     * Réinitialiser le mot de passe (optionnel)
     */
    // public function resetPassword(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'email' => 'required|email|exists:users,email',
    //         'password' => 'required|string|min:6|confirmed',
    //         'token' => 'required|string',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Données invalides',
    //             'errors' => $validator->errors()
    //         ], 422);
    //     }

    //     // Ici vous implémenterez la logique de réinitialisation
    //     // Pour l'instant, on retourne juste un message de succès

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Mot de passe réinitialisé avec succès'
    //     ], 200);
    // }
}
