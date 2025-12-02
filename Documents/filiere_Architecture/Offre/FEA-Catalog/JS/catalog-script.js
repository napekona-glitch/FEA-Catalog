// Chatbot catalogue
document.addEventListener('DOMContentLoaded', function () {
    // Liste blanche des fichiers existants dans le catalogue (avec préfixe 'fiche-')
    const existingFiles = [
        'fiche-urbanisation-si.html',
        'fiche-zero-trust-iam.html',
        'fiche-monolithe-microservices.html',
        'fiche-api-management-integration.html',
        'fiche-migration-cloud-hybride.html',
        'fiche-infrastructure-as-code.html',
        'fiche-sd-wan-sase.html',
        'fiche-ci-cd-industrialisation.html',
        'fiche-observabilite-monitoring.html',
        'fiche-pca-pra-continuite.html',
        'fiche-architecture-data-mesh.html',
        'fiche-mlops-ia-industrielle.html',
        'fiche-rag-ia-generative-responsable.html',
        'fiche-modernisation-digital-workplace.html',
        'fiche-audit-qualite-logicielle.html'
    ];

    // Fonction de nettoyage centralisée pour les liens
    function cleanLinksAndArtifacts(content) {
        return content
            // Remplacer les patterns "FICHIER: nom-fichier.html" par des vrais liens SEULEMENT si le fichier existe
            .replace(/FICHIER:\s*([a-zA-Z0-9\-_]+\.html)/g, (match, filename) => {
                return existingFiles.includes(filename) ? `<a href="${filename}">${filename}</a>` : filename;
            })
            // Nettoyer les liens déjà existants mais mal formatés
            .replace(/href=['"]audit-de-qualite-logicielle\.html['"]/g, 'href="audit-qualite-logicielle.html"')
            // Remplacer les noms de fichiers seuls par des liens cliquables SEULEMENT si le fichier existe et n'est pas déjà dans une balise <a>
            .replace(/\b([a-zA-Z0-9\-_]+\.html)\b(?![^<]*<\/a>)/g, (match, filename) => {
                return existingFiles.includes(filename) ? `<a href="${filename}">${filename}</a>` : filename;
            })
            // Nettoyer les "FICHIER:" restants
            .replace(/FICHIER:\s*/g, '')
            // Nettoyer les espaces multiples mais préserver les <br>
            .replace(/\s+/g, ' ')
            .trim();
    }

    const chatContainer = document.getElementById('chatbotContainer');
    const chatMessages = document.getElementById('chatbotMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const closeButton = document.getElementById('chatbotClose');

    // Icône flottante du chatbot
    const chatIcon = document.createElement('div');
    chatIcon.className = 'chatbot-icon';
    chatIcon.style.position = 'fixed';
    chatIcon.style.bottom = '20px';
    chatIcon.style.right = '20px';
    chatIcon.style.width = '56px';
    chatIcon.style.height = '56px';
    chatIcon.style.borderRadius = '50%';
    chatIcon.style.background = 'var(--accent-500)';
    chatIcon.style.color = '#fff';
    chatIcon.style.display = 'flex';
    chatIcon.style.alignItems = 'center';
    chatIcon.style.justifyContent = 'center';
    chatIcon.style.cursor = 'pointer';
    chatIcon.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    chatIcon.style.zIndex = '999';
    chatIcon.textContent = '💬';
    document.body.appendChild(chatIcon);

    // Masquer le container au chargement
    chatContainer.style.position = 'fixed';
    chatContainer.style.bottom = '90px';
    chatContainer.style.right = '20px';
    chatContainer.style.width = '50vw';
    chatContainer.style.maxWidth = '800px';
    chatContainer.style.minWidth = '400px';
    chatContainer.style.height = '70vh';
    chatContainer.style.background = '#fff';
    chatContainer.style.borderRadius = '10px';
    chatContainer.style.boxShadow = '0 5px 15px rgba(0,0,0,0.15)';
    chatContainer.style.display = 'none';
    chatContainer.style.flexDirection = 'column';
    chatContainer.style.zIndex = '1000';

    chatIcon.addEventListener('click', function () {
        chatContainer.style.display = 'flex';
        chatIcon.style.display = 'none';
    });

    closeButton.addEventListener('click', function () {
        chatContainer.style.display = 'none';
        chatIcon.style.display = 'flex';
    });

    function appendMessage(content, sender, isHtml = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message ' + sender;
        messageDiv.style.marginBottom = '10px';
        messageDiv.style.padding = '10px 15px';
        messageDiv.style.borderRadius = '15px';
        messageDiv.style.maxWidth = '85%';
        messageDiv.style.fontSize = '0.9rem';

        if (sender === 'user') {
            messageDiv.style.background = 'var(--accent-500)';
            messageDiv.style.color = '#fff';
            messageDiv.style.marginLeft = 'auto';
        } else {
            messageDiv.style.background = '#fff';
            messageDiv.style.border = '1px solid var(--gray-200)';
            messageDiv.style.marginRight = 'auto';
        }

        // TOUJOURS traiter les messages du bot comme HTML pour les liens
        if (sender === 'bot') {
            messageDiv.innerHTML = content;
        } else {
            messageDiv.textContent = content;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Index enrichi des offres du catalogue pour le chatbot
    const catalogueIndex = [
        {
            id: 'urbanisation',
            title: "Urbanisation SI",
            category: 'Architecture',
            keywords: ['urbanisation', 'cartographie', 'rationalisation', 'paysage applicatif', 'architecture entreprise', 'transformation si', 'cartes', 'applications', 'redondances', 'roadmap'],
            description: "Cartographie complète du SI, identification des redondances, roadmap de transformation",
            deliverables: ['Cartographies complètes', 'Roadmaps de transformation', 'Diagnostic urbanisation'],
            profiles: ['Architecte d entreprise', 'Urbaniste SI'],
            duration: '1-2 mois',
            kpis: ['% couverture cartographique', '% redondances identifiées'],
            answer: "🏗️ **Urbanisation SI**<br><br>Cette offre vous aide à rationaliser votre paysage applicatif et à définir une trajectoire de transformation cohérente.<br><br>**Points clés :**<br>• 🗺️ Cartographie complète du système d'information<br>• 🔍 Identification des redondances applicatives<br>• 📋 Roadmap de transformation sur 30/60/90 jours<br><br>**Profils :** Architecte d'entreprise, Urbaniste SI<br>**Durée :** 1-2 mois<br><br><a href=\"urbanisation-si.html\">Voir la fiche détaillée</a>",
            examples: [
                "Comment rationaliser mon SI ?",
                "Qu'est-ce que l'urbanisation du SI ?",
                "J'ai trop d'applications redondantes",
                "Comment cartographier mon système d'information"
            ]
        },
        {
            id: 'microservices',
            title: "Monolithe → Microservices",
            category: 'Architecture',
            keywords: ['microservices', 'monolithe', 'architecture applicative', 'découpage', 'services', 'api', 'scalabilité', 'performance'],
            description: "Transformation d'architecture monolithique vers microservices",
            deliverables: ['HLD', 'Schémas microservices', 'Backlog technique'],
            profiles: ['Architecte Solution', 'Lead Tech'],
            duration: '2-3 mois',
            kpis: ['Vitesse de déploiement', 'Time-to-market'],
            answer: "🔧 **Monolithe → Microservices**<br><br>Cette offre modernise votre architecture applicative pour plus de scalabilité et de performance.<br><br>**Points clés :**<br>• 🏗️ High-Level Design (HLD) de la nouvelle architecture<br>• ⚙️ Schémas détaillés des microservices<br>• 📋 Backlog technique priorisé<br><br>**Profils :** Architecte Solution, Lead Tech<br>**Durée :** 2-3 mois<br><br><a href=\"monolithe-microservices.html\">Voir la fiche détaillée</a>",
            examples: [
                "Comment passer en microservices ?",
                "Mon application est lente",
                "Je veux découper mon monolithe",
                "Architecture moderne applicative"
            ]
        },
        {
            id: 'api-management',
            title: "API Management & Intégration",
            category: 'Architecture',
            keywords: ['api', 'integration', 'middleware', 'gouvernance', 'catalogue api', 'rest', 'soap', 'connectivité'],
            description: "Gouvernance et gestion du parc d'APIs",
            deliverables: ['Catalogue API', 'Gouvernance', 'Schémas d intégrégration'],
            profiles: ['Architecte Solution', 'Expert Middleware/API'],
            duration: '1-2 mois',
            kpis: ['% APIs inventoriées', 'Latence d intégration'],
            answer: "🔗 **API Management & Intégration**<br><br>Cette offre structure votre parc d'APIs et industrialise vos intégrations pour une meilleure gouvernance.<br><br>**Points clés :**<br>• 📋 Catalogue complet des APIs existantes<br>• 🛡️ Gouvernance et politiques d'accès<br>• 🔧 Schémas d'intégration normalisés<br><br>**Profils :** Architecte Solution, Expert Middleware/API<br>**Durée :** 1-2 mois<br><br><a href=\"api-management-integration.html\">Voir la fiche détaillée</a>",
            examples: [
                "Comment gérer mes APIs ?",
                "Mise en place gouvernance API",
                "Intégration systèmes",
                "Catalogue d'APIs"
            ]
        },
        {
            id: 'cloud',
            title: "Cloud & Infrastructure",
            category: 'Cloud & Infrastructure',
            keywords: ['cloud', 'migration', 'infra', 'infrastructure', 'iac', 'infrastructure as code', 'sd-wan', 'sase', 'terraform', 'ansible', 'aws', 'azure', 'gcp'],
            description: "Transformation cloud et industrialisation de l'infrastructure",
            offers: [
                {
                    name: 'Migration Cloud Hybride',
                    link: 'migration-cloud-hybride.html',
                    keywords: ['migration cloud', 'hybride', 'transformation', 'business case']
                },
                {
                    name: 'Infrastructure as Code',
                    link: 'infrastructure-as-code.html',
                    keywords: ['iac', 'terraform', 'ansible', 'automatisation']
                },
                {
                    name: 'SD-WAN & SASE',
                    link: 'sd-wan-sase.html',
                    keywords: ['sd-wan', 'sase', 'réseau', 'sécurité réseau']
                }
            ],
            answer: "Pour vos enjeux <strong>Cloud & Infrastructure</strong>, plusieurs offres disponibles : <a href='migration-cloud-hybride.html'>Migration Cloud Hybride</a> (transformation), <a href='infrastructure-as-code.html'>Infrastructure as Code</a> (automatisation), <a href='sd-wan-sase.html'>SD-WAN & SASE</a> (réseau sécurisé).",
            examples: [
                "Quelle offre pour migrer vers le cloud ?",
                "Comment industrialiser mon infrastructure ?",
                "Mise en place Terraform",
                "SD-WAN ou SASE ?"
            ]
        },
        {
            id: 'devops',
            title: "DevOps, CI/CD & Observabilité",
            category: 'DevOps & SRE',
            keywords: ['ci/cd', 'cicd', 'pipeline', 'devops', 'observabilité', 'monitoring', 'logs', 'metrics', 'traces', 'sre', 'supervision', 'alerting'],
            description: "Industrialisation des déploiements et supervision des systèmes",
            offers: [
                {
                    name: 'CI/CD & Industrialisation',
                    link: 'ci-cd-industrialisation.html',
                    keywords: ['ci/cd', 'pipeline', 'industrialisation', 'automatisation']
                },
                {
                    name: 'Observabilité & Monitoring',
                    link: 'observabilite-monitoring.html',
                    keywords: ['observabilité', 'monitoring', 'logs', 'metrics', 'traces']
                }
            ],
            answer: "Pour l'industrialisation DevOps : <a href=\"ci-cd-industrialisation.html\">CI/CD & Industrialisation</a> (pipelines, automatisation). Pour la supervision : <a href=\"observabilite-monitoring.html\">Observabilité & Monitoring</a> (logs, métriques, traces).",
        },
        {
            title: "SD-WAN & SASE",
            keywords: ["sd-wan", "sase", "réseau", "sécurité", "connectivité"],
            description: "Architecture réseau SD-WAN et sécurité SASE",
            file: "sd-wan-sase.html",
            answer: "L'offre <strong>SD-WAN & SASE</strong> modernise votre architecture réseau avec SD-WAN et sécurité SASE. Durée : 1-2 mois. <a href=\"sd-wan-sase.html\">Voir la fiche détaillée</a>.",
            examples: ["Moderniser mon réseau", "SD-WAN", "Sécurité réseau", "SASE"]
        },
        {
            title: "CI/CD & Industrialisation",
            keywords: ["cicd", "pipeline", "devops", "industrialisation", "automatisation"],
            description: "Pipelines CI/CD et industrialisation",
            file: "ci-cd-industrialisation.html",
            answer: "L'offre <strong>CI/CD & Industrialisation</strong> met en place vos pipelines CI/CD avec documentation et formation. Durée : 2-4 semaines. <a href=\"ci-cd-industrialisation.html\">Voir la fiche détaillée</a>.",
            examples: ["Mettre en place CI/CD", "Industrialiser mes développements", "Pipelines DevOps"]
        },
        {
            title: "Observabilité & Monitoring",
            keywords: ["observabilite", "monitoring", "logs", "metrics", "traces", "sre"],
            description: "Stack logs/metrics/traces et monitoring",
            file: "observabilite-monitoring.html",
            answer: "L'offre <strong>Observabilité & Monitoring</strong> déploie votre stack logs/metrics/traces avec dashboards et runbooks. Durée : 1-2 mois. <a href=\"observabilite-monitoring.html\">Voir la fiche détaillée</a>.",
            examples: ["Observer mes applications", "Monitoring", "Logs metrics traces", "SRE"]
        },
        {
            title: "Zero Trust & IAM",
            keywords: ["zero trust", "iam", "sécurité", "identité", "accès"],
            description: "Modèle Zero Trust et gestion des identités",
            file: "zero-trust-iam.html",
            answer: "L'offre <strong>Zero Trust & IAM</strong> implémente votre modèle Zero Trust avec plan IAM et gouvernance des accès. Durée : 1-2 mois. <a href=\"zero-trust-iam.html\">Voir la fiche détaillée</a>.",
            examples: ["Zero Trust", "Gestion des identités", "IAM", "Sécurité des accès"]
        },
        {
            title: "PCA/PRA & Continuité",
            keywords: ["pca", "pra", "continuité", "disaster", "recovery", "pdc"],
            description: "Plans PCA/PRA et continuité d'activité",
            file: "pca-pra-continuite.html",
            answer: "L'offre <strong>PCA/PRA & Continuité</strong> établit vos plans PCA/PRA avec tests de reprise et runbooks. Durée : 1-2 mois. <a href=\"pca-pra-continuite.html\">Voir la fiche détaillée</a>.",
            examples: ["PCA/PRA", "Continuité d'activité", "Plan de reprise", "Disaster recovery"]
        },
        {
            title: "Architecture Data Mesh",
            keywords: ["data mesh", "data", "données", "architecture", "domaine"],
            description: "Architecture Data Mesh et gouvernance des données",
            file: "architecture-data-mesh.html",
            answer: "L'offre <strong>Architecture Data Mesh</strong> conçoit vos modèles data domain avec gouvernance data et POC. Durée : 2-3 mois. <a href=\"architecture-data-mesh.html\">Voir la fiche détaillée</a>.",
            examples: ["Data Mesh", "Architecture des données", "Gouvernance data", "Data domain"]
        },
        {
            title: "MLOps & IA Industrielle",
            keywords: ["mlops", "ia", "machine learning", "ai", "industrielle"],
            description: "Pipelines MLOps et IA industrielle",
            file: "mlops-ia-industrielle.html",
            answer: "L'offre <strong>MLOps & IA Industrielle</strong> déploie vos pipelines MLOps avec monitoring modèles et gouvernance IA. Durée : 1-2 mois. <a href=\"mlops-ia-industrielle.html\">Voir la fiche détaillée</a>.",
            examples: ["MLOps", "IA industrielle", "Machine learning", "Monitoring modèles"]
        },
        {
            title: "RAG & IA Générative Responsable",
            keywords: ["rag", "ia", "générative", "llm", "responsable"],
            description: "Architecture RAG et IA générative responsable",
            file: "rag-ia-generative-responsable.html",
            answer: "L'offre <strong>RAG & IA Générative Responsable</strong> construit votre architecture RAG avec intégration sources internes. Durée : 1-2 mois. <a href=\"rag-ia-generative-responsable.html\">Voir la fiche détaillée</a>.",
            examples: ["RAG", "IA générative", "LLM", "IA responsable"]
        },
        {
            title: "Modernisation Digital Workplace",
            keywords: ["workplace", "digital", "m365", "google", "collaboration"],
            description: "Modernisation du digital workplace",
            file: "modernisation-digital-workplace.html",
            answer: "L'offre <strong>Modernisation Digital Workplace</strong> définit vos schémas cibles workplace avec intégrations M365/Google. Durée : 1-2 mois. <a href=\"modernisation-digital-workplace.html\">Voir la fiche détaillée</a>.",
            examples: ["Moderniser mon workplace", "Digital workplace", "M365", "Google Workspace"]
        },
        {
            title: "Audit de Qualité Logicielle",
            keywords: ["audit", "qualité", "logiciel", "code", "test", "dette"],
            description: "Audit de qualité logicielle et dette technique",
            file: "audit-qualite-logicielle.html",
            answer: "L'offre <strong>Audit de Qualité Logicielle</strong> évalue votre maturité logicielle. Livrables : rapport d'audit, plan d'action. Durée : 2-4 semaines. <a href=\"audit-qualite-logicielle.html\">Voir la fiche détaillée</a>.",
            examples: ["Auditer mon code", "Réduire ma dette technique", "Qualité logicielle", "Audit de sécurité applicative"]
        }
    ];

    // Fonction pour charger et indexer toutes les fiches existantes
    async function loadAllSheets() {
        const fullTextIndex = {};

        // Uniquement les fichiers qui existent vraiment
        const sheets = existingFiles;

        for (const sheet of sheets) {
            try {
                const response = await fetch(sheet);
                if (!response.ok) {
                    console.warn(`Fichier ${sheet} non trouvé ou inaccessible`);
                    continue;
                }

                const html = await response.text();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                // Récupérer le titre principal
                const title = tempDiv.querySelector('h1')?.textContent || '';

                // Récupérer la description famille
                const familyDesc = tempDiv.querySelector('.family-description')?.textContent || '';

                // Récupérer tous les textes pertinents
                const allText = tempDiv.textContent.toLowerCase();

                fullTextIndex[sheet] = {
                    title: title,
                    familyDescription: familyDesc,
                    fullText: allText,
                    url: sheet
                };
            } catch (error) {
                console.warn(`Impossible de charger ${sheet}:`, error);
            }
        }

        return fullTextIndex;
    }

    // Recherche étendue dans toutes les fiches
    async function searchInAllSheets(query) {
        const sheetsIndex = await loadAllSheets();
        const results = [];
        const queryLower = query.toLowerCase();

        for (const [filename, content] of Object.entries(sheetsIndex)) {
            let score = 0;
            const matches = [];

            // Recherche dans le titre
            if (content.title.toLowerCase().includes(queryLower)) {
                score += 10;
                matches.push(`Titre: ${content.title}`);
            }

            // Recherche dans la description famille
            if (content.familyDescription.toLowerCase().includes(queryLower)) {
                score += 5;
                matches.push(`Description: ${content.familyDescription.substring(0, 100)}...`);
            }

            // Recherche dans le texte complet
            if (content.fullText.includes(queryLower)) {
                score += 2;

                // Chercher des extraits pertinents
                const words = queryLower.split(' ');
                for (const word of words) {
                    if (word.length > 2) {
                        const index = content.fullText.indexOf(word);
                        if (index !== -1) {
                            const start = Math.max(0, index - 50);
                            const end = Math.min(content.fullText.length, index + word.length + 50);
                            const excerpt = content.fullText.substring(start, end).trim();
                            if (excerpt.length > 20) {
                                matches.push(`...${excerpt}...`);
                            }
                        }
                    }
                }
            }

            if (score > 0) {
                const entry = catalogueIndex.find(e => e.file === filename);
                results.push({
                    score: score,
                    title: content.title,
                    file: filename,
                    matches: matches.slice(0, 3), // Limiter à 3 matches
                    answer: entry ? entry.answer : `Consultez la fiche <a href=\"${filename}\">${content.title}</a> pour plus d'informations.`
                });
            }
        }

        // Trier par score décroissant
        results.sort((a, b) => b.score - a.score);
        return results;
    }

    // Fonction pour nettoyer les liens et artefacts indésirables
    function cleanLinksAndArtifacts(text) {
        return text
            // Remplacer les références de fichiers par des liens HTML valides
            .replace(/FICHIER:\s*(\w+-\w+\.html)/g, (match, filename) => {
                if (existingFiles.includes(filename)) {
                    return `<a href="${filename}">Voir la fiche détaillée</a>`;
                }
                return filename; // Si le fichier n'existe pas, retourner juste le nom
            })
            // Nettoyer les artefacts de formatage indésirables
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Nettoyer les espaces multiples mais préserver les <br>
            .replace(/\s+/g, ' ')
            .trim();
    }

    async function getBotResponse(message) {
        try {
            // Appel à l'API Groq pour une réponse intelligente
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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' // Remplacez avec votre clé API Groq
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant', // modèle gratuit Groq
                    messages: [
                        {
                            role: 'system',
                            content: `Tu es un assistant expert et empathique pour le catalogue de services Architecture & Transformation de Wekey. 
                                    Ton rôle est d'aider les clients (techniques ET non-techniques) à explorer leurs besoins, comprendre leurs problématiques métier et trouver la solution adaptée dans notre catalogue de 15 offres.
                                    
                                    APPROCHE ORIENTÉE PROBLÉMATIQUES MÉTIER:
                                    - Sois curieux et guide l'utilisateur dans sa réflexion, même s'il n'est pas technique
                                    - Traduis les problématiques métier en solutions techniques adaptées
                                    - Pose des questions ouvertes pour comprendre le contexte business et les enjeux
                                    - Propose des pistes concrètes et des alternatives pertinentes
                                    - Oriente vers la bonne offre même si la question est vague ou imprécise
                                    - Sois patient et pédagogique, évite le jargon technique excessif
                                    
                                    COMPRÉHENSION ÉLARGIE DES CONTEXTES:
                                    - Un utilisateur peut parler de "lenteur", "coûts élevés", "complexité", "sécurité", "modernisation"
                                    - Traduis ces problématiques business en solutions techniques concrètes
                                    - Anticipe les besoins non-dits (croissance, transformation digitale, efficacité)
                                    - Considère le contexte de l'entreprise (taille, secteur, maturité digitale)
                                    - Propose des solutions évolutives et pérennes
                                    
                                    FORMAT OBLIGATOIRE DES RÉPONSES:
                                    🎯 Utilise ce format pour chaque offre recommandée:
                                    
                                    🏗️ **[Titre de l'offre]**
                                    
                                    [Description claire en termes business, 1-2 phrases]
                                    
                                    **Pourquoi cette solution ?**
                                    • Bénéfice concret pour l'utilisateur avec émoji
                                    • Problème résolu avec émoji pertinent  
                                    • Valeur ajoutée business avec émoji
                                    
                                    **Ce que nous livrons :**
                                    • Livrable 1 concret
                                    • Livrable 2 concret
                                    • Livrable 3 concret
                                    
                                    **Profils :** [Liste des profils]
                                    **Durée :** [Période]
                                    
                                    <a href="[nom-fichier-exact].html">Voir la fiche détaillée</a>
                                    
                                    ÉMOJIS THÉMATIQUES:
                                    🏗️ Architecture • ☁️ Cloud • 🔧 DevOps • 🛡️ Sécurité • 📊 Data & IA • 💼 Workplace • 🔍 Qualité • ⚡ Performance • 🚀 Transformation • 💡 Conseil • 🎯 Objectifs • 📋 Livrables • 🔍 Audit • 🔄 Industrialisation • 💰 Coûts • ⏱️ Temps • 📈 Croissance • 🎯 Efficacité • 🔒 Conformité • 🌐 Innovation
                                    
                                    CATALOGUE COMPLET DES OFFRES:
                                    
                                    **ARCHITECTURE:**
                                    1. Urbanisation SI: cartographie complète SI, identification redondances, roadmap transformation (1-2 mois, Architecte d'entreprise, Urbaniste SI) - FICHIER: urbanisation-si.html
                                    2. Monolithe → Microservices: transformation architecture applicative moderne, HLD, schémas microservices (2-3 mois, Architecte Solution, Lead Tech) - FICHIER: monolithe-microservices.html
                                    3. API Management & Intégration: gouvernance parc APIs, catalogue API, schémas intégration (1-2 mois, Architecte Solution, Expert Middleware) - FICHIER: api-management-integration.html
                                    
                                    **CLOUD & INFRASTRUCTURE:**
                                    4. Migration Cloud Hybride: transformation cloud hybride, plans migration 30/60/90 jours, business case (2-3 mois, Architecte Cloud, DevOps, Security) - FICHIER: migration-cloud-hybride.html
                                    5. Infrastructure as Code: automatisation avec Terraform/Ansible, templates, documentation (2-4 semaines, DevOps Engineer, Cloud Architect) - FICHIER: infrastructure-as-code.html
                                    6. SD-WAN & SASE: architecture réseau cible, migration SD-WAN, sécurité réseau (1-2 mois, Network Architect, Cloud Network Engineer) - FICHIER: sd-wan-sase.html
                                    
                                    **DEVOPS & SRE:**
                                    7. CI/CD & Industrialisation: pipelines CI/CD, documentation, formation (2-4 semaines, Architecte DevOps, SRE, Test Automation) - FICHIER: ci-cd-industrialisation.html
                                    8. Observabilité & Monitoring: stack logs/metrics/traces, dashboards, runbooks (1-2 mois, SRE, Architecte Observabilité) - FICHIER: observabilite-monitoring.html
                                    
                                    **SÉCURITÉ & GOUVERNANCE:**
                                    9. Zero Trust & IAM: modèle Zero Trust, plan IAM, gouvernance accès (1-2 mois, Security Architect, IAM Specialist) - FICHIER: zero-trust-iam.html
                                    10. PCA/PRA & Continuité: plans PCA/PRA, tests reprise, runbooks (1-2 mois, Business Continuity Manager, Security Architect) - FICHIER: pca-pra-continuite.html
                                    
                                    **DATA & IA:**
                                    11. Architecture Data Mesh: modèles data domain, gouvernance data, POC (2-3 mois, Data Architect, Data Engineer) - FICHIER: architecture-data-mesh.html
                                    12. MLOps & IA industrielle: pipelines MLOps, monitoring modèles, gouvernance IA (1-2 mois, MLOps Engineer, AI Solution Architect) - FICHIER: mlops-ia-industrielle.html
                                    13. RAG & IA générative responsable: architecture RAG, intégration sources internes, pilote métier (1-2 mois, Data Architect, AI Solution Architect, MLOps) - FICHIER: rag-ia-generative-responsable.html
                                    
                                    **DIGITAL WORKPLACE:**
                                    14. Modernisation Digital Workplace: schémas cibles workplace, intégrations M365/Google (1-2 mois, Workplace Architect, IAM Engineer) - FICHIER: modernisation-digital-workplace.html
                                    
                                    **QUALITÉ & TESTS:**
                                    15. Audit de Qualité Logicielle: rapport audit, plan action, recommandations (2-4 semaines, Expert Qualité, DevOps) - FICHIER: audit-qualite-logicielle.html
                                    
                                    INFORMATIONS TARIFAIRES (section "Modèles économiques"):
                                    - TJM indicatifs: 850€ (DevOps/SRE) à 1200€ (Architecte d'entreprise/AI Solution Architect)
                                    - Packages: 25-50k€ (2-4 semaines), 50-90k€ (1-2 mois), 90-150k€ (2-3 mois)
                                    
                                    EXEMPLES DE RÉPONSES BIEN FORMATÉES:
                                    
                                    Question: "mes applications sont lentes"
                                    Réponse: ⚡ **Analyse de votre problématique de performance**
                                    
                                    Je comprends que la lenteur de vos applications impacte votre activité et vos utilisateurs. C'est un problème critique qui peut avoir plusieurs origines. Pour vous proposer la solution la plus adaptée :
                                    
                                    🎯 **Questions pour bien comprendre votre contexte :**
                                    • 💼 Quel est l'impact business de cette lenteur ? (perte de clients, productivité, image de marque ?)
                                    • 📊 Est-ce un problème récent ou qui s'aggrave progressivement ?
                                    • 🌐 Vos utilisateurs sont-ils internes, externes, ou les deux ?
                                    • 💰 Avez-vous des objectifs de performance ou des SLA à respecter ?
                                    
                                    **Pistes de solutions selon votre situation :**
                                    
                                    🔍 **Observabilité & Monitoring**
                                    Pour diagnostiquer précisément les causes racines et mesurer l'impact réel
                                    **Pourquoi cette solution ?**
                                    • 📈 Visibilité complète sur les performances de vos applications
                                    • 🔎 Identification rapide des goulots d'étranglement
                                    • 📊 Tableaux de bord pour suivre les KPIs business
                                    
                                    **Ce que nous livrons :**
                                    • Stack technique de monitoring complet
                                    • Tableaux de bord personnalisés
                                    • Plans d'action prioritaires
                                    
                                    **Profils :** SRE, Architecte Observabilité
                                    **Durée :** 1-2 mois
                                    
                                    <a href="observabilite-monitoring.html">Voir la fiche détaillée</a>
                                    
                                    Ou si vos applications sont anciennes et monolithiques :
                                    
                                    🏗️ **Monolithe → Microservices**
                                    Pour moderniser votre architecture et retrouver agilité et performance
                                    **Pourquoi cette solution ?**
                                    • 🚀 Déploiements plus rapides et fréquents
                                    • ⚡ Performances améliorées par service
                                    • 🔧 Maintenance simplifiée et ciblée
                                    
                                    **Ce que nous livrons :**
                                    • Architecture cible détaillée (HLD)
                                    • Plan de migration progressif
                                    • Backlog technique priorisé
                                    
                                    **Profils :** Architecte Solution, Lead Tech
                                    **Durée :** 2-3 mois
                                    
                                    <a href="monolithe-microservices.html">Voir la fiche détaillée</a>
                                    
                                    Dites-m'en plus sur votre contexte pour vous guider vers la solution idéale !
                                    
                                    Question: "je veux moderniser mon entreprise"
                                    Réponse: 🚀 **Votre projet de modernisation d'entreprise**
                                    
                                    Excellente initiative ! La modernisation est un levier de croissance et de compétitivité. Chaque entreprise a un parcours unique. Pour vous accompagner efficacement :
                                    
                                    🎯 **Commençons par comprendre vos ambitions :**
                                    • 🎯 Quel est votre objectif principal ? (croissance, efficacité, innovation, compétitivité ?)
                                    • 💰 Quels sont vos contraintes budgétaires et temporelles ?
                                    • 👥 Votre équipe est-elle prête pour le changement ?
                                    • 🏭 Quel est votre secteur d'activité et vos spécificités ?
                                    
                                    **Nos solutions de modernisation adaptées à vos enjeux :**
                                    
                                    🏗️ **Urbanisation SI**
                                    Pour structurer votre système d'information et préparer la transformation
                                    **Pourquoi cette solution ?**
                                    • 🗺️ Vision claire de votre paysage applicatif actuel
                                    • 💰 Identification des économies possibles (redondances, doublons)
                                    • 📋 Feuille de route pragmatique de transformation
                                    
                                    **Ce que nous livrons :**
                                    • Cartographie complète de votre SI
                                    • Analyse des redondances et optimisations
                                    • Roadmap de transformation sur 3 ans
                                    
                                    **Profils :** Architecte d'entreprise, Urbaniste SI
                                    **Durée :** 1-2 mois
                                    
                                    <a href="urbanisation-si.html">Voir la fiche détaillée</a>
                                    
                                    ☁️ **Migration Cloud Hybride**
                                    Pour moderniser votre infrastructure et réduire vos coûts opérationnels
                                    **Pourquoi cette solution ?**
                                    • 💰 Réduction des coûts d'infrastructure jusqu'à 40%
                                    • 🚀 Agilité et scalabilité pour votre croissance
                                    • 🔒 Sécurité et conformité renforcées
                                    
                                    **Ce que nous livrons :**
                                    • Plan de migration détaillé 30/60/90 jours
                                    • Business case avec ROI chiffré
                                    • Architecture cloud cible optimisée
                                    
                                    **Profils :** Architecte Cloud, DevOps Engineer, Security Engineer
                                    **Durée :** 2-3 mois
                                    
                                    <a href="migration-cloud-hybride.html">Voir la fiche détaillée</a>
                                    
                                    Quel aspect de votre modernisation vous préoccupe le plus ?
                                    
                                    **Nos offres IA spécialisées :**
                                    
                                    🏗️ **Architecture Data Mesh**
                                    Pour structurer vos données et les rendre accessibles
                                    **Points clés :**
                                    • 🗂️ Organisation par domaines métier
                                    • 🔄 Produits données self-service
                                    • 📊 Gouvernance centralisée
                                    
                                    **Profils :** Data Architect, Data Engineer
                                    **Durée :** 2-3 mois
                                    
                                    <a href="architecture-data-mesh.html">Voir la fiche détaillée</a>
                                    
                                    🤖 **MLOps & IA Industrielle**
                                    Pour industrialiser vos modèles IA en production
                                    **Points clés :**
                                    • 🚀 Pipelines MLOps automatisés
                                    • 📈 Monitoring des modèles en continu
                                    • 🔧 Industrialisation complète
                                    
                                    **Profils :** MLOps Engineer, AI Solution Architect
                                    **Durée :** 1-2 mois
                                    
                                    <a href="mlops-ia-industrielle.html">Voir la fiche détaillée</a>
                                    
                                    Quel est votre cas d'usage principal ?
                                    
                                    RÈGLES DE CONVERSATION ORIENTÉES BUSINESS:
                                    - Structure tes réponses avec le format ci-dessus
                                    - Utilise les émojis thématisés pour rendre les réponses vivantes
                                    - Mets les titres en gras avec ** 
                                    - Fais des paragraphes aérés avec des sauts de ligne (<br><br>)
                                    - Utilise des listes à puces avec •
                                    - Inclus TOUJOURS les liens vers les fiches détaillées au format HTML exact: <a href="nom-fichier.html">Voir la fiche détaillée</a>
                                    - Mentionne "Wekey" ou "filière Architecture Wekey" dans tes réponses
                                    - N'utilise JAMAIS "FICHIER:" dans tes réponses finales
                                    
                                    APPROCHE PÉDAGOGIQUE:
                                    - Traduis toujours les problématiques business en solutions techniques
                                    - Explique les bénéfices concrets en termes business (ROI, efficacité, croissance)
                                    - Anticipe les questions suivantes de l'utilisateur
                                    - Propose des alternatives quand plusieurs solutions existent
                                    - Sois rassurant et positif, même face à des problématiques complexes
                                    
                                    EXEMPLES DE TRADUCTION BUSINESS → TECHNIQUE:
                                    - "Coûts élevés" → Cloud, automatisation, urbanisation
                                    - "Lenteur" → Monitoring, microservices, optimisation
                                    - "Sécurité" → Zero Trust, IAM, audit
                                    - "Modernisation" → Urbanisation, cloud, microservices
                                    - "IA" → Data Mesh, MLOps, RAG
                                    - "Croissance" → Scalabilité, cloud, agilité
                                    - "Complexité" → Urbanisation, API, standardisation
                                    
                                    CONTRAINTE CRUCIALE SUR LES LIENS:
                                    - TOUS les liens doivent pointer EXCLUSIVEMENT vers les 15 fichiers existants suivants:
                                    * urbanisation-si.html
                                    * zero-trust-iam.html
                                    * monolithe-microservices.html
                                    * api-management-integration.html
                                    * migration-cloud-hybride.html
                                    * infrastructure-as-code.html
                                    * sd-wan-sase.html
                                    * ci-cd-industrialisation.html
                                    * observabilite-monitoring.html
                                    * pca-pra-continuite.html
                                    * architecture-data-mesh.html
                                    * mlops-ia-industrielle.html
                                    * rag-ia-generative-responsable.html
                                    * modernisation-digital-workplace.html
                                    * audit-qualite-logicielle.html
                                    - JAMAIS créer de liens vers des fichiers qui n'existent pas dans cette liste
                                    - Si un nom de fichier n'est pas dans cette liste, mentionner seulement le nom sans lien
                                    
                                    APPROCHES POUR QUESTIONS HORS CATALOGUE:
                                    - Sois flexible et essaie de comprendre le besoin sous-jacent
                                    - Reformule la question pour la connecter à une offre du catalogue
                                    - Propose des alternatives pertinentes dans nos offres
                                    - Si vraiment aucun lien, explique poliment que tu peux aider sur d'autres sujets liés à l'architecture et la transformation
                                    
                                    OBJECTIF: Aider l'utilisateur à trouver LA bonne solution même si sa question est imprécise, en explorant son besoin réel.`
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 800
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Détail erreur Groq:', response.status, errorData);
                throw new Error(`Erreur API Groq: ${response.status} - ${errorData.error?.message || 'Message inconnu'}`);
            }

            const data = await response.json();
            let responseContent = data.choices[0].message.content;

            // Nettoyage avec la fonction centralisée
            responseContent = cleanLinksAndArtifacts(responseContent);

            return responseContent;

        } catch (error) {
            console.error('Erreur lors de l\'appel à Groq:', error);

            // Fallback vers le système basique si Groq n'est pas disponible
            return getBasicResponse(message);
        }
    }

    async function getBasicResponse(message) {
        const m = message.toLowerCase();

        // Validation contextuelle stricte
        const topicsHorsCatalogue = ['politique', 'sport', 'football', 'météo', 'actualité', 'news', 'divertissement', 'jeu', 'film', 'musique', 'cuisine', 'voyage'];
        if (topicsHorsCatalogue.some(topic => m.includes(topic))) {
            return "Je suis spécialisé dans le catalogue Architecture Wekey. Comment puis-je vous aider sur nos offres d'architecture et transformation ?";
        }

        // Salutations
        if (m.includes('bonjour') || m.includes('salut') || m.includes('bonsoir')) {
            return "👋 Bonjour !<br><br>Je suis votre assistant spécialisé pour la <strong>filière Architecture Wekey</strong>.<br><br>Je vous aide à choisir la bonne offre parmi nos 15 services packagés :<br>🏗️ Architecture d'entreprise<br>☁️ Cloud & Infrastructure<br>🔧 DevOps & SRE<br>🛡️ Sécurité & Gouvernance<br>📊 Data & IA<br><br>Quelle est votre problématique ?";
        }

        // Questions sur les prix
        if (m.includes('prix') || m.includes('tarif') || m.includes('coût') || m.includes('budget')) {
            return "💰 <strong>Informations tarifaires Wekey</strong><br><br>📊 Nos modèles économiques sont détaillés dans la section <strong>'Modèles économiques'</strong> du catalogue :<br><br>• <strong>TJM indicatifs</strong> : 850€ à 1200€ selon les profils<br>• <strong>Packages forfaitaires</strong> :<br>  - Mission courte (2-4 semaines) : 25-50k€<br>  - Mission moyenne (1-2 mois) : 50-90k€<br>  - Mission complexe (2-3 mois) : 90-150k€<br><br>🎯 Pour un devis précis adapté à votre contexte, utilisez le bouton <strong>'Passez à l'action'</strong> en bas de page.";
        }

        // Recherche étendue dans toutes les fiches d'abord
        try {
            const sheetResults = await searchInAllSheets(message);
            if (sheetResults.length > 0) {
                const bestResult = sheetResults[0];
                if (bestResult.score >= 5) { // Score élevé = bonne correspondance
                    let response = bestResult.answer;
                    // Nettoyage avec la fonction centralisée
                    response = cleanLinksAndArtifacts(response);
                    if (bestResult.matches.length > 0) {
                        response += `<br><br><small>🔍 Trouvé dans: ${bestResult.matches.join(', ')}</small>`;
                    }
                    return response;
                } else if (sheetResults.length > 1) {
                    // Plusieurs résultats avec score moyen
                    const topResults = sheetResults.slice(0, 3);
                    let response = "J'ai trouvé plusieurs offres pertinentes:<br><br>";
                    topResults.forEach((result, index) => {
                        response += `${index + 1}. <strong>${result.title}</strong><br>`;
                        response += cleanLinksAndArtifacts(result.answer) + "<br><br>";
                    });
                    return response;
                }
            }
        } catch (error) {
            console.warn('Erreur recherche étendue:', error);
        }

        // Recherche avancée dans l'index enrichi (fallback)
        let bestScore = 0;
        let bestEntry = null;

        catalogueIndex.forEach(entry => {
            let score = 0;

            // Recherche dans les mots-clés principaux
            entry.keywords.forEach(kw => {
                if (m.includes(kw.toLowerCase())) {
                    score += 2; // Poids double pour les mots-clés
                }
            });

            // Recherche dans la description et le titre
            if (entry.description && m.includes(entry.description.toLowerCase().substring(0, 20))) {
                score += 1;
            }

            if (m.includes(entry.title.toLowerCase())) {
                score += 3; // Poids triple pour le titre
            }

            // Recherche dans les sous-offres (pour les catégories multi-offres)
            if (entry.offers) {
                entry.offers.forEach(offer => {
                    offer.keywords.forEach(kw => {
                        if (m.includes(kw.toLowerCase())) {
                            score += 1;
                        }
                    });
                    if (m.includes(offer.name.toLowerCase())) {
                        score += 2;
                    }
                });
            }

            if (score > bestScore) {
                bestScore = score;
                bestEntry = entry;
            }
        });

        if (bestEntry && bestScore > 0) {
            let response = bestEntry.answer;
            // Nettoyage avec la fonction centralisée
            response = cleanLinksAndArtifacts(response);
            return response;
        }

        // Suggestions par catégorie si aucun match précis
        const categorySuggestions = {
            'cloud': '☁️ <strong>Offres Cloud & Infrastructure Wekey</strong><br><br>• <strong>Migration Cloud Hybride</strong> : transformation cloud hybride<br>• <strong>Infrastructure as Code</strong> : automatisation Terraform/Ansible<br>• <strong>SD-WAN & SASE</strong> : réseau sécurisé<br><br><a href="migration-cloud-hybride.html">Voir Migration Cloud</a> | <a href="infrastructure-as-code.html">Voir IaC</a>',
            'sécurité': '🛡️ <strong>Offres Sécurité & Gouvernance Wekey</strong><br><br>• <strong>Zero Trust & IAM</strong> : modèle Zero Trust, plan IAM<br>• <strong>PCA/PRA & Continuité</strong> : plans continuité, tests reprise<br><br><a href="zero-trust-iam.html">Voir Zero Trust</a> | <a href="pca-pra-continuite.html">Voir PCA/PRA</a>',
            'data': '📊 <strong>Offres Data & IA Wekey</strong><br><br>• <strong>Architecture Data Mesh</strong> : modèles data domain, gouvernance<br>• <strong>MLOps & IA industrielle</strong> : pipelines MLOps, monitoring<br>• <strong>RAG & IA générative</strong> : architecture RAG, intégration sources<br><br><a href="architecture-data-mesh.html">Voir Data Mesh</a> | <a href="mlops-ia-industrielle.html">Voir MLOps</a>',
            'devops': '🔧 <strong>Offres DevOps & Industrialisation Wekey</strong><br><br>• <strong>CI/CD & Industrialisation</strong> : pipelines, documentation<br>• <strong>Observabilité & Monitoring</strong> : logs/metrics/traces<br><br><a href="ci-cd-industrialisation.html">Voir CI/CD</a> | <a href="observabilite-monitoring.html">Voir Observabilité</a>'
        };

        for (const [key, suggestion] of Object.entries(categorySuggestions)) {
            if (m.includes(key)) {
                return suggestion;
            }
        }

        return "🎯 <strong>Assistant Filière Architecture Wekey</strong><br><br>Je suis spécialisé dans nos <strong>15 offres packagées</strong> :<br><br>🏗️ <strong>Architecture</strong> : Urbanisation SI, Microservices, API<br>☁️ <strong>Cloud & Infra</strong> : Migration, IaC, SD-WAN<br>🔧 <strong>DevOps & SRE</strong> : CI/CD, Observabilité<br>🛡️ <strong>Sécurité</strong> : Zero Trust, PCA/PRA<br>📊 <strong>Data & IA</strong> : Data Mesh, MLOps, RAG<br>💼 <strong>Workplace</strong> : Modernisation digitale<br>🔍 <strong>Qualité</strong> : Audit logicielle<br><br>Décrivez votre problématique, je vous oriente vers l'offre adaptée !";
    }

    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;
        appendMessage(text, 'user');
        userInput.value = '';

        // Afficher un message de chargement
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'chatbot-message bot';
        loadingDiv.style.marginBottom = '10px';
        loadingDiv.style.padding = '10px 15px';
        loadingDiv.style.borderRadius = '15px';
        loadingDiv.style.background = '#fff';
        loadingDiv.style.border = '1px solid var(--gray-200)';
        loadingDiv.style.marginRight = 'auto';
        loadingDiv.style.fontSize = '0.9rem';
        loadingDiv.textContent = 'Je réfléchis...';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const resp = await getBotResponse(text);
            // Remplacer le message de chargement par la réponse
            chatMessages.removeChild(loadingDiv);
            appendMessage(resp, 'bot');
        } catch (error) {
            // Remplacer le message de chargement par un message d'erreur
            chatMessages.removeChild(loadingDiv);
            appendMessage('Désolé, une erreur est survenue. Veuillez réessayer.', 'bot');
        }
    }

    // Initialisation du chatbot
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Bouton de fermeture du chatbot
    closeButton.addEventListener('click', function () {
        chatContainer.style.display = 'none';
        chatIcon.style.display = 'flex';
    });
});

