// Configuration des experts par page
const experts = {
    'architecte-entreprise': {
        name: 'Expert en Architecture d\'Entreprise',
        description: 'Je suis spécialisé en architecture d\'entreprise, avec une expertise en alignement stratégique des systèmes d\'information sur les objectifs métier.',
        expertise: [
            'Gouvernance SI',
            'Urbanisation des SI',
            'Transformation numérique',
            'Architecture cible',
            'Cartographie applicative'
        ]
    },
    'architecte-applicatif': {
        name: 'Expert en Architecture Applicative',
        description: 'Je me spécialise dans la conception et l\'optimisation des architectures logicielles.',
        expertise: [
            'Conception logicielle',
            'Patterns d\'architecture',
            'Microservices',
            'APIs',
            'Performance applicative'
        ]
    },
    'architecte-securite': {
        name: 'Expert en Sécurité',
        description: 'Je suis spécialisé dans la cybersécurité et la protection des systèmes d\'information.',
        expertise: [
            'Sécurité des applications',
            'Conformité',
            'Tests d\'intrusion',
            'Politiques de sécurité',
            'Gestion des identités'
        ]
    }
    // Ajoutez d'autres profils d'experts ici
};

class Chatbot {
    constructor() {
        this.messages = [];
        this.currentExpert = this.detectExpert();
        this.initialize();
    }

    detectExpert() {
        const path = window.location.pathname.split('/').pop().replace('.html', '');
        return experts[path] || {
            name: 'Expert Wekey',
            description: 'Je suis un expert Wekey spécialisé dans les métiers de l\'architecture et des technologies de l\'information.',
            expertise: ['Architecture SI', 'Technologies Cloud', 'Développement', 'Sécurité', 'Gestion de projet']
        };
    }

    initialize() {
        this.createChatUI();
        this.addWelcomeMessage();
        this.setupEventListeners();
    }

    createChatUI() {
        const chatContainer = document.createElement('div');
        chatContainer.id = 'chatbot-container';
        chatContainer.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-avatar">
                    <img src="../wekey-image.png" alt="${this.currentExpert.name}">
                </div>
                <div class="chatbot-info">
                    <h4>${this.currentExpert.name}</h4>
                    <p>${this.currentExpert.description}</p>
                    <div class="expertise-tags">
                        ${this.currentExpert.expertise.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                </div>
                <button id="minimize-chat">_</button>
                <button id="close-chat">×</button>
            </div>
            <div class="chatbot-messages" id="chat-messages"></div>
            <div class="chatbot-input">
                <input type="text" id="user-input" placeholder="Posez votre question..." />
                <button id="send-message">Envoyer</button>
            </div>
        `;
        document.body.appendChild(chatContainer);
    }

    addWelcomeMessage() {
        const welcomeMessage = `Bonjour ! Je suis ${this.currentExpert.name}. ${this.currentExpert.description} Comment puis-je vous aider aujourd'hui ?`;
        this.addMessage('assistant', welcomeMessage);
    }

    addMessage(role, content) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${role}-message`;
        messageElement.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', 'minute': '2-digit'})}</div>
        `;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Ajouter au tableau des messages pour l'historique
        this.messages.push({ role, content });
    }

    async processUserInput() {
        const input = document.getElementById('user-input');
        const userMessage = input.value.trim();
        
        if (!userMessage) return;
        
        // Afficher le message de l'utilisateur
        this.addMessage('user', userMessage);
        input.value = '';
        
        // Afficher un indicateur de frappe
        const typingIndicator = this.showTypingIndicator();
        
        try {
            // Ici, vous pourriez appeler une API d'IA comme OpenAI
            // Pour l'instant, nous allons simuler une réponse
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Récupérer une réponse appropriée
            const response = this.generateResponse(userMessage);
            
            // Remplacer l'indicateur de frappe par la réponse
            typingIndicator.remove();
            this.addMessage('assistant', response);
            
        } catch (error) {
            console.error('Error processing message:', error);
            typingIndicator.remove();
            this.addMessage('assistant', 'Désolé, une erreur est survenue. Veuillez réessayer.');
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingElement = document.createElement('div');
        typingElement.className = 'message assistant-message typing-indicator';
        typingElement.innerHTML = `
            <div class="message-content">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        messagesContainer.appendChild(typingElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingElement;
    }

    generateResponse(userMessage) {
        // Ici, vous pourriez intégrer une API d'IA comme OpenAI
        // Pour l'instant, nous allons utiliser des réponses prédéfinies
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('coucou')) {
            return `Bonjour ! Comment puis-je vous aider avec ${this.currentExpert.expertise[0].toLowerCase()} aujourd'hui ?`;
        } 
        
        if (lowerMessage.includes('merci') || lowerMessage.includes('au revoir')) {
            return 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions.';
        }
        
        if (lowerMessage.includes('compétences') || lowerMessage.includes('expertise')) {
            return `En tant que ${this.currentExpert.name}, je peux vous aider avec :\n- ${this.currentExpert.expertise.join('\n- ')}`;
        }
        
        // Réponse par défaut
        return `En tant que ${this.currentExpert.name}, je peux vous fournir des informations sur ce sujet. 
        Pour une réponse plus précise, vous pourriez préciser votre question concernant ${this.currentExpert.expertise[0].toLowerCase()}.`;
    }

