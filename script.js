const MODELS = {
    "LLaMA 3 8B (Technical)": "meta-llama/Llama-3-8B",
    "Mixtral 8x7B (Math)": "mistralai/Mixtral-8x7B",
    "DeepSeek Coder (Coding)": "deepseek-ai/deepseek-coder"
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

async function fetchAIResponse(text) {
    const API_URL = "https://api.together.xyz/v1/chat/completions";
    const API_KEY = "780437c01a5188d9c13c01ce103fa48da5065a8d099737ef6831a50114f47b33"; // Replace with actual key

    const responseBox = document.getElementById("cheatai-response");

    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistralai/Mixtral-8x7B-Instruct",  // Use "meta-llama/Llama-3-8B-Instruct" or "deepseek-ai/deepseek-coder" if needed
                messages: [{ role: "system", content: "You are a helpful AI assistant." },
                            { role: "user", content: text }],
                temperature: 0.7,
                max_tokens: 300,
                top_p: 1
            })
        });

        let data = await response.json();

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${data.error?.message || "Invalid request"}`);
        }

        responseBox.innerText = data.choices?.[0]?.message?.content || "No response.";
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
