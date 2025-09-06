<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Visiteur extends Model
{
    use HasFactory;

    protected $table = 'Visiteur';
    protected $primaryKey = 'CIN';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'CIN',
        'Nom',
        'Prenom',
        'Telephone',
        'Date_Visite',
        'status',
        'Remarque',
        'Commerciale',
        'Transferer_Date',
        'Source_d_information',
        'Intérêt_principal_'
    ];

    protected $casts = [
        'Date_Visite' => 'datetime',
        'Transferer_Date' => 'datetime',
    ];

    // Relations
    public function client(): HasOne
    {
        return $this->hasOne(Client::class, 'CIN', 'CIN');
    }

    // Scopes pour filtrer les visiteurs
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByCommerciale($query, $commerciale)
    {
        return $query->where('Commerciale', $commerciale);
    }

    public function scopeByDateRange($query, $dateDebut, $dateFin)
    {
        return $query->whereBetween('Date_Visite', [$dateDebut, $dateFin]);
    }

    public function scopeBySourceInfo($query, $source)
    {
        return $query->where('Source_d_information', $source);
    }

    // Accesseurs
    public function getFullNameAttribute()
    {
        return $this->Prenom . ' ' . $this->Nom;
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'nouveau' => 'blue',
            'intéressé' => 'yellow',
            'non_intéressé' => 'red',
            'contacté' => 'green',
            default => 'gray'
        };
    }

    // Méthodes utilitaires
    public function isInteresse()
    {
        return $this->status === 'intéressé';
    }

    public function isNouveau()
    {
        return $this->status === 'nouveau';
    }

    public function hasTransfert()
    {
        return !is_null($this->Transferer_Date);
    }
}

