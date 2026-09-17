import './App.css'
import { useRef, useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const fileInput = useRef(null)
  const [document, setDocument] = useState(null)
  const [documents, setDocuments] = useState([])

useEffect(() => {
  axios
    .get('http://localhost:8080/api/documents')
    .then((response) => {
      setDocuments(response.data)
    })
    .catch((error) => {
      console.error('Failed to load documents:', error)
    })
}, [])

  const handleUploadClick = () => {
    fileInput.current.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
  const response = await axios.post(
    'http://localhost:8080/api/documents/upload',
    formData
  )

  setDocument(response.data)
  setDocuments((prev) => [...prev, response.data])
  } catch (error) {
  console.error('Upload failed:', error)
  }
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">TrustGraph</div>

        <nav>
          <a href="#">Dashboard</a>
          <a href="#">Documents</a>
          <a href="#">Verification</a>
        </nav>
      </header>

      <main className="dashboard">
        <section className="hero">
          <div>
            <p className="tag">DOCUMENT INTEGRITY PLATFORM</p>

            <h1>Know what you can trust.</h1>

            <p className="description">
              Analyze documents for integrity, tampering evidence,
              metadata anomalies, and provenance.
            </p>

            <input
              type="file"
              ref={fileInput}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              style={{ display: 'none' }}
            />

            <button
              className="upload-button"
              onClick={handleUploadClick}
            >
              Upload Document
            </button>

            {document && (
              <div className="uploaded-document">
                <strong>{document.filename}</strong>
                <span>SHA-256: {document.sha256Hash}</span>
              </div>
            )}
          </div>

          <div className="trust-card">
            <p>TRUST SCORE</p>
            <div className="score">--</div>
            <span>Awaiting document analysis</span>
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
          <span>Documents Analyzed</span>
          <strong>{documents.length}</strong>
          </div>

          <div className="stat-card">
            <span>Potentially Modified</span>
            <strong>0</strong>
          </div>
        </section>

        <section className="recent">
          <div className="section-header">
            <h2>Recent Documents</h2>
            <span>View All</span>
          </div>

          {documents.length === 0 ? (
  <div className="empty-state">
    <h3>No documents analyzed yet</h3>
    <p>
      Upload your first document to begin integrity analysis.
    </p>
  </div>
) : (
  <div className="document-list">
    {documents.map((doc) => (
      <div className="document-item" key={doc.id}>
        <strong>{doc.filename}</strong>
        <span>{doc.fileType}</span>
        <span>SHA-256: {doc.sha256Hash}</span>
       <span
       className={
       doc.status === 'VERIFIED'
       ? 'status-verified'
       : doc.status === 'MODIFIED'
       ? 'status-modified'
       : 'status-uploaded'
  }
>
  Status: {doc.status || 'UPLOADED'}
</span>
       <button
       onClick={async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/documents/${doc.id}/verify`
      )

      console.log(response.data)

      const updated = await axios.get(
        `http://localhost:8080/api/documents/${doc.id}`
      )

      setDocuments((prev) =>
        prev.map((item) =>
          item.id === doc.id ? updated.data : item
        )
      )
    } catch (error) {
      console.error('Verification failed:', error)
    }
    }}
>
  Verify
</button>
      </div>
    ))}
  </div>
)}
        </section>
      </main>
    </div>
  )
}

export default App