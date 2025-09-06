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
        Schema::create('Client', function (Blueprint $table) {
            $table->string('CIN', 50)->primary();
            $table->string('Code_Club', 50);
            $table->string('Club', 100);
            $table->string('Email', 100)->unique();
            $table->boolean('Sexe');
            $table->string('Type_Client', 50);
            $table->date('Date_Inscription');
            $table->string('Status', 50)->default('en_attente');
            $table->string('Adresse', 255);
            $table->date('Date_Naissance');
            $table->text('Notes')->nullable();
            $table->timestamps();

            // Index
            $table->index('Code_Club');
            $table->index('Club');
            $table->index('Email');
            $table->index('Status');
            $table->index('Date_Inscription');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Client');
    }
};
