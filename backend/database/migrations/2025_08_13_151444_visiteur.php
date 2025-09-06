<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('Visiteur', function (Blueprint $table) {
            $table->string('CIN', 50)->primary(); // Clé primaire string
            $table->string('Nom', 100);
            $table->string('Prenom', 100);
            $table->string('Telephone', 20);
            $table->dateTime('Date_Visite');
            $table->string('status', 50); // Ex: nouveau, intéressé, etc.
            $table->text('Remarque')->nullable();
            $table->string('Commerciale', 100)->nullable();
            $table->dateTime('Transferer_Date')->nullable();
            $table->string('Source_d_information', 100)->nullable();
            $table->string('Intérêt_principal_', 100)->nullable();

            // Timestamps si nécessaire (non spécifié dans votre modèle)
            $table->timestamps();

            // Index pour les champs fréquemment recherchés
            $table->index('status');
            $table->index('Commerciale');
            $table->index('Date_Visite');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Visiteur');
    }
};
