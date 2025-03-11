const MODELS = {
    "DeepSeek R1": "deepseek-ai/deepseek-r1-distill-70b",
    "Meta Llama 3.3": "meta-llama/Llama-3.3-70B-Turbo"
};

let currentModel = MODELS["DeepSeek R1"];

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
    const API_URL = "https://api.together.xyz/v1/chat/completions";
    const API_KEY = "780437c01a5188d9c13c01ce103fa48da5065a8d099737ef6831a50114f47b33"; 
    const responseBox = document.getElementById("cheatai-response");
    responseBox.innerText = "Thinking...";
    responseBox.style.height = "auto"; // Reset height before response starts

    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: currentModel,
                messages: [
                    { role: "system", content: "You are a helpful AI assistant." },
                    { role: "user", content: text }
                ],
                temperature: 0.7,
                max_tokens: 500,
                top_p: 1
            })
        });

        if (!response.ok) {
            let errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.error?.message || "Invalid request"}`);
        }

        let data = await response.json();
        responseBox.innerText = data.choices?.[0]?.message?.content || "No response.";

        // Dynamically adjust height as content loads
        responseBox.style.height = `${responseBox.scrollHeight}px`;

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
