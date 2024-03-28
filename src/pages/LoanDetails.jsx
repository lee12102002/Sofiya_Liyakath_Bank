import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/approve.css';
 
function LoanDetails() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    fetchPendingRequests();
  }, []);
 
  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get('https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Loan');
      console.log('Response:', response);
     
      if (response.data && response.data.documents) {
        const pending = response.data.documents
          .filter(doc => doc.fields && doc.fields.status.stringValue === 'pending')
          .map(doc => ({
            id: doc.name.split('/').pop(), // Extract document ID from the name
            fields: {
              ...doc.fields,
              amountPaidBack: { integerValue: 0 } // Add amountPaidBack field
            }
          }));
        setPendingRequests(pending);
      } else {
        console.error('Error fetching pending requests:', response);
        setError('No pending account requests found');
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setError('Failed to fetch pending requests. Please try again later.');
    }
  };
 
  const updateRequestStatus = async (id, status, accountNumber, amount) => {
    let sanctionedAmount = 0; // Define sanctionedAmount variable in outer scope
    try {
      if (status === 'approved') {
        sanctionedAmount = prompt('Enter the amount to be sanctioned:');
        if (sanctionedAmount !== null) {
          const accountsResponse = await axios.get('https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/customerAccounts');
          const accounts = accountsResponse.data.documents;
 
          const accountResponse = await axios.get('https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Account');
          const acc = accountResponse.data.documents;
 
          // Find the account with matching account number
          const accountToUpdate = accounts.find(account => account.fields.accountNumber.integerValue === accountNumber);
 
          const accToUpdate = acc.find(account => account.fields.accountNumber.integerValue === accountNumber);
 
          if (accountToUpdate) {
            let currentBalance = accToUpdate.fields.balance ? accToUpdate.fields.balance.doubleValue : 0;
            currentBalance += parseFloat(sanctionedAmount);
 
            // Update account balance while keeping other fields intact
            await axios.patch(`https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/customerAccounts/${accountToUpdate.name.split('/').pop()}`, {
              fields: {
                ...accountToUpdate.fields, // Keep existing fields
                Loan:{stringValue: "Accepted"}                
              }              
            });
 
            await axios.patch(`https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Account/${accToUpdate.name.split('/').pop()}`, {
              fields: {
                ...accToUpdate.fields, // Keep existing fields
                balance: { doubleValue: currentBalance },// Update balance field              
              }              
            });
            toast.success("Loan Approved");
          } else {
            throw new Error('Account not found');
          }
        }
      } else if (status === 'rejected') {
        toast.error('Loan has been rejected.');
        const accountsResponse = await axios.get('https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/customerAccounts');
        const accounts = accountsResponse.data.documents;
        // Find the account with matching account number
        const accountToUpdate = accounts.find(account => account.fields.accountNumber.integerValue === accountNumber);
        if (accountToUpdate) {
          // Update account balance while keeping other fields intact
          await axios.patch(`https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/customerAccounts/${accountToUpdate.name.split('/').pop()}`, {
            fields: {
              ...accountToUpdate.fields, // Keep existing fields
              Loan: { stringValue: "Rejected" }
            }
          });
        }
      }
 
      // Update loan status in Loan collection
      await axios.patch(`https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Loan/${id}`, {
        fields: {
          ...pendingRequests.find(request => request.id === id).fields, // Keep existing fields
          status: { stringValue: status }, // Update status field
          sanctionedAmount: { integerValue: parseInt(sanctionedAmount) }, // Add sanctionedAmount field
          amountPaidBack: { integerValue: 0 } // Add amountPaidBack field with initial value 0
        }
      });
      // Refetch pending requests after update
      fetchPendingRequests();
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status.');
    }
  };
 
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#be1212', textAlign: 'center', marginBottom: '20px' }}>Approve/Reject Loans</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {pendingRequests.length === 0 ? (
        <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No pending loan requests</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {pendingRequests.map(request => (
            <li key={request.id} style={{ border: '1px solid #ccc', marginBottom: '20px', padding: '15px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Account Number:</strong> {request.fields.accountNumber.integerValue}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Property Identified:</strong> {request.fields.propertyIdentified.stringValue}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Profession:</strong> {request.fields.profession.stringValue}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Monthly Income (INR):</strong> {request.fields.monthlyIncome.integerValue}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Annual Income (INR):</strong> {request.fields.annualIncome.integerValue}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Expected Amount (INR):</strong> {request.fields.expectedAmount.integerValue}
              </div>
              <div>
                <button onClick={() => updateRequestStatus(request.id, 'approved', request.fields.accountNumber.integerValue)} style={{ padding: '8px 15px', cursor: 'pointer', marginRight: '10px', backgroundColor: '#07bc0c', color: '#fff', border: 'none', borderRadius: '4px' }}>Approve</button>
                <button onClick={() => updateRequestStatus(request.id, 'rejected', request.fields.accountNumber.integerValue)} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px' }}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
 
      {/* Toast container for displaying notifications */}
      <ToastContainer />
    </div>
  );
}
 
export default LoanDetails;