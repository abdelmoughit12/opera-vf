<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Club', function (Blueprint $table) {
            $table->string('ID_Club')->primary(); // clé primaire string
            $table->string('Nom', 100);
            $table->string('Code')->unique();     // Code unique
            $table->string('Adresse', 255);
            $table->string('Ville', 100);
            $table->string('Code_Postal', 10);
            $table->string('Telephone', 20);
            $table->string('Email', 100)->unique();
            $table->enum('Type_Club', ['standard', 'premium', 'vip', 'familial', 'sportif', 'bienetre']);
            $table->enum('Statut', ['actif', 'inactif', 'maintenance', 'ferme'])->default('actif');
            $table->integer('Capacite_Max');
            $table->date('Date_Creation');
            $table->text('Description')->nullable();
            $table->string('Site_Web', 255)->nullable();
            $table->string('Horaires_Ouverture', 10)->nullable();
            $table->string('Horaires_Fermeture', 10)->nullable();
            $table->text('Services')->nullable();
            $table->text('Notes')->nullable();
            $table->timestamps();                 // created_at et updated_at

            // Index
            $table->index('Type_Club');
            $table->index('Statut');
            $table->index('Ville');
            $table->index('Capacite_Max');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('Club');
    }
};
