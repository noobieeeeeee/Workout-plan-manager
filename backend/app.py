from flask import Flask, request, jsonify, session
import os
import json
import base64
from flask_cors import CORS
from flask import session
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

from datetime import timedelta
from datetime import datetime



app = Flask(__name__)
CORS(app,origins=["http://localhost:3000"],supports_credentials=True)

app.permanent_session_lifetime = timedelta(hours=1)
app.secret_key = 'your_secret_key'  # Required for Flask session management

# Connect to MySQL
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="workout_plan_manager"
    )

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user_name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    #confirmpass=data.get('confirmPassword')
    role = data.get('role')
    hashed_password = generate_password_hash(password)
    print(role)
    if role == 'trainer':
        # insert_query = "INSERT INTO Trainer (name, email, password) VALUES (%s, %s, %s)"
        connection = get_db_connection()
        cursor = connection.cursor()
        print("Trainer is being registered.")
        
        cursor.execute("SELECT * FROM Trainer WHERE email = %s", (email,))
        trainer = cursor.fetchone()
        if trainer:
            return jsonify({"message": "Trainer already exists"}), 400
        
        cursor.execute("INSERT INTO Trainer (name, email, password) VALUES (%s, %s, %s)", 
                   (user_name, email, hashed_password))
        connection.commit()
        cursor.close()
        connection.close()
    
        return jsonify({"message": "User registered successfully"}), 201
        

        
    else:
        # insert_query = "INSERT INTO User (name, email, password) VALUES (%s, %s, %s)"
    
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
        user = cursor.fetchone()
        if user:
            return jsonify({"message": "User already exists"}), 400

        cursor.execute("INSERT INTO User (name, email, password) VALUES (%s, %s, %s)", 
                    (user_name, email, hashed_password))
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({"message": "User registered successfully"}), 201
    


@app.route('/login1', methods=['POST'])
def login1():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM Trainer WHERE email = %s", (email,))
    trainer = cursor.fetchone()

    if trainer and check_password_hash(trainer['Password'], password):
        return jsonify({
            "message": "Login successful", 
            "user": {"id": trainer["TrainerID"], "user_name": trainer["Name"], "role": "trainer"}
        })
    
    cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()

    if user and check_password_hash(user['Password'], password):
        return jsonify({
            "message": "Login successful", 
            "user": {"id": user["UserID"], "user_name": user["Name"], "role": "user"}
        })
    else:
        return jsonify({"message": "Invalid credentials"}), 401

    
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    # Check if user is a Trainer
    cursor.execute("SELECT * FROM Trainer WHERE email = %s", (email,))
    trainer = cursor.fetchone()

    if trainer and check_password_hash(trainer['Password'], password):
        # Set session data
        session['user_id'] = trainer['TrainerID']
        session['user_name'] = trainer['Name']
        session['role'] = 'trainer'
        session.permanent = True  # Keep session active for the configured lifetime

        return jsonify({
            "message": "Login successful", 
            "user": {"id": trainer["TrainerID"], "user_name": trainer["Name"], "role": "trainer"}
        })

    # Check if user is a regular User
    cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()

    if user and check_password_hash(user['Password'], password):
        # Set session data
        session['user_id'] = user['UserID']
        session['user_name'] = user['Name']
        session['role'] = 'user'
        session.permanent = True  # Keep session active for the configured lifetime

        return jsonify({
            "message": "Login successful", 
            "user": {"id": user["UserID"], "user_name": user["Name"], "role": "user"}
        })
    else:
        return jsonify({"message": "Invalid credentials"}), 401


@app.route('/logout', methods=['POST'])
def logout():
    session.clear()  # Clears all session data
    return jsonify({"message": "Logged out successfully"}), 200

# @app.route('/workoutplans', methods=['POST'])
# def submit_workout_plan():
#     print('hello')
#     data = request.json
#     title = data.get('title')
#     description = data.get('description')
#     category = data.get('category')
#     trainer_id = data.get('trainerId')
#     level = data.get('level')
#     is_home_workout = data.get('isHomeWorkout')
#     equipment = data.get('equipment')  # Assume this is a list of equipment IDs
#     video_url = data.get('videoUrl')
#     video_file = data.get('videoFile')
#     print(data)
#     # Save workout plan to database
#     connection = get_db_connection()
#     cursor = connection.cursor()
#     cursor.execute(
#         "INSERT INTO WorkoutPlan (Title, Description, CategoryID, TrainerID, Level, VideoUrl, VideoFile, thumbnailFile) "
#         "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
#         (title, description, category, trainer_id ,level, video_url, video_url, video_file)
#     )
#     connection.commit()
#     cursor.close()
#     connection.close()
#     return jsonify({"message": "Workout plan submitted successfully"}), 201
    
