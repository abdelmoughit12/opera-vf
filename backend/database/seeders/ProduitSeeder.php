<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Produit;

class ProduitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vider la table Produit
        DB::table('Produit')->truncate();

        // Créer des produits de test
        $produits = [
            // Abonnements
            [
                'Nom_Produit' => 'Abonnement Mensuel Standard',
                'Description' => 'Accès illimité au club pendant 1 mois',
                'Prix' => 300.00,
                'Stock' => 100,
                'Categorie' => 'abonnement',
                'Statut' => 'actif',
                'Image_URL' => 'https://example.com/abonnement-mensuel.jpg',
                'Duree_Mois' => 1.0,
                'Type_Abonnement' => 'standard',
                'Conditions' => 'Accès aux équipements de base',
                'Avantages' => 'Prix abordable, flexibilité mensuelle',
                'Restrictions' => 'Pas d\'accès aux services premium',
                'Notes' => 'Produit le plus populaire'
            ],
            [
                'Nom_Produit' => 'Abonnement Trimestriel Premium',
                'Description' => 'Accès premium pendant 3 mois avec 10% de réduction',
                'Prix' => 800.00,
                'Stock' => 50,
                'Categorie' => 'abonnement',
                'Statut' => 'actif',
                'Image_URL' => 'https://example.com/abonnement-trimestriel.jpg',
                'Duree_Mois' => 3.0,
                'Type_Abonnement' => 'premium',
                'Conditions' => 'Accès à tous les équipements et services',
                'Avantages' => 'Économies, accès premium, cours inclus',
                'Restrictions' => 'Engagement de 3 mois',
                'Notes' => 'Bon rapport qualité-prix'
            ],
            [
                'Nom_Produit' => 'Abonnement Semestriel VIP',
                'Description' => 'Accès VIP pendant 6 mois avec 15% de réduction',
                'Prix' => 1500.00,
                'Stock' => 30,
                'Categorie' => 'abonnement',
                'Statut' => 'actif',
                'Image_URL' => 'https://example.com/abonnement-semestriel.jpg',
                'Duree_Mois' => 6.0,
                'Type_Abonnement' => 'vip',
                'Conditions' => 'Accès VIP avec services exclusifs',
                'Avantages' => 'Économies importantes, services VIP, accompagnement personnalisé',
                'Restrictions' => 'Engagement de 6 mois',
                'Notes' => 'Pour les clients fidèles'
            ],
            [
                'Nom_Produit' => 'Abonnement Annuel Elite',
                'Description' => 'Accès Elite pendant 12 mois avec 20% de réduction',
                'Prix' => 5000.00,
                'Stock' => 20,
                'Categorie' => 'abonnement',
                'Statut' => 'actif',
                'Image_URL' => 'https://example.com/abonnement-annuel.jpg',
                'Duree_Mois' => 12.0,
                'Type_Abonnement' => 'elite',
                'Conditions' => 'Accès Elite avec tous les services inclus',
                'Avantages' => 'Économies maximales, services Elite, priorité absolue',
                'Restrictions' => 'Engagement de 12 mois',
                'Notes' => 'Meilleur rapport qualité-prix'
            ],

            // Packs Famille
            [
                'Nom_Produit' => 'Pack Famille 2 personnes',
                'Description' => 'Accès pour 2 membres de la même famille',
                'Prix' => 450.00,
                'Stock' => 40,
                'Categorie' => 'pack_famille',
                'Statut' => 'actif',
                'Image_URL' => 'https://example.com/pack-famille-2.jpg',
                'Duree_Mois' => 1.0,
                'Type_Abonnement' => 'famille_2',
                'Conditions' => '2 membres de la même famille',
                'Avantages' => 'Économies pour les couples',
                'Restrictions' => 'Membres de la même famille uniquement',
                'Notes' => 'Parfait pour les couples'
            ],
            [
                'Nom_Produit' => 'Pack Famille 4 personnes',
                'Description' => 'Accès pour 4 membres de la même famille',
                'Prix' => 800.00,
                'Stock' => 25,
                'Categorie' => 'pack_famille',
                'Statut' => 'actif',
                'Image_URL' => 'https://example.com/pack-famille-4.jpg',
                'Duree_Mois' => 1.0,
                'Type_Abonnement' => 'famille_4',
                'Conditions' => '4 membres de la même famille',
                'Avantages' => 'Économies importantes pour les familles',
                'Restrictions' => 'Membres de la même famille uniquement',
                'Notes' => 'Idéal pour les familles avec enfants'
            ],
            [
                'Nom_Produit' => 'Pack Famille 6 personnes',
                'Description' => 'Accès pour 6 membres de la même famille',
                'Prix' => 1100.00,
                'Stock' => 15,
                'Categorie' => 'pack_famille',
                'Statut' => 'actif',
                'Image_URL' => 'https://example.com/pack-famille-6.jpg',
                'Duree_Mois' => 1.0,
                'Type_Abonnement' => 'famille_6',
                'Conditions' => '6 membres de la même famille',
                'Avantages' => 'Économies maximales pour les grandes familles',
                'Restrictions' => 'Membres de la même famille uniquement',
                'Notes' => 'Pour les très grandes familles'
            ],

            // Promotions
            [
                'Nom_Produit' => 'Essai 15 jours',
                'Description' => 'Essai gratuit pendant 15 jours',
                'Prix' => 150.00,
                'Stock' => 100,
                'Categorie' => 'promotion',
                'Statut' => 'actif',
                'Image_URL' => 'https://example.com/essai-15-jours.jpg',
                'Duree_Mois' => 0.5,
                'Type_Abonnement' => 'essai',
                'Conditions' => 'Nouveaux clients uniquement',
                'Avantages' => 'Découverte du club à prix réduit',
                'Restrictions' => 'Une seule fois par personne',
                'Notes' => 'Excellent pour attirer de nouveaux clients'
            ],
            [
                'Nom_Produit' => 'Promo Étudiant Mensuel',
                'Description' => 'Abonnement mensuel avec réduction étudiant',
                'Prix' => 200.00,
                'Stock' => 80,
                'Categorie' => 'promotion',
                'Statut' => 'actif',
                'Image_URL' => 'https://example.com/promo-etudiant.jpg',
                'Duree_Mois' => 1.0,
                'Type_Abonnement' => 'etudiant',
                'Conditions' => 'Carte étudiant valide',
                'Avantages' => 'Prix réduit pour les étudiants',
                'Restrictions' => 'Carte étudiant obligatoire',
                'Notes' => 'Promotion étudiante permanente'
            ],
            [
                'Nom_Produit' => 'Promo Nouveau Client',
                'Description' => 'Premier mois à prix réduit pour nouveaux clients',
                'Prix' => 180.00,
                'Stock' => 60,
                'Categorie' => 'promotion',
                'Statut' => 'actif',
                'Image_URL' => 'https://example.com/promo-nouveau-client.jpg',
                'Duree_Mois' => 1.0,
                'Type_Abonnement' => 'nouveau_client',
                'Conditions' => 'Première inscription',
                'Avantages' => 'Prix d\'introduction',
                'Restrictions' => 'Une seule fois par personne',
                'Notes' => 'Pour fidéliser les nouveaux clients'
            ]
        ];

        foreach ($produits as $produit) {
            Produit::create($produit);
        }

        $this->command->info('Produits créés avec succès !');
    }
}
