const OPENAI_API_KEY = ""; // Replace with your actual key
const API_URL = "https://api.openai.com/v1/chat/completions";

const MODELS = {
    "GPT-4 Turbo": "gpt-4-turbo",
    "GPT-3.5 Turbo": "gpt-3.5-turbo"
};

let currentModel = MODELS["GPT-4 Turbo"];

document.addEventListener("mouseup", () => {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        showPopup(selectedText);
    }
});

function showPopup(text) {
    let popup = document.getElementById("cheatai-popup");

    if (!popup) {
        popup = document.createElement("div");
        popup.id = "cheatai-popup";
        popup.innerHTML = `
            <header id="cheatai-header">
                CheatAI 
                <select id="model-select">
                    ${Object.keys(MODELS).map(model => `<option value="${MODELS[model]}">${model}</option>`).join("")}
                </select>
                <span id="cheatai-close">×</span>
            </header>
            <div id="cheatai-response">Thinking...</div>
        `;
        document.body.appendChild(popup);

        document.getElementById("cheatai-close").onclick = () => popup.style.display = "none";
        document.getElementById("model-select").onchange = (e) => {
            currentModel = e.target.value;
        };

        makePopupDraggable(popup);
    }

    popup.style.display = "block";
    popup.style.bottom = "20px";
    popup.style.right = "20px";

    fetchAIResponse(text);
}

async function fetchAIResponse(text) {
    const responseBox = document.getElementById("cheatai-response");
    responseBox.innerText = ""; // Clear previous text

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: currentModel,
                messages: [{ role: "system", content: "You are a helpful AI assistant." },
                            { role: "user", content: text }],
                temperature: 0.7,
                stream: true // Enable streaming
            })
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let partialText = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            partialText += decoder.decode(value, { stream: true });
            responseBox.innerText = partialText;
            responseBox.scrollTop = responseBox.scrollHeight; // Auto-scroll as text appears
        }

    } catch (error) {
        console.error("Error:", error);
        responseBox.innerText = `Error: ${error.message}`;
    }
}

function makePopupDraggable(popup) {
    let header = popup.querySelector("#cheatai-header");

    let offsetX = 0, offsetY = 0, isDragging = false;

    header.onmousedown = (e) => {
        isDragging = true;
        offsetX = e.clientX - popup.offsetLeft;
        offsetY = e.clientY - popup.offsetTop;
        document.onmousemove = onMouseMove;
        document.onmouseup = () => {
            isDragging = false;
            document.onmousemove = null;
        };
    };

    function onMouseMove(e) {
        if (!isDragging) return;
        popup.style.left = e.clientX - offsetX + "px";
        popup.style.top = e.clientY - offsetY + "px";
    }
}
