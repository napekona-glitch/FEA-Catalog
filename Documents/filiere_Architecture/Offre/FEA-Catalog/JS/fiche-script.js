 // Gestion du chatbot
        document.addEventListener('DOMContentLoaded', function() {
            const chatContainer = document.getElementById('chatbotContainer');
            const chatMessages = document.getElementById('chatbotMessages');
            const userInput = document.getElementById('userInput');
            const sendButton = document.getElementById('sendButton');
            const closeButton = document.getElementById('chatbotClose');
            
            // Afficher/masquer le chat
            const chatIcon = document.createElement('div');
            chatIcon.className = 'chatbot-icon';
            chatIcon.innerHTML = '<i class="fas fa-comments"></i>';
            document.body.appendChild(chatIcon);
            
            chatIcon.addEventListener('click', function() {
                chatContainer.classList.add('visible');
                chatIcon.style.display = 'none';
            });
            
            closeButton.addEventListener('click', function() {
                chatContainer.classList.remove('visible');
                chatIcon.style.display = 'flex';
            });
            
            // Envoyer un message
            function sendMessage() {
                const message = userInput.value.trim();
                if (message === '') return;
                
                // Ajouter le message de l'utilisateur
                appendMessage(message, 'user');
                userInput.value = '';
                
                // Réponse du bot (simplifiée)
                setTimeout(() => {
                    const botResponse = getBotResponse(message);
                    appendMessage(botResponse, 'bot');
                }, 500);
            }
            
            // Gestion de la touche Entrée
            userInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            sendButton.addEventListener('click', sendMessage);
            
            // Fonction pour ajouter un message au chat
            function appendMessage(text, sender) {
                const messageDiv = document.createElement('div');
                messageDiv.className = `chatbot-message ${sender}`;
                messageDiv.textContent = text;
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            // Obtenir une réponse du bot (simplifiée)
            function getBotResponse(message) {
                const lowerMessage = message.toLowerCase();
                
                if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('coucou')) {
                    return "Bonjour ! Comment puis-je vous aider avec nos services d'API Management aujourd'hui ?";
                } else if (lowerMessage.includes('tarif') || lowerMessage.includes('prix') || lowerMessage.includes('coût')) {
                    return "Les tarifs varient en fonction de vos besoins spécifiques. Pour une estimation personnalisée, je peux vous mettre en relation avec un de nos experts.";
                } else if (lowerMessage.includes('contact') || lowerMessage.includes('contacter') || lowerMessage.includes('email')) {
                    return "Vous pouvez nous contacter à contact@wekey-architecture.com ou au 01 23 45 67 89. Nos horaires sont du lundi au vendredi de 9h à 18h.";
                } else if (lowerMessage.includes('fonctionnalité') || lowerMessage.includes('caractéristique')) {
                    return "Nos solutions d'API Management incluent : gestion des accès, monitoring, documentation automatique, sécurité avancée, et bien plus encore. Souhaitez-vous des détails sur une fonctionnalité particulière ?";
                } else if (lowerMessage.includes('temps') || lowerMessage.includes('délai') || lowerMessage.includes('durée')) {
                    return "La durée de mise en place dépend de la complexité de votre écosystème. En moyenne, les projets prennent entre 4 et 12 semaines. Je peux vous proposer une estimation plus précise avec plus d'informations sur votre contexte.";
                } else {
                    return "Je ne suis pas sûr de bien comprendre votre question. Pourriez-vous la reformuler ? Je peux vous aider avec des informations sur nos services d'API Management, l'intégration de systèmes, les tarifs, ou vous mettre en relation avec un expert.";
                }
            }
            
            // Gestion de l'icône flottante
            const icon = document.createElement('div');
            icon.className = 'icon-card';
            icon.innerHTML = '<i class="fas fa-arrow-up"></i>';
            document.body.appendChild(icon);
            
            // Faire défiler vers le haut au clic sur l'icône
            icon.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Afficher/masquer l'icône au défilement
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    icon.style.opacity = '1';
                    icon.style.visibility = 'visible';
                } else {
                    icon.style.opacity = '0';
                    icon.style.visibility = 'hidden';
                }
            });
        });