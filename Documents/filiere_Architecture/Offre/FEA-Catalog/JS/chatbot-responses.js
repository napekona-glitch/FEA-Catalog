// Réponses du chatbot par domaine
export const chatbotResponses = {
    // Réponses pour l'API Management
    'api-management': {
        greeting: "Bonjour ! Je suis votre assistant expert en API Management. Comment puis-je vous aider aujourd'hui ?",
        fallback: "Je ne suis pas sûr de bien comprendre. Je peux vous aider avec des questions sur l'API Management, l'intégration, la sécurité, ou vous mettre en relation avec un expert.",
        responses: [
            {
                keywords: ['tarif', 'prix', 'coût', 'budget'],
                answer: "Les tarifs varient en fonction de la complexité de votre écosystème d'APIs. En moyenne, nos solutions démarrent à partir de 15 000€ pour une implémentation complète. Souhaitez-vous une estimation personnalisée ?"
            },
            {
                keywords: ['sécurité', 'sécurisation', 'authentification', 'autorisation'],
                answer: "La sécurité est au cœur de notre approche. Nous implémentons OAuth 2.0, OpenID Connect, et des mécanismes avancés comme le rate limiting et le chiffrement des données. Voulez-vous plus de détails sur un aspect particulier de la sécurité ?"
            },
            {
                keywords: ['documentation', 'swagger', 'openapi', 'spécification'],
                answer: "Nous générons automatiquement une documentation interactive pour toutes vos APIs, conforme aux standards OpenAPI. Cela inclut des exemples de requêtes, de réponses et la possibilité de tester directement les endpoints. Je peux vous montrer un exemple si vous le souhaitez."
            }
        ]
    },
    
    // Réponses pour l'Infrastructure as Code
    'infrastructure-as-code': {
        greeting: "Bonjour ! Je suis votre assistant expert en Infrastructure as Code. Comment puis-je vous aider avec votre projet d'automatisation d'infrastructure ?",
        fallback: "Je ne suis pas sûr de bien comprendre. Je peux vous aider avec Terraform, Ansible, la gestion des états, les bonnes pratiques, ou vous mettre en relation avec un expert.",
        responses: [
            {
                keywords: ['terraform', 'terragrunt', 'iac'],
                answer: "Terraform est notre outil de prédilection pour le déploiement d'infrastructure. Nous utilisons des modules réutilisables, des workspaces pour gérer les environnements, et des pipelines CI/CD pour la validation. Avez-vous des besoins spécifiques en termes d'outils ou de processus ?"
            },
            {
                keywords: ['ansible', 'configuration management', 'provisioning'],
                answer: "Ansible est idéal pour la configuration et le déploiement d'applications. Nous créons des playbooks modulaires avec des rôles réutilisables et des tests automatisés. Souhaitez-vous des exemples de nos implémentations ?"
            },
            {
                keywords: ['meilleures pratiques', 'best practices', 'sécurité', 'gouvernance'],
                answer: "Nos meilleures pratiques incluent :\n• Utilisation de modules certifiés\n• Gération sécurisée des secrets avec Vault\n• Tests automatisés avec Terratest\n• Revue de code systématique\n• Documentation en tant que code\nSur quel aspect souhaitez-vous plus de détails ?"
            }
        ]
    },
    
    // Réponses pour la Sécurité
    'securite': {
        greeting: "Bonjour ! Je suis votre assistant expert en sécurité informatique. Comment puis-vous vous protéger aujourd'hui ?",
        fallback: "Je ne suis pas sûr de bien comprendre. Je peux vous aider avec des questions sur la sécurité des applications, la conformité, les tests d'intrusion, ou vous mettre en relation avec un expert en cybersécurité.",
        responses: [
            {
                keywords: ['conformité', 'rgpd', 'iso 27001', 'pci dss'],
                answer: "Nous accompagnons les entreprises dans leur mise en conformité avec les réglementations en vigueur. Notre approche inclut un audit initial, la mise en place des contrôles nécessaires et la documentation complète. Quelle réglementation vous intéresse particulièrement ?"
            },
            {
                keywords: ['test intrusion', 'pentest', 'audit sécurité'],
                answer: "Nos tests d'intrusion comprennent des analyses manuelles et automatisées, couvrant les applications web, mobiles et les infrastructures. Nous fournissons un rapport détaillé avec des recommandations prioritaires. Souhaitez-vous connaître notre méthodologie ?"
            }
        ]
    },
    
    // Réponses pour le Cloud
    'cloud': {
        greeting: "Bonjour ! Je suis votre assistant expert en solutions Cloud. Comment puis-je vous aider dans votre transformation cloud ?",
        fallback: "Je ne suis pas sûr de bien comprendre. Je peux vous aider avec des questions sur le cloud public, hybride, la migration, l'optimisation des coûts, ou vous mettre en relation avec un architecte cloud.",
        responses: [
            {
                keywords: ['migration', 'refactorisation', 'lift and shift'],
                answer: "Notre approche de migration cloud comprend :\n• Une analyse approfondie de votre infrastructure actuelle\n• Des recommandations de refactorisation\n• Une planification détaillée de la migration\n• Une exécution avec un temps d'arrêt minimal\n• Une optimisation post-migration\nAvez-vous déjà identifié des charges de travail à migrer ?"
            },
            {
                keywords: ['coût', 'optimisation', 'facturation'],
                answer: "Nous aidons les entreprises à optimiser leurs coûts cloud grâce à :\n• L'analyse des ressources sous-utilisées\n• La mise en place de politiques d'arrêt automatique\n• Le choix des bons types d'instances\n• La réserve d'instances pour les charges stables\nSouhaitez-vous une analyse gratuite de votre infrastructure actuelle ?"
            }
        ]
    },
    
    // Réponses pour le DevOps
    'devops': {
        greeting: "Bonjour ! Je suis votre assistant expert en pratiques DevOps. Comment puis-je vous aider à améliorer votre flux de livraison ?",
        fallback: "Je ne suis pas sûr de bien comprendre. Je peux vous aider avec des questions sur l'intégration continue, le déploiement continu, l'observabilité, ou vous mettre en relation avec un expert DevOps.",
        responses: [
            {
                keywords: ['ci/cd', 'pipeline', 'intégration continue', 'déploiement continu'],
                answer: "Nous concevons des pipelines CI/CD sur mesure avec des outils comme GitLab CI, GitHub Actions ou Azure DevOps. Nos pipelines incluent :\n• Tests automatisés à chaque commit\n• Analyse de la qualité du code\n• Déploiements progressifs\n• Retour arrière automatisé en cas d'échec\nUtilisez-vous déjà un outil de CI/CD ?"
            },
            {
                keywords: ['kubernetes', 'docker', 'orchestration', 'conteneurs'],
                answer: "Nous aidons les équipes à adopter Kubernetes avec :\n• Une architecture de cluster sécurisée et haute disponibilité\n• Des déploiements avec Helm ou Kustomize\n• La surveillance avec Prometheus/Grafana\n• La gestion des secrets avec Vault\n• Les bonnes pratiques de sécurité\nAvez-vous des conteneurs à orchestrer ?"
            }
        ]
    }
};

