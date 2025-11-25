// Architecte : Napé Kona
// Configuration pour l'intégration Groq
// Créez un compte sur https://groq.com/ pour obtenir votre clé API

const GROQ_CONFIG = {
    // Remplacez cette valeur par votre vraie clé API Groq
    apiKey: 'gsk_YOUR_GROQ_API_KEY_HERE',
    
    // Modèles disponibles sur Groq
    models: {
        mixtral: 'mixtral-8x7b-32768',    // Excellent pour le français, multilingue
        llama2: 'llama2-70b-4096',        // Modèle général puissant
        gemma: 'gemma-7b-it'              // Modèle léger et rapide
    },
    
    // Paramètres par défaut
    defaultParams: {
        temperature: 0.7,     // Créativité des réponses (0.0 = très prévisible, 1.0 = très créatif)
        max_tokens: 500,      // Longueur maximale de la réponse
        top_p: 0.9,          // Diversité des réponses
        stream: false         // Streaming désactivé pour le chatbot simple
    },
    
    // URL de l'API Groq
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions'
};

// Fonction pour vérifier que la clé API est configurée
function validateGroqConfig() {
    if (!GROQ_CONFIG.apiKey || GROQ_CONFIG.apiKey === 'gsk_YOUR_GROQ_API_KEY_HERE') {
        console.warn('⚠️ Clé API Groq non configurée. Le chatbot utilisera le mode basique.');
        return false;
    }
    return true;
}

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GROQ_CONFIG, validateGroqConfig };
}
