import './App.css'
import { useRef, useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const fileInput = useRef(null)

  const [document, setDocument] = useState(null)
  const [documents, setDocuments] = useState([])
  const [verifyingId, setVerifyingId] = useState(null)

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

  const handleVerify = async (id) => {
  try {
    setVerifyingId(id)

    await axios.get(
      `http://localhost:8080/api/documents/${id}/verify`
    )

    const response = await axios.get(
      `http://localhost:8080/api/documents/${id}`
    )

    setDocuments((prev) =>
      prev.map((item) =>
        item.id === id ? response.data : item
      )
    )

    if (document && document.id === id) {
      setDocument(response.data)
    }
  } catch (error) {
    console.error('Verification failed:', error)
  } finally {
    setVerifyingId(null)
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

            <p className="tag">
              DOCUMENT INTEGRITY PLATFORM
            </p>

            <h1>
              Know what you can trust.
            </h1>

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

                <strong>
                  {document.filename}
                </strong>

                <span>
                  SHA-256: {document.sha256Hash}
                </span>

                <span
                  className={
                    document.status === 'VERIFIED'
                      ? 'status-verified'
                      : document.status === 'MODIFIED'
                        ? 'status-modified'
                        : 'status-uploaded'
                  }
                >
                  Status: {document.status || 'UPLOADED'}
                </span>

              </div>
            )}

          </div>

          <div className="trust-card">

            <p>TRUST SCORE</p>

            <div className="score">
              --
            </div>

            <span>
              Awaiting document analysis
            </span>

          </div>

        </section>

        <section className="stats">

  <div className="stat-card">
    <span>
      Documents Uploaded
    </span>

    <strong>
      {documents.length}
    </strong>

    <small>
      Total documents stored
    </small>
  </div>

  <div className="stat-card">
    <span>
      Verified Documents
    </span>

    <strong>
      {
        documents.filter(
          (doc) => doc.status === 'VERIFIED'
        ).length
      }
    </strong>

    <small>
      Integrity checks passed
    </small>
  </div>

  <div className="stat-card">
    <span>
      Potentially Modified
    </span>

    <strong>
      {
        documents.filter(
          (doc) => doc.status === 'MODIFIED'
        ).length
      }
    </strong>

    <small>
      Requires further review
    </small>
  </div>

</section>

        <section className="recent">

          <div className="section-header">

            <h2>
              Recent Documents
            </h2>

            <span>
              View All
            </span>

          </div>

          {documents.length === 0 ? (

            <div className="empty-state">

              <h3>
                No documents analyzed yet
              </h3>

              <p>
                Upload your first document to begin integrity analysis.
              </p>

            </div>

          ) : (

            <div className="document-list">

              {documents.map((doc) => (

                <div
                  className="document-item"
                  key={doc.id}
                >

                  <strong>
                    {doc.filename}
                  </strong>

                  <span>
                    {doc.fileType}
                  </span>

                  <span>
                    SHA-256: {doc.sha256Hash}
                  </span>

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
  onClick={() => handleVerify(doc.id)}
  disabled={verifyingId === doc.id}
>
  {verifyingId === doc.id ? 'Verifying...' : 'Verify'}
</button>

                  {doc.status === 'VERIFIED' && (

                    <div className="verification-result verified-result">
                      Document integrity verified. No changes detected.
                    </div>

                  )}

                  {doc.status === 'MODIFIED' && (

                    <div className="verification-result modified-result">
                      Possible modification detected. File contents have changed.
                    </div>

                  )}

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