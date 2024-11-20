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
  searchInput: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginBottom: '10px',
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
  dropdown: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    marginBottom: '10px',
  }
};

export default function WorkoutPlansPage() {
  //const [showTrainerPlans, setShowTrainerPlans] = useState(false); 
  //const [userId, setUserId] = useState(localStorage.getItem('userId'));// this  
  //const [userRole, setUserRole] = useState(localStorage.getItem('userRole')); // this
  const [isTrainer, setIsTrainer] = useState(localStorage.getItem('userRole') === 'trainer');
  const [isTrainerView, setIsTrainerView] = useState(true);
  const [userID, setUserID] = useState(localStorage.getItem('userId'))
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [exerciseList, setExerciseList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('');
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
  const [newWorkout, setNewWorkout] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    isHomeWorkout: false,
    equipment: [],
    exercises: [],
    videoType: 'link',
    videoUrl: '',
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
    fetchExercises();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const response = await fetch('http://localhost:5000/workoutplans');
      const data = await response.json();
      console.log("Workoutplandata:");
      console.log(data);


      // Prepare image and video sources
      // const updatedWorkoutPlans = workoutPlans.map(plan => ({
      //   ...plan,
      //   videoSrc: plan.VideoFile
      //     ? `data:video/mp4;base64,${plan.VideoFile}`
      //     : null,
      //   thumbnailSrc: plan.ThumbnailFile
      //     ? `data:image/png;base64,${plan.ThumbnailFile}`
      //     : null
      // }));
      // setWorkoutPlans(data.workout_plans);
      const processedPlans = data.map(plan => ({
        ...plan,
        thumbnailSrc: plan.ThumbnailFile ? `data:image/jpeg;base64,${plan.ThumbnailFile}` : null,
        videoSrc: plan.VideoFile ? `data:video/mp4;base64,${plan.VideoFile}` : null
      }));

      console.log("Below:");
      console.log(processedPlans)
      setWorkoutPlans(processedPlans);
      console.log("workoutPlans:")
      //workoutPlans=processedPlans;
      console.log(workoutPlans)
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    }
  };

  // After the workoutPlans state changes, log it
  useEffect(() => {
    console.log("Updated workoutPlans:", workoutPlans);
  }, [workoutPlans]);

  const fetchEquipment = async () => {
    try {
      const response = await fetch('http://localhost:5000/equipment');
      const data = await response.json();
      setEquipmentList(data.equipment);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await fetch('http://localhost:5000/exercise');
      const data = await response.json();
      setExerciseList(data.exercise);
      console.log(data)
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const filteredEquipment = equipmentList.filter(equipment =>
    equipment.EquipmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExercises = exerciseList.filter(exercise =>
    exercise.Name.toLowerCase().includes(exerciseSearchTerm.toLowerCase())
  );

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

  const handleEquipmentChange = (e) => {
    const selectedEquipmentId = parseInt(e.target.value);
    if (selectedEquipmentId && !newWorkout.equipment.includes(selectedEquipmentId)) {
      setNewWorkout({
        ...newWorkout,
        equipment: [...newWorkout.equipment, selectedEquipmentId],
      });
    }
  };

  const handleExerciseChange = (e) => {
    const selectedExerciseId = parseInt(e.target.value);
    if (selectedExerciseId && !newWorkout.exercises.includes(selectedExerciseId)) {
      setNewWorkout({
        ...newWorkout,
        exercises: [...newWorkout.exercises, selectedExerciseId],
      });
    }
  };

  const removeEquipment = (equipmentId) => {
    setNewWorkout({
      ...newWorkout,
      equipment: newWorkout.equipment.filter(id => id !== equipmentId),
    });
  };

  const removeExercise = (exerciseId) => {
    setNewWorkout({
      ...newWorkout,
      exercises: newWorkout.exercises.filter(id => id !== exerciseId),
    });
  };


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const formData = new FormData();
  //     for (const key in newWorkout) {
  //       if (key === 'equipment' || key === 'exercises') {
  //         formData.append(key, JSON.stringify(newWorkout[key]));
  //       } else if (key === 'videoFile' || key === 'thumbnail') {
  //         if (newWorkout[key]) {
  //           formData.append(key, newWorkout[key]);
  //         }
  //       } else {
  //         formData.append(key, newWorkout[key]);
  //       }
  //     }

  //     const response = await fetch('http://localhost:5000/workoutplans', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to create workout plan');
  //     }

  //     const result = await response.json();
  //     console.log('New workout plan created:', result);

  //     setNewWorkout({
  //       title: '',
  //       description: '',
  //       category: '',
  //       level: '',
  //       isHomeWorkout: false,
  //       equipment: [],
  //       exercises: [],
  //       videoType: 'link',
  //       videoLink: '',
  //       videoFile: null,
  //       thumbnail: null,
  //       trainerId: 
  //     });
  //     setShowCreateForm(false);
  //     fetchWorkoutPlans(); // Refresh workout plans after submission
  //   } catch (error) {
  //     console.error('Error creating workout plan:', error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Append all text fields
      formData.append('title', newWorkout.title);
      formData.append('description', newWorkout.description);
      formData.append('category', newWorkout.category);
      formData.append('level', newWorkout.level);
      formData.append('isHomeWorkout', newWorkout.isHomeWorkout);
      formData.append('videoType', newWorkout.videoType);
      formData.append('videoUrl', newWorkout.videoUrl);
      formData.append('trainerId', userID);

      // Append arrays as JSON strings
      formData.append('equipment', JSON.stringify(newWorkout.equipment));
      formData.append('exercises', JSON.stringify(newWorkout.exercises));

      // Append files if they exist
      if (newWorkout.videoFile) {
        formData.append('videoFile', newWorkout.videoFile);
      }
      if (newWorkout.thumbnail) {
        formData.append('thumbnail', newWorkout.thumbnail);
      }

      const response = await fetch('http://localhost:5000/workoutplans', {
        method: 'POST',
        body: formData,
        // Remove the Content-Type header to let the browser set it automatically with the correct boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create workout plan');
      }

      const result = await response.json();
      console.log('New workout plan created:', result);

      setNewWorkout({
        title: '',
        description: '',
        category: '',
        level: '',
        isHomeWorkout: false,
        equipment: [],
        exercises: [],
        videoType: 'link',
        videoUrl : '',
        videoFile: null,
        thumbnail: null,
      });
      setShowCreateForm(false);
      fetchWorkoutPlans(); // Refresh workout plans after submission
    } catch (error) {
      console.error('Error creating workout plan:', error);
      alert(error.message);
    }
  };

  // const toggleUserRole = () => {
  //   setIsTrainer(!isTrainer);
  // };
  console.log("Equipment:")
  console.log(equipmentList)
  console.log("Exercise:")
  console.log(exerciseList)
  console.log("Updated workoutPlans 2:", newWorkout);

  const toggleView = () => {
    setIsTrainerView(!isTrainerView);
  };
  console.log(isTrainerView)


  return (
    <div style={styles.page}>
      <Header isLoggedIn={true} userName={localStorage.getItem('userName')} onLogin={() => {}} onLogout={() => {}} />
      <main style={styles.content}>
        <div style={styles.container}>
        <h1 style={styles.h1}>
            {isTrainer 
              ? (isTrainerView ? 'My Workout Plans' : 'All Workout Plans') 
              : 'Workout Plans'}
          </h1>
          {/* Toggle button for trainers */}
          {isTrainer && (
            <button onClick={toggleView} style={styles.button}>
              Switch to {isTrainerView ? 'User' : 'Trainer'} View
            </button>
          )}
          {/* <button onClick={toggleUserRole} style={styles.button}>
            Switch to {isTrainer ? 'User' : 'Trainer'} View
          </button> */}
          {isTrainer && (
            <button onClick={() => setShowCreateForm(!showCreateForm)} style={styles.button}>
              {showCreateForm ? 'Cancel' : 'Create New Workout Plan'}
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

              {/* <div style={styles.formGroup}>
                <label style={styles.label}>Exercises:</label>
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={exerciseSearchTerm}
                  onChange={(e) => setExerciseSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
                <select onChange={handleExerciseChange} style={styles.dropdown} value="">
                  <option value="">Select exercise</option>
                  {filteredExercises.map((exercise) => (
                    <option key={exercise.ExerciseID} value={exercise.ExerciseID}>
                      {exercise.Name}
                    </option>
                  ))}
                </select>
                <div style={styles.selectedItems}>
                  {newWorkout.exercises.map((exerciseId) => {
                    const exercise = exerciseList.find(e => e.ExerciseID === exerciseId);
                    return exercise ? (
                      <span key={exerciseId} style={styles.itemTag}>
                        {exercise.Name}
                        <span onClick={() => removeExercise(exerciseId)} style={styles.removeItem}>
                          &times;
                        </span>
                      </span>
                    ) : null;
                  })}
                </div>
              </div> */}


              {/* <div style={styles.formGroup}>
                  <label style={styles.label}>Exercise:</label>
                  <input
                    type="text"
                    placeholder="Search exercise..."
                    value={exerciseSearchTerm}
                    onChange={(e) => setExerciseSearchTerm(e.target.value)}
                    style={styles.searchInput}
                  />
                  <select
                    onChange={handleExerciseChange}
                    style={styles.equipmentDropdown}
                    value=""
                  >
                    <option value="">Select exercise</option>
                    {filteredExercises.map((exercise) => (
                      <option key={exercise.exerciseID} value={exercise.exerciseID}>
                        {exercise.Name}
                      </option>
                    ))}
                  </select>
                  <div style={styles.selectedEquipment}>
                    {newWorkout.exercises.map((exerciseId) => {
                      const exercise = exerciseList.find(e => e.exerciseID === exerciseId);
                      return exercise ? (
                        <span key={exerciseId} style={styles.equipmentTag}>
                          {exercise.Name}
                          <span
                            onClick={() => removeExercise(exerciseId)}
                            style={styles.removeEquipment}
                          >
                          </span>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div> */}

              <div style={styles.formGroup}>
                <label style={styles.label}>Exercises:</label>
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={exerciseSearchTerm}
                  onChange={(e) => setExerciseSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
                <select onChange={handleExerciseChange} style={styles.dropdown} value="">
                  <option value="">Select exercise</option>
                  {filteredExercises.map((exercise) => (
                    <option key={exercise.ExerciseID} value={exercise.ExerciseID}>
                      {exercise.Name}
                    </option>
                  ))}
                </select>
                <div style={styles.selectedItems}>
                  {newWorkout.exercises.map((exerciseId) => {
                    const exercise = exerciseList.find(e => e.ExerciseID === exerciseId);
                    return exercise ? (
                      <span key={exerciseId} style={styles.itemTag}>
                        {exercise.Name}
                        <span onClick={() => removeExercise(exerciseId)} style={styles.removeItem}>
                          &times;
                        </span>
                      </span>
                    ) : null;
                  })}
                </div>
              </div>


              {/* {!newWorkout.isHomeWorkout && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Equipment:</label>
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                  />
                  <select
                    onChange={handleEquipmentChange}
                    style={styles.equipmentDropdown}
                    value=""
                  >
                    <option value="">Select equipment</option>
                    {filteredEquipment.map((equipment) => (
                      <option key={equipment.EquipmentID} value={equipment.EquipmentID}>
                        {equipment.EquipmentName}
                      </option>
                    ))}
                  </select>
                  <div style={styles.selectedEquipment}>
                    {newWorkout.equipment.map((equipmentId) => {
                      const equipment = equipmentList.find(e => e.EquipmentID === equipmentId);
                      return equipment ? (
                        <span key={equipmentId} style={styles.equipmentTag}>
                          {equipment.EquipmentName}
                          <span
                            onClick={() => removeEquipment(equipmentId)}
                            style={styles.removeEquipment}
                          >
                          </span>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )} */}
              {!newWorkout.isHomeWorkout && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Equipment:</label>
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    value={equipmentSearchTerm}
                    onChange={(e) => setEquipmentSearchTerm(e.target.value)}
                    style={styles.searchInput}
                  />
                  <select
                    onChange={handleEquipmentChange}
                    style={styles.dropdown}
                    value=""
                  >
                    <option value="">Select equipment</option>
                    {filteredEquipment.map((equipment) => (
                      <option key={equipment.EquipmentID} value={equipment.EquipmentID}>
                        {equipment.EquipmentName}
                      </option>
                    ))}
                  </select>
                  <div style={styles.selectedItems}>
                    {newWorkout.equipment.map((equipmentId) => {
                      const equipment = equipmentList.find(e => e.EquipmentID === equipmentId);
                      return equipment ? (
                        <span key={equipmentId} style={styles.itemTag}>
                          {equipment.EquipmentName}
                          <span
                            onClick={() => removeEquipment(equipmentId)}
                            style={styles.removeItem}
                          >
                            &times;
                          </span>
                        </span>
                      ) : null;
                    })}
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
                    name="videoUrl"
                    value={newWorkout.videoUrl}
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

          {/* <div style={styles.workoutGrid}>
          {workoutPlans
            .filter(plan => !isTrainer || plan.instructor === localStorage.getItem('userName'))
            .map((plan) => (
              <Link to={`/workout/${plan.id}`} key={plan.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={styles.workoutCard}>
                  {plan.thumbnailSrc ? (
                    <img 
                      src={plan.thumbnailSrc}  // Ensures that the src is set to the base64 thumbnail
                      alt={`Thumbnail for ${plan.title}`} 
                      style={styles.workoutImage} 
                    />
                  ) : (
                    <img 
                      src={`${process.env.PUBLIC_URL}/default-thumbnail.png`}  // Access default image correctly
                      alt="Default Thumbnail" 
                      style={styles.workoutImage} 
                    />
                  )}
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
                    {plan.videoSrc && (
                      <video 
                        width="320" 
                        height="240" 
                        controls 
                        style={styles.workoutVideo}
                      >
                        <source src={plan.videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                </div>
              </Link>
            ))}
        </div> */}
        <div style={styles.workoutGrid}>
          {workoutPlans
            .filter(plan => {
              console.log("In filter",isTrainerView, isTrainer,Number(plan.TrainerID) === Number(userID))
              console.log("Compare:",userID,plan.TrainerID)
              if (!isTrainer) return true; // Non-trainers see all workouts
              if (isTrainerView) return Number(plan.TrainerID) === Number(userID); // Trainer view: only show own workouts
              return true; // User view for trainers: show all workouts
            })
            .map((plan) => {
              console.log(`Plan ID: ${plan.PlanID}`);
              console.log(`Title: ${plan.Title}`);
              console.log(`Thumbnail Source: ${plan.thumbnailSrc}`);
              console.log("Plan:",plan)
              
              return (
                <Link to={`/workout/${plan.PlanID}`} key={plan.PlanID} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={styles.workoutCard}>
                    {plan.thumbnailFile ? (
                      <img 
                        src={`data:image/jpeg;base64,${plan.thumbnailFile}`}  // Adjust MIME type if PNG  // Uses base64 thumbnail if available
                        alt={`Thumbnail for ${plan.Title}`} 
                        style={styles.workoutImage} 
                        onError={(e) => {
                          console.error(`Failed to load thumbnail for ${plan.Title}. Setting default.`);
                          e.target.src = `${process.env.PUBLIC_URL}/default-thumbnail.png`;
                        }}
                      />
                    ) : (
                      <img 
                        src={`${process.env.PUBLIC_URL}/default-thumbnail.png`}  // Default image if no base64 thumbnail
                        alt="Default Thumbnail" 
                        style={styles.workoutImage} 
                      />
                    )}
                    <div style={styles.workoutInfo}>
                      <h2 style={styles.workoutTitle}>{plan.Title}</h2>
                      <p style={styles.instructorName}>Instructor: {plan.TrainerName}</p>
                      <p>{plan.Description}</p>
                      <p>Category: {plan.CategoryID}</p>
                      <p>Level: {plan.Level}</p>
                      <p>{plan.isHomeWorkout ? 'Home Workout' : 'Gym Workout'}</p>
                      {(!isTrainer || !isTrainerView) && (
                          <div style={styles.rating}>
                            <span style={styles.star}>⭐</span> {plan.rating}
                          </div>
                        )}
                      {plan.videoSrc && (
                        <video 
                          width="320" 
                          height="240" 
                          controls 
                          style={styles.workoutVideo}
                        >
                          <source src={plan.videoSrc} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>



        </div>
      </main>
    </div>
  );
}
