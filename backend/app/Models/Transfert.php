<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transfert extends Model
{
    use HasFactory;

    protected $table = 'Transfert';
    protected $primaryKey = 'ID_Transfert';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ID_Transfert',
        'CIN_Client_Source',
        'CIN_Client_Cible',
        'Date_Transfert',
        'Frais',
        'Message'
    ];

    protected $casts = [
        'Frais' => 'decimal:2',
        'Date_Transfert' => 'date',
    ];

    // Relations
    public function clientSource(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'CIN_Client_Source', 'CIN');
    }

    public function clientCible(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'CIN_Client_Cible', 'CIN');
    }

    public function clients(): HasMany
    {
        return $this->hasMany(Client::class, 'ID_Transfert', 'ID_Transfert');
    }

    // Scopes
    public function scopeByDateRange($query, $dateDebut, $dateFin)
    {
        return $query->whereBetween('Date_Transfert', [$dateDebut, $dateFin]);
    }

    public function scopeByClient($query, $cin)
    {
        return $query->where(function ($q) use ($cin) {
            $q->where('CIN_Client_Source', $cin)
              ->orWhere('CIN_Client_Cible', $cin);
        });
    }

    public function scopeByClientSource($query, $cin)
    {
        return $query->where('CIN_Client_Source', $cin);
    }

    public function scopeByClientCible($query, $cin)
    {
        return $query->where('CIN_Client_Cible', $cin);
    }

    public function scopeByFraisRange($query, $minFrais, $maxFrais)
    {
        return $query->whereBetween('Frais', [$minFrais, $maxFrais]);
    }

    public function scopeWithFrais($query)
    {
        return $query->whereNotNull('Frais')->where('Frais', '>', 0);
    }

    public function scopeWithoutFrais($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('Frais')->orWhere('Frais', 0);
        });
    }

    // Accesseurs
    public function getFraisFormattedAttribute()
    {
        if ($this->Frais) {
            return number_format($this->Frais, 2, ',', ' ') . ' DH';
        }
        return 'Gratuit';
    }

    public function getMessageCourtAttribute()
    {
        if (strlen($this->Message) > 100) {
            return substr($this->Message, 0, 100) . '...';
        }
        return $this->Message;
    }

    public function getDureeDepuisTransfertAttribute()
    {
        return $this->Date_Transfert->diffForHumans();
    }

    public function getTypeTransfertAttribute()
    {
        if ($this->Frais && $this->Frais > 0) {
            return 'Payant';
        }
        return 'Gratuit';
    }

    // Méthodes utilitaires
    public function hasFrais()
    {
        return !is_null($this->Frais) && $this->Frais > 0;
    }

    public function isGratuit()
    {
        return !$this->hasFrais();
    }

    public function getClientSourceInfo()
    {
        if ($this->clientSource) {
            return [
                'cin' => $this->clientSource->CIN,
                'nom' => $this->clientSource->full_name,
                'club' => $this->clientSource->Club,
                'email' => $this->clientSource->Email
            ];
        }
        return null;
    }

    public function getClientCibleInfo()
    {
        if ($this->clientCible) {
            return [
                'cin' => $this->clientCible->CIN,
                'nom' => $this->clientCible->full_name,
                'club' => $this->clientCible->Club,
                'email' => $this->clientCible->Email
            ];
        }
        return null;
    }

    public function getMontantTotal()
    {
        return $this->Frais ?? 0;
    }

    public function isRecent()
    {
        return $this->Date_Transfert->diffInDays(now()) <= 30;
    }

    public function getStatutColor()
    {
        if ($this->isRecent()) {
            return 'green';
        } elseif ($this->Date_Transfert->diffInDays(now()) <= 90) {
            return 'yellow';
        } else {
            return 'gray';
        }
    }
}
