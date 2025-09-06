<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Client;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Désactiver les contraintes de clé étrangère
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Vider la table Client
        DB::table('Client')->truncate();

        // Réactiver les contraintes de clé étrangère
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Créer des clients de test
        $clients = [
            [
                'CIN' => 'AB123456',
                'Code_Club' => 'CLUB_STD_001',
                'Club' => 'Club Standard Casablanca',
                'Email' => 'client1@example.com',
                'Sexe' => 1,
                'Type_Client' => 'standard',
                'Date_Inscription' => '2024-01-15',
                'Status' => 'actif',
                'Adresse' => '123 Rue de la Paix, Casablanca',
                'Date_Naissance' => '1990-05-15',
                'Notes' => 'Client standard'
            ],
            [
                'CIN' => 'CD789012',
                'Code_Club' => 'CLUB_VIP_001',
                'Club' => 'Club VIP Premium Rabat',
                'Email' => 'client2@example.com',
                'Sexe' => 0,
                'Type_Client' => 'vip',
                'Date_Inscription' => '2024-02-20',
                'Status' => 'actif',
                'Adresse' => '456 Avenue Mohammed V, Rabat',
                'Date_Naissance' => '1985-08-22',
                'Notes' => 'Client VIP'
            ],
            [
                'CIN' => 'EF345678',
                'Code_Club' => 'CLUB_FAM_001',
                'Club' => 'Club Familial Marrakech',
                'Email' => 'client3@example.com',
                'Sexe' => 1,
                'Type_Client' => 'premium',
                'Date_Inscription' => '2024-03-10',
                'Status' => 'actif',
                'Adresse' => '789 Boulevard Hassan II, Marrakech',
                'Date_Naissance' => '1992-12-10',
                'Notes' => 'Client familial'
            ],
            [
                'CIN' => 'GH901234',
                'Code_Club' => 'CLUB_SPO_001',
                'Club' => 'Club Sportif Agadir',
                'Email' => 'client4@example.com',
                'Sexe' => 0,
                'Type_Client' => 'standard',
                'Date_Inscription' => '2024-04-05',
                'Status' => 'actif',
                'Adresse' => '321 Avenue des Sports, Agadir',
                'Date_Naissance' => '1988-03-18',
                'Notes' => 'Client sportif'
            ],
            [
                'CIN' => 'IJ567890',
                'Code_Club' => 'CLUB_BEN_001',
                'Club' => 'Club Bien-être Fès',
                'Email' => 'client5@example.com',
                'Sexe' => 1,
                'Type_Client' => 'premium',
                'Date_Inscription' => '2024-05-12',
                'Status' => 'actif',
                'Adresse' => '654 Rue du Bien-être, Fès',
                'Date_Naissance' => '1995-07-25',
                'Notes' => 'Client bien-être'
            ]
        ];

        foreach ($clients as $client) {
            Client::create($client);
        }

        $this->command->info('Clients créés avec succès !');
    }
}
