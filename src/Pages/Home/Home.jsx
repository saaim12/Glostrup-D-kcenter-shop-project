// src/Pages/Home/Home.jsx
import React, { useEffect, useState } from 'react';
import './Home.css';

const INITIAL_LINES = Array(7).fill('');

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [formData, setFormData] = useState({
    lines: INITIAL_LINES,
    code: '',
    image: null,
    imageFile: null,
  });

  // Close modal with ESC
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setShowModal(false);
    if (showModal) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showModal]);

  const handleLineChange = (i, value) => {
    setFormData(prev => {
      const lines = [...prev.lines];
      lines[i] = value;
      return { ...prev, lines };
    });
  };

  const addLine = () => setFormData(prev => ({ ...prev, lines: [...prev.lines, ''] }));

  const removeExtraLine = (i) => {
    if (i >= 7) {
      setFormData(prev => ({ ...prev, lines: prev.lines.filter((_, idx) => idx !== i) }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: url, imageFile: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString();
    const cleanLines = formData.lines.map(s => s.trim()).filter(Boolean);
    setReceipts(prev => [...prev, { ...formData, lines: cleanLines, timestamp }]);
    setShowModal(false);
    setFormData({ lines: INITIAL_LINES, code: '', image: null, imageFile: null });
  };

  const handleDelete = (index) =>
    setReceipts(prev => prev.filter((_, i) => i !== index));

const handlePrint = (index) => {
  const r = receipts[index];
  const frame = document.createElement('iframe');
  Object.assign(frame.style, {
    position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0'
  });
  document.body.appendChild(frame);

  const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Print</title>
<style>
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color:#000; background:#fff; }
  .logo{
    width: 100%;
    height: 260px;              /* navbar-like height */
    object-fit: contain;
    display:block;
    margin-bottom: 10mm;
  }
  .sheet{ display:grid; grid-template-columns: 42% 58%; gap:16px; align-items:start; }
  .photo{ width:100%; height:auto; max-height:160mm; object-fit:contain; border-radius:6px; border:1px solid #ddd; }
  .right{ padding-top: 2mm; }
  .lines{
  font-size: 14pt;  /* increased from 11pt */
  line-height: 1.65; /* extra spacing for readability */
  white-space: pre-wrap;
}
.line{
  margin: 3mm 0; /* slightly more gap between lines */
}
  .footer{ display:flex; justify-content: space-between; margin-top: 18mm; font-size: 9pt; color:#444; }
  .code{ letter-spacing: .5px; }
  .muted{ color:#777;font-size:22px;font-weight:bold }
</style>
</head>
<body>
  <!-- IMPORTANT: path includes extension and exact name -->
  <img src="/logo-wide.png" alt="Glostrup Dækcenter" class="logo" />
  <div class="sheet">
    <div>${r.image ? `<img src="${r.image}" class="photo" alt="Uploaded" />` : ''}</div>
    <div class="right">
      <div class="lines">
        ${r.lines.map(l => `<div class="line">${l}</div>`).join('')}
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="code">${r.code || ''}</div>
    <div class="muted">Generated At: ${r.timestamp}</div>
  </div>

  <script>
    // Wait for ALL images (including the logo) before printing
    const imgs = Array.from(document.images);
    Promise.all(
      imgs.map(img =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise(res => img.addEventListener('load', res, { once: true }))
      )
    ).then(() => {
      // small delay helps some printers render full-width images
      setTimeout(() => window.print(), 50);
    });
  </script>
</body>
</html>`.trim();

  const doc = frame.contentWindow.document;
  doc.open(); doc.write(html); doc.close();

  const cleanup = () => { document.body.removeChild(frame); };
  frame.contentWindow.onafterprint = cleanup;
  // Fallback cleanup if onafterprint doesn't fire
  setTimeout(cleanup, 3000);
};


  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to Glostrup Dækcenter</h1>
        <p>Your trusted tire shop for quality and service</p>
        <button className="receipt-btn" onClick={() => setShowModal(true)}>Create Sheet</button>
      </header>

      <main className="content">
        {receipts.length > 0 && (
          <section className="receipt-section">
            <h2 className="section-title">Sheets</h2>
            <div className="receipt-grid">
              {receipts.map((r, i) => (
                <div className="receipt-card" key={i}>
                  <div className="receipt-small">
                    {r.image && <img src={r.image} className="receipt-thumb" alt="Preview" />}
                    <div className="receipt-info">
                      <p><strong>{r.lines?.[0] || '—'}</strong></p>
                      <p className="muted-small">{r.lines?.[1] || ''}</p>
                      <p className="muted-xs">{r.code || ''}</p>
                    </div>
                  </div>
                  <div className="receipt-buttons">
                    <button className="print-btn" onClick={() => handlePrint(i)}>Print</button>
                    <button className="delete-btn" onClick={() => handleDelete(i)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Sheet</h2>
            <form onSubmit={handleSubmit} className="receipt-form">
              <label>Upload Image (optional)</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />

              <label>Text lines</label>
              <div className="lines-scroller">
                {formData.lines.map((line, i) => (
                  <div className="line-row" key={i}>
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => handleLineChange(i, e.target.value)}
                      placeholder={i === 0 ? 'e.g., BBS' : 'Type line…'}
                    />
                    {i >= 7 && (
                      <button type="button" className="small-btn" onClick={() => removeExtraLine(i)} aria-label={`Remove line ${i + 1}`}>
                        −
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" className="secondary-btn" onClick={addLine}>➕ Add extra line</button>

              <label>Code (optional)</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="e.g., 000 4690 SLV33 6900"
              />

              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Glostrup Dækcenter. All rights reserved.</p>
      </footer>
    </div>
  );
}
