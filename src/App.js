import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import confetti from "canvas-confetti";

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDesc) {
      alert("Please upload a resume and paste a job description!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobDesc", jobDesc);

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5001/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

    } catch (error) {
      console.error(error);
      setResult({ error: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "bg-dark text-light min-vh-100 p-4" : "bg-light text-dark min-vh-100 p-4"}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>🧾 Smart Resume Analyzer</h1>
          <button
            className={`btn ${darkMode ? "btn-outline-light" : "btn-outline-dark"}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label">📎 Upload Resume</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">📝 Job Description</label>
          <textarea
            className="form-control"
            rows="5"
            placeholder="Paste the job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          ></textarea>
        </div>

        <button
          className="btn btn-gradient w-100 mb-3"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "📤 Analyze Resume"}
        </button>

        <hr className={darkMode ? "border-light" : "border-dark"} />

        {result && (
          <div className="result-section fade-in mt-4">
            {result.error && <p className="text-danger">{result.error}</p>}

            {result.score && (
              <>
                <h3>📊 Score</h3>
                <div className="progress mb-3">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                    role="progressbar"
                    style={{ width: `${result.score}%` }}
                  >
                    {result.score}%
                  </div>
                </div>
              </>
            )}

            {result.matched && (
              <>
                <h4>✅ Matched Keywords</h4>
                <ul>{result.matched.map((k, i) => <li key={i}>{k}</li>)}</ul>
              </>
            )}

            {result.missing && (
              <>
                <h4>❌ Missing Keywords</h4>
                <ul>{result.missing.map((k, i) => <li key={i}>{k}</li>)}</ul>
              </>
            )}

            {result.tips && (
              <>
                <h4>💡 Suggestions</h4>
                <p>{result.tips}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
