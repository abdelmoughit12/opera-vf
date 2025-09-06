<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientTest extends TestCase
{
    use RefreshDatabase; // vide et recrée les tables avant chaque test

    /** @test */
    // public function un_client_peut_etre_cree()
    // {
    //     // 1. Envoyer une requête POST à ton API
    //     $response = $this->postJson('/api/clients', [
    //         'nom' => 'Ali',
    //         'prenom' => 'Mohamed',
    //         'email' => 'ali@example.com',
    //         'telephone' => '0600000000',
    //     ]);

    //     // 2. Vérifier la réponse HTTP
    //     $response->assertStatus(201)
    //              ->assertJson([
    //                  'message' => 'Client créé avec succès',
    //              ]);

    //     // 3. Vérifier que la base contient bien le client
    //     $this->assertDatabaseHas('clients', [
    //         'email' => 'ali@example.com'
    //     ]);
    // }

    // /** @test */
    // public function la_creation_client_echoue_si_email_est_manquant()
    // {
    //     // 1. Envoyer une requête POST sans email
    //     $response = $this->postJson('/api/clients', [
    //         'nom' => 'Ali',
    //         'prenom' => 'Mohamed',
    //         'telephone' => '0600000000',
    //     ]);

    //     // 2. Vérifier qu'une erreur 422 est renvoyée (erreur de validation)
    //     $response->assertStatus(422);
    // }
}
