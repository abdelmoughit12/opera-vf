<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Vente extends Model
{
    use HasFactory;

    protected $table = 'Vente';
    protected $primaryKey = 'ID_Ventes';
    public $incrementing = true;

    protected $fillable = [
        'CIN',
        'ID_Produit',
        'Quantite',
        'Prix_Unitaire',
        'Montant_HT',
        'Remise',
        'Montant_Remise',
        'Montant_TTC',
        'Statut',
        'Date_Vente',
        'Notes',
        'Mode_Paiement',
        'Statut_Paiement'
    ];

    protected $casts = [
        'Date_Vente' => 'datetime',
        'Prix_Unitaire' => 'decimal:2',
        'Montant_HT' => 'decimal:2',
        'Montant_Remise' => 'decimal:2',
        'Montant_TTC' => 'decimal:2',
        'Remise' => 'decimal:2',
        'Quantite' => 'integer',
    ];

    // Relations
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'CIN', 'CIN');
    }

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'ID_Produit', 'ID_Produit');
    }

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class, 'ID_Ventes', 'ID_Ventes');
    }

    // Scopes pour filtrer les ventes
    public function scopeByStatus($query, $status)
    {
        return $query->where('Statut', $status);
    }

    public function scopeByClient($query, $cin)
    {
        return $query->where('CIN', $cin);
    }

    public function scopeByProduit($query, $produitId)
    {
        return $query->where('ID_Produit', $produitId);
    }

    public function scopeByDateRange($query, $dateDebut, $dateFin)
    {
        return $query->whereBetween('Date_Vente', [$dateDebut, $dateFin]);
    }

    public function scopeByPaiement($query, $statutPaiement)
    {
        return $query->where('Statut_Paiement', $statutPaiement);
    }

    // Accesseurs
    public function getPrixFinalAttribute()
    {
        if ($this->Remise > 0) {
            return $this->Montant_TTC;
        }
        return $this->Montant_HT;
    }

    public function getPrixFormattedAttribute()
    {
        return number_format($this->Montant_TTC, 2, ',', ' ') . ' DH';
    }

    public function getStatusLabelAttribute()
    {
        return match($this->Statut) {
            'confirmee' => 'Confirmée',
            'annulee' => 'Annulée',
            'en_attente' => 'En attente',
            default => 'Inconnu'
        };
    }

    public function getStatusColorAttribute()
    {
        return match($this->Statut) {
            'confirmee' => 'green',
            'annulee' => 'red',
            'en_attente' => 'yellow',
            default => 'gray'
        };
    }

    // Méthodes utilitaires
    public function isConfirmee()
    {
        return $this->Statut === 'confirmee';
    }

    public function isAnnulee()
    {
        return $this->Statut === 'annulee';
    }

    public function isEnAttente()
    {
        return $this->Statut === 'en_attente';
    }

    public function isPayee()
    {
        return $this->Statut_Paiement === 'paye';
    }

    public function hasRemise()
    {
        return $this->Remise > 0;
    }

    public function getRemiseMontant()
    {
        return $this->Montant_Remise;
    }
}
