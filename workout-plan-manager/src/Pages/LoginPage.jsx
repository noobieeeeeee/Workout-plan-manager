import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';


const styles = {
  loginPage: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },

  loginContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },

  loginContainer: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },

  h1: {
    fontSize: '28px',
    marginBottom: '10px',
    textAlign: 'center',
  },

  p: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '20px',
  },

  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },

  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },

  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },

  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },

  buttonPrimary: {
    backgroundColor: '#000',
    color: '#fff',
  },

  errorMessage: {
    color: 'red',
    fontSize: '14px',
    marginTop: '5px',
  },

  socialLogin: {
    marginTop: '30px',
  },

  socialButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  socialButton: {
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },

  signupLink: {
    marginTop: '20px',
    textAlign: 'center',
  },

  signupLinkAnchor: {
    color: '#000',
    textDecoration: 'underline',
  },

  '@media (maxWidth: 768px)': {
    loginContainer: {
      padding: '20px',
    },
  }
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userDetails, setUserDetails] = useState(null); // State for storing user details
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        const user = data.user;
        setUserDetails(user); // Store user details, including role and ID
        console.log(user)
        console.log(userDetails)
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userId', data.user.id);
        sessionStorage.setItem("user", JSON.stringify(data.user)); // Store user data

        setIsLoggedIn(true); // Set login status
        console.log(data.user)
        navigate('/workoutplans');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setErrorMessage("Unable to connect to the server. Please try again later.");
    }
  };
  
  return (
    <div style={styles.loginPage}>
      <Header isLoggedIn={isLoggedIn} onLogin={() => setIsLoggedIn(true)} onLogout={() => setIsLoggedIn(false)} />
      <main style={styles.loginContent}>
        <div style={styles.loginContainer}>
          <h1 style={styles.h1}>Welcome Back</h1>
          <p style={styles.p}>Log in to access your FitLife Gym account</p>
          <form onSubmit={handleLogin} style={styles.loginForm}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            {errorMessage && (
              <span style={styles.errorMessage}>{errorMessage}</span>
            )}
            <button type="submit" style={{ ...styles.button, ...styles.buttonPrimary }}>
              Log In
            </button>
          </form>
          <div style={styles.socialLogin}>
            <p>Or log in with:</p>
            <div style={styles.socialButtons}>
              <button style={{ ...styles.button, ...styles.socialButton }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                Facebook
              </button>
              <button style={{ ...styles.button, ...styles.socialButton }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                GitHub
              </button>
              <button style={{ ...styles.button, ...styles.socialButton }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Google
              </button>
            </div>
          </div>
          <p style={styles.signupLink}>
            Don't have an account? <a href="/signup" style={styles.signupLinkAnchor}>Sign up</a>
          </p>
        </div>
      </main>
    </div>
  );
}