#     #return jsonify(workout_plans)



# @app.route('/workoutplans', methods=['POST','GET'])
# def submit_workout_plan():
#     # Ensure the uploads directory exists
#     upload_folder = 'uploads'
#     if not os.path.exists(upload_folder):
#         os.makedirs(upload_folder)

#     # Parse the text data from the form
#     title = request.form.get('title')
#     description = request.form.get('description')
#     category = request.form.get('category')
#     trainer_id = request.form.get('trainerId')
#     level = request.form.get('level')
#     is_home_workout = request.form.get('isHomeWorkout') == 'true'
#     equipment = request.form.get('equipment')  # Assuming this is a JSON string
#     exercises = request.form.get('exercises')  # Also assuming this is a JSON string

#     # Parse video link and video file
#     video_url = request.form.get('videoUrl')
#     video_file = request.files.get('videoFile')
#     thumbnail_file = request.files.get('thumbnail')

#     # File saving paths
#     video_file_path = None
#     thumbnail_file_path = None

#     # Save video file if provided
#     if video_file:
#         video_file_path = os.path.join(upload_folder, video_file.filename)
#         video_file.save(video_file_path)

#     # Save thumbnail file if provided
#     if thumbnail_file:
#         thumbnail_file_path = os.path.join(upload_folder, thumbnail_file.filename)
#         thumbnail_file.save(thumbnail_file_path)

#     # Insert into database
#     connection = get_db_connection()
#     cursor = connection.cursor()
#     cursor.execute(
#         """
#         INSERT INTO WorkoutPlan (Title, Description, CategoryID, TrainerID, Level, VideoUrl, VideoFile, ThumbnailFile)
#         VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
#         """,
#         (title, description, category, trainer_id, level, video_url, video_file_path, thumbnail_file_path)
#     )
#     connection.commit()
#     cursor.close()
#     connection.close()

#     return jsonify({"message": "Workout plan submitted successfully"}), 201


# Ensure the uploads directory exists

import datetime
upload_folder = 'uploads'
if not os.path.exists(upload_folder):
    os.makedirs(upload_folder)

