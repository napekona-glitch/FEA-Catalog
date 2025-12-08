const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Configuration
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint proxy pour l'API Groq
app.post('/api/groq', async (req, res) => {
    try {
        const { model, messages, temperature, max_tokens } = req.body;
        
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model,
                messages,
                temperature,
                max_tokens
            })
        });

        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Erreur proxy:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Servir les fichiers statiques
app.use(express.static('.'));

app.listen(PORT, () => {
    console.log(`Serveur proxy démarré sur http://localhost:${PORT}`);
});
