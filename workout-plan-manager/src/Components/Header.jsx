import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8f8f8',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000',
    textDecoration: 'none',
  },
  icon: {
    marginRight: '10px',
  },
  nav: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: '#000',
    textDecoration: 'none',
    fontSize: '16px',
  },
  authButtons: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  buttonPrimary: {
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    backgroundColor: '#000',
    color: '#fff',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    backgroundColor: 'transparent',
    color: '#000',
    border: '2px solid #000',
    cursor: 'pointer',
  },
  userName: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  '@media(maxWidth: 768px)': {
    header: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    nav: {
      marginTop: '20px',
    },
    authButtons: {
      width: '100%',
      justifyContent: 'space-between',
    },
  },
};

type HeaderProps = {
  isLoggedIn: boolean;
  onLogout: () => void;
};

export default function Header({ isLoggedIn, onLogout }: HeaderProps) {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from session storage if logged in
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const { user_name } = JSON.parse(storedUser);
      setUserName(user_name);
    }
  }, [isLoggedIn]);

  const handleLogoutClick = () => {
    // Clear user session data
    sessionStorage.removeItem("user");
    onLogout();
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <a href="/" style={styles.logo}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={styles.icon}
        >
          <path d="M6.5 6.5h11"></path>
          <path d="M6.5 17.5h11"></path>
          <path d="M3 10h18"></path>
          <path d="M3 14h18"></path>
        </svg>
        <span>FitLife Gym</span>
      </a>
      <nav style={styles.nav}>
        <a href="/classes" style={styles.navLink}>
          Classes
        </a>
        <a href="/trainers" style={styles.navLink}>
          Trainers
        </a>
        <a href="/membership" style={styles.navLink}>
          Membership
        </a>
        <a href="/contact" style={styles.navLink}>
          Contact
        </a>
      </nav>
      <div style={styles.authButtons}>
        {isLoggedIn ? (
          <>
            <span style={styles.userName}>Welcome, {userName || "User"}</span>
            <button onClick={handleLogoutClick} style={styles.buttonSecondary}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} style={styles.buttonSecondary}>
              Login
            </button>
            <a href="/signup" style={styles.buttonPrimary}>
              Sign Up
            </a>
          </>
        )}
      </div>
    </header>
  );
}
