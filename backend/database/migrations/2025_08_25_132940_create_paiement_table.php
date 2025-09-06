<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('Paiement', function (Blueprint $table) {
            $table->id('ID_Paiement');

            // Relation vers Vente
            $table->unsignedBigInteger('ID_Ventes');

            // Relation vers TypePaiement
            $table->unsignedBigInteger('ID_Type_Paiement')->nullable();

            // Champs principaux
            $table->decimal('Montant', 10, 2);
            $table->string('Mode_Paiement')->nullable(); // ⚠️ conservé pour compatibilité (déprécié ensuite)
            $table->enum('Statut', ['paye', 'en_attente', 'annule', 'rembourse'])->default('en_attente');
            $table->dateTime('Date_Paiement')->nullable();
            $table->string('Reference')->nullable();
            $table->text('Notes')->nullable();

            $table->timestamps();

            // Contraintes
            $table->foreign('ID_Ventes')
                ->references('ID_Ventes')
                ->on('Vente')
                ->onDelete('cascade');

            $table->foreign('ID_Type_Paiement')
                ->references('ID_Type_Paiement')
                ->on('Type_Paiement')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Paiement');
    }
};
