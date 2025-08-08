// src/Pages/Home/Home.jsx
import React, { useState } from 'react';
import './Home.css';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [formData, setFormData] = useState({
    customer: '',
    service: '',
    price: '',
    image: null,
    imageFile: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: URL.createObjectURL(file),
        imageFile: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString();
    setReceipts(prev => [...prev, { ...formData, timestamp }]);
    setShowModal(false);
    setFormData({
      customer: '',
      service: '',
      price: '',
      image: null,
      imageFile: null,
    });
  };

  const handleCancel = () => setShowModal(false);

  const handleDelete = (index) => {
    setReceipts(receipts.filter((_, i) => i !== index));
  };

  const handlePrint = (index) => {
    const receipt = receipts[index];
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const printDocument = printFrame.contentWindow.document;
    const html = `
      <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            padding: 2cm;
            background: white;
            color: #000;
            text-align: center;
          }
          img.logo {
            width: 120px;
            margin-bottom: 1rem;
          }
          img.uploaded {
            width: 100%;
            max-height: 250px;
            object-fit: contain;
            border-radius: 8px;
            margin-bottom: 1rem;
          }
          .info {
            text-align: left;
            font-size: 1rem;
            margin: 1rem auto;
            max-width: 400px;
          }
          .timestamp {
            margin-top: 1rem;
            font-size: 0.9rem;
            color: #666;
          }
          .footer-note {
            margin-top: 2rem;
            font-size: 0.85rem;
            border-top: 1px dashed #ccc;
            padding-top: 1rem;
            color: #888;
          }
        </style>
      </head>
      <body>
        <img src="/logo.png" class="logo" alt="Logo" />
        ${receipt.image ? `<img src="${receipt.image}" class="uploaded" alt="Uploaded Image" />` : ''}
        <div class="info">
          <p><strong>Customer:</strong> ${receipt.customer}</p>
          <p><strong>Service:</strong> ${receipt.service}</p>
          <p><strong>Total:</strong> $${receipt.price}</p>
        </div>
        <div class="timestamp">
          Receipt Generated: ${receipt.timestamp}
        </div>
        <div class="footer-note">
          Thank you for choosing Glostrup Dækcenter<br>
          Adresse: Naverland 11c, 2600 Glostrup
        </div>
      </body>
      </html>
    `;

    printDocument.write(html);
    printDocument.close();
    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();

    setTimeout(() => {
      document.body.removeChild(printFrame);
    }, 1000);
  };

  return (
    <div className="home">
      <header className="hero">
        <h1>Welcome to Glostrup Dækcenter</h1>
        <p>Your trusted tire shop for quality and service</p>
        <button className="receipt-btn" onClick={() => setShowModal(true)}>
          Create Receipt
        </button>
      </header>

      <section className="features">
        <div className="feature-card">
          <h2>🚗 Wide Range of Tires</h2>
          <p>We offer tires for all vehicle types with professional fitting.</p>
        </div>
        <div className="feature-card">
          <h2>🛠️ Expert Mechanics</h2>
          <p>Our certified experts ensure your safety and satisfaction.</p>
        </div>
        <div className="feature-card">
          <h2>💰 Competitive Prices</h2>
          <p>Top-quality products at affordable rates.</p>
        </div>
      </section>

      {receipts.length > 0 && (
        <section className="receipt-section">
            <div>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Receipts</h2>
          </div >
                  <div style={{display:'flex',flexDirection:'row',gap:'1rem'}}>
                    {receipts.map((receipt, index) => (
            <div className="receipt-card" key={index}>

              <div className="receipt-small">
                {receipt.image && (
                  <img src={receipt.image} className="receipt-thumb" alt="Preview" />
                )}
                <div className="receipt-info">
                  <p><strong>{receipt.customer}</strong></p>
                  <p>{receipt.service}</p>
                  <p>${receipt.price}</p>
                </div>
              </div>
              <div className="receipt-buttons">
                <button className="print-btn" onClick={() => handlePrint(index)}>Print</button>
                <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </div>
          ))}
          </div>
        </section>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Receipt</h2>
            <form onSubmit={handleSubmit} className="receipt-form">
              <label>Customer Name</label>
              <input type="text" name="customer" value={formData.customer} onChange={handleInputChange} required />
              <label>Service</label>
              <input type="text" name="service" value={formData.service} onChange={handleInputChange} required />
              <label>Total Price ($)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
              <label>Upload Image (optional)</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              <div className="modal-buttons">
                <button type="submit" className="submit-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
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
};

export default Home;