// Détecte le domaine de la page en fonction de l'URL ou de la classe du body
export function detectDomain() {
    const path = window.location.pathname.toLowerCase();
    
    if (path.includes('api-management')) return 'api-management';
    if (path.includes('infrastructure-as-code') || path.includes('iac')) return 'infrastructure-as-code';
    if (path.includes('securite') || path.includes('zero-trust') || path.includes('pca') || path.includes('sase')) return 'securite';
    if (path.includes('cloud') || path.includes('migration') || path.includes('aws') || path.includes('azure') || path.includes('gcp')) return 'cloud';
    if (path.includes('devops') || path.includes('ci-cd') || path.includes('kubernetes') || path.includes('docker')) return 'devops';
    
    // Vérifier les classes du body comme solution de secours
    const bodyClasses = document.body.className.toLowerCase();
    if (bodyClasses.includes('api') || bodyClasses.includes('integration')) return 'api-management';
    if (bodyClasses.includes('devops') || bodyClasses.includes('ci-cd')) return 'devops';
    if (bodyClasses.includes('securite') || bodyClasses.includes('sécurité')) return 'securite';
    if (bodyClasses.includes('cloud') || bodyClasses.includes('azure') || bodyClasses.includes('aws') || bodyClasses.includes('gcp')) return 'cloud';
    
    return 'default';
}

// Trouve la meilleure réponse en fonction du message de l'utilisateur
export function findBestResponse(domain, message) {
    const domainResponses = chatbotResponses[domain] || chatbotResponses['default'];
    const lowerMessage = message.toLowerCase();
    
    // Vérifier les réponses spécifiques au domaine
    for (const response of domainResponses.responses) {
        if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
            return response.answer;
        }
    }
    
    // Vérifier les réponses génériques
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('coucou')) {
        return domainResponses.greeting;
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('contacter') || lowerMessage.includes('email') || lowerMessage.includes('téléphone')) {
        return "Vous pouvez nous contacter à contact@wekey-architecture.com ou au 01 23 45 67 89. Nos experts sont disponibles du lundi au vendredi de 9h à 18h pour échanger sur votre projet.";
    }
    
    if (lowerMessage.includes('tarif') || lowerMessage.includes('prix') || lowerMessage.includes('coût') || lowerMessage.includes('budget')) {
        return "Les tarifs varient en fonction de la complexité de votre projet. Pour une estimation personnalisée, je peux vous mettre en relation avec un de nos experts. Souhaitez-vous que je vous rappelle ?";
    }
    
    // Si aucune correspondance, retourner la réponse par défaut du domaine
    return domainResponses.fallback;
}
