<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypePaiementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'Code' => 'especes',
                'Nom' => 'Espèces',
                'Icon' => '💵',
                'Description' => 'Paiement en espèces',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'Code' => 'cheque',
                'Nom' => 'Chèque',
                'Icon' => '🏦',
                'Description' => 'Paiement par chèque',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'Code' => 'carte',
                'Nom' => 'Carte bancaire',
                'Icon' => '💳',
                'Description' => 'Paiement par carte bancaire',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'Code' => 'virement',
                'Nom' => 'Virement bancaire',
                'Icon' => '🏛️',
                'Description' => 'Paiement par virement bancaire',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($types as $type) {
            DB::table('Type_Paiement')->updateOrInsert(
                ['Code' => $type['Code']], // éviter doublons
                $type
            );
        }
    }
}
