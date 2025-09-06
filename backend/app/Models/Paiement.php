<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paiement extends Model
{
    use HasFactory;

    protected $table = 'Paiement';
    protected $primaryKey = 'ID_Paiement';
    public $incrementing = true;

        public $timestamps = false; // 🚫 désactive created_at/updated_at

    // ✅ valeurs acceptées (pour validation côté contrôleur)
    public const STATUTS = ['paye', 'en_attente', 'annule', 'rembourse'];
    public const MODES   = ['especes', 'cheque', 'carte', 'virement']; // 'carte_bancaire' sera normalisé -> 'carte'

  protected $fillable = [
    'ID_Paiement',
    'type_paiement',
    'Date_paiement',  // Note: lowercase 'p'
    'Montant',
    'compte',
    'Banque',
    'status',
    'ID_Ventes',
];

    protected $casts = [
        'Montant' => 'decimal:2',
        'Date_Paiement' => 'datetime',
    ];

    protected $appends = [
        'montant_formatted',
        'statut_label',
        'statut_color',
        'mode_paiement_label',
        'mode_icon',
    ];

    /* -------------------- Relations -------------------- */

    public function vente(): BelongsTo
    {
        return $this->belongsTo(Vente::class, 'ID_Ventes', 'ID_Ventes');
    }

    public function typePaiement(): BelongsTo
    {
        return $this->belongsTo(TypePaiement::class, 'ID_Type_Paiement', 'ID_Type_Paiement');
    }

    /* -------------------- Scopes -------------------- */

    public function scopeByStatut($query, $statut)
    {
        return $query->where('Statut', $statut);
    }

    public function scopeByModePaiement($query, $mode)
    {
        // on accepte 'carte_bancaire' -> normaliser en 'carte'
        $normalized = $mode === 'carte_bancaire' ? 'carte' : $mode;
        return $query->where(function ($q) use ($normalized) {
            $q->where('Mode_Paiement', $normalized)
              ->orWhere('Mode_Paiement', $normalized === 'carte' ? 'carte_bancaire' : $normalized);
        });
    }

    public function scopeByDateRange($query, $dateDebut, $dateFin)
    {
        return $query->whereBetween('Date_Paiement', [$dateDebut, $dateFin]);
    }

    public function scopeByVente($query, $venteId)
    {
        return $query->where('ID_Ventes', $venteId);
    }

    /* -------------------- Accessors (API) -------------------- */

    public function getMontantFormattedAttribute()
    {
        return number_format((float)$this->Montant, 2, ',', ' ') . ' DH';
    }

    public function getStatutLabelAttribute()
    {
        return match($this->Statut) {
            'paye' => 'Payé',
            'en_attente' => 'En attente',
            'annule' => 'Annulé',
            'rembourse' => 'Remboursé',
            default => 'Inconnu'
        };
    }

    public function getStatutColorAttribute()
    {
        return match($this->Statut) {
            'paye' => 'green',
            'en_attente' => 'yellow',
            'annule' => 'red',
            'rembourse' => 'blue',
            default => 'gray'
        };
    }

    public function getModePaiementLabelAttribute()
    {
        // priorité à la table Type_Paiement si liée
        if ($this->relationLoaded('typePaiement') && $this->typePaiement) {
            return $this->typePaiement->Nom;
        }

        // fallback si pas de type lié (compatibilité)
        $value = $this->Mode_Paiement === 'carte_bancaire' ? 'carte' : $this->Mode_Paiement;
        return match($value) {
            'especes' => 'Espèces',
            'carte'   => 'Carte bancaire',
            'cheque'  => 'Chèque',
            'virement'=> 'Virement bancaire',
            default   => 'Inconnu'
        };
    }

    public function getModeIconAttribute()
    {
        if ($this->relationLoaded('typePaiement') && $this->typePaiement) {
            return $this->typePaiement->Icon;
        }

        // fallback si pas de type lié
        $value = $this->Mode_Paiement === 'carte_bancaire' ? 'carte' : $this->Mode_Paiement;
        return match($value) {
            'especes' => '💵',
            'cheque'  => '🏦',
            'carte'   => '💳',
            'virement'=> '🏛️',
            default   => '💲'
        };
    }

    /* -------------------- Helpers -------------------- */

    public function isPaye()       { return $this->Statut === 'paye'; }
    public function isEnAttente()  { return $this->Statut === 'en_attente'; }
    public function isAnnule()     { return $this->Statut === 'annule'; }
    public function isRembourse()  { return $this->Statut === 'rembourse'; }

    public function canBeRembourse()
    {
        return $this->isPaye() && !$this->isRembourse();
    }

    public function canBeAnnule()
    {
        return $this->isEnAttente();
    }
}
