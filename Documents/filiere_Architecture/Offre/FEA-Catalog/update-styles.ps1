# Architecte : Napé Kona
# Script pour mettre à jour les fichiers HTML avec le nouveau style
$excludedFile = "FEA-catalogue_services.html"
$cssLink = '<link rel="stylesheet" href="css/catalog-style.css">'
$fontAwesomeLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">'
$googleFontLink = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">'

# Liste des fichiers HTML à mettre à jour
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -File | Where-Object { $_.Name -ne $excludedFile }

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Vérifier si le fichier a déjà été mis à jour
    if ($content -match "catalog-style\.css") {
        Write-Host "Le fichier $($file.Name) a déjà été mis à jour."
        continue
    }
    
    # Ajouter les liens CSS dans le <head>
    $newContent = $content -replace '(?i)<head>', "<head>`n    $cssLink`n    $fontAwesomeLink`n    $googleFontLink"
    
    # Supprimer les styles en ligne s'ils existent
    $newContent = $newContent -replace '(?s)<style>.*?</style>', ''
    
    # Supprimer les attributs de style en ligne
    $newContent = $newContent -replace '\s+style=".*?"', ''
    
    # Ajouter la structure de base si elle n'existe pas
    if (-not ($newContent -match '<body.*?>.*<div class="page">')) {
        $newContent = $newContent -replace '(?i)<body(.*?)>', '<body$1><div class="page">'
        $newContent = $newContent -replace '(?i)</body>', '  </div><!-- Fin .page -->
</body>'
    }
    
    # Ajouter la structure de contenu si elle n'existe pas
    if (-not ($newContent -match '<main.*?>')) {
        $newContent = $newContent -replace '(?i)<body(.*?)>', '<body$1>
    <div class="page">
        <header class="header">
            <div class="title-block">
                <h1>Titre de la page</h1>
            </div>
            <a href="index.html" class="back-link">
                <i class="fas fa-arrow-left"></i>
                Retour à l''accueil
            </a>
        </header>
        
        <main class="content">
            <div class="facts">
                <div class="fact-card">
                    <h3><i class="fas fa-info-circle"></i> Titre de la section</h3>
                    <p>Contenu de la section</p>
                </div>
            </div>
            
            <div class="icon-card">
                <i class="fas fa-cube"></i>
            </div>
        </main>
        
        <footer class="footer">
            <span>© 2025 Votre Entreprise. Tous droits réservés.</span>
        </footer>'
    }
    
    # Écrire le contenu mis à jour
    Set-Content -Path $file.FullName -Value $newContent
    Write-Host "Le fichier $($file.Name) a été mis à jour avec succès."
}
