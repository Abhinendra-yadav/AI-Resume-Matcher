import os
import io
import pypdf
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# 1. CORS Setup - Vercel frontend ke liye zaroori hai
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Root Route - Taaki Render par "Not Found" na dikhaye
@app.get("/")
def read_root():
    return {"message": "AI Resume Matcher Backend is Running!"}

# PDF se text nikalne ka function
def extract_text_from_pdf(file_bytes):
    reader = pypdf.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

# 3. Main Logic Endpoint
@app.post("/match")
async def match_resume(job_description: str = Form(...), file: UploadFile = File(...)):
    try:
        # Text Extraction
        file_content = await file.read()
        resume_text = extract_text_from_pdf(file_content)
        
        if not resume_text.strip():
            return {"error": "Could not extract text from PDF. Please check the file."}

        # NLP Score Calculation (TF-IDF & Cosine Similarity)
        documents = [resume_text, job_description]
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(documents)
        score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        match_percentage = round(score * 100, 2)

        # --- MISSING KEYWORDS LOGIC ---
        tech_keywords = [
            "python", "java", "react", "sql", "html", "css", "javascript", 
            "c++", "node", "aws", "docker", "git", "api", "fastapi", "mongodb"
        ]
        
        job_lower = job_description.lower()
        resume_lower = resume_text.lower()
        
        missing = []
        for word in tech_keywords:
            if word in job_lower and word not in resume_lower:
                missing.append(word.upper())
        
        return {
            "match_score": match_percentage,
            "missing_keywords": missing,
            "extracted_text": resume_text[:150] + "..."
        }
    except Exception as e:
        return {"error": f"Server Error: {str(e)}"}

# 4. Render Deployment Port Logic
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)