@app.route('/workoutplans', methods=['POST', 'GET'])
def workout_plans():
    if request.method == 'POST':
        # Parse text data from the form
        title = request.form.get('title')
        description = request.form.get('description')
        category = request.form.get('category')
        trainer_id = request.form.get('trainerId')
        level = request.form.get('level')
        is_home_workout = request.form.get('isHomeWorkout') == 'true'
        equipment = json.loads(request.form.get('equipment', '[]'))  # Parse JSON string into a list
        exercises = json.loads(request.form.get('exercises', '[]'))  # Parse JSON string into a list

        # Parse video link and file
        video_url = request.form.get('videoUrl')
        video_file = request.files.get('videoFile')
        thumbnail_file = request.files.get('thumbnail')
        
        
        # File saving paths
        video_file_path = None
        thumbnail_file_path = None

        # Save video file if provided
        if video_file:
            video_file_path = os.path.join(upload_folder, video_file.filename)
            video_file.save(video_file_path)

        # Save thumbnail file if provided
        if thumbnail_file:
            thumbnail_file_path = os.path.join(upload_folder, thumbnail_file.filename)
            thumbnail_file.save(thumbnail_file_path)

        # Insert workout plan into the database
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO WorkoutPlan (Title, Description, CategoryID, TrainerID, Level, VideoUrl, VideoFile, ThumbnailFile)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (title, description, category, trainer_id, level, video_url, video_file_path, thumbnail_file_path)
        )
        
        workout_plan_id = cursor.lastrowid
        print("Exercises:",exercises)
        # Link exercises to the workout plan
        for exercise_id in exercises:
            print("in:",workout_plan_id,exercise_id)
            cursor.execute(
                """
                INSERT INTO WorkoutPlanExercise (WorkoutPlanID, ExerciseID)
                VALUES (%s, %s)
                """,
                (workout_plan_id, exercise_id)
            )
            print("out")
        connection.commit()
        cursor.close()
        connection.close()
        
        print("URL:",video_url)
        return jsonify({"message": "Workout plan submitted successfully"}), 201

    elif request.method == 'GET':
        # Retrieve workout plans from the database
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM WorkoutPlan")
        workout_plans = cursor.fetchall()
        cursor.execute(" SELECT TrainerID,Name from trainer; ")
        trainer_details=cursor.fetchall()
        print(trainer_details)
        trainer_name_map = {trainer["TrainerID"]: trainer["Name"] for trainer in trainer_details}
        print("Trainer Details:",trainer_name_map)
        print(workout_plans)
        print("Hello")
        # for plan in workout_plans:
        #     print("plan:",plan)
        #     if isinstance(plan.get("VideoFile"), bytes):
        #         # Convert bytes to a Base64-encoded string, or just keep the file path if available
        #         plan["VideoFile"] = base64.b64encode(plan["VideoFile"]).decode('utf-8')
        #     if isinstance(plan.get("ThumbnailFile"), bytes):
        #         plan["ThumbnailFile"] = base64.b64encode(plan["ThumbnailFile"]).decode('utf-8')
        # for plan in workout_plans:
        #     # Encode video file to base64 if present
        #     video_file_path = plan.get("videoFile")
        #     if video_file_path:
        #         with open(video_file_path, "rb") as video_file:
        #             video_base64 = base64.b64encode(video_file.read()).decode('utf-8')
        #             plan["videoFile"] = video_base64
        #             # Write to text file
        #             video_file.write(f"PlanID: {plan['PlanID']} - VideoFile Base64:\n{video_base64}\n\n")
            
        #     # Encode thumbnail file to base64 if present
        #     thumbnail_file_path = plan.get("thumbnailFile")
        #     if thumbnail_file_path:
        #         with open(thumbnail_file_path, "rb") as thumbnail_file:
        #             plan["thumbnailFile"] = base64.b64encode(thumbnail_file.read()).decode('utf-8') #this could work
        # with open("base64_encoded_files.txt", "w") as log_file:  # Renamed to avoid confusion
        #     for plan in workout_plans:
        #         # Encode video file to base64 if present
        #         video_file_path = plan.get("videoFile")
        #         if video_file_path:
        #             with open(video_file_path, "rb") as video_file:
        #                 video_base64 = base64.b64encode(video_file.read()).decode('utf-8')
        #                 plan["videoFile"] = video_base64
        #                 # Write to text log file
        #                 log_file.write(f"PlanID: {plan['PlanID']} - VideoFile Base64:\n{video_base64}\n\n")

        #         # Encode thumbnail file to base64 if present
        #         thumbnail_file_path = plan.get("thumbnailFile")
        #         if thumbnail_file_path:
        #             with open(thumbnail_file_path, "rb") as thumbnail_file:
        #                 thumbnail_base64 = base64.b64encode(thumbnail_file.read()).decode('utf-8')
        #                 plan["thumbnailFile"] = thumbnail_base64
        #                 # Write to text log file
        #                 log_file.write(f"PlanID: {plan['PlanID']} - ThumbnailFile Base64:\n{thumbnail_base64}\n\n")
        for plan in workout_plans:
            
            # Encode video file to base64 if present
            video_file_path = plan.get("videoFile")
            if video_file_path:
                with open(video_file_path, "rb") as video_file:
                    plan["videoFile"] = base64.b64encode(video_file.read()).decode('utf-8')
            print("type:",type(plan["videoFile"]))
            
            # Encode thumbnail file to base64 if present
            thumbnail_file_path = plan.get("thumbnailFile")
            if thumbnail_file_path:
                with open(thumbnail_file_path, "rb") as thumbnail_file:
                    plan["thumbnailFile"] = base64.b64encode(thumbnail_file.read()).decode('utf-8')
            print("date:",plan['DateCreated'])
            print("date2:",plan["DateCreated"].isoformat())
            plan["DateCreated"] = plan["DateCreated"].isoformat()
            plan["TrainerName"] = trainer_name_map.get(plan["TrainerID"], "Unknown")
            print(f"Trainer name for {plan["Title"]}: {plan["TrainerName"]}")
            # if isinstance(plan.get("DateCreated"), datetime):
            #     print(f"Original type: {type(plan['DateCreated'])}")  # This will print <class 'datetime.datetime'>
    
            #     # Convert the datetime object to an ISO 8601 string
            #     plan["DateCreated"] = plan["DateCreated"].isoformat()
                
            #     # Now, DateCreated is a string in ISO format
            #     print(f"Converted type: {type(plan['DateCreated'])}")  # This will print <class 'str'>
            #     print(f"Converted value: {plan['DateCreated']}")  # Example output: 2024-11-08T22:28:15

            #     # Now you can safely serialize the plan dictionary to JSON
            #     json_data = json.dumps(plan)
            #     print(f"JSON data: {json_data}")
        
        cursor.close()
        connection.close()
        with open("workout_plans_log.txt", "w") as log_file:
            log_file.write("Workout Plans:\n")
            log_file.write(json.dumps(workout_plans, indent=4))  # Pretty-print JSON data
        return jsonify(workout_plans), 200



