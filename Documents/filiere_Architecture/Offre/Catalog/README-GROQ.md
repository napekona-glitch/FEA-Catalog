<!-- Architecte : Napé Kona -->
# Intégration Groq - Chatbot du Catalogue Architecture

## Configuration

1. **Obtenir une clé API Groq**
   - Créez un compte sur [https://groq.com/](https://groq.com/)
   - Allez dans la section API pour générer votre clé
   - Copiez votre clé API (commence par `gsk_`)

2. **Configurer la clé API**
   - Ouvrez le fichier `index.html`
   - Remplacez `gsk_YOUR_GROQ_API_KEY_HERE` par votre vraie clé API à la ligne 764
   - OU utilisez le fichier `groq-config.js` pour une configuration centralisée

## Modèles disponibles

- **mixtral-8x7b-32768**: Meilleur pour le français, très performant
- **llama2-70b-4096**: Excellent modèle général
- **gemma-7b-it**: Plus rapide et léger

## Fonctionnalités

### ✅ Avec Groq API configurée
- Réponses intelligentes et contextuelles
- Compréhension naturelle des questions
- Recommandations personnalisées
- Gestion des nuances et des questions complexes

### 🔄 Mode fallback (sans API)
- Réponses basées sur mots-clés
- Fonctionnement limité mais opérationnel
- Orientation vers les fiches détaillées

## Exemples d'utilisation

### Questions supportées :
- "Quelle offre pour migrer vers le cloud ?"
- "Comment mettre en place du Zero Trust ?"
- "Avez-vous des services autour de l'IA ?"
- "Quels sont vos tarifs ?"
- "Je veux moderniser mon infrastructure DevOps"

## Sécurité

⚠️ **Important**: Ne partagez jamais votre clé API Groq publiquement. Pour la production, utilisez un backend proxy.

## Dépannage

### Le chatbot répond de manière basique
- Vérifiez que votre clé API est correctement configurée
- Consultez la console du navigateur pour les erreurs
- Vérifiez votre connexion internet

### Erreur 401/403
- Votre clé API est invalide ou a expiré
- Générez une nouvelle clé sur Groq

### Erreur 429
- Trop de requêtes simultanées
- Patientez quelques instants avant de réessayer

### Erreur CORS
- L'API Groq doit être appelée depuis un backend en production
- Pour le développement, utilisez un navigateur moderne

## Architecture

```
User Input → Frontend → Groq API → LLM Response → Frontend → User
     ↓ (fallback)              ↑ (si erreur)
Keyword Matching → Basic Response
```

## Prochaines améliorations

- [ ] Backend proxy pour la production
- [ ] Cache des réponses fréquentes
- [ ] Analytics des questions utilisateurs
- [ ] Support multimodal (images, documents)
- [ ] Intégration voix synthétisée
