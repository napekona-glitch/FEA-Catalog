import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cron from 'node-cron';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de l'API BoondManager
const boondConfig = {
  baseURL: process.env.BOOND_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.BOOND_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Création d'une instance axios pour les appels API
const boondApi = axios.create(boondConfig);

// Exemple de fonction pour récupérer les opportunités
async function getOpportunities() {
  try {
    const response = await boondApi.get('/api/opportunities');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des opportunités:', error.message);
    throw error;
  }
}

// Exemple de fonction pour calculer des KPI
async function calculateKPIs() {
  try {
    const opportunities = await getOpportunities();
    
    // Exemple de calcul de KPI
    const kpis = {
      totalOpportunities: opportunities.data.length,
      wonOpportunities: opportunities.data.filter(opp => opp.attributes.state === 'WON').length,
      lostOpportunities: opportunities.data.filter(opp => opp.attributes.state === 'LOST').length,
      conversionRate: 0
    };
    
    kpis.conversionRate = kpis.totalOpportunities > 0 
      ? (kpis.wonOpportunities / kpis.totalOpportunities * 100).toFixed(2)
      : 0;
    
    return kpis;
  } catch (error) {
    console.error('Erreur lors du calcul des KPI:', error.message);
    throw error;
  }
}

// Planification des tâches récurrentes (exécution tous les jours à minuit)
cron.schedule('0 0 * * *', async () => {
  console.log('Exécution du calcul des KPI...');
  try {
    const kpis = await calculateKPIs();
    console.log('KPIs calculés avec succès:', kpis);
    // Ici, vous pourriez stocker ces KPI dans une base de données
    // ou les envoyer par email, etc.
  } catch (error) {
    console.error('Erreur lors de la tâche planifiée:', error);
  }
});

// Routes API
app.get('/api/kpis', async (req, res) => {
  try {
    const kpis = await calculateKPIs();
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des KPI' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`API KPI disponible sur http://localhost:${PORT}/api/kpis`);
});

export default app;
