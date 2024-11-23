import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import YouTube from 'react-youtube';

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
  video: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto 20px',
  },
  exerciseList: {
    listStyle: 'none',
    padding: 0,
  },
  exerciseItem: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  button: {
    marginBottom: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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
  startButton: {
    backgroundColor: '#28a745',
    color: '#ffffff',
  },
};

export default function WorkoutDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [totalDuration, setTotalDuration] = useState(0);
  const [playbackData, setPlaybackData] = useState({ totalPlayedTime: 0, playEvents: 0, pauseEvents: 0, endedEvents: 0 });
  const localVideoRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const [playStartTime, setPlayStartTime] = useState(null);

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await fetch(`http://localhost:5000/workoutplans/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch workout plan');
        }
        const data = await response.json();
        setWorkoutPlan(data);
      } catch (error) {
        console.error('Error fetching workout plan:', error);
      }
    };

    fetchWorkoutPlan();
  }, [id]);

  useEffect(() => {
    if (workoutPlan) {
      calculateTotalDuration();
    }
  }, [workoutPlan]);

  const calculateTotalDuration = () => {
    let totalDuration = 0;

    if (workoutPlan.videoFile && localVideoRef.current) {
      const videoElement = localVideoRef.current;

      const handleMetadata = () => {
        const localDuration = videoElement.duration || 0;
        totalDuration += localDuration;
        setTotalDuration(totalDuration);
      };

      videoElement.addEventListener('loadedmetadata', handleMetadata);

      return () => {
        videoElement.removeEventListener('loadedmetadata', handleMetadata);
      };
    }

    if (workoutPlan.videoUrl) {
      const videoId = workoutPlan.videoUrl.split('v=')[1];
      const apiKey = 'youtube-api-key'; // Replace with your actual YouTube API key

      fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.items && data.items.length > 0) {
            const ytDuration = convertYouTubeDuration(data.items[0].contentDetails.duration);
            totalDuration += ytDuration;
            setTotalDuration(totalDuration);
          } else {
            console.error('YouTube video not found or invalid response:', data);
          }
        })
        .catch((error) => console.error('Error fetching YouTube video duration:', error));
    }
  };

  const convertYouTubeDuration = (ytDuration) => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = ytDuration.match(regex);
    const hours = parseInt(matches[1] || 0, 10);
    const minutes = parseInt(matches[2] || 0, 10);
    const seconds = parseInt(matches[3] || 0, 10);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const handlePlay = () => {
    setPlayStartTime(Date.now());
    setPlaybackData((prev) => ({
      ...prev,
      playEvents: prev.playEvents + 1,
    }));
  };

  const handlePause = () => {
    if (playStartTime) {
      const elapsedTime = (Date.now() - playStartTime) / 1000;
      setPlayStartTime(null);
      setPlaybackData((prev) => ({
        ...prev,
        totalPlayedTime: prev.totalPlayedTime + elapsedTime,
        pauseEvents: prev.pauseEvents + 1,
      }));
    }
  };

  const handleEnded = () => {
    handlePause();
    setPlaybackData((prev) => ({
      ...prev,
      endedEvents: prev.endedEvents + 1,
    }));
  };

  const handleYouTubeStateChange = (event) => {
    const playerState = event.data;
    if (playerState === YouTube.PlayerState.PLAYING) {
      handlePlay();
    } else if (playerState === YouTube.PlayerState.PAUSED) {
      handlePause();
    } else if (playerState === YouTube.PlayerState.ENDED) {
      handleEnded();
    }
  };

  const handleStartWorkout = async () => {
    setIsWorkoutStarted(true);
    const currentTime = new Date().toISOString();
    setStartTime(currentTime);
    console.log("Workout started at:", currentTime);

    try {
      const response = await fetch('http://localhost:5000/workout-session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          planId: id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start workout');
      }
    } catch (error) {
      console.error('Error starting workout session:', error);
    }
  };

  const handleStopWorkout = async () => {
    setIsWorkoutStarted(false);

    console.log("Playback Data:", playbackData);
    console.log("Total Duration:", totalDuration);

    try {
      const response = await fetch('http://localhost:5000/workout-sessions/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          planId: id,
          totalPlayedTime: playbackData.totalPlayedTime,
          totalDuration,
          playEvents: playbackData.playEvents,
          pauseEvents: playbackData.pauseEvents,
          endedEvents: playbackData.endedEvents,
        }),
      });

      if (!response.ok) throw new Error('Failed to stop workout');
      alert('Workout session recorded successfully!');
    } catch (error) {
      console.error('Error stopping workout session:', error);
    }
  };

  const handleDeleteWorkout = async () => {
    if (window.confirm('Are you sure you want to delete this workout plan? This action cannot be undone.')) {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`http://localhost:5000/workoutplans/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error('Failed to delete workout plan');
        }

        alert('Workout plan deleted successfully!');
        navigate('/workoutplans');
      } catch (error) {
        console.error('Error deleting workout plan:', error);
      }
    }
  };

  const handleBackClick = () => {
    navigate('/workoutplans');
  };

  return (
    <div style={styles.page}>
      <Header isLoggedIn={true} userName={localStorage.getItem('userName')} onLogin={() => {}} onLogout={() => {}} />
      <main style={styles.content}>
        <div style={styles.container}>
          {!workoutPlan ? (
            <div>Loading...</div>
          ) : (
            <>
              <button onClick={handleBackClick} style={styles.backButton}>
                Back to Workout Plans
              </button>
              <h1 style={styles.title}>{workoutPlan.Title}</h1>
              {workoutPlan?.videoFile && (
                <video
                  ref={localVideoRef}
                  style={styles.video}
                  controls
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onEnded={handleEnded}
                >
                  <source src={`data:video/mp4;base64,${workoutPlan.videoFile}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {workoutPlan?.videoUrl && (
                <YouTube
                  videoId={workoutPlan.videoUrl.split('v=')[1]}
                  opts={{
                    width: '100%',
                    height: '450',
                    playerVars: {
                      autoplay: 0,
                    },
                  }}
                  onStateChange={handleYouTubeStateChange}
                  ref={youtubePlayerRef}
                />
              )}
              <h2>Exercises:</h2>
              <ul style={styles.exerciseList}>
                {workoutPlan.Exercises && workoutPlan.Exercises.length > 0 ? (
                  workoutPlan.Exercises.map((exercise) => (
                    <li key={exercise.ExerciseID} style={styles.exerciseItem}>
                      <h3>{exercise.Name}</h3>
                      <p>{exercise.Description}</p>
                    </li>
                  ))
                ) : (
                  <li>No exercises found for this workout plan.</li>
                )}
              </ul>
              {!isWorkoutStarted ? (
                <button
                  onClick={handleStartWorkout}
                  style={{ ...styles.button, ...styles.startButton }}
                >
                  Start Workout
                </button>
              ) : (
                <button
                  onClick={handleStopWorkout}
                  style={{ ...styles.button, ...styles.stopButton }}
                >
                  Stop Workout
                </button>
              )}
            </>
          )}
        </div>
      </main>
      {localStorage.getItem('userRole') === 'trainer' && (
        <button style={styles.completeButton} onClick={handleDeleteWorkout}>
          Delete Workout
        </button>
      )}
    </div>
  );
}
