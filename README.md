# Compliance Catastrophe - AI-Driven Compliance Training Game

## 🚀 Overview
Compliance Catastrophe is an AI-powered simulation game where players take on the role of a compliance officer managing vendor approvals in a complex supply chain. Players must evaluate vendors based on compliance risks, using AI-generated vendor profiles and risk assessments. The game balances risk, ethics, and strategy, ensuring an engaging and impactful learning experience.

## 🎯 Objective
This game was developed as part of the **AI-Driven Compliance Training Challenge**. The goal is to create a **non-quiz-based** game mechanic that effectively teaches compliance concepts while leveraging AI for **dynamic, scenario-based learning**.

## 📌 Compliance Topic: Supply Chain Risk Management
### Why It Matters
Supply chain compliance is critical in industries like **manufacturing, pharmaceuticals, and retail**. Companies must vet suppliers to avoid issues like **child labor, environmental violations, and financial fraud**. Failing to comply can lead to **legal penalties, reputational damage, and operational disruptions**.

## 🎮 Game Mechanics
- **Turn-Based Strategy:** Players review **AI-generated vendors** and choose whether to **Approve, Audit, or Reject** them.
- **Dynamic Risk Evaluation:** Vendors have **compliance ratings** and hidden risks, making every decision a **balancing act**.
- **Resource Management:** Each action impacts **company resources**, requiring careful planning.
- **Consequence System:** The AI **describes realistic outcomes** for approvals and rejections, ensuring players understand compliance risks in real-world terms.
- **AI-Powered Post-Game Analysis:** If a player **loses the game**, the AI generates a **detailed breakdown** of their decisions, highlighting key mistakes and suggesting **improvements for future playthroughs**.

## 🧠 AI Integration
- **AI-Generated Vendors:** OpenAI via OpenRouter generates **realistic vendor profiles**, each with industry-specific risks and defenses.
- **Adaptive Audit Insights:** AI provides **detailed audit reports** when vendors are investigated, **enhancing learning depth**.
- **Dynamic Consequences:** AI generates **realistic outcomes** based on player decisions, making every playthrough unique.
- **Post-Game Analysis:** Google Gemini via OpenRouter evaluates the player’s decisions and **provides insights** on how they could improve compliance risk management strategies in future rounds.

## 🔧 Tech Stack & Architecture
### 🖥️ Frontend
- **Vue.js 3 + TailwindCSS** for a sleek and engaging UI, using the technology I'm most familiar with.
- **Neo-Brutalist Design:** High-contrast, bold typography, and hard-edged UI components. Modern and stylish!

### 🖥️ Backend
- **Hono.js (Node.js)** for handling AI requests. Ready to be deployed on modern platforms like Cloudflare Workers.
- **OpenRouter (LLM API)** for AI-generated vendor data and playthrough analysis. Allows for fast LLM provider experimentation.

## 🚀 Setup Instructions
### Prerequisites
- Node.js 18+
- A registered **OpenRouter API key**

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/wildsylvan/compliance-catastrophe.git
   cd compliance-catastrophe
   ``` 
2. Set up environment variables:
    ```bash
    cd backend
    ```
   - Create a `.env` file and add:
     ```env
     OPENROUTER_API_KEY=your-api-key
     OPENROUTER_MODEL_VENDORS=openai/gpt-4o-mini
     OPENROUTER_MODEL_ANALYZE=google/gemini-2.0-flash-lite-001
     ```
3. Run the backend:
   ```bash
   npm i
   npm run dev
   ```
4. Run the frontend:
   ```bash
   cd ../frontend
   npm i
   npm run dev
   ```

## 📹 Video Walkthrough
A 5-10 minute walkthrough demonstrating:
1. **Gameplay Mechanics & Compliance Focus**
2. **AI-Driven Vendor Generation & Risk Evaluation**
3. **Technical Architecture & Design Decisions**
4. **AI-Generated Post-Game Analysis**

[YouTube video](https://youtu.be/2-Bv1rmaFWY)

## 📌 Evaluation Criteria
✔ **Creativity & Engagement:** Non-quiz mechanics, real-time decision-making, and AI-driven complexity.

✔ **Technical Depth:** Well-structured **Vue.js frontend** and **Hono.js backend** with seamless AI integration.

✔ **Ownership & Decision-Making:** Thoughtful use of **AI, UX, and scalable tech stack**.

✔ **Clear Documentation & Communication:** This README + **video walkthrough** explains everything concisely.

## 📬 Submission
- **GitHub Repository:** [wildsylvan/compliance-catastrophe](https://github.com/wildsylvan/compliance-catastrophe/)
- **Video Demo:** [YouTube video](https://youtu.be/2-Bv1rmaFWY)
- **Contact Information:** [linkedin.com/in/matteo-gazzoni](https://www.linkedin.com/in/matteo-gazzoni/)

I hope you enjoy Compliance Catastrophe! 🎮🔥