# Endpoint to fetch equipment only
@app.route('/equipment', methods=['GET'])
def get_equipment():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT EquipmentID, EquipmentName, Description FROM Equipment")
    equipment = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify({"equipment": equipment})
    

@app.route('/workoutplans/<int:id>', methods=['GET'])
def get_workout_plan(id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Query to get the workout plan details by ID
    cursor.execute("SELECT * FROM WorkoutPlan WHERE PlanID = %s", (id,))
    workout_plan = cursor.fetchone()
    if not workout_plan:
        return jsonify({"error": "Workout plan not found"}), 404
    
    #print("WorkoutPLan:",workout_plan)
    # Convert video file to base64 string if a file path exists
    video_file_path = workout_plan.get("videoFile")
    if video_file_path:
        with open(video_file_path, "rb") as video_file:
            # Encode the video file in Base64 and convert bytes to string
            workout_plan["videoFile"] = base64.b64encode(video_file.read()).decode('utf-8')
    
    thumbnail_file_path = workout_plan.get("thumbnailFile")
    if thumbnail_file_path:
        with open(thumbnail_file_path, "rb") as thumbnail_file:
            workout_plan["thumbnailFile"] = base64.b64encode(thumbnail_file.read()).decode('utf-8')

    # Format DateCreated to ISO 8601
    workout_plan["DateCreated"] = workout_plan["DateCreated"].isoformat()
    #print("type:",type(workout_plan["videoFile"]))
    #for i in workout_plan:
        #print("types:",i,workout_plan[i],type(workout_plan[i]))
    # Log the workout plan for debugging
    

    # Get exercises related to this workout plan
    cursor.execute("""
        SELECT e.ExerciseID, e.Name, e.Description 
        FROM Exercise e
        JOIN WorkoutPlanExercise wpe ON e.ExerciseID = wpe.ExerciseID
        WHERE wpe.WorkoutPlanID = %s
    """, (id,))
    exercises = cursor.fetchall()
    
    # Add the exercises list to the workout plan dictionary
    workout_plan["Exercises"] = exercises
    #print("exercises:",exercises)
    #print("URL:",workout_plan["videoUrl"])
    # with open("workout_plans_log2.txt", "w") as log_file:
    #     log_file.write("Workout Plan:\n")
    #     if workout_plan["videoFile"]:
    #         log_file.write(workout_plan["videoFile"])
    #     else:
    #         log_file.write(workout_plan["videoUrl"])
    #     log_file.write(json.dumps(workout_plan, indent=4))  # Pretty-print JSON data
    # Close the database connection
    cursor.close()
    connection.close()

    # Return the workout plan as JSON
    return jsonify(workout_plan), 200


@app.route('/workoutplans/<int:plan_id>', methods=['DELETE'])
def delete_workout_plan(plan_id):
    user_id = request.json.get('userId')  # Get user ID from the frontend request
    print("Received UserID:",user_id)
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        # Fetch TrainerID of the workout plan
        cursor.execute("SELECT TrainerID FROM WorkoutPlan WHERE PlanID = %s", (plan_id,))
        result = cursor.fetchone()
        
        
        
        if not result["TrainerID"]:
            print(result["TrainerID"])
            return jsonify({"error": "Workout plan not found"}), 404
        print("Here1")
        print(result["TrainerID"])
        trainer_id = result["TrainerID"]

        # Check if the user is the trainer of the workout plan
        if trainer_id != int(user_id):
            print("Here2")
            return jsonify({"error": "Unauthorized: Only the trainer can delete this plan"}), 403

        # Delete the workout plan
        print("Here3")
        cursor.execute("DELETE FROM WorkoutPlan WHERE PlanID = %s", (plan_id,))
        connection.commit()
        print("Here4")
        return jsonify({"message": "Workout plan deleted successfully"}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "An error occurred"}), 500



