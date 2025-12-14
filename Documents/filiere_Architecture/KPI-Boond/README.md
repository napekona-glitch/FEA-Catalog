# Boond KPI Reporter

Application de reporting KPI pour BoondManager.

## Prérequis

- Node.js (version 14 ou supérieure)
- Compte BoondManager avec accès API
- Clé API BoondManager

## Installation

1. Cloner le dépôt :
   ```bash
   git clone [URL_DU_REPO]
   cd KPI-Boond
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement :
   - Copier le fichier `.env.example` vers `.env`
   - Remplacer `votre_cle_api_boond` par votre véritable clé API BoondManager

## Utilisation

1. Démarrer le serveur :
   ```bash
   npm start
   ```

2. Accéder aux KPI :
   - API REST : `http://localhost:3000/api/kpis`

## Fonctionnalités

- Récupération des opportunités BoondManager
- Calcul de KPI de base (taux de conversion, opportunités gagnées/perdues)
- Planification de tâches pour le calcul automatique des KPI
- API REST pour l'accès aux données

## Configuration

Le fichier `.env` contient les paramètres de configuration :

```
# Configuration BoondManager API
BOOND_API_URL=https://api.boondmanager.com
BOOND_API_KEY=votre_cle_api_boond

# Configuration du serveur
PORT=3000
NODE_ENV=development
```

## Développement

Pour le développement avec rechargement automatique :

```bash
npm install -g nodemon
nodemon index.js
```

## Prochaines étapes

- Ajouter l'authentification
- Implémenter plus de KPI
- Ajouter une interface utilisateur
- Configurer une base de données pour le stockage des historiques
- Exporter les rapports au format PDF/Excel
