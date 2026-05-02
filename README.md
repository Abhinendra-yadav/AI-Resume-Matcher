# AI-Resume-Matcher
# 🚀 AI Resume Matcher & Skill Gap Analyzer

A modern full-stack application that helps candidates match their resumes with job descriptions. The app uses AI to calculate a match score and identify missing keywords.

## ✨ Features
 -PDF Text Extraction: Extracts all text from resume PDFs.
  NLP Matching: Uses TF-IDF and Cosine Similarity (via Scikit-learn) to calculate an accurate match percentage.
  Skill Gap Analysis: Identifies keywords present in the job description but missing from the resume.
  Modern UI: Clean and responsive interface built with React and TypeScript.

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


