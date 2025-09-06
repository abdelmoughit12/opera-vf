<?php
/**
 * Script de test pour vérifier l'API
 * Exécuter avec: php test_api.php
 */

// Configuration
$baseUrl = 'http://localhost:8000/api';

echo "🧪 Test de l'API Opera\n";
echo "=======================\n\n";

// Test 1: Vérifier que l'API est accessible
echo "1. Test de connectivité...\n";
$response = file_get_contents($baseUrl . '/produits');
if ($response === false) {
    echo "❌ Erreur: Impossible d'accéder à l'API\n";
    echo "   Vérifiez que le serveur Laravel est démarré\n";
    echo "   Commande: php artisan serve\n\n";
    exit(1);
}
echo "✅ API accessible\n\n";

// Test 2: Lister les produits
echo "2. Test de récupération des produits...\n";
$produits = json_decode($response, true);
if (isset($produits['data']['data'])) {
    $produitsList = $produits['data']['data'];
    echo "✅ " . count($produitsList) . " produits trouvés\n";
    foreach ($produitsList as $produit) {
        echo "   - {$produit['Nom_Produit']} ({$produit['Prix']} DH)\n";
    }
} else {
    echo "❌ Erreur: Format de réponse incorrect\n";
    print_r($produits);
}
echo "\n";

// Test 3: Lister les clients
echo "3. Test de récupération des clients...\n";
$response = file_get_contents($baseUrl . '/clients');
$clients = json_decode($response, true);
if (isset($clients['data']['data'])) {
    $clientsList = $clients['data']['data'];
    echo "✅ " . count($clientsList) . " clients trouvés\n";
    foreach ($clientsList as $client) {
        echo "   - {$client['CIN']} ({$client['Club']})\n";
    }
} else {
    echo "❌ Erreur: Format de réponse incorrect\n";
    print_r($clients);
}
echo "\n";

// Test 4: Tester la création d'une vente
echo "4. Test de création d'une vente...\n";
$venteData = [
    'CIN' => 'AB123456',
    'ID_Produit' => 1,
    'Quantite' => 1,
    'Prix_Unitaire' => 300.00,
    'Remise' => 0,
    'Mode_Paiement' => 'especes',
    'Statut_Paiement' => 'paye',
    'Notes' => 'Test via script',
    'Date_Vente' => date('Y-m-d H:i:s')
];

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode($venteData)
    ]
]);

$response = file_get_contents($baseUrl . '/ventes', false, $context);
$vente = json_decode($response, true);

if (isset($vente['success']) && $vente['success']) {
    echo "✅ Vente créée avec succès\n";
    echo "   ID: {$vente['data']['ID_Ventes']}\n";
    echo "   Montant: {$vente['data']['Montant_TTC']} DH\n";
} else {
    echo "❌ Erreur lors de la création de la vente\n";
    if (isset($vente['message'])) {
        echo "   Message: {$vente['message']}\n";
    }
    if (isset($vente['errors'])) {
        echo "   Erreurs de validation:\n";
        foreach ($vente['errors'] as $field => $errors) {
            echo "     - {$field}: " . implode(', ', $errors) . "\n";
        }
    }
}
echo "\n";

// Test 5: Vérifier les statistiques
echo "5. Test des statistiques...\n";
$response = file_get_contents($baseUrl . '/ventes/stats');
$stats = json_decode($response, true);
if (isset($stats['success']) && $stats['success']) {
    echo "✅ Statistiques récupérées\n";
    echo "   Total ventes: {$stats['data']['total']}\n";
    echo "   Montant total: {$stats['data']['montant_total']} DH\n";
} else {
    echo "❌ Erreur lors de la récupération des statistiques\n";
}
echo "\n";

echo "🎯 Tests terminés !\n";
echo "Si tous les tests sont verts, l'API fonctionne correctement.\n";
echo "Vous pouvez maintenant tester l'interface utilisateur.\n";
