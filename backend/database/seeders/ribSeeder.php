<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rib;

class ribSeeder extends Seeder
{
    public function run()
    {
        Rib::create([
            'Banque' => 'Attijariwafa Bank',
            'Agence' => 'Ag. Rabat Centre',
            'Compte' => '1234567890',
            'IBAN' => 'MA64000110009000000001312345',
            'BIC' => 'BCMAFRPP',
            'Statut' => true,
            'CIN' => 'dn52625',
        ]);

        Rib::create([
            'Banque' => 'Banque Populaire',
            'Agence' => 'Ag. Casa Maarif',
            'Compte' => '9876543210',
            'IBAN' => 'MA64000110009000000001354321',
            'BIC' => 'BPMAMAMC',
            'Statut' => false,
            'CIN' => 'kd5466',
        ]);

        Rib::create([
            'Banque' => 'BMCE Bank',
            'Agence' => 'Ag. Fès Centre',
            'Compte' => '1122334455',
            'IBAN' => 'MA64000110009000000001398765',
            'BIC' => 'BMCEMAMC',
            'Statut' => true,
            'CIN' => 'cn4532',
        ]);
    }
}
