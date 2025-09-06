<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Visiteur;
use App\Models\Client;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

class VisiteurConversionTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    // public function test_visiteur_can_be_converted_to_client()
    // {
    //     // Créer un visiteur
    //     $visiteur = Visiteur::create([
    //         'CIN' => 'TEST123',
    //         'Nom' => 'Test',
    //         'Prenom' => 'User',
    //         'Telephone' => '0612345678',
    //         'Date_Visite' => now(),
    //         'status' => 'Nouveau',
    //         'Commerciale' => 'Test Commercial',
    //         'Source_d_information' => 'Internet',
    //         'Intérêt_principal_' => 'Fitness'
    //     ]);

    //     // Données de conversion
    //     $conversionData = [
    //         'Code_Club' => 'CLUB-TEST-123456',
    //         'Club' => 'Club Test',
    //         'Email' => 'test@example.com',
    //         'Sexe' => 1,
    //         'Type_Client' => 'standard',
    //         'Adresse' => '123 Test Street',
    //         'Date_Naissance' => '1990-01-01',
    //         'Notes' => 'Test conversion'
    //     ];

    //     // Appeler l'API de conversion
    //     $response = $this->postJson("/api/visiteurs/{$visiteur->CIN}/convert", $conversionData);

    //     // Vérifier la réponse
    //     $response->assertStatus(201)
    //             ->assertJson([
    //                 'success' => true,
    //                 'message' => 'Visiteur converti en client avec succès'
    //             ]);

    //     // Vérifier que le client a été créé
    //     $this->assertDatabaseHas('Client', [
    //         'CIN' => 'TEST123',
    //         'Email' => 'test@example.com',
    //         'Club' => 'Club Test'
    //     ]);

    //     // Vérifier que le statut du visiteur a été mis à jour
    //     $this->assertDatabaseHas('Visiteur', [
    //         'CIN' => 'TEST123',
    //         'status' => 'Converti'
    //     ]);
    // }

    // public function test_cannot_convert_already_converted_visiteur()
    // {
    //     // Créer un visiteur déjà converti
    //     $visiteur = Visiteur::create([
    //         'CIN' => 'TEST456',
    //         'Nom' => 'Test',
    //         'Prenom' => 'User',
    //         'Telephone' => '0612345678',
    //         'Date_Visite' => now(),
    //         'status' => 'Converti',
    //         'Commerciale' => 'Test Commercial',
    //         'Source_d_information' => 'Internet',
    //         'Intérêt_principal_' => 'Fitness'
    //     ]);

    //     // Créer un client existant
    //     Client::create([
    //         'CIN' => 'TEST456',
    //         'Code_Club' => 'CLUB-TEST-789',
    //         'Club' => 'Club Test',
    //         'Email' => 'existing@example.com',
    //         'Sexe' => 1,
    //         'Type_Client' => 'standard',
    //         'Date_Inscription' => now(),
    //         'Status' => 'actif',
    //         'Adresse' => '123 Test Street',
    //         'Date_Naissance' => '1990-01-01'
    //     ]);

    //     // Données de conversion
    //     $conversionData = [
    //         'Code_Club' => 'CLUB-TEST-456789',
    //         'Club' => 'Club Test 2',
    //         'Email' => 'test2@example.com',
    //         'Sexe' => 0,
    //         'Type_Client' => 'premium',
    //         'Adresse' => '456 Test Street',
    //         'Date_Naissance' => '1990-01-01',
    //         'Notes' => 'Test conversion'
    //     ];

    //     // Appeler l'API de conversion
    //     $response = $this->postJson("/api/visiteurs/{$visiteur->CIN}/convert", $conversionData);

    //     // Vérifier que la conversion est refusée
    //     $response->assertStatus(400)
    //             ->assertJson([
    //                 'success' => false,
    //                 'message' => 'Ce visiteur est déjà client'
    //             ]);
    // }
}
