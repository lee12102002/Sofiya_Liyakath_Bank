// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import AdminPage from './pages/AdminPage';
import ApproveAccountsPage from './pages/approveaccount';
import TransactionsDonePage from './pages/transactionDone';
import CustomerDetailsPage from './pages/customerdetail';
import ForgotPassword from './pages/forgotpassword';
import CustomerPage from './pages/CustomerPage';
import CreateAccountPage from './pages/createaccount';
import LoginPage from './pages/login';
import CustomerPageMain from './pages/customer-page-main';
import LoanDetails from './pages/LoanDetails';
import BankRegistration from './pages/bankRegistration';
import DepositPage from './pages/Deposit';
import LoanDeposit from './pages/LoanDeposit';
import CustomerTransaction from './pages/customerTransaction';
import Loan from './pages/Loan';
import BankTransfer from './pages/Bank-transfer';
import HomePage from './pages/home';
 
 
 
 
function App() {
  const [isSignedUp, setIsSignedUp] = useState(false);
 
  const handleSignupSuccess = () => {
    setIsSignedUp(true);
  };
 
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup onSignupSuccess={handleSignupSuccess} />} />
        <Route path="/admin" element={<AdminPage />}/>
        <Route path="/approve-accounts" element={<ApproveAccountsPage />} />
        <Route path="/transactions" element={<TransactionsDonePage />} />
        <Route path="/customer-details" element={<CustomerDetailsPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/customerTransaction" element={<CustomerTransaction />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/customer-page-main" element={<CustomerPageMain/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/Loan-details" element={< LoanDetails/>}/>
        <Route path="/Bank-registration" element={< BankRegistration/>}/>
        <Route path="/Deposit" element={< DepositPage/>}/>
        <Route path="/Loan" element={<Loan/>}/>
        <Route path="/loandeposit" element={<LoanDeposit/>}/>
        <Route path="/Bank-transfer" element={<BankTransfer/>}/>
 
        <Route path="*" element={<HomePage onSignupSuccess={handleSignupSuccess} />} />
 
      </Routes>
    </Router>
  );
}
 
export default App;