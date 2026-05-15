import React, { useState } from 'react';
import axios from 'axios';

// 1. Define the interface for the API response
interface AnalysisResult {
  match_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  extracted_preview: string;
}

const App: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      alert("Please upload a resume and provide a job description.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('job_description', jobDescription);
    formData.append('file', file);

    try {
      // NOTE: Update this URL to your Render backend URL once deployed live
      const response = await axios.post('http://localhost:8000/match', formData);
      setResult(response.data);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      alert("Analysis failed. Check if your FastAPI backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#f4f7f9', 
      minHeight: '100vh', 
      padding: '40px 20px', 
      fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif' 
    }}>
      <div style={{ 
        maxWidth: '750px', 
        margin: 'auto', 
        backgroundColor: '#ffffff', 
        borderRadius: '16px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)', 
        padding: '40px' 
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h1 style={{ fontSize: '32px', color: '#1a202c', margin: '0 0 10px 0' }}>🚀 AI Resume Matcher</h1>
          <p style={{ color: '#718096', fontSize: '16px', fontWeight: 500 }}>Professional Score & Skill Gap Analysis</p>
        </div>
        
        {/* Input: Job Description */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '10px', color: '#2d3748' }}>Job Description</label>
          <textarea 
            placeholder="Paste the job requirements here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            style={{ 
              width: '100%', borderRadius: '12px', padding: '15px', 
              border: '1px solid #e2e8f0', outline: 'none', transition: 'all 0.2s',
              fontSize: '14px', boxSizing: 'border-box', fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Input: File Upload */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '10px', color: '#2d3748' }}>Upload Resume (PDF/DOCX)</label>
          <div style={{ 
            border: '2px dashed #cbd5e0', borderRadius: '12px', padding: '25px', textAlign: 'center',
            backgroundColor: '#f8fafc', cursor: 'pointer'
          }}>
            <input 
              type="file" 
              accept=".pdf,.docx"
              onChange={(e) => { if (e.target.files && e.target.files[0]) setFile(e.target.files[0]); }} 
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleAnalyze} 
          disabled={loading}
          style={{
            width: '100%', padding: '18px', backgroundColor: '#3182ce', 
            color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
            fontWeight: 700, fontSize: '17px', transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)',
            opacity: loading ? 0.8 : 1
          }}
        >
          {loading ? "Processing NLP Analysis..." : "Analyze Now"}
        </button>

        {/* Results Dashboard */}
        {result && (
          <div style={{ marginTop: '45px', borderTop: '2px solid #edf2f7', paddingTop: '35px' }}>
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <h2 style={{ fontSize: '22px', color: '#2d3748', margin: '0 0 5px 0' }}>Match Score</h2>
              <div style={{ 
                fontSize: '56px', 
                fontWeight: 900, 
                color: result.match_score > 75 ? '#38a169' : result.match_score > 40 ? '#3182ce' : '#e53e3e' 
              }}>
                {result.match_score}%
              </div>
              
              {/* Visual Progress Bar */}
              <div style={{ width: '100%', height: '12px', backgroundColor: '#edf2f7', borderRadius: '10px', marginTop: '15px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${result.match_score}%`, 
                  height: '100%', 
                  backgroundColor: result.match_score > 75 ? '#48bb78' : '#3182ce', 
                  borderRadius: '10px', 
                  transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' 
                }}></div>
              </div>
            </div>
            
            {/* Skill Gap Analysis Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              {/* Matched */}
              <div style={{ padding: '20px', backgroundColor: '#f0fff4', borderRadius: '14px', border: '1px solid #c6f6d5' }}>
                <h4 style={{ color: '#2f855a', marginTop: 0, marginBottom: '15px', fontSize: '16px' }}>
                  ✅ Matched Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.matched_keywords.length > 0 ? result.matched_keywords.map((skill, i) => (
                    <span key={i} style={{ 
                      background: '#c6f6d5', color: '#22543d', padding: '5px 12px', 
                      borderRadius: '8px', fontSize: '13px', fontWeight: 600 
                    }}>{skill}</span>
                  )) : <span style={{fontSize: '13px', color: '#718096'}}>No keywords detected</span>}
                </div>
              </div>

              {/* Missing */}
              <div style={{ padding: '20px', backgroundColor: '#fff5f5', borderRadius: '14px', border: '1px solid #fed7d7' }}>
                <h4 style={{ color: '#c53030', marginTop: 0, marginBottom: '15px', fontSize: '16px' }}>
                  ❌ Missing Skills
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.missing_keywords.length > 0 ? result.missing_keywords.map((skill, i) => (
                    <span key={i} style={{ 
                      background: '#fed7d7', color: '#822727', padding: '5px 12px', 
                      borderRadius: '8px', fontSize: '13px', fontWeight: 600 
                    }}>{skill}</span>
                  )) : <span style={{fontSize: '13px', color: '#718096'}}>Excellent! No gaps.</span>}
                </div>
              </div>
            </div>

            {/* Resume Preview Text */}
            <div style={{ marginTop: '35px', padding: '20px', backgroundColor: '#f7fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#4a5568', fontWeight: 600 }}>📄 Extracted Text Preview</h4>
              <p style={{ color: '#718096', fontSize: '13px', lineHeight: '1.7', margin: 0, fontStyle: 'italic' }}>
                "{result.extracted_preview}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;