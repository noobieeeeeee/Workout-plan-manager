import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Components/Header';
import { Activity, Calendar, Clock, Target } from 'lucide-react';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f4f8',
  },
  content: {
    flex: 1,
    padding: '40px 20px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: '1 1 200px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    margin: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#0066cc',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
  },
  workoutItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  workoutTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  workoutProgress: {
    display: 'flex',
    alignItems: 'center',
  },
  progressBar: {
    width: '100px',
    height: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    marginRight: '10px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: '5px',
  },
  button: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#0066cc',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    textAlign: 'center',
    transition: 'background-color 0.3s',
  },
  chartContainer: {
    width: '100%',
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    padding: '20px',
    boxSizing: 'border-box',
  },
  barContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '100%',
  },
  bar: {
    width:'5px',
    flex: 1,
    backgroundColor: '#4caf50',
    margin: '0 5px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    transition: 'height 0.5s ease-in-out',
  },
  barLabel: {
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    transform: 'rotate(180deg)',
    padding: '5px',
    fontSize: '12px',
    color: '#fff',
  },
  barValue: {
    position: 'absolute',
    top: '-20px',
    fontSize: '12px',
    color: '#333',
  },
};

const BarChart = ({ data }) => {
  return (
    <div style={styles.chartContainer}>
      <div style={styles.barContainer}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.bar,
              height: `${item.ProgressPercentage}%`,
            }}
          >
            <span style={styles.barValue}>{`${item.ProgressPercentage}%`}</span>
            <span style={styles.barLabel}>{item.PlanTitle}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [userProgress, setUserProgress] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [overallStats, setOverallStats] = useState({
    totalWorkoutsCompleted: 0,
    averageCompletion: 0,
    streakDays: 0,
    totalMinutesExercised: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/dashboard', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        
        console.log("Fetched Data:", data);
        
        setUserProgress(data.userProgress || []);
        setOverallStats(data.overallStats || {
          totalWorkoutsCompleted: 0,
          averageCompletion: 0,
          streakDays: 0,
          totalMinutesExercised: 0,
        });
        setRecentWorkouts(data.recentWorkouts || []);
        setIsLoading(false);
        
        console.log("User Progress:", data.userProgress);
        console.log("Overall Stats:", data.overallStats);
        console.log("Recent Workouts:", data.recentWorkouts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []); 

  if (isLoading) {
    console.log("Loading...");
    return (
      <div style={styles.page}>
        <Header isLoggedIn={true} userName={localStorage.getItem('userName')} onLogin={() => {}} onLogout={() => {}} />
        <main style={styles.content}>
          <div style={styles.container}>
            <h1 style={styles.header}>Dashboard</h1>
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  console.log("Final Stats:", overallStats);  
  console.log("Final User Progress:", userProgress);
  console.log("Final Recent Workouts:", recentWorkouts);

  return (
    <div style={styles.page}>
      <Header isLoggedIn={true} userName={localStorage.getItem('userName')} onLogin={() => {}} onLogout={() => {}} />
      <main style={styles.content}>
        <div style={styles.container}>
          <h1 style={styles.header}>Dashboard</h1>
          
          <div style={styles.flexContainer}>
            <div style={styles.statCard}>
              <Activity size={24} />
              <div style={styles.statValue}>{overallStats.totalWorkoutsCompleted}</div>
              <div style={styles.statLabel}>Workouts Completed</div>
            </div>
            <div style={styles.statCard}>
              <Target size={24} />
              <div style={styles.statValue}>{Number(overallStats.averageCompletion).toFixed(1)}%</div>
              <div style={styles.statLabel}>Average Completion</div>
            </div>
            <div style={styles.statCard}>
              <Calendar size={24} />
              <div style={styles.statValue}>{overallStats.streakDays}</div>
              <div style={styles.statLabel}>Day Streak</div>
            </div>
            <div style={styles.statCard}>
              <Clock size={24} />
              <div style={styles.statValue}>{overallStats.totalMinutesExercised}</div>
              <div style={styles.statLabel}>Total Minutes Exercised</div>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.header}>Your Progress</h2>
            {userProgress.length > 0 ? (
              <BarChart data={userProgress} style={styles.bar}/>
            ) : (
              <div>No progress data available.</div>
            )}
          </div>

          <div style={styles.card}>
            <h2 style={styles.header}>Recent Workouts</h2>
            {recentWorkouts.length > 0 ? (
              recentWorkouts.map((workout) => (
                <div key={workout.PlanTitle} style={styles.workoutItem}>
                  <div>
                    <div style={styles.workoutTitle}>{workout.PlanTitle}</div>
                    <div>{new Date(workout.DateStarted).toLocaleDateString()}</div>
                  </div>
                  <div style={styles.workoutProgress}>
                    <div style={styles.progressBar}>
                      <div 
                        style={{
                          ...styles.progressFill,
                          width: `${(workout.ExercisesCompleted / workout.TotalExercises) * 100}%`
                        }}
                      ></div>
                    </div>
                    <div>{Math.round((workout.ExercisesCompleted / workout.TotalExercises) * 100)}%</div>
                  </div>
                </div>
              ))
            ) : (
              <p>No recent workouts available.</p>
            )}
          </div>

          <div style={styles.card}>
            <h2 style={styles.header}>Start a New Workout</h2>
            <Link to="/workoutplans" style={styles.button}>Browse Workout Plans</Link>
          </div>
        </div>
      </main>
    </div>
  );
}