# Endpoint to fetch exercise only
@app.route('/exercise', methods=['GET'])
def get_exercise():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT ExerciseID, Name, Description FROM exercise")
    exercise = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify({"exercise": exercise})





# @app.route('/dashboard', methods=['GET'])
# def get_dashboard_data():
    
#     user_id = session.get('user_id')  # or decode from token, if using JWT

#     if not user_id:
#         return jsonify({"error": "User not logged in"}), 401
#     connection = get_db_connection()
#     cursor = connection.cursor(dictionary=True)

#     # Get overall stats from UserWorkoutPlanProgress
#     cursor.execute("""
#         SELECT COUNT(DISTINCT WorkoutPlanID) AS totalWorkoutsCompleted,
#                AVG(ProgressPercentage) AS averageCompletion,
#                SUM(TotalTime) AS totalMinutesExercised
#         FROM UserWorkoutPlanProgress
#         WHERE UserID = %s
#     """, (user_id,))
#     overall_stats = cursor.fetchone()
    
#     # Calculate streak days   
#     cursor.execute("""
#         SELECT COUNT(*) AS streakDays 
#         FROM UserWorkoutPlanProgress
#         WHERE UserID = %s 
#         AND DateStarted >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
#     """, (user_id,))
#     streak_days = cursor.fetchone()['streakDays']
#     overall_stats['streakDays'] = streak_days

#     # Fetch recent workouts from UserWorkoutPlanProgress
#     cursor.execute("""
#         SELECT PlanTitle, DateStarted, ExercisesCompleted, TotalExercises, WorkoutPlanID AS PlanID
#         FROM UserWorkoutPlanProgress
#         WHERE UserID = %s
#         ORDER BY DateStarted DESC
#         LIMIT 5
#     """, (user_id,))
#     recent_workouts = cursor.fetchall()

#     # Fetch progress data for the bar chart
#     cursor.execute("""
#         SELECT PlanTitle, ProgressPercentage
#         FROM UserWorkoutPlanProgress
#         WHERE UserID = %s
#     """, (user_id,))
#     user_progress = cursor.fetchall()

#     cursor.close()
#     connection.close()

#     return jsonify({
#         "overallStats": overall_stats,
#         "userProgress": user_progress,
#         "recentWorkouts": recent_workouts
#     })


@app.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    print("Here0")
    print("Session:",session)
    user_id = session.get('user_id')  # Retrieve user ID from session or token

    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    print("User ID:",user_id)
    try:
        print("Here1:",)
        # Call stored procedure to fetch overall stats and streak days
        cursor.callproc('GetUserDashboardData2', [user_id])
        print("Here2")
        # Get overall stats and streak days
        # overall_stats = cursor.fetchone()
        # print("overall stats:",overall_stats)
        # overall_stats['streakDays'] = overall_stats.get('streakDays', 0)
        
        # print("Overall Stats:",overall_stats)
        # # Fetch recent workouts and user progress data from cursor's result sets
        # recent_workouts = []
        # user_progress = []

        # # Fetch each result set
        # for result in cursor.stored_results():
        #     if len(recent_workouts) == 0:  # First result is recent workouts
        #         recent_workouts = result.fetchall()
        #     else:  # Second result is user progress for the bar chart
        #         user_progress = result.fetchall()
        # print("Dashboard data3:",overall_stats,user_progress,recent_workouts)
         # Call stored procedure to fetch overall stats and streak days

        # Initialize placeholders
        overall_stats = None
        recent_workouts = []
        user_progress = []

        # Fetch result sets in order
        for idx, result in enumerate(cursor.stored_results()):
            if idx == 0:  # First result set is overall stats
                overall_stats = result.fetchone()
            elif idx == 2:  # Second result set is recent workouts
                recent_workouts = result.fetchall()
            elif idx == 3:  # Third result set is user progress
                user_progress = result.fetchall()
        print("TEsting:",overall_stats,recent_workouts,user_progress)
        # Ensure streakDays is set
        if overall_stats:
            overall_stats['streakDays'] = overall_stats.get('streakDays', 0)
            

    except mysql.connector.Error as err:
        print("Error fetching dashboard data:", err)
        return jsonify({"error": "Failed to fetch dashboard data"}), 500
    finally:
        print("overall stats:",overall_stats)
        print("userProgress",user_progress)
        print("recentWorkouts", recent_workouts)
        cursor.close()
        connection.close()
    
    return jsonify({
        "overallStats": overall_stats,
        "userProgress": user_progress,
        "recentWorkouts": recent_workouts
    })
    
    
    
