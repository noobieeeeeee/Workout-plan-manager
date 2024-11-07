from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app,origins=["http://localhost:3000"])

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
    


@app.route('/login', methods=['POST'])
def login():
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

    

@app.route('/workoutplans', methods=['POST'])
def submit_workout_plan():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    category = data.get('category')
    level = data.get('level')
    is_home_workout = data.get('isHomeWorkout')
    equipment = data.get('equipment')  # Assume this is a list of equipment IDs
    video_type = data.get('videoType')
    video_link = data.get('videoLink')
    # Save workout plan to database
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO WorkoutPlan (Title, Description, Category, Level, IsHomeWorkout, VideoType, VideoLink) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s)",
        (title, description, category, level, is_home_workout, video_type, video_link)
    )
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Workout plan submitted successfully"}), 201
    
    #return jsonify(workout_plans)


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



if __name__ == '__main__':
    app.run(port=5000)
