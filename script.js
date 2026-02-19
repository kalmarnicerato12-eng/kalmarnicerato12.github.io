document.addEventListener('DOMContentLoaded', () => {
    const btnPublish = document.getElementById('btn-publish');
    const mainInput = document.getElementById('main-input');
    const categorySelect = document.getElementById('category-select');
    const questionsFeed = document.getElementById('questions-feed');
    const categoriesList = document.getElementById('categories-list');

    // --- Funcionalidad de Publicación de Preguntas y Respuestas ---
    btnPublish.addEventListener('click', () => {
        const text = mainInput.value.trim();
        const category = categorySelect.value;

        if (!text) {
            alert("¡Por favor, escribe tu duda antes de publicar!");
            return;
        }

        // Crear Tarjeta de Pregunta
        const card = document.createElement('div');
        card.className = 'question-card';
        card.dataset.category = category; // Para filtrar
        
        card.innerHTML = `
            <span class="tag">${category}</span>
            <p style="font-size: 1.1rem; margin: 10px 0;">${text}</p>
            
            <div class="actions">
                <button class="btn-action btn-upvote">⬆️ <span class="vote-count">0</span></button>
                <button class="btn-action btn-toggle-replies">💬 <span class="reply-count">0</span> Respuestas</button>
            </div>

            <div class="replies-section" style="display: none;">
                <div class="replies-list"></div>
                <div class="reply-input-group">
                    <input type="text" class="reply-input" placeholder="Escribe una respuesta...">
                    <button class="btn-send-reply">Enviar</button>
                </div>
            </div>
        `;

        // Insertar al inicio del feed
        questionsFeed.prepend(card);
        mainInput.value = ""; // Limpiar el input principal

        // --- Lógica de Interacción Interna de la Tarjeta ---
        const upvoteBtn = card.querySelector('.btn-upvote');
        const toggleBtn = card.querySelector('.btn-toggle-replies');
        const repliesSection = card.querySelector('.replies-section');
        const sendReplyBtn = card.querySelector('.btn-send-reply');
        const replyInput = card.querySelector('.reply-input');
        const repliesList = card.querySelector('.replies-list');
        const replyCountSpan = card.querySelector('.reply-count');
        const voteCountSpan = card.querySelector('.vote-count');

        // 1. Votos
        let votes = 0;
        upvoteBtn.addEventListener('click', () => {
            votes++;
            voteCountSpan.innerText = votes;
            upvoteBtn.style.color = "#4f46e5"; // Cambiar color al votar
        });

        // 2. Mostrar/Ocultar respuestas
        toggleBtn.addEventListener('click', () => {
            const isHidden = repliesSection.style.display === 'none';
            repliesSection.style.display = isHidden ? 'block' : 'none';
            toggleBtn.style.color = isHidden ? "#4f46e5" : "#64748b"; // Cambiar color al abrir
        });

        // 3. Agregar Respuesta
        sendReplyBtn.addEventListener('click', () => {
            const replyText = replyInput.value.trim();
            if (replyText) {
                const replyDiv = document.createElement('div');
                replyDiv.className = 'reply-item';
                replyDiv.innerHTML = `<strong>Compañero:</strong> ${replyText}`;
                
                repliesList.appendChild(replyDiv);
                replyInput.value = ""; // Limpiar el input de respuesta
                
                // Actualizar contador de respuestas
                replyCountSpan.innerText = repliesList.children.length;
            }
        });

        // Permitir enviar respuesta con Enter
        replyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendReplyBtn.click();
        });
    });

    // --- Funcionalidad de Filtrado por Categorías ---
    categoriesList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            // Remover 'active' de todas las categorías
            document.querySelectorAll('#categories-list li').forEach(li => li.classList.remove('active'));
            // Añadir 'active' a la categoría clickeada
            e.target.classList.add('active');

            const selectedCategory = e.target.dataset.category;
            const allQuestions = questionsFeed.querySelectorAll('.question-card');

            allQuestions.forEach(card => {
                if (selectedCategory === 'General' || card.dataset.category === selectedCategory) {
                    card.style.display = 'block'; // Mostrar la pregunta
                } else {
                    card.style.display = 'none'; // Ocultar
                }
            });
        }
    });

    // --- Funcionalidad del Bot de IA ---
    const aiChatbot = document.getElementById('ai-chatbot');
    const toggleChatBtn = document.getElementById('toggle-chat-visibility');
    const chatWindow = document.getElementById('chat-window');
    const chatInputArea = document.getElementById('chat-input-area'); // Este no existe, se usa el ID del input
    const userMsgInput = document.getElementById('user-msg');
    const sendAiBtn = document.getElementById('send-ai');

    // Toggle para mostrar/ocultar el chat
    toggleChatBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('chat-hidden');
        userMsgInput.closest('.chat-input-area').classList.toggle('chat-hidden');
        toggleChatBtn.innerText = chatWindow.classList.contains('chat-hidden') ? '_' : 'X'; // Cambiar icono
        if (!chatWindow.classList.contains('chat-hidden')) {
            chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll al final al abrir
            userMsgInput.focus();
        }
    });

    function addMessageToChat(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg ${sender}`;
        msgDiv.innerText = text;
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll
    }

    // Lógica simulada de la IA
    function getAiResponse(message) {
        const input = message.toLowerCase();
        
        // Simulación de respuestas basadas en palabras clave
        if (input.includes("hola")) return "¡Hola! Soy EduBot, tu asistente de estudio. ¿En qué materia te gustaría que te ayude hoy?";
        if (input.includes("matemáticas") || input.includes("matematica")) return "Claro, ¿tienes alguna pregunta sobre álgebra, cálculo o geometría?";
        if (input.includes("historia")) return "¡La historia es fascinante! Pregúntame sobre cualquier evento o figura histórica.";
        if (input.includes("física") || input.includes("fisica")) return "La física es la clave para entender el universo. ¿Sobre qué ley o concepto quieres saber?";
        if (input.includes("química") || input.includes("quimica")) return "Desde elementos hasta reacciones complejas, ¡la química es mi especialidad! ¿Cuál es tu duda?";
        if (input.includes("programación") || input.includes("programacion")) return "Puedo darte consejos básicos de Python, JavaScript o lógica de programación. ¿Qué necesitas?";
        if (input.includes("fotosíntesis")) return "La fotosíntesis es el proceso bioquímico por el cual las plantas, algas y bacterias fotosintéticas convierten la energía de la luz solar en energía química.";
        if (input.includes("derivada")) return "En cálculo, la derivada de una función es la razón de cambio instantánea de la función con respecto a una de sus variables. Por ejemplo, la derivada de x² es 2x.";
        if (input.includes("revolución francesa")) return "La Revolución Francesa fue un conflicto social y político, con diversos periodos de violencia, que convulsionó Francia y, por extensión, sus implicaciones a otras naciones de Europa que enfrentaban a partidarios y opositores del sistema conocido como el Antiguo Régimen. Se inició con la toma de la Bastilla en 1789.";
        if (input.includes("agua")) return "La fórmula química del agua es H₂O, lo que significa que cada molécula de agua está compuesta por dos átomos de hidrógeno y un átomo de oxígeno.";
        if (input.includes("ecuación cuadrática") || input.includes("ecuacion cuadratica")) return "Una ecuación cuadrática es una ecuación de la forma ax² + bx + c = 0. Se puede resolver con la fórmula general: x = [-b ± √(b²-4ac)] / 2a.";
        
        return "No tengo esa información en mi base de datos actual, pero te recomiendo que publiques tu pregunta en el foro. ¡Quizás un compañero pueda ayudarte!";
    }

    sendAiBtn.addEventListener('click', () => {
        const text = userMsgInput.value.trim();
        if (!text) return;

        addMessageToChat(text, 'user');
        userMsgInput.value = "";

        // Simular tiempo de "pensamiento" de la IA
        setTimeout(() => {
            const response = getAiResponse(text);
            addMessageToChat(response, 'bot');
        }, 800);
    });

    // Permitir enviar con la tecla Enter para el bot
    userMsgInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendAiBtn.click();
    });
});