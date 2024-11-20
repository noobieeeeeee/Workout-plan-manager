import './App.css';
import React from 'react';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignUpPage from './Pages/SignUp';
import WorkoutPlansPage from './Pages/WorkoutPlansPage';
import WorkoutDetailPage from './Pages/WorkoutDetailPage';
import DashboardPage from './Pages/DashboardPage';
import DietPlansPage from './Pages/DietPlansPage';
import DietPlanDetailPage from './Pages/DietDetailPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/workoutplans" element={<WorkoutPlansPage/>}/>
        <Route path="/workout/:id" element={<WorkoutDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dietplans" element={<DietPlansPage/>}/>
        <Route path="/diet/:id" element={<DietPlanDetailPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
