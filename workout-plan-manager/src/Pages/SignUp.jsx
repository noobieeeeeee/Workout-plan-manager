import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  container: {
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
  form: {
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
  buttonOutline: {
    backgroundColor: 'transparent',
    color: '#000',
    border: '2px solid #000',
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
    justifyContent: 'space-between',
    gap: '10px',
  },
  socialButton: {
    flex: 1,
    fontSize: '14px',
  },
  icon: {
    marginRight: '8px',
  },
  link: {
    marginTop: '20px',
    textAlign: 'center',
  },
  linkAnchor: {
    color: '#000',
    textDecoration: 'underline',
  },
};

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [role, setRole] = useState('user'); // State for user role
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();  // Prevents page reload on form submit

    const signupData = {
        name: name,
        password: password,
        confirmPassword:confirmPassword,
        email: email,
        role: role
    };

    try {
        if (password !== confirmPassword){
          setPasswordMatch(false);
          setErrorMessage("Passwords do not match");
          throw new Error("Passwords do not match");
          
        } else {
          setPasswordMatch(true);
          setErrorMessage(''); // Clear error message if passwords match
        }
        const response = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        });
        console.log(signupData);
        
      
        if (response.ok) {
          const data = await response.json();
          console.log("Signup successful:", data);
          console.log(name,password,email)
          navigate('/login');
          // Handle successful signup (e.g., redirect to login)
        } else {
            const errorData = await response.json();
            if (errorData.message === "User already exists") {
              setErrorMessage("User already exists"); // Set error message for existing user

            } else {
              console.error("Signup failed:", errorData);
              setErrorMessage("Signup failed. Please try again.");
            // Handle signup error
            }
            
        }
        
    } catch (error) {
        console.error("An error occurred:", error);
        //setErrorMessage("An error occurred. Please try again.");
    }
};

  return (
    <div style={styles.page}>
      <Header isLoggedIn={false} onLogin={() => {}} onLogout={() => {}} />
      <main style={styles.content}>
        <div style={styles.container}>
          <h1 style={styles.h1}>Create Your Account</h1>
          <p style={styles.p}>Join FitLife Gym and start your fitness journey today</p>
          <form onSubmit={handleSignup} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="name" style={styles.label}>Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            </div>
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
            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.input}
              />
              {(errorMessage || !passwordMatch) && (
                <span style={styles.errorMessage}>{errorMessage || "Passwords do not match!"}</span>
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>I am a:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="user"
                    checked={role === 'user'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  User
                </label>
                <label style={{ marginLeft: '10px' }}>
                  <input
                    type="radio"
                    value="trainer"
                    checked={role === 'trainer'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Trainer
                </label>
              </div>
            </div>
            <button type="submit" style={{ ...styles.button, ...styles.buttonPrimary }}>
              Sign Up
            </button>
          </form>
          <div style={styles.socialLogin}>
            <p style={styles.p}>Or sign up with:</p>
            <div style={styles.socialButtons}>
              <button style={{ ...styles.button, ...styles.buttonOutline, ...styles.socialButton }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                Facebook
              </button>
              <button style={{ ...styles.button, ...styles.buttonOutline, ...styles.socialButton }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                GitHub
              </button>
              <button style={{ ...styles.button, ...styles.buttonOutline, ...styles.socialButton }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.icon}>
                  <path d="M16 8a6 6 0 0 1 6 6v4H2v-4a6 6 0 0 1 6-6h8z"></path>
                  <path d="M4 16v1h16v-1"></path>
                </svg>
                Google
              </button>
            </div>
          </div>
          <div style={styles.link}>
            <p>
              Already have an account? <a href="/login" style={styles.linkAnchor}>Log in</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
