<?php
/**
 * Script de test pour les API de configuration (Clubs et Produits)
 * Utilisez ce script pour tester les endpoints avant d'utiliser le frontend
 */

// Configuration
$baseUrl = 'http://localhost:8000/api';
$headers = [
    'Content-Type: application/json',
    'Accept: application/json'
];

echo "🧪 Test des API de Configuration\n";
echo "================================\n\n";

// Test des Clubs
echo "🏢 Test des API Clubs\n";
echo "----------------------\n";

// 1. Lister tous les clubs
echo "1. Lister tous les clubs...\n";
$response = makeRequest("$baseUrl/clubs", 'GET', null, $headers);
if ($response['success']) {
    echo "✅ Succès: " . count($response['data']) . " clubs trouvés\n";
    if (!empty($response['data'])) {
        $firstClub = $response['data'][0];
        echo "   Premier club: {$firstClub['Nom']} ({$firstClub['Type_Club']})\n";
    }
} else {
    echo "❌ Erreur: " . $response['error'] . "\n";
}

// 2. Créer un nouveau club
echo "\n2. Créer un nouveau club...\n";
$newClub = [
    'Nom' => 'Club Test API',
    'Type_Club' => 'standard',
    'Statut' => 'actif',
    'Adresse' => '123 Rue Test',
    'Ville' => 'Ville Test',
    'Code_Postal' => '12345',
    'Telephone' => '0612345678',
    'Email' => 'test@clubapi.com',
    'Capacite_Max' => 150,
    'Date_Creation' => date('Y-m-d'),
    'Description' => 'Club créé via test API',
    'Services' => 'Fitness, Cardio'
];

$response = makeRequest("$baseUrl/clubs", 'POST', $newClub, $headers);
if ($response['success']) {
    echo "✅ Succès: Club créé avec l'ID {$response['data']['ID_Club']}\n";
    $clubId = $response['data']['ID_Club'];
} else {
    echo "❌ Erreur: " . $response['error'] . "\n";
    $clubId = null;
}

// 3. Récupérer un club par ID
if ($clubId) {
    echo "\n3. Récupérer le club créé...\n";
    $response = makeRequest("$baseUrl/clubs/$clubId", 'GET', null, $headers);
    if ($response['success']) {
        echo "✅ Succès: Club récupéré - {$response['data']['Nom']}\n";
    } else {
        echo "❌ Erreur: " . $response['error'] . "\n";
    }
}

// 4. Modifier un club
if ($clubId) {
    echo "\n4. Modifier le club...\n";
    $updateData = [
        'Nom' => 'Club Test API Modifié',
        'Capacite_Max' => 200
    ];
    
    $response = makeRequest("$baseUrl/clubs/$clubId", 'PUT', $updateData, $headers);
    if ($response['success']) {
        echo "✅ Succès: Club modifié\n";
    } else {
        echo "❌ Erreur: " . $response['error'] . "\n";
    }
}

// 5. Statistiques des clubs
echo "\n5. Statistiques des clubs...\n";
$response = makeRequest("$baseUrl/clubs/stats", 'GET', null, $headers);
if ($response['success']) {
    echo "✅ Succès: Statistiques récupérées\n";
    echo "   Données: " . json_encode($response['data']) . "\n";
} else {
    echo "❌ Erreur: " . $response['error'] . "\n";
}

// Test des Produits
echo "\n\n📦 Test des API Produits\n";
echo "------------------------\n";

// 1. Lister tous les produits
echo "1. Lister tous les produits...\n";
$response = makeRequest("$baseUrl/produits", 'GET', null, $headers);
if ($response['success']) {
    echo "✅ Succès: " . count($response['data']) . " produits trouvés\n";
    if (!empty($response['data'])) {
        $firstProduit = $response['data'][0];
        echo "   Premier produit: {$firstProduit['Nom_Produit']} ({$firstProduit['Categorie']})\n";
    }
} else {
    echo "❌ Erreur: " . $response['error'] . "\n";
}

