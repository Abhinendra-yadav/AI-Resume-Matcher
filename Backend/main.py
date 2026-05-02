import os
import io
import pypdf
import docx  # Library for handling .docx files
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# 1. CORS Configuration
# Essential for allowing your Vercel frontend to communicate with this Render backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Health Check Route
# Prevents "Not Found" errors when visiting the base URL on Render
@app.get("/")
def read_root():
    return {"status": "Online", "message": "AI Resume Matcher API is running successfully."}

# Function to extract text from PDF files
def extract_text_from_pdf(file_bytes):
    reader = pypdf.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

# Function to extract text from Word (.docx) files
def extract_text_from_docx(file_bytes):
    doc = docx.Document(io.BytesIO(file_bytes))
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return "\n".join(full_text)

# 3. Primary Processing Endpoint
@app.post("/match")
async def match_resume(job_description: str = Form(...), file: UploadFile = File(...)):
    try:
        # Read file into memory
        file_content = await file.read()
        filename = file.filename.lower()
        resume_text = ""

        # Route extraction based on file extension
        if filename.endswith('.pdf'):
            resume_text = extract_text_from_pdf(file_content)
        elif filename.endswith('.docx'):
            resume_text = extract_text_from_docx(file_content)
        else:
            return {"error": "Unsupported file format. Please upload a PDF or DOCX file."}
        
        # Validation for empty extraction
        if not resume_text.strip():
            return {"error": "Could not extract text. The file might be empty or image-based."}

        # NLP Logic: Calculate Match Percentage using TF-IDF and Cosine Similarity
        documents = [resume_text, job_description]
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(documents)
        
        # Compare Resume (index 0) with Job Description (index 1)
        score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        match_percentage = round(score * 100, 2)

        # Keyword Gap Analysis
        tech_keywords = [
            "python", "java", "react", "sql", "html", "css", "javascript", 
            "c++", "node", "aws", "docker", "git", "api", "fastapi", "mongodb",
            "machine learning", "nlp", "django", "express", "postgresql"
        ]
        
        job_lower = job_description.lower()
        resume_lower = resume_text.lower()
        
        missing = [word.upper() for word in tech_keywords if word in job_lower and word not in resume_lower]
        
        # Return structured data to the Frontend
        return {
            "match_score": match_percentage,
            "missing_keywords": missing,
            "extracted_preview": resume_text[:200] + "..."
        }

    except Exception as e:
        return {"error": f"Internal Server Error: {str(e)}"}

# 4. Deployment Logic for Render/Production
if __name__ == "__main__":
    # Render provides a PORT environment variable dynamically
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)