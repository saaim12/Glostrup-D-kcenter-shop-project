import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <h1>About Us</h1>
        <p>
          At <strong>Glostrup Dækcenter</strong>, we pride ourselves on delivering the
          best mechanical services and top-quality tires in town. Whether you’re here
          for maintenance, repair, or to buy and sell tires, we’re your trusted partner.
        </p>
      </section>

      <section className="about-services">
        <h2>What We Offer</h2>
        <div className="service-grid">
          <div className="service-card">
            <h3>⚙️ Expert Mechanics</h3>
            <p>
              Our skilled technicians provide professional repair and maintenance
              services to keep your vehicle in top condition.
            </p>
          </div>
          <div className="service-card">
            <h3>🛞 Tire Sales & Purchase</h3>
            <p>
              We sell premium new and used tires at competitive prices, and we
              also purchase quality used tires.
            </p>
          </div>
          <div className="service-card">
            <h3>🔧 Wheel Balancing & Alignment</h3>
            <p>
              Ensure smooth driving and extended tire life with our precision wheel
              balancing and alignment services.
            </p>
          </div>
        </div>
      </section>

      <section className="about-footer-msg">
        <p>
          We are committed to offering friendly service, transparent pricing, and
          the highest quality workmanship. Visit us today and experience the difference!
        </p>
      </section>
    </div>
  );
};

export default About;
