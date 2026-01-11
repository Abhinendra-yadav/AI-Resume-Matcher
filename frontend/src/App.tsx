import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !jobDesc) {
      alert("Please upload a resume and paste a job description.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDesc);

    try {
      const response = await axios.post('http://localhost:8000/match', formData);
      setResult(response.data);
    } catch (error) {
      alert("Backend error! Make sure Python main.py is running.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🚀 AI Resume Matcher</h1>
        <p style={styles.subtitle}>Professional Score & Skill Gap Analysis</p>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Job Description</label>
          <textarea 
            placeholder="Paste the job requirements here..." 
            style={styles.textarea}
            onChange={(e) => setJobDesc(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Upload Resume (PDF)</label>
          <input 
            type="file" 
            accept=".pdf"
            style={styles.fileInput}
            onChange={(e) => setFile(e.target.files![0])} 
          />
        </div>

        <button 
          onClick={handleUpload} 
          style={{...styles.button, opacity: loading ? 0.7 : 1}}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Now'}
        </button>

        {result && (
          <div style={styles.resultCard}>
            <div style={styles.scoreContainer}>
              <span style={styles.scoreLabel}>Match Score</span>
              <h2 style={styles.scoreValue}>{result.match_score}%</h2>
            </div>
            
            <div style={styles.progressBarBg}>
              <div style={{...styles.progressBarFill, width: `${result.match_score}%`}}></div>
            </div>

            {/* Missing Keywords Section */}
            {result.missing_keywords && result.missing_keywords.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ color: '#d93025', marginBottom: '10px', fontSize: '14px' }}>Missing Skills to Add:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.missing_keywords.map((word: string, index: number) => (
                    <span key={index} style={styles.tag}>
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p style={styles.previewText}><b>Preview:</b> {result.extracted_text}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f4f7f6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: '"Segoe UI", Roboto, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '35px',
    borderRadius: '16px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
    maxWidth: '550px',
    width: '100%',
  },
  title: {
    margin: '0 0 5px 0',
    color: '#2d3436',
    textAlign: 'center',
    fontSize: '26px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#636e72',
    marginBottom: '30px',
    fontSize: '14px'
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 600,
    color: '#2d3436',
    fontSize: '14px'
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #dfe6e9',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px dashed #b2bec3',
    backgroundColor: '#fafafa',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#0984e3',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s',
  },
  resultCard: {
    marginTop: '25px',
    padding: '20px',
    backgroundColor: '#f1f2f6',
    borderRadius: '12px',
    border: '1px solid #dfe6e9',
  },
  scoreContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: '16px',
    color: '#2d3436',
    fontWeight: 'bold',
  },
  scoreValue: {
    fontSize: '28px',
    margin: 0,
    color: '#0984e3',
  },
  progressBarBg: {
    width: '100%',
    height: '8px',
    backgroundColor: '#dfe6e9',
    borderRadius: '4px',
    marginTop: '10px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0984e3',
    transition: 'width 0.8s ease-in-out',
  },
  tag: {
    backgroundColor: '#ffeaa7',
    color: '#d63031',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    border: '1px solid #fab1a0'
  },
  previewText: {
    marginTop: '15px',
    fontSize: '11px',
    color: '#636e72',
    fontStyle: 'italic'
  }
};

export default App;