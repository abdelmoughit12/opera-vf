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
        // Créer la table Vente après Client
        Schema::create('Vente', function (Blueprint $table) {
            $table->id('ID_Ventes');
            $table->string('CIN', 50);
            $table->integer('ID_Produit');
            $table->integer('Quantite');
            $table->decimal('Prix_Unitaire', 15, 2);
            $table->decimal('Montant_HT', 15, 2);
            $table->decimal('Remise', 5, 2)->default(0);
            $table->decimal('Montant_Remise', 15, 2)->default(0);
            $table->decimal('Montant_TTC', 15, 2);
            $table->string('Statut', 50)->default('en_attente');
            $table->datetime('Date_Vente');
            $table->text('Notes')->nullable();
            $table->string('Mode_Paiement', 50)->nullable();
            $table->string('Statut_Paiement', 50)->default('en_attente');
            $table->timestamps();

            // Index
            $table->index('CIN');
            $table->index('ID_Produit');
            $table->index('Statut');
            $table->index('Date_Vente');
            $table->index('Statut_Paiement');
        });

        // Créer la table Paiement après Vente
        Schema::create('Paiement', function (Blueprint $table) {
            $table->string('ID_Paiement', 50)->primary();
            $table->string('type_paiement', 120);
            $table->date('Date_paiement');
            $table->decimal('Montant', 15, 2);
            $table->integer('compte');
            $table->string('Banque', 50)->nullable();
            $table->boolean('status');
            $table->unsignedBigInteger('ID_Ventes');

            $table->foreign('ID_Ventes')->references('ID_Ventes')->on('Vente');
        });

        // Créer la table Transfert après Client
        Schema::create('Transfert', function (Blueprint $table) {
            $table->string('ID_Transfert', 50)->primary();
            $table->string('CIN_Client_Source', 50);
            $table->string('Code_Club_Destination', 50);
            $table->string('Club_Destination', 100);
            $table->date('Date_Demande');
            $table->string('Statut', 50)->default('en_attente');
            $table->text('Motif')->nullable();
            $table->date('Date_Validation')->nullable();
            $table->text('Notes')->nullable();
            $table->timestamps();

            $table->foreign('CIN_Client_Source')->references('CIN')->on('Client')->onDelete('restrict');
        });

        // Créer la table Rib après Client
        Schema::create('Rib', function (Blueprint $table) {
            $table->id('ID_Rib');
            $table->string('CIN', 50);
            $table->string('Banque', 100);
            $table->string('Agence', 100);
            $table->string('Compte', 100);
            $table->string('IBAN', 50)->nullable();
            $table->string('BIC', 20)->nullable();
            $table->boolean('Statut')->default(true);
            $table->timestamps();

            $table->foreign('CIN')->references('CIN')->on('Client')->onDelete('cascade');
        });

        // Créer la table Resiliation après Client
        Schema::create('Resiliation', function (Blueprint $table) {
            $table->id('ID_Resiliation');
            $table->string('CIN', 50);
            $table->date('Date_Resiliation');
            $table->string('Motif', 255);
            $table->string('Statut', 50)->default('en_cours');
            $table->text('Commentaires')->nullable();
            $table->timestamps();

            $table->foreign('CIN')->references('CIN')->on('Client')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Resiliation');
        Schema::dropIfExists('Rib');
        Schema::dropIfExists('Transfert');
        Schema::dropIfExists('Paiement');
        Schema::dropIfExists('Vente');
    }
};
