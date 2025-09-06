<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('Type_Paiement', function (Blueprint $table) {
            $table->id('ID_Type_Paiement');
            $table->string('Code')->unique();     // 'especes', 'cheque', 'carte', 'virement'
            $table->string('Nom');
            $table->string('Icon')->nullable();   // 💵 🏦 💳 🏛️
            $table->string('Description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Type_Paiement');
    }
};
