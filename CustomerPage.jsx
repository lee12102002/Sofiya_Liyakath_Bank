// CustomerPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/customerpage.css'; // Import the CSS file

function CustomerPage() {
  return (
    <div className="container">
      <nav className="navbar">
        <div className="navbar-left">
          <span className="rbi-logo">Sofiya Liyakath Bank</span>
        </div>
        <div className="navbar-right">
          {/* <span>You're secure with us!</span> */}
        </div>
      </nav>
      <div className="button-container">
        <Link to="/create-account">
          <button style={{ backgroundColor: '#799e9c' }}>Create an Account</button>
        </Link>
        
        <Link to="/login">
        <button style={{ backgroundColor: '#799e9c' }}>Already Have an Account</button>
        </Link>
      </div>
      {/* <div className="bank-info">
        <h2>About Our Bank</h2>
        <p>Welcome to our bank! We are dedicated to providing top-notch banking services to our customers. With a focus on security, innovation, and customer satisfaction, we strive to meet all your financial needs. Whether you're looking to save, invest, or borrow, we have solutions tailored for you. Our team of experts is here to assist you every step of the way. Thank you for choosing us as your trusted financial partner.</p>
      </div> */}
      {/* <footer className="footer">
        <h3>Contact Details</h3>
        <p>If you have any questions or need assistance, feel free to contact us:</p>
        <ul>
          <li>Email: info@bank.com</li>
          <li>Phone: 123-456-7890</li>
          <li>Address: 123 Bank Street, City, Country</li>
        </ul>
      </footer> */}
    </div>
  );
}

export default CustomerPage;
