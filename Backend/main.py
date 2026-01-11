from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pypdf
import io
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_pdf(file_bytes):
    reader = pypdf.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

@app.post("/match")
async def match_resume(job_description: str = Form(...), file: UploadFile = File(...)):
    # Text Extraction
    file_content = await file.read()
    resume_text = extract_text_from_pdf(file_content)
    
    # NLP Score
    documents = [resume_text, job_description]
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(documents)
    score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    match_percentage = round(score * 100, 2)

    # --- MISSING KEYWORDS LOGIC ---
    # In keywords ko hum search karenge
    tech_keywords = [
        "python", "java", "react", "sql", "html", "css", "javascript", 
        "c++", "node", "aws", "docker", "git", "api", "fastapi", "mongodb"
    ]
    
    job_lower = job_description.lower()
    resume_lower = resume_text.lower()
    
    missing = []
    for word in tech_keywords:
        # Agar word job description mein hai par resume mein nahi
        if word in job_lower and word not in resume_lower:
            missing.append(word.upper())
    
    # Response jo React ko jayega
    return {
        "match_score": match_percentage,
        "missing_keywords": missing,  # Ye list React dhoond raha hai
        "extracted_text": resume_text[:150] + "..."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)