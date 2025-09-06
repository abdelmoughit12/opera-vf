<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Club extends Model
{
    use HasFactory;

    protected $table = 'Club';
    protected $primaryKey = 'ID_Club';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ID_Club',
        'Nom',
        'Code',
        'Adresse',
        'Ville',
        'Code_Postal',
        'Telephone',
        'Email',
        'Type_Club',
        'Statut',
        'Capacite_Max',
        'Date_Creation',
        'Description',
        'Site_Web',
        'Horaires_Ouverture',
        'Horaires_Fermeture',
        'Services',
        'Notes'
    ];

    protected $casts = [
        'Capacite_Max' => 'integer',
        'Date_Creation' => 'date',
    ];

    // Relations
    public function users(): HasMany
    {
        return $this->hasMany(Users::class, 'club', 'ID_Club');
        // clé étrangère = "club" dans User (MCD)
        // clé locale = "ID_Club"
    }

    /**
     * Un club peut avoir plusieurs clients (relation appartient).
     */
    public function clients(): HasMany
    {
        return $this->hasMany(Client::class, 'Code_Club', 'ID_Club');
    }

    /**
     * Retourne le nombre de clients dans le club.
     */
    public function countClients(): int
    {
        return $this->clients()->count();
    }

    /**
     * Retourne le nombre d'utilisateurs (admins / gestionnaires) du club.
     */
    public function countUsers(): int
    {
        return $this->users()->count();
    }

    /**
     * Vérifie si un client appartient à ce club.
     */
    public function hasClient($clientId): bool
    {
        return $this->clients()->where('id', $clientId)->exists();
    }

    /**
     * Récupère tous les emails des utilisateurs liés à ce club.
     */
    public function userEmails(): array
    {
        return $this->users()->pluck('email')->toArray();
    }

    // Scopes pour filtrer les clubs
    public function scopeByType($query, $type)
    {
        return $query->where('Type_Club', $type);
    }

    public function scopeByStatut($query, $statut)
    {
        return $query->where('Statut', $statut);
    }

    public function scopeByVille($query, $ville)
    {
        return $query->where('Ville', 'like', '%' . $ville . '%');
    }

    public function scopeByCapacite($query, $min, $max = null)
    {
        if ($max) {
            return $query->whereBetween('Capacite_Max', [$min, $max]);
        }
        return $query->where('Capacite_Max', '>=', $min);
    }

    public function scopeActifs($query)
    {
        return $query->where('Statut', 'actif');
    }
}
