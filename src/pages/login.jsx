import React, { useState } from 'react';
import '../Styles/login.css';

 
const LoginPage = () => {
  const [customerId, setCustomerId] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');
 
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
   
    try {
      // Trim the customerId and accountNumber to remove leading/trailing whitespace
      const trimmedCustomerId = customerId.trim();
      const trimmedAccountNumber = accountNumber.trim();
 
      // Fetch the customer accounts from Firestore
      const response = await fetch(`https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/customerAccounts/${trimmedCustomerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer account');
      }
      const data = await response.json();
     
      console.log('Fetched data:', data);
 
      // Check if the entered account number matches the one in the fetched document
      if (data.fields && data.fields.accountNumber && parseInt(data.fields.accountNumber.integerValue) === parseInt(trimmedAccountNumber)) {
        // Account number matches, store account number in local storage
        localStorage.setItem('accountNumber', trimmedAccountNumber);
        localStorage.setItem('customerId', trimmedCustomerId); 
        // Navigate to the main customer page
        window.location.href = '/customer-page-main';
      } else {
        // Account number does not match
        setError('Invalid credentials. Please enter valid customer ID and account number.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to login. Please try again later.');
    }
  };
 
  return (
    <div className='Login'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}> {/* Use onSubmit to handle form submission */}
        <input
          type="text"
          placeholder="Enter your customer ID"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <button type="submit">Login</button> {/* Use type="submit" for the login button */}
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
 
export default LoginPage;