    setupEventListeners() {
        // Envoyer un message avec le bouton
        document.getElementById('send-message').addEventListener('click', () => this.processUserInput());
        
        // Ou avec la touche Entrée
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processUserInput();
            }
        });
        
        // Gérer la fermeture et la minimisation
        document.getElementById('minimize-chat').addEventListener('click', () => {
            document.getElementById('chatbot-container').classList.toggle('minimized');
        });
        
        document.getElementById('close-chat').addEventListener('click', () => {
            document.getElementById('chatbot-container').style.display = 'none';
            // Optionnel: Afficher un bouton flottant pour rouvrir le chat
        });
    }
}

// Démarrer le chatbot quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new Chatbot();
});

document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChat = document.getElementById('close-chat');
    const minimizeChat = document.getElementById('minimize-chat');
    const chatNotification = document.getElementById('chat-notification');
    let isFirstInteraction = true;

    // Fonction pour ouvrir le chat
    function openChat() {
        chatbotContainer.classList.add('active');
        chatbotToggle.style.display = 'none';
        
        // Masquer la notification si c'est la première interaction
        if (isFirstInteraction) {
            chatNotification.style.display = 'none';
            isFirstInteraction = false;
        }
    }

    // Fonction pour fermer le chat
    function closeChatFunc() {
        chatbotContainer.classList.remove('active');
        chatbotToggle.style.display = 'flex';
    }

    // Fonction pour minimiser le chat
    function minimizeChatFunc() {
        chatbotContainer.classList.remove('active');
        chatbotToggle.style.display = 'flex';
        
        // Afficher une notification pour indiquer qu'il y a eu une activité
        chatNotification.style.display = 'block';
    }

    // Événements
    chatbotToggle.addEventListener('click', openChat);
    closeChat.addEventListener('click', closeChatFunc);
    minimizeChat.addEventListener('click', minimizeChatFunc);

    // Fermer le chat en cliquant à l'extérieur
    document.addEventListener('click', function(event) {
        if (!chatbotContainer.contains(event.target) && 
            !chatbotToggle.contains(event.target) && 
            chatbotContainer.classList.contains('active')) {
            minimizeChatFunc();
        }
    });

    // Empêcher la propagation des clics à l'intérieur du chat
    chatbotContainer.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Gestion de l'envoi des messages (exemple basique)
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');
    const chatMessages = document.querySelector('.chatbot-messages');

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Ajouter le message de l'utilisateur
        addMessage(message, 'user-message');
        userInput.value = '';

        // Simuler une réponse du bot
        setTimeout(() => {
            const responses = [
                "Je comprends votre question. Laissez-moi vous aider avec les fiches de poste.",
                "C'est une excellente question ! Voici ce que je peux vous dire...",
                "Je suis là pour vous aider à trouver les informations dont vous avez besoin.",
                "Permettez-moi de vous guider vers la bonne fiche de poste."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'bot-message');
        }, 1000);
    }

    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Animation d'apparition
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }

    // Envoyer un message avec le bouton ou la touche Entrée
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Afficher une notification après 10 secondes si l'utilisateur n'a pas encore interagi
    setTimeout(() => {
        if (isFirstInteraction) {
            chatNotification.style.display = 'block';
        }
    }, 10000);
});
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChat = document.getElementById('close-chat');
    const minimizeChat = document.getElementById('minimize-chat');
    const chatNotification = document.getElementById('chat-notification');
    let isFirstInteraction = true;

    // Fonction pour ouvrir le chat
    function openChat() {
        chatbotContainer.classList.add('active');
        chatbotToggle.style.display = 'none';
        
        // Masquer la notification si c'est la première interaction
        if (isFirstInteraction) {
            chatNotification.style.display = 'none';
            isFirstInteraction = false;
        }
    }

    // Fonction pour fermer le chat
    function closeChatFunc() {
        chatbotContainer.classList.remove('active');
        chatbotToggle.style.display = 'flex';
    }

    // Fonction pour minimiser le chat
    function minimizeChatFunc() {
        chatbotContainer.classList.remove('active');
        chatbotToggle.style.display = 'flex';
        
        // Afficher une notification pour indiquer qu'il y a eu une activité
        chatNotification.style.display = 'block';
    }

    // Événements
    chatbotToggle.addEventListener('click', openChat);
    closeChat.addEventListener('click', closeChatFunc);
    minimizeChat.addEventListener('click', minimizeChatFunc);

    // Fermer le chat en cliquant à l'extérieur
    document.addEventListener('click', function(event) {
        if (!chatbotContainer.contains(event.target) && 
            !chatbotToggle.contains(event.target) && 
            chatbotContainer.classList.contains('active')) {
            minimizeChatFunc();
        }
    });

    // Empêcher la propagation des clics à l'intérieur du chat
    chatbotContainer.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Gestion de l'envoi des messages (exemple basique)
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');
    const chatMessages = document.querySelector('.chatbot-messages');

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Ajouter le message de l'utilisateur
        addMessage(message, 'user-message');
        userInput.value = '';

        // Simuler une réponse du bot
        setTimeout(() => {
            const responses = [
                "Je comprends votre question. Laissez-moi vous aider avec les fiches de poste.",
                "C'est une excellente question ! Voici ce que je peux vous dire...",
                "Je suis là pour vous aider à trouver les informations dont vous avez besoin.",
                "Permettez-moi de vous guider vers la bonne fiche de poste."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'bot-message');
        }, 1000);
    }

    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Animation d'apparition
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }

    // Envoyer un message avec le bouton ou la touche Entrée
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Afficher une notification après 10 secondes si l'utilisateur n'a pas encore interagi
    setTimeout(() => {
        if (isFirstInteraction) {
            chatNotification.style.display = 'block';
        }
    }, 10000);
});