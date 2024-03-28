import React, { useState, useEffect } from 'react';
import '../Styles/deposit.css';
 
function Deposit() {
  const [accountNumber, setAccountNumber] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
 
  useEffect(() => {
    // Retrieve account number from localStorage
    const loggedInAccountNumber = localStorage.getItem('accountNumber');
    setAccountNumber(loggedInAccountNumber);
  }, []);
 
  const handleDeposit = () => {
    // Check if all fields are filled
    if (!accountNumber || !name || !amount) {
      setMessage('Please fill in all fields.');
      return;
    }
 
    const depositType = "deposit"; // Type of deposit
 
    // Create transaction object
    const transactionData = {
      fields: {
        accountNumber: { integerValue: parseInt(accountNumber) },
        name: { stringValue: name },
        amount: { doubleValue: parseFloat(amount) },
        type: { stringValue: depositType },
        timestamp: { timestampValue: new Date().toISOString() }
      }
    };
 
    // Fetch the account details from Firestore API
    fetch(`https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Account`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch account details.');
        }
        return response.json();
      })
      .then(data => {
        // Find the document with the matching account number in the Account collection
        const matchedDocument = data.documents.find(doc => {
          const fields = doc.fields;
          return fields && fields.accountNumber && parseInt(fields.accountNumber.integerValue) === parseInt(accountNumber);
        });
 
        if (!matchedDocument) {
          throw new Error('Account not found.');
        }
 
        // Extract the document ID from the response
        const docId = matchedDocument.name.split('/').pop();
        const accountData = matchedDocument.fields;
 
        // Check if provided name matches the name associated with the account number
        if (name !== accountData.name.stringValue) {
          throw new Error('Provided name does not match the name associated with this account.');
        }
 
        // Calculate new balance for the Account collection
        const currentBalance = parseFloat(accountData.balance.doubleValue);
        const depositAmount = parseFloat(amount);
        const newBalance = currentBalance + depositAmount;
 
        // Update the balance field in the existing account data for the Account collection
        const updatedAccountData = {
          ...accountData,
          balance: { doubleValue: newBalance }
        };
 
        // Perform deposit by updating the balance field only for the Account collection
        return fetch(`https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Account/${docId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: updatedAccountData
          })
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Deposit unsuccessful. Please try again.');
        }
 
        // Transaction successful, now store transaction details
        return fetch(`https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(transactionData)
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Transaction details not stored.');
        }
        setMessage('Deposit successful!');
      })
      .catch(error => {
        setMessage(error.message);
      });
  };
 
  return (
    <div className="container1">
      <div className="form">
        <h2>Make a Deposit</h2>
        <div>
          <label>Account Number:</label>
          <input type="text" value={accountNumber} readOnly />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label>Amount:</label>
          <input type="text" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <button onClick={handleDeposit}>Deposit</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
 
export default Deposit;