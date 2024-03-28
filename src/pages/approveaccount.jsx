import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/approve.css';
import emailjs from 'emailjs-com';
 
export const sendEmail = async (toEmail, templateId) => {
  try {
    const templateParams = {
      to_email: toEmail,
      firestore_api_link: 'https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/customerAccounts',
      // Add other template parameters here as needed
    };
 
    const serviceId = 'service_46l9nso'; // Replace with your EmailJS service ID
    const userId = 'KvtXVt3te9L2LL6PJ'; // Replace with your EmailJS user ID
 
    await emailjs.send(serviceId, templateId, templateParams, userId);
    console.log('Email sent successfully');
    return null; // Indicate success
  } catch (error) {
    console.error('Error sending email:', error);
    return 'Failed to send email'; // Indicate failure
  }
};
 
function ApproveAccountsPage() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    fetchPendingRequests();
  }, []);
 
  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get('https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/customerAccounts');
      console.log('Response:', response);
     
      if (response.data && response.data.documents) {
        const pending = response.data.documents
          .filter(doc => doc.fields && doc.fields.status.stringValue === 'pending')
          .map(doc => ({
            id: doc.name.split('/').pop(), // Extract document ID from the name
            fields: doc.fields // Store all fields
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
 
  const updateRequestStatus = async (requestId, newStatus, email, phoneNumber) => {
    try {
      // Fetch existing fields of the request
      const existingRequest = pendingRequests.find(request => request.id === requestId);
      const updatedFields = { ...existingRequest.fields, status: { stringValue: newStatus }, email: { stringValue: email }, phoneNumber: { stringValue: phoneNumber } };
 
      // Patch the request with updated fields
      await axios.patch(`https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/customerAccounts/${requestId}`, {
        fields: updatedFields
      });
 
      // Send email regardless of status
      const templateId = newStatus === 'approved' ? 'template_0ml9v5c' : 'template_0ml9v5c'; // Use different template for rejection
      const emailError = await sendEmail(email, templateId); // Pass templateId to sendEmail function
      if (emailError) {
        throw new Error(emailError);
      }
      console.log('Status updated successfully');
 
      if (newStatus === 'approved') {
        // If request is approved, generate account number and set balance to 0
        const accountNumber = generateAccountNumber();
        const balance = 100000;
        const Loan="No"
 
        // Update Firestore with new fields
        await axios.patch(`https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/customerAccounts/${requestId}`, {
          fields: {
            ...updatedFields,
            accountNumber: { integerValue: accountNumber },
            Loan: {stringValue : Loan}
          }
        });
        // Create new account entry
        await axios.post('https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Account', {
          fields: {
            accountNumber: { integerValue: accountNumber },
            balance: { doubleValue: balance },
            name: { stringValue: existingRequest.fields.name.stringValue }, // Add account holder's name
            customerId: { stringValue: requestId },
            age: { integerValue: existingRequest.fields.age.integerValue }, // Add age
            phoneNumber: { stringValue: existingRequest.fields.phoneNumber.stringValue }, // Add phone number
            email:{stringValue: existingRequest.fields.email.stringValue}
          }
        });
      }
 
      // Update the status in the local state
      setPendingRequests(pendingRequests.filter(request => request.id !== requestId));
 
      // Show toast notification
      toast.success(`Request ${newStatus === 'approved' ? 'Approved' : 'Rejected'} successfully`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(`Error updating request ${requestId} status:`, error);
      // Show error toast notification
      toast.error(`Failed to ${newStatus === 'approved' ? 'approve' : 'reject'} request. Please try again later`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
 
  // Function to generate a 6-digit random account number
  const generateAccountNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };
 
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', padding: '20px',width:'500px',height:'400px' }}>
      <h1 style={{ color: '#078a83', textAlign: 'center', marginBottom: '20px' }}>Approve Accounts</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {pendingRequests.length === 0 ? (
        <p style={{ textAlign: 'center', fontStyle: 'italic' }}>No pending account requests</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {pendingRequests.map(request => (
            <li key={request.id} style={{ border: '1px solid #ccc', marginBottom: '20px', padding: '15px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Name:</strong> {request.fields.name.stringValue}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Age:</strong> {request.fields.age.integerValue}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Occupation:</strong> {request.fields.occupation.stringValue}
              </div>
             
 
              <div style={{ marginBottom: '10px' }}>
                <strong>Status:</strong> {request.fields.status.stringValue}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Email:</strong> {request.fields.email.stringValue}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Phone Number:</strong> {request.fields.phoneNumber.stringValue}
              </div>
              <div style={{ marginBottom: '10px' }}>
                {/* Display images if available */}
                {request.fields.aadharCardUrl.stringValue && <img src={request.fields.aadharCardUrl.stringValue} alt="Aadhar Card" style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }} />}
                {request.fields.panCardUrl.stringValue && <img src={request.fields.panCardUrl.stringValue} alt="PAN Card" style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }} />}
                {request.fields.voterIdUrl.stringValue && <img src={request.fields.voterIdUrl.stringValue} alt="Voter ID" style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }} />}
              </div>
              <div>
                <button onClick={() => updateRequestStatus(request.id, 'approved', request.fields.email.stringValue, request.fields.phoneNumber.stringValue)} style={{ padding: '8px 15px', cursor: 'pointer', marginRight: '10px', backgroundColor: '#07bc0c', color: '#fff', border: 'none', borderRadius: '4px' }}>Approve</button>
                <br/>
                <button onClick={() => updateRequestStatus(request.id, 'rejected', request.fields.email.stringValue, request.fields.phoneNumber.stringValue)} style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px' }}>Reject</button>
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
 
export default ApproveAccountsPage;