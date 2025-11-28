# Architecte : Napé Kona
$files = Get-ChildItem -Path . -Filter "*.html" -File -Recurse | Where-Object { $_.Name -ne "index.html" }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $updatedContent = $content -replace 'href=["'']FEA-catalogue_services\.html["'']', 'href="index.html"'
    
    # Vérifier si la modification est nécessaire
    if ($content -ne $updatedContent) {
        Set-Content -Path $file.FullName -Value $updatedContent -NoNewline
        Write-Host "Mise à jour effectuée : $($file.Name)"
    } else {
        Write-Host "Aucune modification nécessaire : $($file.Name)"
    }
}

Write-Host "Mise à jour des liens terminée."