@app.route('/complete_workout', methods=['POST'])
def complete_workout():
    data = request.get_json()
    user_id = data.get('user_id')
    workout_id = data.get('workout_id')

    connection = get_db_connection()
    cursor = connection.cursor()
    print("is it here?",data,user_id,workout_id)
    # Example insert statement to mark workout as complete
    cursor.execute("""
        INSERT INTO UserWorkoutPlanProgress (UserID, PlanID, DateStarted, ProgressPercentage, TotalTime, ExercisesCompleted, )
        VALUES (%s, %s, CURDATE(), 100, 60, 10)  -- customize based on actual workout stats
    """, (user_id, workout_id))
    connection.commit()

    cursor.close()
    connection.close()
    return jsonify({"message": "Workout completed"}), 200

'''
@app.route('/workout-session', methods=['POST'])
def log_workout_session():
    print("Test1")
    data = request.json
    print("Test2",data)
    user_id = data.get('user_id')
    plan_id = data.get('workout_id')
    start_time = data.get('start_time')
    end_time = data.get('end_time')

    if not all([user_id, plan_id, start_time, end_time]):
        print("Fail1")
        return jsonify({"error": "Missing data"}), 400
    
    
     # Convert ISO format to SQL format
    try:
        start_time = datetime.datetime.strptime(start_time, '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y-%m-%d %H:%M:%S')
        end_time = datetime.datetime.strptime(end_time, '%Y-%m-%dT%H:%M:%S.%fZ').strftime('%Y-%m-%d %H:%M:%S')
        print(start_time,end_time)
    except ValueError as e:
        return jsonify({"error": "Invalid timestamp format"}), 400


    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Update start and end time in the database
        cursor.execute("""
            UPDATE UserWorkoutPlanProgress
            SET DateStarted = %s, DateCompleted = %s
            WHERE UserID = %s AND PlanID = %s
        """, (start_time, end_time, user_id, plan_id))
        connection.commit()
    except mysql.connector.Error as err:
        print("Error:", err)
        return jsonify({"error": "Failed to save session"}), 500
    finally:
        cursor.close()
        connection.close()

    return jsonify({"message": "Workout session logged successfully!"})
'''

