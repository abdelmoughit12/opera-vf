<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resiliation extends Model
{
    use HasFactory;

    protected $table = 'Resiliation';
    protected $primaryKey = 'ID_Resiliation';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ID_Resiliation',
        'Date_Resiliation',
        'Motif',
        'Montant_Remboursement',
        'ID_Ventes'
    ];

    protected $casts = [
        'Date_Resiliation' => 'date',
        'Montant_Remboursement' => 'decimal:2',
    ];

    // Relations
    public function vente(): BelongsTo
    {
        return $this->belongsTo(Vente::class, 'ID_Ventes', 'ID_Ventes');
    }

    // Scopes pour filtrer les résiliations
    public function scopeByDateRange($query, $dateDebut, $dateFin)
    {
        return $query->whereBetween('Date_Resiliation', [$dateDebut, $dateFin]);
    }

    public function scopeByMotif($query, $motif)
    {
        return $query->where('Motif', 'like', '%' . $motif . '%');
    }

    public function scopeByMontantRange($query, $minMontant, $maxMontant)
    {
        return $query->whereBetween('Montant_Remboursement', [$minMontant, $maxMontant]);
    }

    public function scopeWithRemboursement($query)
    {
        return $query->whereNotNull('Montant_Remboursement');
    }

    public function scopeWithoutRemboursement($query)
    {
        return $query->whereNull('Montant_Remboursement');
    }

    // Accesseurs
    public function getMontantRemboursementFormattedAttribute()
    {
        if ($this->Montant_Remboursement) {
            return number_format($this->Montant_Remboursement, 2, ',', ' ') . ' DH';
        }
        return 'Aucun remboursement';
    }

    public function getMotifCourtAttribute()
    {
        if (strlen($this->Motif) > 50) {
            return substr($this->Motif, 0, 50) . '...';
        }
        return $this->Motif;
    }

    public function getDureeDepuisResiliationAttribute()
    {
        return $this->Date_Resiliation->diffForHumans();
    }

    // Méthodes utilitaires
    public function hasRemboursement()
    {
        return !is_null($this->Montant_Remboursement) && $this->Montant_Remboursement > 0;
    }

    public function isRemboursementComplet()
    {
        if (!$this->hasRemboursement()) {
            return false;
        }

        // Vérifier si le montant de remboursement correspond au prix de la vente
        return $this->vente && $this->Montant_Remboursement >= $this->vente->prix;
    }

    public function getPourcentageRemboursement()
    {
        if (!$this->hasRemboursement() || !$this->vente) {
            return 0;
        }

        return round(($this->Montant_Remboursement / $this->vente->prix) * 100, 2);
    }

    public function getMotifsCommuns()
    {
        return [
            'insatisfaction' => 'Insatisfaction du service',
            'demenagement' => 'Déménagement',
            'financier' => 'Problèmes financiers',
            'technique' => 'Problèmes techniques',
            'personnel' => 'Raisons personnelles',
            'autre' => 'Autre'
        ];
    }
}
