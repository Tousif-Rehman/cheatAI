# **CheatAI - Floating AI Assistant**  
CheatAI is a **floating AI assistant** that overlays on web pages, detects selected text, and provides AI-generated responses using **Together AI's free models**.  

## **🚀 Features**
- 🧠 **AI-powered** responses (LLaMA 3, Mixtral, DeepSeek Coder)  
- 🎭 **Draggable & resizable** floating UI  
- 📝 **Auto-detects selected text**  
- 🔄 **Switch between AI models dynamically**  

---

## **📂 Project Structure**
```
/cheatai
  ├── index.html       # Main HTML structure
  ├── script.js        # AI logic & popup behavior
  ├── style.css        # Styling for the floating UI
  ├── vercel.json      # Vercel deployment config
  ├── README.md        # Project documentation
```

---

## **🛠 Setup & Usage**  
### **1️⃣ Deploy on Vercel**  
#### **Option 1: Using Vercel CLI**  
```sh
npm install -g vercel
vercel deploy --prod
```
#### **Option 2: Manually via GitHub**  
1. Upload files to a GitHub repository  
2. Connect it to Vercel  
3. Deploy & get your **Live URL**  

### **2️⃣ Embed CheatAI on Any Website**  
Add this to your website's `<head>`:  
```html
<script src="https://cheatai.vercel.app/script.js"></script>
<link rel="stylesheet" href="https://cheatai.vercel.app/style.css">
```

---

## **⚡ How It Works**
1. **Select text** on any webpage  
2. **CheatAI detects it** and sends it to **Together AI API**  
3. **Floating popup appears** with AI-generated results  
4. **Switch models** for different AI responses  

---