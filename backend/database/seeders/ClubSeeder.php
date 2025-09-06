<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Club;

class ClubSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vider la table Club
        DB::table('Club')->truncate();

        // Créer des clubs de test
        $clubs = [
            [
                'ID_Club' => 'CLUB_STD_001',
                'Nom' => 'Club Standard Casablanca',
                'Code' => 'C0001',
                'Adresse' => '123 Rue de la Paix',
                'Ville' => 'Casablanca',
                'Code_Postal' => '20000',
                'Telephone' => '0522000001',
                'Email' => 'contact@clubstandard.ma',
                'Type_Club' => 'standard',
                'Statut' => 'actif',
                'Capacite_Max' => 100,
                'Date_Creation' => '2024-01-15',
                'Description' => 'Club de fitness standard avec équipements de base',
                'Site_Web' => 'https://clubstandard.ma',
                'Horaires_Ouverture' => '06:00',
                'Horaires_Fermeture' => '23:00',
                'Services' => 'Fitness, Cardio, Musculation',
                'Notes' => 'Club principal de Casablanca'
            ],
            [
                'ID_Club' => 'CLUB_VIP_001',
                'Nom' => 'Club VIP Premium Rabat',
                'Code' => 'C0002',
                'Adresse' => '456 Avenue Mohammed V',
                'Ville' => 'Rabat',
                'Code_Postal' => '10000',
                'Telephone' => '0537000002',
                'Email' => 'contact@clubvip.ma',
                'Type_Club' => 'vip',
                'Statut' => 'actif',
                'Capacite_Max' => 50,
                'Date_Creation' => '2024-02-20',
                'Description' => 'Club premium avec services exclusifs',
                'Site_Web' => 'https://clubvip.ma',
                'Horaires_Ouverture' => '07:00',
                'Horaires_Fermeture' => '22:00',
                'Services' => 'Fitness, Piscine, Sauna, Spa, Restaurant',
                'Notes' => 'Club VIP de Rabat'
            ],
            [
                'ID_Club' => 'CLUB_FAM_001',
                'Nom' => 'Club Familial Marrakech',
                'Code' => 'C0003',
                'Adresse' => '789 Boulevard Hassan II',
                'Ville' => 'Marrakech',
                'Code_Postal' => '40000',
                'Telephone' => '0524000003',
                'Email' => 'contact@clubfamilial.ma',
                'Type_Club' => 'familial',
                'Statut' => 'actif',
                'Capacite_Max' => 200,
                'Date_Creation' => '2024-03-10',
                'Description' => 'Club adapté aux familles avec activités pour tous âges',
                'Site_Web' => 'https://clubfamilial.ma',
                'Horaires_Ouverture' => '08:00',
                'Horaires_Fermeture' => '21:00',
                'Services' => 'Fitness, Piscine, Cours enfants, Garderie',
                'Notes' => 'Club familial de Marrakech'
            ],
            [
                'ID_Club' => 'CLUB_SPO_001',
                'Nom' => 'Club Sportif Agadir',
                'Code' => 'C0004',
                'Adresse' => '321 Avenue des Sports',
                'Ville' => 'Agadir',
                'Code_Postal' => '80000',
                'Telephone' => '0528000004',
                'Email' => 'contact@clubsportif.ma',
                'Type_Club' => 'sportif',
                'Statut' => 'actif',
                'Capacite_Max' => 150,
                'Date_Creation' => '2024-04-05',
                'Description' => 'Club spécialisé dans les sports et activités physiques',
                'Site_Web' => 'https://clubsportif.ma',
                'Horaires_Ouverture' => '06:30',
                'Horaires_Fermeture' => '22:30',
                'Services' => 'Fitness, Sports collectifs, Athlétisme, Natation',
                'Notes' => 'Club sportif d\'Agadir'
            ],
            [
                'ID_Club' => 'CLUB_BEN_001',
                'Nom' => 'Club Bien-être Fès',
                'Code' => 'C0005',
                'Adresse' => '654 Rue du Bien-être',
                'Ville' => 'Fès',
                'Code_Postal' => '30000',
                'Telephone' => '0535000005',
                'Email' => 'contact@clubbienetre.ma',
                'Type_Club' => 'bienetre',
                'Statut' => 'actif',
                'Capacite_Max' => 80,
                'Date_Creation' => '2024-05-12',
                'Description' => 'Club spécialisé dans le bien-être et la relaxation',
                'Site_Web' => 'https://clubbienetre.ma',
                'Horaires_Ouverture' => '08:00',
                'Horaires_Fermeture' => '20:00',
                'Services' => 'Yoga, Pilates, Méditation, Spa, Massages',
                'Notes' => 'Club bien-être de Fès'
            ]
        ];

        foreach ($clubs as $club) {
            Club::create($club);
        }

        $this->command->info('Clubs créés avec succès !');
    }
}
