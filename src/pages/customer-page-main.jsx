import React, { useState, useEffect } from 'react';
import '../Styles/customer-page-main.css';
import { Link } from 'react-router-dom';
 
const CustomerPageMain = () => {
  // State to hold customer details
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState(null);
 
  // Function to fetch customer details
  const fetchCustomerDetails = async (accountNumber) => {
    try {
      // Make a fetch request to retrieve customer details from Firestore
      const response = await fetch(`https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Account`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer details');
      }
      const data = await response.json();
 
      // Iterate over each document to find the matching account number
      let matchedDocument = null;
      for (const doc of data.documents) {
        const fields = doc.fields;
        if (fields && fields.accountNumber && parseInt(fields.accountNumber.integerValue) === parseInt(accountNumber)) {
          matchedDocument = doc;
          break; // Exit loop if a match is found
        }
      }
 
      if (matchedDocument) {
        // Extract necessary details from the matched document
        const accountNumber = matchedDocument.fields.accountNumber.integerValue;
        const customerName = matchedDocument.fields.name ? matchedDocument.fields.name.stringValue : 'N/A';
        const email = matchedDocument.fields.email ? matchedDocument.fields.email.stringValue : 'N/A';
        const balance = matchedDocument.fields.balance ? matchedDocument.fields.balance.doubleValue : 0;
        const phone = matchedDocument.fields.phoneNumber ? matchedDocument.fields.phoneNumber.stringValue : 'N/A';
        // const loan = matchedDocument.fields.Loan ? matchedDocument.fields.Loan.booleanValue : false;
 
        // Update the state with the details of the matched document
        setCustomerDetails({
          accountNumber,
          customerName,
          email,
          balance,
          phone
          // loan // Include loan field in the state
          // Add more fields as needed
        });
      } else {
        setError('Customer details not found');
      }
    } catch (error) {
      setError(error.message);
    }
  };
 
  useEffect(() => {
    // Retrieve account number from local storage
    const loggedInAccountNumber = localStorage.getItem('accountNumber');
 
    if (loggedInAccountNumber) {
      // Fetch customer details using the account number
      fetchCustomerDetails(loggedInAccountNumber);
    } else {
      setError('Account number not found in local storage');
    }
  }, []);
 
  // Function to handle loan button click
  const handleLoanClick = () => {
    // Implement loan functionality here
    console.log('Requesting loan...');
  };
 
  // Function to handle transaction history button click
  const handleTransactionHistoryClick = () => {
    // Implement transaction history functionality here
    console.log('Fetching transaction history...');
  };
 
  // Function to handle bank transfer button click
  const handleBankTransferClick = () => {
    // Implement bank transfer functionality here
    console.log('Initiating bank transfer...');
  };
 
  // Function to handle deposit button click
  const handleDepositClick = () => {
    // Implement deposit functionality here
    console.log('Initiating deposit...');
  };
 
  return (
    <div className="maincustomer">
    <div className="customer-details">
      <h1>Welcome {customerDetails && customerDetails.customerName}</h1>
      {error && <p>{error}</p>}
      {customerDetails && (
        <div>
          <h2>Customer Details</h2>
          <p className="account-number">Account Number: {customerDetails.accountNumber}</p>
          <p className="customer-name">Customer Name: {customerDetails.customerName}</p>
          <p className="email">Email: {customerDetails.email}</p>
          <p className="balance">Balance: {customerDetails.balance}</p>
          <p className="phone-number">Phone Number: {customerDetails.phone}</p>
          {/* <p className="loan-status">Loan: {customerDetails.loan ? 'Yes' : 'No'}</p> */}
          {/* Add more fields as needed */}
          <div className="buttons">
          <Link to="/Loan">
            <button onClick={handleLoanClick} style={{backgroundColor: '#078a83'}}>Apply for Loan</button>
            </Link>
            <Link to="/CustomerTransaction">
            <button onClick={handleTransactionHistoryClick} style={{backgroundColor: '#078a83'}}>View Transaction History</button>
            </Link>
           
            <Link to="/Bank-transfer">
              <button onClick={handleBankTransferClick} style={{backgroundColor: '#078a83'}}>Bank Transfer</button>
            </Link>
           
            {/* <button onClick={handleDepositClick}>Deposit</button> */}
            <Link to="/Deposit">
            <button onClick={handleDepositClick} style={{backgroundColor: '#078a83'}}>Deposit</button>
            </Link>
            <Link to="/loandeposit">
              <button onClick={handleDepositClick} style={{backgroundColor: '#078a83'}}>Loan Deposit</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};
 
export default CustomerPageMain;
 