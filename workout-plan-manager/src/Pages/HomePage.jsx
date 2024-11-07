import React, { useState } from 'react';
import Header from '../Components/Header';


export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserName('John Doe'); // This would normally come from your authentication system
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <div className="home-page">
      <Header isLoggedIn={isLoggedIn} userName={userName} onLogin={handleLogin} onLogout={handleLogout} />
      <main>
        <section className="hero">
          <div className="container">
            <h1>Transform Your Body, Transform Your Life</h1>
            <p>Join FitLife Gym today and start your journey to a healthier, stronger you. Expert trainers, state-of-the-art equipment, and motivating classes await.</p>
            <div className="button-group">
              <button className="button button-primary">Start Free Trial</button>
              <button className="button button-secondary">Learn More</button>
            </div>
          </div>
        </section>
        <section className="featured-classes">
          <div className="container">
            <h2>Featured Classes</h2>
            <div className="class-grid">
              <div className="class-card">
                <h3>High-Intensity Interval Training</h3>
                <p>Burn fat and build muscle with our intense HIIT sessions.</p>
                <div className="class-info">
                  <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 45 minutes</span>
                  <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> Max 20 people</span>
                </div>
              </div>
              <div className="class-card">
                <h3>Yoga Flow</h3>
                <p>Find your center and improve flexibility with our yoga classes.</p>
                <div className="class-info">
                  <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 60 minutes</span>
                  <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> Max 15 people</span>
                </div>
              </div>
              <div className="class-card">
                <h3>Strength Training</h3>
                <p>Build muscle and increase your metabolism with weight training.</p>
                <div className="class-info">
                  <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 50 minutes</span>
                  <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> Max 12 people</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button className="button button-outline">
                View All Classes
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </section>
        <section className="cta">
          <div className="container">
            <h2>Ready to Get Started?</h2>
            <p>Join FitLife Gym today and take the first step towards a healthier, stronger you. Our expert trainers and supportive community are here to help you achieve your fitness goals.</p>
            <button className="button button-primary">
              Sign Up Now
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </section>
      </main>
      <footer className="footer">
        <p>&copy; 2024 FitLife Gym. All rights reserved.</p>
        <nav>
          <a href="/terms" className="footer-link">Terms of Service</a>
          <a href="/privacy" className="footer-link">Privacy</a>
        </nav>
      </footer>

      <style jsx>{`
        /* Global Styles */
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          color: #333;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .button-primary {
          background-color: #000;
          color: #fff;
        }

        .button-primary:hover {
          background-color: #333;
        }

        .button-secondary {
          background-color: transparent;
          color: #fff;
          border: 2px solid #fff;
        }

        .button-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .button-outline {
          background-color: transparent;
          color: #000;
          border: 2px solid #000;
        }

        .button-outline:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        .icon {
          margin-left: 8px;
        }

        /* Hero Section Styles */
        .hero {
          background-color: #000;
          color: #fff;
          padding: 100px 0;
          text-align: center;
        }

        .hero h1 {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .hero p {
          font-size: 18px;
          max-width: 600px;
          margin: 0 auto 30px;
        }

        .button-group {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        /* Featured Classes Styles */
        .featured-classes {
          background-color: #f8f8f8;
          padding: 80px 0;
        }

        .featured-classes h2 {
          font-size: 36px;
          text-align: center;
          margin-bottom: 40px;
        }

        .class-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .class-card {
          background-color: #fff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .class-card h3 {
          font-size: 24px;
          margin-bottom: 10px;
        }

        .class-card p {
          margin-bottom: 20px;
        }

        .class-info {
          display: flex;
          justify-content: space-between;
          color: #666;
          
          font-size: 14px;
        }

        .class-info span {
          display: flex;
          align-items: center;
        }

        .class-info .icon {
          margin-right: 5px;
        }

        /* CTA Section Styles */
        .cta {
          padding: 80px 0;
          text-align: center;
        }

        .cta h2 {
          font-size: 36px;
          margin-bottom: 20px;
        }

        .cta p {
          font-size: 18px;
          max-width: 600px;
          margin: 0 auto 30px;
        }

        /* Footer Styles */
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background-color: #f8f8f8;
          font-size: 14px;
        }

        .footer-link {
          color: #666;
          text-decoration: none;
          margin-left: 20px;
        }

        .footer-link:hover {
          text-decoration: underline;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .hero h1 {
            font-size: 36px;
          }

          .button-group {
            flex-direction: column;
            align-items: center;
          }

          .footer {
            flex-direction: column;
            align-items: center;
          }

          .footer nav {
            margin-top: 10px;
          }

          .footer-link {
            margin: 0 10px;
          }
        }
      `}</style>
    </div>
  );
}