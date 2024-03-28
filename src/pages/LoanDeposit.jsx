import React, { useState, useEffect } from 'react';
// import '../Styles/loandeposit.css';
 
function LoanDeposit() {
  const [loggedInAccountNumber, setLoggedInAccountNumber] = useState('');
  const [matchingDocuments, setMatchingDocuments] = useState([]);
  const [payingDocument, setPayingDocument] = useState(null);
  const [payingAmount, setPayingAmount] = useState('');
  const [payingAccountNumber, setPayingAccountNumber] = useState('');
 
  useEffect(() => {
    const loggedInAccount = localStorage.getItem('accountNumber');
    setLoggedInAccountNumber(loggedInAccount);
  }, []);
 
  useEffect(() => {
    const fetchLoanDocuments = async () => {
      try {
        const response = await fetch('https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Loan');
        const data = await response.json();
       
        // Filter documents based on logged-in account number and sanctioned amount
        const matchingDocs = data.documents.filter(document => {
          const accountNumber = document.fields.accountNumber.integerValue;
          const sanctionedAmount = document.fields.sanctionedAmount.integerValue;
          return accountNumber === loggedInAccountNumber && sanctionedAmount > 0;
        });
 
        if (matchingDocs.length === 0) {
          alert('No loan found.');
        }
 
        setMatchingDocuments(matchingDocs);
      } catch (error) {
        console.error('Error fetching loan documents:', error);
      }
    };
 
    if (loggedInAccountNumber !== '') {
      fetchLoanDocuments();
    }
  }, [loggedInAccountNumber]);
 
  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    // Validate payment details
    if (!payingAccountNumber || !payingAmount) {
      alert('Please enter both account number and amount.');
      return;
    }
 
    // Minimum transfer amount validation
    const amount = parseFloat(payingAmount);
    if (amount < 50) {
      alert('Minimum transfer amount should be Rs. 50.');
      return;
    }
 
    try {
      // Fetch account documents
      const accountResponse = await fetch('https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Account');
      if (!accountResponse.ok) {
        throw new Error('Failed to fetch account documents.');
      }
      const accountData = await accountResponse.json();
   
      // Find the account document
      const accountDocument = accountData.documents.find(doc => doc.fields.accountNumber.integerValue === payingAccountNumber);
      if (!accountDocument) {
        alert('Account not found.');
        return;
      }
   
      // Check if balance is sufficient
      const balance = accountDocument.fields.balance.doubleValue;
      if (balance < amount) {
        alert('Insufficient balance.');
        return;
      }
     
      // Check if sanctioned amount is exceeded
      const totalPaidBack = parseInt(payingDocument.fields.amountPaidBack.integerValue || 0);
      const sanctionedAmount = payingDocument.fields.sanctionedAmount.integerValue;
      if (sanctionedAmount < totalPaidBack + amount) {
        alert('Amount exceeds sanctioned limit.');
        return;
      }
 
      // Deduct amount from balance
      const newBalance = balance - amount;
   
      // Update account document with new balance
      const updatedAccountDocument = {
        ...accountDocument,
        fields: {
          ...accountDocument.fields,
          balance: { doubleValue: newBalance }
        }
      };
   
      // Update account document with new balance
      await fetch(`https://firestore.googleapis.com/v1/${accountDocument.name}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAccountDocument)
      });
 
      // Update the loan document with the amount paid back
      const updatedLoanDocument = {
        ...payingDocument,
        fields: {
          ...payingDocument.fields,
          amountPaidBack: { integerValue: totalPaidBack + amount }
        }
      };
 
      // Patch the updated loan document
      await fetch(`https://firestore.googleapis.com/v1/${payingDocument.name}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedLoanDocument)
      });
 
      // Post the transaction
      const transactionData = {
        documents: [
          {
            fields: {
              accountNumber: { integerValue: payingAccountNumber },
              amount: { doubleValue: amount },
              timestamp: { timestampValue: new Date().toISOString() },
              type: { stringValue: "Loan" },
       // Replace "YourNameHere" with appropriate value
            }
          }
        ]
      };
 
      await fetch('https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      });
 
      // Notify the user
      alert('Payment processed successfully.');
 
      // Clear input fields and close payment form
      setPayingAccountNumber('');
      setPayingAmount('');
      setPayingDocument(null);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment. Please try again.');
    }
  };
 
  const handlePay = (document) => {
    setPayingDocument(document);
  };
 
 
 
  return (
    <div className="container">
    <h1>Loan Documents</h1>
    {matchingDocuments.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Account Number</th>
            <th>Profession</th>
            <th>Status</th>
            <th>Sanctioned Amount</th>
            <th>Expected Amount</th>
            <th>Monthly Income</th>
            <th>Annual Income</th>
            <th>Property Identified</th>
            <th>Amount PaidBack</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {matchingDocuments.map((document, index) => (
            <tr key={index}>
              <td>{document.fields.accountNumber.integerValue}</td>
              <td>{document.fields.profession.stringValue}</td>
              <td>{document.fields.status.stringValue}</td>
              <td>{document.fields.sanctionedAmount.integerValue}</td>
              <td>{document.fields.expectedAmount.integerValue}</td>
              <td>{document.fields.monthlyIncome.integerValue}</td>
              <td>{document.fields.annualIncome.integerValue}</td>
              <td>{document.fields.propertyIdentified.stringValue}</td>
              <td>{document.fields.amountPaidBack ? document.fields.amountPaidBack.integerValue : 0}</td>
 
              <td>
                <button onClick={() => handlePay(document)}>Pay</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No loan found.</p>
    )}
 
    {/* Payment Form */}
    {payingDocument && (
      <div>
        <h2>Payment</h2>
        <form onSubmit={handleSubmitPayment}>
          <label htmlFor="payingAccountNumber">Account Number:</label>
          <input type="text" id="payingAccountNumber" value={payingAccountNumber} onChange={(e) => setPayingAccountNumber(e.target.value)} />
          <br />
          <label htmlFor="payingAmount">Amount:</label>
          <input type="number" id="payingAmount" value={payingAmount} onChange={(e) => setPayingAmount(e.target.value)} />
          <br />
          <button type="submit">Submit Payment</button>
        </form>
      </div>
      )}
    </div>
  );
}
 
export default LoanDeposit;