@app.route('/workout-session/start', methods=['POST'])
def start_workout():
    data = request.json
    user_id = data.get('userId')
    plan_id = data.get('planId')

    if not all([user_id, plan_id]):
        return jsonify({"error": "Missing data"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()
    print("Starting workout for ",user_id,"Plan ID:",plan_id)
    try:
        # Check if the record exists
        cursor.execute("""
            SELECT COUNT(*) FROM UserWorkoutPlanProgress WHERE UserID = %s AND PlanID = %s
        """, (user_id, plan_id))
        record_exists = cursor.fetchone()[0] > 0

        # Insert a new record if it doesn't exist
        if not record_exists:
            print("Creating new record for ",user_id,plan_id)
            cursor.execute("""
                INSERT INTO UserWorkoutPlanProgress (UserID, PlanID, TotalExercises)
                SELECT %s, %s, COUNT(*)
                FROM WorkoutPlanExercise
                WHERE WorkoutPlanID = %s
            """, (user_id, plan_id, plan_id))
        print("Updating record for",user_id,plan_id)
        # Update start time
        cursor.execute("""
            UPDATE UserWorkoutPlanProgress
            SET DateStarted = NOW()
            WHERE UserID = %s AND PlanID = %s
        """, (user_id, plan_id))
        connection.commit()
    except mysql.connector.Error as err:
        print("Error:", err)
        return jsonify({"error": "Failed to log start time"}), 500
    finally:
        cursor.close()
        connection.close()

    return jsonify({"message": "Workout started!"})

#old
# @app.route('/workout-session/end', methods=['POST'])
# def end_workout():
#     data = request.json
#     user_id = data.get('userId')
#     plan_id = data.get('planId')

#     if not all([user_id, plan_id]):
#         return jsonify({"error": "Missing data"}), 400

#     connection = get_db_connection()
#     cursor = connection.cursor()
#     print("Ended",user_id,plan_id)
#     try:
#         # Update end time
#         print("Updating end time for",user_id,plan_id)
#         cursor.execute("""
#             UPDATE UserWorkoutPlanProgress
#             SET DateCompleted = NOW()
#             WHERE UserID = %s AND PlanID = %s
#         """, (user_id, plan_id))
#         connection.commit()
#     except mysql.connector.Error as err:
#         print("Error:", err)
#         return jsonify({"error": "Failed to log end time"}), 500
    # finally:
    #     cursor.close()
    #     connection.close()

#     return jsonify({"message": "Workout completed!"})

#new
@app.route('/workout-sessions/end', methods=['OPTIONS','POST'])
def end_workout_session():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response, 200
    
    
    data = request.get_json()
    user_id = data.get('userId')
    plan_id = data.get('planId')
    total_played_time = data.get('totalPlayedTime')
    total_duration = data.get('totalDuration')
    print("total played time:",total_played_time)
    # Calculate progress percentage
    progress_percentage = (total_played_time / total_duration) * 100
    print("progress percentage:",progress_percentage)

    connection = get_db_connection()
    cursor = connection.cursor()
    # Update the UserWorkoutPlanProgress table
    cursor.execute("""
        UPDATE UserWorkoutPlanProgress
        SET ExercisesCompleted = FLOOR(TotalExercises * (%s / 100)),
            ProgressPercentage = %s,
            DateCompleted = NOW(),
            TotalTime = %s
        WHERE UserID = %s AND PlanID = %s
    """, (progress_percentage, progress_percentage, total_played_time,user_id, plan_id))
    connection.commit()
    
    cursor.close()
    connection.close()
    

    return jsonify({'message': 'Workout session ended successfully'}), 200



@app.route('/dietplans', methods=['GET'])
def get_dietplans():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT dp.DietPlanID, dp.Title, dp.Description, dp.Calories, dp.TrainerID, dp.DateCreated, dp.Thumbnail,
                   t.Name as TrainerName
            FROM DietPlan dp
            LEFT JOIN Trainer t ON dp.TrainerID = t.TrainerID
            ORDER BY dp.DateCreated DESC
        """)
        dietplans = cursor.fetchall()
        for diet in dietplans:
            print("Plan:",diet)
            # thumbnail_file_path = diet.get("thumbnail")
            thumbnail_file_path = diet.get("Thumbnail")
            if thumbnail_file_path:
                with open(thumbnail_file_path, "rb") as thumbnail_file:
                    diet["Thumbnail"] = base64.b64encode(thumbnail_file.read()).decode('utf-8')
            diet["DateCreated"]=diet["DateCreated"].isoformat()
            print(diet)
        print("????") 
        print(dietplans)
        return jsonify(dietplans)
    except mysql.connector.Error as err:
        print("Error: ", err)
        return jsonify({"error": "Failed to fetch diet plans"}), 500
    finally:
        cursor.close()

@app.route('/diets', methods=['GET'])
def get_diets():
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT DietID, Name, Type FROM Diets")
        diets = cursor.fetchall()
        return jsonify(diets)
    except mysql.connector.Error as err:
        print("Error: ", err)
        return jsonify({"error": "Failed to fetch diets"}), 500
    finally:
        cursor.close()


upload_folder = 'uploads'
if not os.path.exists(upload_folder):
    os.makedirs(upload_folder)
@app.route('/dietplans', methods=['POST'])
def create_dietplan():
    # data = request.json
    title = request.form.get("title")
    description = request.form.get("description")
    # calories = request.form.get("calories")
    trainer_id = request.form.get("trainerId")
    selected_diets = request.form.get("selectedDiets")
    #date_created = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    thumbnail = request.files.get("thumbnail", None)  # Optional thumbnail field
    
    thumbnail_path = None
    print(title,description,trainer_id,selected_diets,thumbnail)
    if thumbnail:
            thumbnail_path = os.path.join(upload_folder, thumbnail.filename)
            thumbnail.save(thumbnail_path)

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        total_calories = 0
        if selected_diets:
            for diet_id in selected_diets:
                cursor.execute("SELECT Calories FROM Diets WHERE DietID = %s", (diet_id,))
                result = cursor.fetchone()
                if result:
                    total_calories += result[0]  # Add the calories of each diet
                    print(total_calories)
        print(title, description, total_calories, trainer_id, thumbnail_path)
        # Insert into DietPlans
        cursor.execute("""
            INSERT INTO DietPlan (Title, Description, Calories, TrainerID, Thumbnail)
            VALUES (%s, %s, %s, %s, %s)
        """, (title, description, total_calories, trainer_id, thumbnail_path))
        
        dietplan_id = cursor.lastrowid
        print(type(list(selected_diets)))
        selected_diets=selected_diets[1:-1].split(',')
        print(selected_diets)
        # Insert into DietPlanDiets (Linking table)
        if selected_diets:
            for diet_id in selected_diets:
                if diet_id!=',':
                    print(dietplan_id, diet_id)
                    cursor.execute("INSERT INTO DietPlanDiets (DietPlanID, DietID) VALUES (%s, %s)", (dietplan_id, diet_id))

        connection.commit()
        return jsonify({"message": "Diet plan created successfully", "DietPlanID": dietplan_id}), 201
    except mysql.connector.Error as err:
        print("Error: ", err)
        connection.rollback()
        return jsonify({"error": "Failed to create diet plan"}), 500
    finally:
        connection.close()
        cursor.close()



@app.route('/diet/<int:id>', methods=['GET'])
def get_diet_plan(id):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    print("ID:",id)
    # Query to get the workout plan details by ID
    cursor.execute("SELECT * FROM DietPlan WHERE DietPlanID = %s", (id,))
    diet_plan = cursor.fetchone()
    if not diet_plan:
        return jsonify({"error": "Diet plan not found"}), 404
    
    print("DietPlan:",diet_plan)
    # Convert video file to base64 string if a file path exists
    
    thumbnail_file_path = diet_plan.get("thumbnail")
    if thumbnail_file_path:
        with open(thumbnail_file_path, "rb") as thumbnail_file:
            diet_plan["thumbnail"] = base64.b64encode(thumbnail_file.read()).decode('utf-8')

    # Format DateCreated to ISO 8601
    diet_plan["DateCreated"] = diet_plan["DateCreated"].isoformat()
    for i in diet_plan:
        print("types:",i,diet_plan[i],type(diet_plan[i]))
    # Log the workout plan for debugging
    

    # Get exercises related to this workout plan
    cursor.execute("""
        SELECT d.DietID, d.Name, d.Calories
        FROM Diets d
        JOIN DietPlanDiets dpd ON d.DietID = dpd.DietID
        WHERE dpd.DietPlanID = %s
    """, (id,))
    diets = cursor.fetchall()
    
    # Add the diets list to the diet plan dictionary
    diet_plan["Diets"] = diets

    cursor.close()
    connection.close()

    # Return the workout plan as JSON
    return jsonify(diet_plan), 200

@app.route('/dietplans/<int:plan_id>', methods=['DELETE'])
def delete_diet_plan(plan_id):
    user_id = request.json.get('userId')  # Get user ID from the frontend request
    print("Received UserID:",user_id)
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        # Fetch TrainerID of the workout plan
        cursor.execute("SELECT TrainerID FROM DietPlan WHERE DietPlanID = %s", (plan_id,))
        result = cursor.fetchone()
        
        
        
        if not result["TrainerID"]:
            print(result["TrainerID"])
            return jsonify({"error": "Diet plan not found"}), 404
        print("Here1")
        print(result["TrainerID"])
        trainer_id = result["TrainerID"]

        # Check if the user is the trainer of the workout plan
        if trainer_id != int(user_id):
            print("Here2")
            return jsonify({"error": "Unauthorized: Only the trainer can delete this plan"}), 403

        # Delete the workout plan
        print("Here3")
        cursor.execute("DELETE FROM DietPlan WHERE DietPlanID = %s", (plan_id,))
        connection.commit()
        print("Here4")
        return jsonify({"message": "Diet plan deleted successfully"}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "An error occurred"}), 500

if __name__ == '__main__':
    app.run(port=5000)
