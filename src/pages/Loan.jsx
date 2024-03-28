import React, { useState } from 'react';
//import '../Styles/Loan.css';
 
function Loan() {
    const [formData, setFormData] = useState({
        accountNumber: '',
        propertyIdentified: '',
        profession: '',
        monthlyIncome: '',
        annualIncome: '',
        expectedAmount: '',
        status: 'pending' // Add status field and set it as 'pending' by default
    });
    const [accountExists, setAccountExists] = useState(true); // Initially assuming account exists
   
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if account exists in Firestore
        const accountExistsResponse = await checkAccountExists(formData.accountNumber);
        setAccountExists(accountExistsResponse);
 
        if (accountExistsResponse) {
            // Account exists, proceed to store loan application data
            const storeLoanResponse = await storeLoanData(formData);
            console.log(storeLoanResponse);
            alert('Loan application submitted successfully!');
            // Reset form data after submission
            setFormData({
                accountNumber: '',
                propertyIdentified: '',
                profession: '',
                monthlyIncome: '',
                annualIncome: '',
                expectedAmount: '',
                status: 'pending' // Reset status to 'pending'
            });
        }
    };
 
    const checkAccountExists = async (accountNumber) => {
        try {
            const response = await fetch('https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/customerAccounts');
            const data = await response.json();
 
            for (const doc of data.documents) {
                const docData = doc.fields;
                if (docData.accountNumber.integerValue === accountNumber) {
                    return true; // Account found
                }
            }
            return false; // Account not found
        } catch (error) {
            console.error('Error checking account existence:', error);
            return false; // Return false in case of error
        }
    };
 
    const storeLoanData = async (loanData) => {
        try {
            const response = await fetch('https://firestore.googleapis.com/v1/projects/bank-c3114/databases/(default)/documents/Loan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: {
                        accountNumber: { integerValue: parseInt(loanData.accountNumber) },
                        propertyIdentified: { stringValue: loanData.propertyIdentified },
                        profession: { stringValue: loanData.profession },
                        monthlyIncome: { integerValue: parseInt(loanData.monthlyIncome) },
                        annualIncome: { integerValue: parseInt(loanData.annualIncome) },
                        expectedAmount: { integerValue: parseInt(loanData.expectedAmount) },
                        status: { stringValue: loanData.status } // Include status in the stored data
                    }
                })
            });
            return response.json();
        } catch (error) {
            console.error('Error storing loan data:', error);
            return { error: 'Failed to store loan data' }; // Return error object
        }
    };
   
 
    return (
        <div style={{
            maxWidth: '400px',
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
            <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#fff' }}>Apply For Loan</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Account Number:</label>
                    <input type="number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box', marginBottom: '15px' }}/>
                </div>
               
                <div>
                    <label>Property Identified:</label>
                    <select name="propertyIdentified" value={formData.propertyIdentified} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box',marginBottom: '15px' }}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
               
                <div>
                    <label>Profession:</label>
                    <select name="profession" value={formData.profession} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box', marginBottom: '15px' }}>
                        <option value="">Select</option>
                        <option value="Salaried">Salaried</option>
                        <option value="Self Employed">Self Employed</option>
                    </select>
                </div>
             
                <div>
                    <label>Monthly Income (INR):</label>
                    <input type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box', marginBottom: '15px' }}/>
                </div>
       
                <div>
                    <label>Annual Income (INR):</label>
                    <input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box', marginBottom: '15px' }}/>
                </div>
               
                <div>
                    <label>Expected Amount (INR):</label>
                    <input type="number" name="expectedAmount" value={formData.expectedAmount} onChange={handleChange} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box', marginBottom: '15px' }}/>
                </div>
                <br/>
                <button type="submit" style={{ width: '100%', padding: '10px', border: 'none', borderRadius: '5px', backgroundColor: '#078a83', color: '#fff', cursor: 'pointer', marginBottom: '15px' }}>Submit</button>
            </form>
            {!accountExists && <p style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>Account number does not exist.</p>}
        </div>
    );
}
 
export default Loan;