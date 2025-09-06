<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TypePaiement extends Model
{
    use HasFactory;

    protected $table = 'Type_Paiement';
    protected $primaryKey = 'ID_Type_Paiement';

    protected $fillable = ['Code','Nom','Icon','Description'];

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class, 'ID_Type_Paiement', 'ID_Type_Paiement');
    }
}
