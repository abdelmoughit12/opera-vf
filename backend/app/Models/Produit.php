<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produit extends Model
{
    use HasFactory;

    protected $table = 'Produit';
    protected $primaryKey = 'ID_Produit';
    public $incrementing = true;

    protected $fillable = [
        'Nom_Produit',
        'Description',
        'Prix',
        'Stock',
        'Categorie',
        'Statut',
        'Image_URL',
        'Duree_Mois',
        'Type_Abonnement',
        'Conditions',
        'Avantages',
        'Restrictions',
        'Notes'
    ];

    protected $casts = [
        'Prix' => 'decimal:2',
        'Stock' => 'integer',
        'Duree_Mois' => 'decimal:1',
    ];

    // Relations
    public function ventes(): HasMany
    {
        return $this->hasMany(Vente::class, 'ID_Produit', 'ID_Produit');
    }

    // Scopes pour filtrer les produits
    public function scopeByCategorie($query, $categorie)
    {
        return $query->where('Categorie', $categorie);
    }

    public function scopeByStatut($query, $statut)
    {
        return $query->where('Statut', $statut);
    }

    public function scopeByPrixRange($query, $minPrix, $maxPrix)
    {
        return $query->whereBetween('Prix', [$minPrix, $maxPrix]);
    }

    public function scopeEnStock($query)
    {
        return $query->where('Stock', '>', 0);
    }

    public function scopeByTypeAbonnement($query, $type)
    {
        return $query->where('Type_Abonnement', $type);
    }

    public function scopeByDuree($query, $duree)
    {
        return $query->where('Duree_Mois', $duree);
    }

    // Accesseurs
    public function getPrixFormattedAttribute()
    {
        return number_format($this->Prix, 2, ',', ' ') . ' DH';
    }

    public function getStockStatusAttribute()
    {
        if ($this->Stock <= 0) {
            return 'Rupture';
        } elseif ($this->Stock <= 10) {
            return 'Faible';
        } else {
            return 'Disponible';
        }
    }

    public function getStockColorAttribute()
    {
        if ($this->Stock <= 0) {
            return 'red';
        } elseif ($this->Stock <= 10) {
            return 'yellow';
        } else {
            return 'green';
        }
    }

    public function getDureeFormattedAttribute()
    {
        if ($this->Duree_Mois == 0.5) {
            return '15 jours';
        } elseif ($this->Duree_Mois == 1) {
            return '1 mois';
        } else {
            return $this->Duree_Mois . ' mois';
        }
    }

    // Méthodes utilitaires
    public function isEnStock()
    {
        return $this->Stock > 0;
    }

    public function hasStockSuffisant($quantite)
    {
        return $this->Stock >= $quantite;
    }

    public function decrementerStock($quantite)
    {
        if ($this->hasStockSuffisant($quantite)) {
            $this->decrement('Stock', $quantite);
            return true;
        }
        return false;
    }

    public function incrementerStock($quantite)
    {
        $this->increment('Stock', $quantite);
    }

    public function isAbonnement()
    {
        return $this->Categorie === 'abonnement';
    }

    public function isPackFamille()
    {
        return $this->Categorie === 'pack_famille';
    }

    public function isPromotion()
    {
        return $this->Categorie === 'promotion';
    }
}
