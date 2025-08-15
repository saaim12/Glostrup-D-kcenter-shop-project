import React, { useEffect, useState } from 'react';
import './Home.css';

// Spec row with fixed separators: x, x, ET, ø
const PIECES = () => ({ type: 'pieces', pieces: ['', '', '', '', '', ''] });
const TEXT   = () => ({ type: 'text', value: '' });

// Lines under the Title: 2,3,5,7 are pieces; 4 & 6 are text
const INITIAL_LINES = [PIECES(), PIECES(), TEXT(), PIECES(), TEXT(), PIECES()];

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [receipts,  setReceipts]  = useState([]);
  const [formData,  setFormData]  = useState({
    title: '',
    lines: INITIAL_LINES,
    code:  '',
    image: null,
    imageFile: null,
  });

  // Close modal with ESC
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setShowModal(false);
    if (showModal) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showModal]);

  const handleTextChange = (i, value) => {
    setFormData(prev => {
      const lines = [...prev.lines];
      lines[i] = { ...lines[i], value };
      return { ...prev, lines };
    });
  };

  const handlePieceChange = (i, k, value) => {
    setFormData(prev => {
      const lines  = [...prev.lines];
      const pieces = [...lines[i].pieces];
      pieces[k] = value;
      lines[i]  = { ...lines[i], pieces };
      return { ...prev, lines };
    });
  };

  const addTextLine = () =>
    setFormData(prev => ({ ...prev, lines: [...prev.lines, TEXT()] }));

  const addPiecesLine = () =>
    setFormData(prev => ({ ...prev, lines: [...prev.lines, PIECES()] }));

  const removeLine = (i) =>
    setFormData(prev => ({ ...prev, lines: prev.lines.filter((_, idx) => idx !== i) }));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: url, imageFile: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString();

    const cleanLines = formData.lines
      .map(row => {
        if (row.type === 'text') {
          const v = (row.value || '').trim();
          return v ? { type: 'text', value: v } : null;
        }
        const pcs = row.pieces.map(p => (p || '').trim());
        return pcs.every(p => !p) ? null : { type: 'pieces', pieces: pcs };
      })
      .filter(Boolean);

    const newReceipt = {
      title: (formData.title || '').trim(),
      lines: cleanLines,
      code: formData.code,
      image: formData.image,
      imageFile: formData.imageFile,
      timestamp,
    };

    setReceipts(prev => [...prev, newReceipt]);
    setShowModal(false);
    setFormData({ title: '', lines: INITIAL_LINES, code: '', image: null, imageFile: null });
  };

  const handleDeleteReceipt = (index) =>
    setReceipts(prev => prev.filter((_, i) => i !== index));

  // Preview helper
  const rowToText = (row) => {
    if (!row) return '';
    if (row.type === 'text') return row.value;
    const [a,b,c,d,e,f] = row.pieces;
    const p1 = [a,b].filter(Boolean).join('x');
    const p2 = [c,d].filter(Boolean).join('x');
    const p3 = e ? `ET${e}` : '';
    const p4 = f ? `ø ${f}` : '';
    return [p1, p2, p3, p4].filter(Boolean).join('   ');
  };

  const handlePrint = (index) => {
    const r = receipts[index];
    const htmlLines = r.lines.map(row => {
      if (row.type === 'text') {
        return `<div class="line">${row.value}</div>`;
      }
      const [a,b,c,d,e,f] = row.pieces;
      return `
        <div class="specrow">
          <span class="pcd"><b>${a || ''}</b><i>x</i><b>${b || ''}</b></span>
          <span class="size"><b>${c || ''}</b><i>x</i><b>${d || ''}</b></span>
          <span class="et"><i>ET</i><b>${e || ''}</b></span>
          <span class="dia"><i>ø</i><b>${f || ''}</b></span>
        </div>`;
    }).join('');

    const frame = document.createElement('iframe');
    Object.assign(frame.style, { position:'fixed', right:'0', bottom:'0', width:'0', height:'0', border:'0' });
    document.body.appendChild(frame);

    const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Print</title>
<style>
  @page { size: A4 portrait; margin: 12mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color:#000; background:#fff; }
  .logo{ width:100%; height:260px; object-fit:contain; display:block; margin-bottom:10mm; }
  .sheet{ display:grid; grid-template-columns: 42% 58%; gap:16px; align-items:start; }
  .photo{ width:100%; height:auto; max-height:160mm; object-fit:contain; border-radius:6px; border:1px solid #ddd; }
  .right{ padding-top:2mm; }
  .title{ font-size:16pt; font-weight:700; margin: 0 0 4mm 0; }
  .lines{ font-size:14pt; line-height:1.65; }
  .line{ margin:3mm 0; }
  .specrow{
    display:grid;
    grid-template-columns: 1fr 1fr auto auto;
    gap: 12mm;
    align-items: baseline;
    margin: 3mm 0; white-space: nowrap;
  }
  .specrow i{ font-style:normal; margin:0 .25em; opacity:.8; }
  .specrow b{ font-weight:600; }
  .footer{ display:flex; justify-content:space-between; margin-top:18mm; font-size:9pt; color:#444; }
  .code{ letter-spacing:.5px; }
  .muted{ color:#777; font-size:22px; font-weight:bold; }
</style>
</head>
<body>
  <img src="/logo-wide.png" alt="Glostrup Dækcenter" class="logo" />
  <div class="sheet">
    <div>${r.image ? `<img src="${r.image}" class="photo" alt="Uploaded" />` : ''}</div>
    <div class="right">
      ${r.title ? `<div class="title">${r.title}</div>` : ''}
      <div class="lines">
        ${htmlLines}
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="code">${r.code || ''}</div>
    <div class="muted">Generated At: ${r.timestamp}</div>
  </div>
  <script>
    const imgs = Array.from(document.images);
    Promise.all(imgs.map(img =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise(res => img.addEventListener('load', res, { once:true }))
    )).then(() => setTimeout(() => window.print(), 50));
  </script>
</body>
</html>`.trim();

    const doc = frame.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
    const cleanup = () => { document.body.removeChild(frame); };
    frame.contentWindow.onafterprint = cleanup;
    setTimeout(cleanup, 3000);
  };

  return (
    <div className="home">
      <header className="hero">
        <div className="hero-inner">
          <h1>Glostrup Dækcenter</h1>
          <p>Your trusted tire shop for quality and service</p>
          <button className="receipt-btn" onClick={() => setShowModal(true)}>Create Sheet</button>
        </div>
      </header>

      <main className="content">
        {receipts.length === 0 ? (
          <section className="empty">
            <div className="empty-card">
              <div className="empty-title">No sheets yet</div>
              <div className="empty-sub">Create your first sheet with image + specs and print it in A4 portrait.</div>
              <button className="receipt-btn" onClick={() => setShowModal(true)}>Create Sheet</button>
            </div>
          </section>
        ) : (
          <section className="receipt-section">
            <h2 className="section-title">Sheets</h2>
            <div className="receipt-grid">
              {receipts.map((r, i) => (
                <div className="receipt-card" key={i}>
                  <div className="receipt-small">
                    {r.image && <img src={r.image} className="receipt-thumb" alt="Preview" />}
                    <div className="receipt-info">
                      <p className="rc-title">{r.title || '—'}</p>
                      <p className="muted-small">{rowToText(r.lines[0])}</p>
                      <p className="muted-xs">{r.code || ''}</p>
                    </div>
                  </div>
                  <div className="receipt-buttons">
                    <button className="print-btn"  onClick={() => handlePrint(i)}>Print</button>
                    <button className="delete-btn" onClick={() => handleDeleteReceipt(i)}>Delete</button>
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
            <h2 className="modal-title">Create New Sheet</h2>

            <form onSubmit={handleSubmit} className="receipt-form">
              {/* Title */}
              <div className="input-row">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., BBS"
                />
              </div>

              {/* Image */}
              <div className="input-row">
                <label htmlFor="img">Upload Image (optional)</label>
                <input id="img" type="file" accept="image/*" onChange={handleImageUpload} />
              </div>

              {/* Lines */}
              <label className="block-label">Lines</label>
              <div className="lines-scroller">
                {formData.lines.map((row, i) => (
                  <div className="line-row" key={i}>
                    {row.type === 'text' ? (
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => handleTextChange(i, e.target.value)}
                        placeholder={(i === 2 || i === 4) ? 'e.g., Bridgestone Vento 3' : 'Type line…'}
                      />
                    ) : (
                      <div className="piece-row6">
                        <input value={row.pieces[0]} onChange={(e)=>handlePieceChange(i,0,e.target.value)} placeholder="5" />
                        <span className="sep">x</span>
                        <input value={row.pieces[1]} onChange={(e)=>handlePieceChange(i,1,e.target.value)} placeholder="112" />
                        <input value={row.pieces[2]} onChange={(e)=>handlePieceChange(i,2,e.target.value)} placeholder="9" />
                        <span className="sep">x</span>
                        <input value={row.pieces[3]} onChange={(e)=>handlePieceChange(i,3,e.target.value)} placeholder="20" />
                        <span className="sep">ET</span>
                        <input value={row.pieces[4]} onChange={(e)=>handlePieceChange(i,4,e.target.value)} placeholder="20" />
                        <span className="sep">ø</span>
                        <input value={row.pieces[5]} onChange={(e)=>handlePieceChange(i,5,e.target.value)} placeholder="35" />
                      </div>
                    )}
                    <div className="row-actions">
                      <button
                        type="button"
                        className="small-btn danger"
                        onClick={() => removeLine(i)}
                        aria-label={`Remove line ${i + 1}`}
                        title="Remove this line"
                      >−</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add row buttons */}
              <div className="add-row-buttons">
                <button type="button" className="secondary-btn" onClick={addTextLine}>➕ Add text line</button>
                <button type="button" className="secondary-btn" onClick={addPiecesLine}>➕ Add spec line</button>
              </div>

              {/* Code */}
              <div className="input-row">
                <label htmlFor="code">Code (optional)</label>
                <input
                  id="code"
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., 000 4690 SLV33 6900"
                />
              </div>

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
