# AI-Resume-Matcher
# 🚀 AI Resume Matcher & Skill Gap Analyzer

Ek modern Full-Stack application jo candidates ki help karti hai unke resume ko Job Descriptions ke saath match karne mein. Yeh app AI ka use karke match score aur missing keywords batati hai.

## ✨ Features
- **PDF Text Extraction:** Resume (PDF) se saara text extract karta hai.
- **NLP Matching:** Scikit-learn ke `TF-IDF` aur `Cosine Similarity` ka use karke accurate match percentage nikalta hai.
- **Skill Gap Analysis:** Job Description mein se un keywords ko dhundta hai jo aapke resume mein missing hain.
- **Modern UI:** Clean aur responsive interface React aur TypeScript ke saath.

## 🛠️ Tech Stack
- **Frontend:** React.js, TypeScript, Axios
- **Backend:** FastAPI (Python), Uvicorn
- **Data Science:** Scikit-learn (NLP), NumPy
- **PDF Processing:** PyPDF

## ⚙️ Installation & Setup

### 1. Backend Setup
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # Windows ke liye: .\venv\Scripts\activate
pip install fastapi uvicorn pypdf scikit-learn
python main.py

### Frontend Setup
cd frontend
npm install
npm install axios
npm start


