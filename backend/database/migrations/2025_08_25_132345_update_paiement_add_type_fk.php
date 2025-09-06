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
       Schema::table('Paiement', function (Blueprint $table) {
    if (!Schema::hasColumn('Paiement', 'ID_Type_Paiement')) {
        $table->unsignedBigInteger('ID_Type_Paiement')->nullable()->after('ID_Ventes');
    }

    if (!Schema::hasColumn('Paiement', 'Mode_Paiement')) {
        $table->string('Mode_Paiement', 50)->nullable()->after('ID_Type_Paiement');
    }

    // Foreign key
    $table->foreign('ID_Type_Paiement')
        ->references('ID_Type_Paiement')
        ->on('Type_Paiement')
        ->onDelete('set null');
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       Schema::table('Paiement', function (Blueprint $table) {
    $table->dropForeign(['ID_Type_Paiement']);
    if (Schema::hasColumn('Paiement', 'ID_Type_Paiement')) {
        $table->dropColumn('ID_Type_Paiement');
    }
});

    }
};
