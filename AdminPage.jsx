import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/admin.css'; // Import CSS file for admin page styles

function AdminPage() {
  return (
    <div className="admin-container" style={{ backgroundColor: '#f0f0f0', padding: '20px' }}>
      <h1 style={{ color: '#078a83' }}>Admin Dashboard</h1>
      <div className="button-container">
      <Link to="/Bank-registration">
          <button className="admin-button" style={{backgroundColor : '#207554'}}>Bank Registration</button>
        </Link>
        <Link to="/approve-accounts">
          <button className="admin-button" style={{backgroundColor : '#207554'}}>Approval of Accounts</button>
        </Link>
        <Link to="/transactions">
          <button className="admin-button" style={{backgroundColor : '#207554'}}>Transactions Details</button>
        </Link>
        <Link to="/customer-details">
          <button className="admin-button" style={{backgroundColor : '#207554'}}>Customer Details</button>
        </Link>
        <Link to="/Loan-details">
          <button className="admin-button" style={{backgroundColor : '#207554'}}>Loan Details</button>
        </Link>
        
      </div>
      {/* <div className="quote-container">
        <p className="quote">
          "Banking is not just about money. It's about trust, integrity, and relationships."
        </p>
        <p className="author">- RAJESH</p>
      </div> */}
    </div>
  );
}

export default AdminPage;
