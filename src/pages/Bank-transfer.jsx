
import React, { useState } from 'react';
import '../Styles/Bank-transfer.css'; // Import CSS file for admin page styles
 
function BankTransfer() {
  const loggedInAccountNumber = localStorage.getItem('accountNumber');
  const [confirmedAccountNumber, setConfirmedAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [transactionInProgress, setTransactionInProgress] = useState(false); // State to track transaction progress
 
 
 
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setConfirmationDialogOpen(false); // Close confirmation dialog
    setTransactionInProgress(true); // Set transaction in progress
 
 
    try {
      if (parseFloat(amount) > 0) {
        // Fetch data from Firestore using the provided IFSC code as document ID
        const response = await fetch(`https://firestore.googleapis.com/v1/projects/common-bank-db/databases/(default)/documents/bank/${ifscCode}`);
        const data = await response.json();
 
        if (!data.fields) {
          setError('No bank is available for the provided IFSC code.');
          setTimeout(() => setError(''), 4000);
          return;
        }
 
        const domain = data.fields.domain_name.stringValue;
 
        // Fetch sender's account data using the retrieved domain
        const senderAccountResponse = await fetch(`https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Account`);
        const senderAccountData = await senderAccountResponse.json();
 
        // Search for the sender's account number within the documents
        const senderDoc = senderAccountData.documents.find(doc => {
          const accountNumberField = doc.fields.accountNumber;
          return accountNumberField && (parseInt(accountNumberField.integerValue || accountNumberField.stringValue) === parseInt(loggedInAccountNumber));
        });
 
        if (!senderDoc) {
          setError('Sender account not found.');
          setTimeout(() => setError(''), 4000);
          return;
        }
 
        // Check if the receiver account exists within the specified IFSC
        const receiverAccountResponse = await fetch(`https://firestore.googleapis.com/v1/projects/${domain}/databases/(default)/documents/Account`);
        const receiverAccountData = await receiverAccountResponse.json();
        const receiverDoc = receiverAccountData.documents.find(doc => {
          const accountNumberField = doc.fields.accountNumber;
          return accountNumberField && (parseInt(accountNumberField.integerValue || accountNumberField.stringValue) === parseInt(confirmedAccountNumber));
        });
 
        if (!receiverDoc) {
          setError('This bank account is not available in the receiver bank.');
          setTimeout(() => setError(''), 4000);
          return;
        }
 
        // Proceed with the transaction
        const senderNewBalance = parseFloat(senderDoc.fields.balance.doubleValue) - parseFloat(amount);
        if (senderNewBalance >= 0) {
          // Update sender's balance
          await fetch(`https://firestore.googleapis.com/v1/${senderDoc.name}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fields: {
                ...senderDoc.fields,
                balance: {
                  doubleValue: senderNewBalance
                }
              }
            })
          });
 
          // Add transaction to sender's transaction history
          await fetch(`https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Transactions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fields: {
                senderAccountNumber: {
                  integerValue: parseInt(loggedInAccountNumber)
                },
                receiverAccountNumber: {
                  integerValue: parseInt(confirmedAccountNumber)
                },
                type: {
                  stringValue: 'Debit'
                },
                amount: {
                  doubleValue: parseFloat(amount)
                },
                timestamp: {
                  timestampValue: new Date().toISOString()
                }
              }
            })
          });
 
          // Update receiver's balance
          const receiverNewBalance = parseFloat(receiverDoc.fields.balance.doubleValue) + parseFloat(amount);
          await fetch(`https://firestore.googleapis.com/v1/${receiverDoc.name}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fields: {
                ...receiverDoc.fields,
                balance: {
                  doubleValue: receiverNewBalance
                }
              }
            })
          });
 
          // Add transaction to receiver's transaction history
          await fetch(`https://firestore.googleapis.com/v1/projects/${domain}/databases/(default)/documents/Transactions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fields: {
                senderAccountNumber: {
                  integerValue: parseInt(loggedInAccountNumber)
                },
                receiverAccountNumber: {
                  integerValue: parseInt(confirmedAccountNumber)
                },
                type: {
                  stringValue: 'Credit'
                },
                amount: {
                  doubleValue: parseFloat(amount)
                },
                timestamp: {
                  timestampValue: new Date().toISOString()
                }
              }
            })
          });
 
          // Show success message if the transaction succeeds
          setSuccessMessage('Transaction successful!');
          setTimeout(() => setSuccessMessage(''), 4000);
        } else {
          setError('Insufficient balance.');
          setTimeout(() => setError(''), 4000);
        }
      } else {
        setError('Invalid amount.');
        setTimeout(() => setError(''), 4000);
      }
    } catch (error) {
      // Show error message if the transaction fails
      setError('Transaction failed.');
      setTimeout(() => setError(''), 4000);
    } finally {
      // Reset form fields and error state
      setConfirmedAccountNumber('');
      setIfscCode('');
      setAmount('');
      setTransactionInProgress(false);
    }
  };
 
 
  const handleConfirmedAccountNumberChange = (event) => {
    setConfirmedAccountNumber(event.target.value);
  };
 
  const handleIfscCodeChange = (event) => {
    setIfscCode(event.target.value);
  };
 
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };
 
  const handleConfirmTransaction = async () => {
    try {
      // Proceed with the transaction
      await handleSubmit();
    } catch (error) {
      // Show error message if the transaction fails
      setError('Transaction failed.');
    }
  };
 
  return (
    <div style={{
      // maxWidth: '500px',
      width: '100%',
      margin: '0 auto',
      padding: '20px',
      background: 'linear-gradient(to bottom, #044441, #2b5f5b)',
      color:'#fff',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      boxSizing: 'border-box',
      overflow: 'hidden'
  }}>
          <div className='background-container'>
            <h1 style={{justifyContent:'center'}}>Bank Transfer</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="confirmedAccountNumber">Account Number:</label>
                <input
                  type="text"
                  id="confirmedAccountNumber"
                  value={confirmedAccountNumber}
                  onChange={handleConfirmedAccountNumberChange}
                  required
                  style={{width:'200px', height:'30px'}}
                />
              </div>
              <br/>
              <div>
                <label htmlFor="ifscCode">IFSC Code:</label>
                <input
                  type="text"
                  id="ifscCode"
                  value={ifscCode}
                  onChange={handleIfscCodeChange}
                  required
                  style={{width:'200px', height:'30px'}}
                />
              </div>
              <br/>
              <div>
                <label htmlFor="amount">Amount:</label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  required
                  style={{width:'200px', height:'30px'}}
                />
              </div>
              <br/>
              {error && <div style={{ color: 'red' }}>{error}</div>}
              {confirmationDialogOpen && (
                <div>
                  <p>Are you sure you want to transfer?</p>
                  <button onClick={handleConfirmTransaction}>Yes</button>
                  <button onClick={() => setConfirmationDialogOpen(false)}>No</button>
                </div>
              )}
              {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
              <button type="submit" className="submit-buttonBankTransfer" disabled={transactionInProgress} style={{backgroundColor:'#073d39'}}>
                  {transactionInProgress ? 'Transaction in Progress...' : 'Submit'}
                </button>
            </form>
          </div>
        </div>
      );
    }
 
export default BankTransfer;
 