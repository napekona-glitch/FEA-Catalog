# Architecte : Napé Kona
# Script pour désactiver les chatbots dans toutes les fiches de service
# Garde seulement le chatbot principal du catalogue

# Liste des fichiers de fiches à traiter
$fiches = @(
    "api-management-integration.html",
    "architecture-data-mesh.html", 
    "audit-qualite-logicielle.html",
    "ci-cd-industrialisation.html",
    "infrastructure-as-code.html",
    "migration-cloud-hybride.html",
    "mlops-ia-industrielle.html",
    "modernisation-digital-workplace.html",
    "monolithe-microservices.html",
    "observabilite-monitoring.html",
    "pca-pra-continuite.html",
    "rag-ia-generative-responsable.html",
    "sd-wan-sase.html",
    "urbanisation-si.html",
    "zero-trust-iam.html"
)

Write-Host "Desactivation des chatbots dans les fiches de service..." -ForegroundColor Green

foreach ($fiche in $fiches) {
    $filePath = $fiche
    
    if (Test-Path $filePath) {
        Write-Host "Traitement de: $fiche" -ForegroundColor Yellow
        
        # Lire le contenu du fichier
        $content = Get-Content $filePath -Raw
        
        # Commenter toute la section du chatbot
        $content = $content -replace '(<!-- Chatbot Widget -->)(.*?)(</script>)', '<!-- Chatbot Widget temporairement desactive - utilisez le chatbot du catalogue principal --><!-- $1$2$3 -->'
        
        # Sauvegarder les modifications
        $content | Out-File $filePath -Encoding UTF8
        Write-Host "Chatbot desactive dans: $fiche" -ForegroundColor Green
    } else {
        Write-Host "Fichier non trouve: $fiche" -ForegroundColor Red
    }
}

Write-Host "Operation terminee ! Les chatbots des fiches ont ete desactives." -ForegroundColor Cyan
Write-Host "Seul le chatbot principal du catalogue (index.html) reste actif." -ForegroundColor Cyan
