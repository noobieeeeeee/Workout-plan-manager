import './App.css';
import React from 'react';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUp';
import WorkoutPlansPage from './Pages/WorkoutPlansPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/workoutplans" element={<WorkoutPlansPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
