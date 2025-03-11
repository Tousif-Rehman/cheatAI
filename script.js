const MODELS = {
    "LLaMA 3 8B": "meta-llama/Llama-3-8B",
    "Mixtral 8x7B": "mistralai/Mixtral-8x7B",
    "DeepSeek Coder": "deepseek-ai/deepseek-coder"
};

let currentModel = MODELS["LLaMA 3 8B"];

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

function fetchAIResponse(text) {
    const apiKey = "YOUR_TOGETHER_AI_API_KEY"; // Replace with your actual API key
    const endpoint = "https://api.together.xyz/v1/chat/completions";

    fetch(endpoint, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: currentModel,
            messages: [{ role: "user", content: text }],
            max_tokens: 150
        })
    })
    .then(response => response.json())
    .then(data => {
        let reply = data.choices?.[0]?.message?.content || "No response.";
        document.getElementById("cheatai-response").innerText = reply;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("cheatai-response").innerText = "Error fetching response.";
    });
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
