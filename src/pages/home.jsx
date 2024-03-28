
import React from 'react';
import { Link } from 'react-router-dom';
// import '../Styles/home.css'; // Import custom CSS styles
 
const HomePage = () => {
  return (
    <div className="container">
      <header className="header">
        <div className="header-left">
          <h1>SOFIYA LIYAKATH BANK</h1>
        </div>
        <div className="header-right">
          <Link to="/signup" className="signup-link">Sign Up</Link>
        </div>
      </header>
      <main className="main-content">
        <section className="hero-section">
          <div className="hero-left">
            <div className="bg-image"></div>
          </div>
          <div className="hero-right">
            <h2>Welcome</h2>
            <p>
            Welcome to SLB, where your financial journey begins.Experience personalized banking solutions tailored to your needs.Trust and security are our top priorities, ensuring your peace of mind.
            </p>
            <p className="quote">
            Welcome to a bank that understands your needs and exceeds your expectations.
            </p>
            <p className="quote">
            Join a community of financial empowerment and unlock your potential for success.
            </p>
            <p className="quote">
            From small beginnings to great achievements, we're here to support you at every milestone.
            </p>
          </div>
        </section>
        <section className="photo-section">
          <div className="photo-grid">
            {/* Include your photo components here */}
            {/* Example: <img src="photo1.jpg" alt="Photo 1" /> */}
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <h3>Contact Us</h3>
          <p>Email: sofiyaliyakathali@gmail.com</p>
        </div>
      </footer>
    </div>
  );
};
 
export default HomePage;