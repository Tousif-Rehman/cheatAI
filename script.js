const API_URL = "https://api.kimi.com/v1/chat/completions";  // Replace with actual Kimi AI API URL
const API_KEY = "sk-HumsdF8LOzx347MH6pfZquV1iG5cfPQywq0NKnQNUs4qSMzQ";  // Replace with your actual API key

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
                <span id="cheatai-close">×</span>
            </header>
            <div id="cheatai-response">Thinking...</div>
        `;
        document.body.appendChild(popup);

        document.getElementById("cheatai-close").onclick = () => popup.style.display = "none";
        makePopupDraggable(popup);
    }

    popup.style.display = "block";
    popup.style.bottom = "20px";
    popup.style.right = "20px";

    fetchAIResponse(text);
}

async function fetchAIResponse(text) {
    const responseBox = document.getElementById("cheatai-response");
    responseBox.innerText = "Thinking...";

    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "kimi-default-model",  // Replace with the correct Kimi model
                messages: [
                    { role: "system", content: "You are a helpful AI assistant." },
                    { role: "user", content: text }
                ],
                temperature: 0.7,
                max_tokens: 300,
                stream: true  // Enable streaming
            })
        });

        if (!response.ok) {
            let errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData.error?.message || "Invalid request"}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let resultText = "";

        responseBox.innerText = ""; // Clear initial "Thinking..." text

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            let chunk = decoder.decode(value, { stream: true });
            resultText += chunk;

            responseBox.innerText = resultText; // Update dynamically
            responseBox.style.maxHeight = "none"; // Expand as needed
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
