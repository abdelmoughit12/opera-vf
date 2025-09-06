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
        Schema::create('Produit', function (Blueprint $table) {
            // Clé primaire auto-incrémentée
            $table->id('ID_Produit');

            // Informations du produit
            $table->string('Nom_Produit', 100);
            $table->text('Description')->nullable();
            $table->decimal('Prix', 15, 2);
            $table->integer('Stock')->default(0);
            $table->string('Categorie', 50);
            $table->string('Statut', 50)->default('actif');
            $table->string('Image_URL')->nullable();

            // Champs spécifiques aux abonnements
            $table->decimal('Duree_Mois', 4, 1)->default(1.0); // Durée en mois (peut être 0.5 pour 15 jours)
            $table->string('Type_Abonnement', 50)->nullable(); // Type d'abonnement (standard, premium, vip, etc.)

            // Champs supplémentaires
            $table->text('Conditions')->nullable();
            $table->text('Avantages')->nullable();
            $table->text('Restrictions')->nullable();
            $table->text('Notes')->nullable();

            // Timestamps
            $table->timestamps();

            // Index
            $table->index('Categorie');
            $table->index('Statut');
            $table->index('Prix');
            $table->index('Stock');
            $table->index('Duree_Mois');
            $table->index('Type_Abonnement');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Produit');
    }
};
