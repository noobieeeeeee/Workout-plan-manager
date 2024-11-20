import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: '40px 20px',
    backgroundColor: '#f8f8f8',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  dietList: {
    listStyle: 'none',
    padding: 0,
  },
  dietItem: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    marginBottom: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  completeButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default function DietPlanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dietPlan, setDietPlan] = useState(null);
  console.log(id)
  useEffect(() => {
    const fetchDietPlan = async () => {
      try {
        const response = await fetch(`http://localhost:5000/diet/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch diet plan');
        }
        const data = await response.json();
        console.log(data);
        setDietPlan(data);
      } catch (error) {
        console.error('Error fetching diet plan:', error);
      }
    };

    fetchDietPlan();
  }, [id]);

  if (!dietPlan) {
    return <div>Loading...</div>;
  }

  const handleBackClick = () => {
    navigate('/dietplans');
  };

  const handleDeleteDiet = async () => {
    if (window.confirm('Are you sure you want to delete this diet plan? This action cannot be undone.')) {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`http://localhost:5000/dietplans/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete diet plan');
        }

        alert('Diet plan deleted successfully!');
        navigate('/workoutplans');
      } catch (error) {
        console.error('Error deleting diet plan:', error);
      }
    }
  };
  console.log(dietPlan)
  return (
    <div style={styles.page}>
      <Header isLoggedIn={true} userName={localStorage.getItem('userName')} onLogin={() => {}} onLogout={() => {}} />
      <main style={styles.content}>
        <div style={styles.container}>
          <button onClick={handleBackClick} style={styles.backButton}>
            Back to Diet Plans
          </button>
          <h1 style={styles.title}>{dietPlan.Title}</h1>
          <p>{dietPlan.Description}</p>
          <p><strong>Calories:</strong> {dietPlan.Calories}</p>
          {dietPlan.Thumbnail && (
            <img
              src={`data:image/jpeg;base64,${dietPlan.Thumbnail}`}
              alt="Diet plan thumbnail"
              style={{ width: '100%', maxWidth: '400px', margin: '20px auto', display: 'block' }}
            />
          )}
          <h2>Diets:</h2>
          <ul style={styles.dietList}>
            {dietPlan.Diets && dietPlan.Diets.length > 0 ? (
              dietPlan.Diets.map((diet) => (
                <li key={diet.DietID} style={styles.dietItem}>
                  <h3>{diet.Name}</h3>
                  <p><strong>Calories:</strong> {diet.Calories}</p>
                </li>
              ))
            ) : (
              <li>No diets found for this diet plan.</li>
            )}
          </ul>
        </div>
      </main>
      {localStorage.getItem('userRole') === 'trainer' && (
        <button style={styles.completeButton} onClick={handleDeleteDiet}>
          Delete Workout
        </button>
      )}
    </div>
  );
}
