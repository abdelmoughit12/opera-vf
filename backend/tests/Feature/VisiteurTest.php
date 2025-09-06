<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VisiteurTest extends TestCase
{
    use RefreshDatabase; // remet la base à zéro avant chaque test

    /** @test */
    public function un_visiteur_peut_etre_cree()
    {
        // Données valides pour la création
        $data = [
            'CIN' => 'AB123456',
            'Nom' => 'Ali',
            'Prenom' => 'Mohamed',
            'Telephone' => '0612345678',
            'Remarque' => 'Intéressé par une offre',
            'Date_Visite' => '2025-09-06',
            'status' => 'Nouveau',
            'Commerciale' => 'Karim',
            'Transferer_Date' => null,
            'Source_d_information' => 'Facebook',
            'Intérêt_principal_' => 'Abonnement annuel',
        ];

        // Envoi d'une requête POST à l'API
        $response = $this->postJson('/api/visiteurs', $data);

        // Vérification de la réponse
        $response->assertStatus(201)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Visiteur créé avec succès',
                 ]);

        // Vérification que le visiteur existe bien dans la base
        $this->assertDatabaseHas('visiteurs', [
            'CIN' => 'AB123456',
            'Nom' => 'Ali',
        ]);
    }

    /** @test */
    public function la_creation_echoue_si_champs_obligatoires_manquent()
    {
        // On oublie volontairement le champ CIN
        $data = [
            'Nom' => 'Ali',
            'Prenom' => 'Mohamed',
            'Telephone' => '0612345678',
            'Date_Visite' => '2025-09-06',
            'status' => 'Nouveau',
            'Commerciale' => 'Karim',
            'Source_d_information' => 'Facebook',
            'Intérêt_principal_' => 'Abonnement annuel',
        ];

        $response = $this->postJson('/api/visiteurs', $data);

        // Le contrôleur doit renvoyer une erreur 422
        $response->assertStatus(422)
                 ->assertJson([
                     'success' => false,
                     'message' => 'Données invalides',
                 ]);
    }
}