// 2. Créer un nouveau produit
echo "\n2. Créer un nouveau produit...\n";
$newProduit = [
    'Nom_Produit' => 'Produit Test API',
    'Description' => 'Produit créé via test API',
    'Prix' => 299.99,
    'Stock' => 50,
    'Categorie' => 'abonnement',
    'Statut' => 'actif',
    'Duree_Mois' => 3,
    'Type_Abonnement' => 'standard'
];

$response = makeRequest("$baseUrl/produits", 'POST', $newProduit, $headers);
if ($response['success']) {
    echo "✅ Succès: Produit créé avec l'ID {$response['data']['ID_Produit']}\n";
    $produitId = $response['data']['ID_Produit'];
} else {
    echo "❌ Erreur: " . $response['error'] . "\n";
    $produitId = null;
}

// 3. Récupérer un produit par ID
if ($produitId) {
    echo "\n3. Récupérer le produit créé...\n";
    $response = makeRequest("$baseUrl/produits/$produitId", 'GET', null, $headers);
    if ($response['success']) {
        echo "✅ Succès: Produit récupéré - {$response['data']['Nom_Produit']}\n";
    } else {
        echo "❌ Erreur: " . $response['error'] . "\n";
    }
}

// 4. Modifier un produit
if ($produitId) {
    echo "\n4. Modifier le produit...\n";
    $updateData = [
        'Prix' => 349.99,
        'Stock' => 75
    ];
    
    $response = makeRequest("$baseUrl/produits/$produitId", 'PUT', $updateData, $headers);
    if ($response['success']) {
        echo "✅ Succès: Produit modifié\n";
    } else {
        echo "❌ Erreur: " . $response['error'] . "\n";
    }
}

// 5. Rechercher des produits
echo "\n5. Rechercher des produits...\n";
$response = makeRequest("$baseUrl/produits?search=Test", 'GET', null, $headers);
if ($response['success']) {
    echo "✅ Succès: Recherche effectuée\n";
    echo "   Résultats: " . count($response['data']) . " produits trouvés\n";
} else {
    echo "❌ Erreur: " . $response['error'] . "\n";
}

// 6. Statistiques des produits
echo "\n6. Statistiques des produits...\n";
$response = makeRequest("$baseUrl/produits/stats", 'GET', null, $headers);
if ($response['success']) {
    echo "✅ Succès: Statistiques récupérées\n";
    echo "   Données: " . json_encode($response['data']) . "\n";
} else {
    echo "❌ Erreur: " . $response['error'] . "\n";
}

// Nettoyage - Supprimer les éléments de test
echo "\n\n🧹 Nettoyage des données de test\n";
echo "--------------------------------\n";

if ($clubId) {
    echo "Suppression du club de test...\n";
    $response = makeRequest("$baseUrl/clubs/$clubId", 'DELETE', null, $headers);
    if ($response['success']) {
        echo "✅ Succès: Club supprimé\n";
    } else {
        echo "❌ Erreur lors de la suppression: " . $response['error'] . "\n";
    }
}

if ($produitId) {
    echo "Suppression du produit de test...\n";
    $response = makeRequest("$baseUrl/produits/$produitId", 'DELETE', null, $headers);
    if ($response['success']) {
        echo "✅ Succès: Produit supprimé\n";
    } else {
        echo "❌ Erreur lors de la suppression: " . $response['error'] . "\n";
    }
}

echo "\n🎉 Tests terminés !\n";

/**
 * Fonction utilitaire pour faire des requêtes HTTP
 */
function makeRequest($url, $method, $data = null, $headers = []) {
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    } elseif ($method === 'PUT') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        if ($data) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
    } elseif ($method === 'DELETE') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    curl_close($ch);
    
    if ($error) {
        return ['success' => false, 'error' => "Erreur cURL: $error"];
    }
    
    $responseData = json_decode($response, true);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        return ['success' => true, 'data' => $responseData];
    } else {
        $errorMessage = isset($responseData['message']) ? $responseData['message'] : "Erreur HTTP $httpCode";
        return ['success' => false, 'error' => $errorMessage];
    }
}
?>
