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
  workoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  workoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
  },
  workoutImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  workoutInfo: {
    padding: '15px',
  },
  workoutTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  instructorName: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
  },
  star: {
    color: '#ffd700',
    marginRight: '5px',
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
  select: {
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
  checkbox: {
    marginRight: '10px',
  },
  equipmentList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  equipmentItem: {
    backgroundColor: '#f0f0f0',
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '14px',
  },
  fileInput: {
    marginTop: '10px',
  },
  thumbnailPreview: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    marginTop: '10px',
  },
};

export default function WorkoutPlansPage() {
  const [isTrainer, setIsTrainer] = useState(localStorage.getItem('userRole') === 'trainer');
  //const [showTrainerPlans, setShowTrainerPlans] = useState(false); 
  //const [userId, setUserId] = useState(localStorage.getItem('userId'));// this  
  //const [userRole, setUserRole] = useState(localStorage.getItem('userRole')); // this
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [newWorkout, setNewWorkout] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    isHomeWorkout: false,
    equipment: [],
    videoType: 'link',
    videoLink: '',
    videoFile: null,
    thumbnail: null,
  });

  // useEffect(() => {
  //   // Fetch workout plans from an API or database
  //   async function fetchWorkoutPlans() {
  //     try {
  //       const response = await fetch('http://localhost:5000/workoutplans');
  //       const data = await response.json();
  //       //console.log(data)

  //       setWorkoutPlans(data.workout_plans);
  //       setEquipmentList(data.equipment); // Set equipment list
    
  //     } catch (error) {
  //       console.error('Error fetching workout plans:', error);
  //     }
  //   }
    
  //   fetchWorkoutPlans();
  //   console.log(userRole,userId)
  //   console.log("hello")
  //   console.log("Equipment:",equipmentList)
  //   // Fetch equipment list
  //   // async function fetchEquipment() {
  //   //   try {
  //   //     const response = await fetch('http://localhost:5000/equipment');
  //   //     const data = await response.json();
  //   //     setEquipmentList(data);
  //   //   } catch (error) {
  //   //     console.error('Error fetching equipment:', error);
  //   //   }
  //   // }
  //   // fetchEquipment();
  // }, []);

  useEffect(() => {
    fetchWorkoutPlans();
    fetchEquipment();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const response = await fetch('http://localhost:5000/workoutplans');
      const data = await response.json();
      setWorkoutPlans(data.workout_plans);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await fetch('http://localhost:5000/equipment');
      const data = await response.json();
      setEquipmentList(data.equipment);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setNewWorkout({ ...newWorkout, [name]: checked });
    } else if (type === 'file') {
      setNewWorkout({ ...newWorkout, [name]: files[0] });
    } else {
      setNewWorkout({ ...newWorkout, [name]: value });
    }
  };

  const handleEquipmentChange = (equipmentId) => {
    const updatedEquipment = newWorkout.equipment.includes(equipmentId)
      ? newWorkout.equipment.filter(id => id !== equipmentId)
      : [...newWorkout.equipment, equipmentId];
    setNewWorkout({ ...newWorkout, equipment: updatedEquipment });
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New workout plan:', newWorkout);
    // Here you would typically send the data to your backend
    setNewWorkout({
      title: '',
      description: '',
      category: '',
      level: '',
      isHomeWorkout: false,
      equipment: [],
      videoType: 'link',
      videoLink: '',
      videoFile: null,
      thumbnail: null,
    });
    setShowCreateForm(false);
    fetchWorkoutPlans(); // Refresh workout plans after submission
  };

  // const toggleUserRole = () => {
  //   setIsTrainer(!isTrainer);
  // };
  console.log(equipmentList)
  console.log()

  return (
    <div style={styles.page}>
      <Header isLoggedIn={true} userName={localStorage.getItem('userName')} onLogin={() => {}} onLogout={() => {}} />
      <main style={styles.content}>
        <div style={styles.container}>
          <h1 style={styles.h1}>{isTrainer ? 'My Workout Plans' : 'Workout Plans'}</h1>
          {/* <button onClick={toggleUserRole} style={styles.button}>
            Switch to {isTrainer ? 'User' : 'Trainer'} View
          </button> */}
          {isTrainer && (
            <button onClick={() => setShowCreateForm(!showCreateForm)} style={styles.button}>
              {showCreateForm ? 'Cancel' : 'Create New Workout Plan'}
            </button>
          )}
          {showCreateForm && (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="title" style={styles.label}>Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newWorkout.title}
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
                  value={newWorkout.description}
                  onChange={handleInputChange}
                  required
                  style={styles.textarea}
                ></textarea>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="category" style={styles.label}>Category:</label>
                <select
                  id="category"
                  name="category"
                  value={newWorkout.category}
                  onChange={handleInputChange}
                  required
                  style={styles.select}
                >
                  <option value="">Select a category</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Strength">Strength</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Flexibility">Flexibility</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="level" style={styles.label}>Level:</label>
                <select
                  id="level"
                  name="level"
                  value={newWorkout.level}
                  onChange={handleInputChange}
                  required
                  style={styles.select}
                >
                  <option value="">Select a level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <input
                    type="checkbox"
                    name="isHomeWorkout"
                    checked={newWorkout.isHomeWorkout}
                    onChange={handleInputChange}
                    style={styles.checkbox}
                  />
                  Home Workout
                </label>
              </div>
              {!newWorkout.isHomeWorkout && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Equipment:</label>
                  <div style={styles.equipmentList}>
                    {equipmentList.map((equipment) => (
                      <label key={equipment.EquipmentID} style={styles.equipmentItem}>
                        <input
                          type="checkbox"
                          checked={newWorkout.equipment.includes(equipment.EquipmentID)}
                          onChange={() => handleEquipmentChange(equipment.EquipmentID)}
                          style={styles.checkbox}
                        />
                        {equipment.EquipmentName}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div style={styles.formGroup}>
                <label style={styles.label}>Video:</label>
                <select
                  name="videoType"
                  value={newWorkout.videoType}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="link">YouTube Link</option>
                  <option value="upload">Upload Video</option>
                </select>
                {newWorkout.videoType === 'link' ? (
                  <input
                    type="url"
                    name="videoLink"
                    value={newWorkout.videoLink}
                    onChange={handleInputChange}
                    placeholder="Enter YouTube video URL"
                    style={styles.input}
                  />
                ) : (
                  <input
                    type="file"
                    name="videoFile"
                    onChange={handleInputChange}
                    accept="video/mp4"
                    style={styles.fileInput}
                  />
                )}
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
                  {newWorkout.thumbnail && (
                    <img
                      src={URL.createObjectURL(newWorkout.thumbnail)}
                      alt="Thumbnail preview"
                      style={styles.thumbnailPreview}
                    />
                  )}
                </div>
              </div>
              <button type="submit" style={styles.button}>Create Workout Plan</button>
            </form>
          )}
          <div style={styles.workoutGrid}>
            {workoutPlans
              .filter(plan => !isTrainer || plan.instructor === "Jane Doe")
              .map((plan) => (
                <Link to={`/workout/${plan.id}`} key={plan.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={styles.workoutCard}>
                    <img src={plan.imageUrl} alt={`Workout for ${plan.title}`} style={styles.workoutImage} />
                    <div style={styles.workoutInfo}>
                      <h2 style={styles.workoutTitle}>{plan.title}</h2>
                      <p style={styles.instructorName}>Instructor: {plan.instructor}</p>
                      <p>{plan.description}</p>
                      <p>Category: {plan.category}</p>
                      <p>Level: {plan.level}</p>
                      <p>{plan.isHomeWorkout ? 'Home Workout' : 'Gym Workout'}</p>
                      {!isTrainer && (
                        <div style={styles.rating}>
                          <span style={styles.star}>⭐</span> {plan.rating}
                        </div>
                      )}
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
