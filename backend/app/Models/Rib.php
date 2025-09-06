<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rib extends Model
{
    use HasFactory;

    protected $table = 'Rib';
    protected $primaryKey = 'ID_Rib';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ID_Rib',
        'CIN',
        'Banque',
        'Agence',
        'Compte',
        'IBAN',
        'BIC',
        'Statut'
    ];

    protected $casts = [
        'Statut' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function client()
    {
        return $this->belongsTo(Client::class, 'CIN', 'CIN');
    }

    // Scope pour filtrer par client
    public function scopeByClient($query, $cin)
    {
        return $query->where('CIN', $cin);
    }

    public function setAsDefaut()
    {
        Rib::where('CIN', $this->CIN)
            ->where('ID_Rib', '!=', $this->ID_Rib)
            ->update(['Statut' => false]);

        $this->update(['Statut' => true]);
    }
}
