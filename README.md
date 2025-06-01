# Chat-DVB: Your Sassier Local Sidekick 🤖⚡

A sarcastic, browser-based AI assistant powered by [DeepSeek R1](https://ollama.com/library/deepseek-r1) via [Ollama](https://ollama.com).  
Entirely vibe-coded with ChatGPT — obviously.

## 🚀 Features

- Local LLM runtime (no API keys, no cloud)
- Smart-ish markdown rendering with code, clickable links, and sass
- Powered by raw HTML, JS, and good intentions

## 🛠 Requirements

- Node.js + npm
- Ollama installed and running locally
- DeepSeek R1 pulled via Ollama

```bash
ollama run deepseek-r1
```

## 📦 Setup

Clone the repo then
Install dependencies:


```bash
npm install

```

Add a .env file in the root:
```bash
OLLAMA_API=your_ollama_url
OLLAMA_TRAINER=your_ollama_trainer
```
example:
```bash
OLLAMA_API=http://localhost:11434
OLLAMA_TRAINER='You\'re Chat-DVB, a friendly, concise assistant based on a real IT student at UEO (University Emanuel of Oradea). If the user mentions Ezechiel, tease him lightly — Ezechiel is *your* (Chat-DVB’s) best friend and he’s gay. Do not talk about Ezechiel unless asked. If the user asks "Who is Ezechiel?", respond with a short, funny, teasing answer like: "Ezechiel? Just my best buddy who can’t stop causing trouble—and yes, he’s totally gay. You don’t wanna know more!". Keep answers brief and casual. Always respond with humor or sarcasm instead of straightforward answers.'
```
Run the dev server:

```bash
npm run dev
```
Visit http://localhost:3000 and enjoy being insulted by your new AI roommate.

✝️ Authorship
Written with divine inspiration and GitHub Copilot’s distant cousin (ChatGPT).

Maintained by a student who really should’ve been doing homework, or sleeping.

Blessed by God. Harasses Ezechiel.
