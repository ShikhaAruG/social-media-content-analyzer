# 📊 Social Media Content Analyzer

A full-stack web app that extracts text from **PDFs** and analyzes it for **readability, sentiment, hashtags, mentions, CTAs, and content length**. It then provides suggestions to improve engagement.

---

## 🔎 Overview
The tool helps content creators, marketers, and social media managers quickly refine their posts before publishing.  
It supports **PDF uploads with text extraction** and runs **sentiment/readability analysis** with actionable recommendations.

---

## 🏗️ Architecture

- **Frontend**:  
  - [Next.js](https://nextjs.org/) + [TailwindCSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)  
  - Deployed on **Vercel**  

- **Backend**:  
  - [FastAPI](https://fastapi.tiangolo.com/)  
  - **Text Extraction** → PyMuPDF (for PDFs only)  
  - **Analysis** → VADER Sentiment + Textstat Readability  
  - Deployed on **Render**

- **API Communication**:  
  Frontend calls backend endpoints (`/extract`, `/analyze`) via  
  `NEXT_PUBLIC_API_BASE_URL`

---

## ⚙️ Usage

1. Visit the deployed frontend on Vercel  
   👉 `https://social-media-content-analyzer-kappa.vercel.app/`  
2. Upload a **PDF file**.  
3. Extracted text will appear in the editor box.  
4. Click **Analyze** → view **sentiment, readability scores, and improvement tips**.

---

## 🚀 Deployment Details

- **Backend (FastAPI)** → Hosted on Render  
  - Endpoints:  
    - `/extract` → Extracts text from PDF  
    - `/analyze` → Runs sentiment & readability analysis  

- **Frontend (Next.js)** → Hosted on Vercel  
  - Environment variable links to backend API:  
    ```env
    NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com
    ```

---

## 👥 Target Users
- Content creators  
- Marketers  
- Social media managers  

Anyone who wants quick insights to **optimize social media content**.

---

## ✨ Features
- ✅ PDF upload with text extraction  
- ✅ Sentiment analysis (positive/neutral/negative)  
- ✅ Readability score (easy/medium/hard)  
- ✅ Suggestions for hashtags, mentions & CTAs  
- ✅ Dark-themed dashboard with smooth animations  

---

## 📌 Tech Stack
**Frontend**: Next.js, TailwindCSS, Framer Motion  
**Backend**: FastAPI, PyMuPDF, VADER, Textstat  
**Hosting**: Vercel (frontend), Render (backend)

---
