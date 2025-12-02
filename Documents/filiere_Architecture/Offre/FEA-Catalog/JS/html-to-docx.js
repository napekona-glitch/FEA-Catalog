// Fonction pour télécharger la proposition commerciale en format Word (.docx)
// Cette fonction charge le contenu de la page PDF et le convertit en format Word

async function downloadAsWord() {
    try {
        // Trouver le lien PDF existant dans la page
        const pdfLink = document.querySelector('a[href^="pdf-"]');

        if (!pdfLink) {
            throw new Error('Lien PDF non trouvé dans la page');
        }

        // Extraire le nom du fichier PDF depuis le lien
        const pdfFileName = pdfLink.getAttribute('href');

        // Récupérer le titre pour le nom du fichier Word
        const ficheTitle = document.querySelector('h1').textContent.trim();

        //Afficher un message de chargement
        showLoadingMessage('Préparation du document Word...');

        // Charger le contenu du fichier PDF
        const response = await fetch(pdfFileName);

        if (!response.ok) {
            throw new Error(`Impossible de charger ${pdfFileName}`);
        }

        const htmlContent = await response.text();

        // Créer un élément temporaire pour parser le HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Extraire le contenu principal (tout le contenu des pages PDF)
        const pdfContent = doc.querySelector('#pdfContent') || doc.querySelector('.pdf-container');

        if (!pdfContent) {
            throw new Error('Contenu PDF non trouvé');
        }

        // Nettoyer le contenu (supprimer scripts, boutons, etc.)
        const contentClone = pdfContent.cloneNode(true);
        const elementsToRemove = contentClone.querySelectorAll('script, .button-container, .loading, #generatePdf');
        elementsToRemove.forEach(el => el.remove());

        // Créer le document HTML pour Word avec styles professionnels
        const wordHtml = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
<head>
    <meta charset='UTF-8'>
    <title>${ficheTitle} - Proposition Commerciale</title>
    <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #333; }
        .pdf-header h1 { color: #111827; font-size: 28pt; font-weight: 700; border-bottom: 4px solid #f5a623; padding-bottom: 10px; }
        .subtitle { font-size: 16pt; color: #f5a623; font-weight: 600; }
        .section-title, h2 { color: #f5a623; font-size: 18pt; font-weight: 700; margin-top: 30px; border-bottom: 2px solid #f5a623; padding-bottom: 8px; }
        h3 { color: #f5a623; font-size: 14pt; font-weight: 600; }
        .value-card { padding: 15px; margin: 10px; background: #f9fafb; border-left: 4px solid #f5a623; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f9fafb; color: #111827; padding: 12px; border-bottom: 2px solid #f5a623; }
        td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
        .pricing-box { background: #f5a623; color: white; padding: 25px; text-align: center; margin: 20px 0; }
        .timeline-item { margin-bottom: 20px; padding: 15px; background: #f9fafb; border-left: 4px solid #f5a623; }
        blockquote { font-style: italic; color: #111827; padding: 15px; background: #fffbf0; border-left: 4px solid #f5a623; }
        .pdf-page { page-break-after: always; margin-bottom: 40px; }
    </style>
</head>
<body>
    ${contentClone.innerHTML}
    <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #dee2e6; text-align: center; color: #6c757d; font-size: 9pt;">
        <p>© Wekey - Filière Excellence Architecture</p>
        <p>Document généré le ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
    </div>
</body>
</html>`;

        // Créer le Blob avec le contenu HTML formaté pour Word
        const blob = new Blob(['\ufeff', wordHtml], {
            type: 'application/msword'
        });

        // Créer un lien de téléchargement
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().split('T')[0];
        a.download = `Proposition-Commerciale-${ficheTitle.replace(/\s+/g, '-')}-${date}.doc`;
        document.body.appendChild(a);
        a.click();

        // Nettoyage
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        // Message de succès
        hideLoadingMessage();
        showSuccessMessage('Document Word téléchargé avec succès !');

    } catch (error) {
        console.error('Erreur lors de la génération du document Word:', error);
        hideLoadingMessage();
        showErrorMessage('Impossible de générer le document Word. Vérifiez que le fichier PDF existe.');
    }
}

// Fonction pour afficher un message de chargement
function showLoadingMessage(message) {
    // Supprimer le message existant s'il y en a un
    const existing = document.getElementById('word-loading-message');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.id = 'word-loading-message';
    div.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px 40px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
    `;
    div.innerHTML = `
        <div style="margin-bottom: 15px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #2980b9;"></i>
        </div>
        <div style="font-weight: 600; color: #333;">${message}</div>
    `;
    document.body.appendChild(div);
}

// Fonction pour masquer le message de chargement
function hideLoadingMessage() {
    const div = document.getElementById('word-loading-message');
    if (div) div.remove();
}

// Fonction pour afficher un message de succès
function showSuccessMessage(message) {
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
    `;
    div.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(div);

    setTimeout(() => div.remove(), 3000);
}

// Fonction pour afficher un message d'erreur
function showErrorMessage(message) {
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
    `;
    div.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    document.body.appendChild(div);

    setTimeout(() => div.remove(), 5000);
}
