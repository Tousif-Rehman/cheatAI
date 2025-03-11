const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4-turbo";

let OPENAI_API_KEY = localStorage.getItem("openai_api_key");

if (!OPENAI_API_KEY) {
    alert("⚠️ OpenAI API Key not found! Please set it using localStorage.\n\nOpen DevTools (F12) -> Console and run:\nlocalStorage.setItem('openai_api_key', 'your-secret-key-here');");
}

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
    responseBox.innerHTML = ""; // Clear previous response

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: "system", content: "You are a helpful assistant." },
                            { role: "user", content: text }],
                temperature: 0.7,
                max_tokens: 500,
                stream: true,  // Enable streaming
            })
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            let chunk = decoder.decode(value, { stream: true });

            try {
                chunk.split("\n").forEach(line => {
                    if (line.startsWith("data:")) {
                        let jsonData = JSON.parse(line.substring(5));
                        let newText = jsonData.choices[0]?.delta?.content || "";
                        accumulatedText += newText;
                        responseBox.innerHTML = accumulatedText;
                        responseBox.style.maxHeight = "none"; // Expand dynamically
                    }
                });
            } catch (e) {
                console.error("Streaming Error:", e);
            }
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
