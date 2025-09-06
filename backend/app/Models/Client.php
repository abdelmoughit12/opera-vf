<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Client extends Model
{
    use HasFactory;

    protected $table = 'Client';
    protected $primaryKey = 'CIN';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'CIN',
        'Code_Club',
        'Club',
        'Email',
        'Sexe',
        'Type_Client',
        'Date_Inscription',
        'Status',
        'Adresse',
        'Date_Naissance',
        'Notes',
        'ID_Transfert',
        'ID_Ventes'
    ];

    protected $casts = [
        'Sexe' => 'boolean',
        'Date_Inscription' => 'date',
        'Date_Naissance' => 'date',
    ];

    // Relations
    public function visiteur(): BelongsTo
    {
        return $this->belongsTo(Visiteur::class, 'CIN', 'CIN');
    }

    public function transfert(): BelongsTo
    {
        return $this->belongsTo(Transfert::class, 'ID_Transfert', 'ID_Transfert');
    }

    public function vente(): BelongsTo
    {
        return $this->belongsTo(Vente::class, 'ID_Ventes', 'ID_Ventes');
    }

    public function ribs(): HasMany
    {
        return $this->hasMany(Rib::class, 'CIN', 'CIN');
    }

    public function ribDefaut(): HasOne
    {
        return $this->hasOne(Rib::class, 'CIN', 'CIN')->where('Est_Defaut', true);
    }

    // Scopes pour filtrer les clients
    public function scopeByStatus($query, $status)
    {
        return $query->where('Status', $status);
    }

    public function scopeByTypeClient($query, $type)
    {
        return $query->where('Type_Client', $type);
    }

    public function scopeByClub($query, $club)
    {
        return $query->where('Club', $club);
    }

    public function scopeByCodeClub($query, $codeClub)
    {
        return $query->where('Code_Club', $codeClub);
    }

    public function scopeBySexe($query, $sexe)
    {
        return $query->where('Sexe', $sexe);
    }

    public function scopeByDateInscription($query, $dateDebut, $dateFin)
    {
        return $query->whereBetween('Date_Inscription', [$dateDebut, $dateFin]);
    }

    public function scopeByDateNaissance($query, $dateDebut, $dateFin)
    {
        return $query->whereBetween('Date_Naissance', [$dateDebut, $dateFin]);
    }

    // Accesseurs
    public function getFullNameAttribute()
    {
        if ($this->visiteur) {
            return $this->visiteur->Prenom . ' ' . $this->visiteur->Nom;
        }
        return 'Nom non disponible';
    }

    public function getTelephoneAttribute()
    {
        return $this->visiteur ? $this->visiteur->Telephone : null;
    }

    public function getSexeLabelAttribute()
    {
        return $this->Sexe ? 'Homme' : 'Femme';
    }

    public function getStatusColorAttribute()
    {
        return match($this->Status) {
            'actif' => 'green',
            'inactif' => 'red',
            'en_attente' => 'yellow',
            'suspendu' => 'orange',
            'resilié' => 'gray',
            default => 'blue'
        };
    }

    public function getTypeClientColorAttribute()
    {
        return match($this->Type_Client) {
            'vip' => 'purple',
            'premium' => 'blue',
            'standard' => 'gray',
            'gold' => 'yellow',
            'platinum' => 'cyan',
            default => 'gray'
        };
    }

    public function getAgeAttribute()
    {
        if (!$this->Date_Naissance) {
            return null;
        }
        return $this->Date_Naissance->age;
    }

    public function getAncienneteAttribute()
    {
        return $this->Date_Inscription->diffForHumans();
    }

    // Méthodes utilitaires
    public function isActif()
    {
        return $this->Status === 'actif';
    }

    public function isVip()
    {
        return in_array($this->Type_Client, ['vip', 'platinum', 'gold']);
    }

    public function hasRib()
    {
        return $this->ribs()->exists();
    }

    public function hasRibDefaut()
    {
        return $this->ribDefaut()->exists();
    }

    public function hasTransfert()
    {
        return !is_null($this->ID_Transfert);
    }

    public function hasVente()
    {
        return !is_null($this->ID_Ventes);
    }

    public function getVisiteurInfo()
    {
        if ($this->visiteur) {
            return [
                'nom' => $this->visiteur->Nom,
                'prenom' => $this->visiteur->Prenom,
                'telephone' => $this->visiteur->Telephone,
                'date_visite' => $this->visiteur->Date_Visite,
                'commerciale' => $this->visiteur->Commerciale,
                'source_info' => $this->visiteur->Source_d_information,
                'interet' => $this->visiteur->Intérêt_principal_
            ];
        }
        return null;
    }
    protected static function boot()
{
    parent::boot();

    static::creating(function ($client) {
        if (empty($client->Code_Club)) {
            // Générer un code unique basé sur la date + un ID aléatoire
            $client->Code_Club = 'CLUB-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));
        }
    });
}

}
