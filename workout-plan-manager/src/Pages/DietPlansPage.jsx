import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  h1: {
    fontSize: '32px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  dietPlanGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  dietPlanCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
  },
  dietPlanInfo: {
    padding: '15px',
  },
  dietPlanTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  trainerName: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  },
  button: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    textDecoration: 'none',
    marginBottom: '20px',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    minHeight: '100px',
  },
  select: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  selectedItems: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  itemTag: {
    backgroundColor: '#f0f0f0',
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
  },
  removeItem: {
    marginLeft: '5px',
    cursor: 'pointer',
    color: '#ff0000',
  },
};

export default function DietPlansPage() {
  const [isTrainer, setIsTrainer] = useState(localStorage.getItem('userRole') === 'trainer');
  const [isTrainerView, setIsTrainerView] = useState(true);
  const [userID, setUserID] = useState(localStorage.getItem('userId'));
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [dietPlans, setDietPlans] = useState([]);
  const [diets, setDiets] = useState([]);
  const [newDietPlan, setNewDietPlan] = useState({
    title: '',
    description: '',
    calories: '',
    selectedDiets: [],
  });

  useEffect(() => {
    fetchDietPlans();
    fetchDiets();
  }, []);

  const fetchDietPlans = async () => {
    try {
      const response = await fetch('http://localhost:5000/dietplans');
      const data = await response.json();
      setDietPlans(data);
    } catch (error) {
      console.error('Error fetching diet plans:', error);
    }
  };

  const fetchDiets = async () => {
    try {
      const response = await fetch('http://localhost:5000/diets');
      const data = await response.json();
      setDiets(data);
    } catch (error) {
      console.error('Error fetching diets:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setNewDietPlan({ ...newDietPlan, [name]: files[0] });
    } else {
      setNewDietPlan({ ...newDietPlan, [name]: value });
    }
  };

  const handleDietChange = (e) => {
    const selectedDietId = parseInt(e.target.value);
    if (selectedDietId && !newDietPlan.selectedDiets.includes(selectedDietId)) {
      setNewDietPlan({
        ...newDietPlan,
        selectedDiets: [...newDietPlan.selectedDiets, selectedDietId],
      });
    }
  };

  const removeDiet = (dietId) => {
    setNewDietPlan({
      ...newDietPlan,
      selectedDiets: newDietPlan.selectedDiets.filter(id => id !== dietId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const formData = new FormData();
      formData.append('title', newDietPlan.title);
      formData.append('description', newDietPlan.description);
      //    formData.append('calories', newDietPlan.calories);
      formData.append('selectedDiets', JSON.stringify(newDietPlan.selectedDiets));
      formData.append('trainerId', userID);
      if (newDietPlan.thumbnail) {
        formData.append('thumbnail', newDietPlan.thumbnail);
      }



      const response = await fetch('http://localhost:5000/dietplans', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        // body: JSON.stringify({
        //   ...newDietPlan,
        //   trainerId: userID,
        // }),
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create diet plan');
      }

      const result = await response.json();
      console.log('New diet plan created:', result);

      setNewDietPlan({
        title: '',
        description: '',
        //calories: '',
        selectedDiets: [],
        thumbnail: null,
      });
      setShowCreateForm(false);
      fetchDietPlans();
    } catch (error) {
      console.error('Error creating diet plan:', error);
      alert(error.message);
    }
  };

  const toggleView = () => {
    setIsTrainerView(!isTrainerView);
  };

  console.log("Diet Plan:",newDietPlan);    
  console.log("plans:",dietPlans)

  return (
    <div style={styles.page}>
      <Header isLoggedIn={true} userName={localStorage.getItem('userName')} onLogin={() => {}} onLogout={() => {}} />
      <main style={styles.content}>
        <div style={styles.container}>
          <h1 style={styles.h1}>
            {isTrainer 
              ? (isTrainerView ? 'My Diet Plans' : 'All Diet Plans') 
              : 'Diet Plans'}
          </h1>
          {isTrainer && (
            <button onClick={toggleView} style={styles.button}>
              Switch to {isTrainerView ? 'User' : 'Trainer'} View
            </button>
          )}
          {isTrainer && (
            <button onClick={() => setShowCreateForm(!showCreateForm)} style={styles.button}>
              {showCreateForm ? 'Cancel' : 'Create New Diet Plan'}
            </button>
          )}
          {showCreateForm && isTrainer && (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="title" style={styles.label}>Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newDietPlan.title}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="description" style={styles.label}>Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={newDietPlan.description}
                  onChange={handleInputChange}
                  required
                  style={styles.textarea}
                ></textarea>
              </div>
              {/* <div style={styles.formGroup}>
                <label htmlFor="calories" style={styles.label}>Calories:</label>
                <input
                  type="number"
                  id="calories"
                  name="calories"
                  value={newDietPlan.calories}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div> */}
              <div style={styles.formGroup}>
                <label htmlFor="diets" style={styles.label}>Select Diets:</label>
                <select
                  id="diets"
                  onChange={handleDietChange}
                  style={styles.select}
                  value=""
                >
                  <option value="">Select a diet</option>
                  {diets.map((diet) => (
                    <option key={diet.DietID} value={diet.DietID}>
                      {diet.Name} ({diet.Type})
                    </option>
                  ))}
                </select>
                <div style={styles.selectedItems}>
                  {newDietPlan.selectedDiets.map((dietId) => {
                    const diet = diets.find(d => d.DietID === dietId);
                    return diet ? (
                      <span key={dietId} style={styles.itemTag}>
                        {diet.Name}
                        <span onClick={() => removeDiet(dietId)} style={styles.removeItem}>
                          &times;
                        </span>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="thumbnail" style={styles.label}>Thumbnail:</label>
                <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  onChange={handleInputChange}
                  accept="image/*"
                  style={styles.fileInput}
                />
                {newDietPlan.thumbnail && (
                  <img
                    src={URL.createObjectURL(newDietPlan.thumbnail)}
                    alt="Thumbnail preview"
                    style={styles.thumbnailPreview}
                  />
                )}
              </div>
              <button type="submit" style={styles.button}>Create Diet Plan</button>
            </form>
          )}
          <div style={styles.dietPlanGrid}>
            {dietPlans
              .filter(plan => {
                if (!isTrainer) return true;
                if (isTrainerView) return Number(plan.TrainerID) === Number(userID);
                return true;
              })
              .map((plan) => (
                <Link to={`/diet/${plan.DietPlanID}`} key={plan.DietPlanID} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={styles.dietPlanCard}>
                    {plan.Thumbnail && (
                      <img 
                        src={`data:image/jpeg;base64,${plan.Thumbnail}`}
                        alt={`Thumbnail for ${plan.Title}`}
                        style={styles.dietPlanImage}
                        onError={(e) => {
                            console.error(`Failed to load thumbnail for ${plan.Title}. Setting default.`);
                            e.target.src = `${process.env.PUBLIC_URL}/default-thumbnail.png`;
                          }}
                      />
                    )}
                    <div style={styles.dietPlanInfo}>
                      <h2 style={styles.dietPlanTitle}>{plan.Title}</h2>
                      <p style={styles.trainerName}>Trainer: {plan.TrainerName}</p>
                      <p>{plan.Description}</p>
                      <p>Calories: {plan.Calories}</p>
                      <p>Date Created: {new Date(plan.DateCreated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}