import React, { useState,useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { Link, useNavigate } from 'react-router-dom';
 
 
function MainComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null); // Initialize userId state
  const navigate = useNavigate();
 
  useEffect(() => {
    // Add event listener to prevent right-clicking
    const handleContextMenu = (e) => {
      e.preventDefault();
      alert("Right-click is not allowed here.");
    };
    document.body.addEventListener("contextmenu", handleContextMenu);
    return () => {
      // Cleanup: Remove event listener when component unmounts
      document.body.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
 
  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
 
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Signin successful:', user);
 
      // Store user ID
      setUserId(user.uid);
 
      // Redirect based on email
      if (email === 'sofiyaliyakathali@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/customer');
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
 
  const handleForgotPassword = () => {
    // Redirect user to Forgot Password page
    navigate('/forgot-password');
  };
 
  return (
    <div className="signup-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignin}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}>Sign In</button>
      </form>
      {error && <div className="error">{error}</div>}
      <p><Link to="/forgot-password">Forgot Password?</Link></p>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
   
    </div>
  );
}
 
export default MainComponent;