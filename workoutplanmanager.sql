create database workout_plan_manager;
use workout_plan_manager;
-- CREATE TABLE User (
--     UserID SERIAL PRIMARY KEY,
--     Name VARCHAR(100) NOT NULL,
--     Email VARCHAR(100) UNIQUE NOT NULL,
--     Password VARCHAR(100) NOT NULL,
--     role ENUM('user', 'trainer') NOT NULL,
--     DateJoined DATE DEFAULT(current_date())
-- );


-- CREATE TABLE Trainer (
--     TrainerID SERIAL PRIMARY KEY,
--     Name VARCHAR(100) NOT NULL,
--     Email VARCHAR(100) UNIQUE NOT NULL,
--     Password VARCHAR(100) NOT NULL,
--     Expertise VARCHAR(100),
--     DateJoined DATE DEFAULT(current_date())
-- );

-- CREATE TABLE WorkoutPlan (
--     PlanID SERIAL PRIMARY KEY,
--     Title VARCHAR(100) NOT NULL,
--     Description TEXT,
--     CategoryID INT, -- Foreign key to another table if needed for workout categories
--     Level VARCHAR(50) CHECK (Level IN ('Beginner', 'Intermediate', 'Advanced')),
--     TrainerID INT REFERENCES Trainer(TrainerID) ON DELETE CASCADE,
--     DateCreated DATE DEFAULT(CURRENT_DATE())
-- );

-- CREATE TABLE Exercise (
--     ExerciseID SERIAL PRIMARY KEY,
--     Name VARCHAR(100) NOT NULL,
--     Description TEXT,
--     MediaURL VARCHAR(255),
--     PlanID INT REFERENCES WorkoutPlan(PlanID) ON DELETE CASCADE
-- );

-- CREATE TABLE DietPlan (
--     DietPlanID SERIAL PRIMARY KEY,
--     Title VARCHAR(100) NOT NULL,
--     Description TEXT,
--     Calories INT,
--     TrainerID INT REFERENCES Trainer(TrainerID) ON DELETE CASCADE,
--     DateCreated DATE DEFAULT(CURRENT_DATE())
-- );

-- CREATE TABLE Equipment (
--     EquipmentID SERIAL PRIMARY KEY,
--     EquipmentName VARCHAR(100) NOT NULL,
--     Description TEXT
-- );

-- CREATE TABLE User_WorkoutPlan (
--     UserID INT REFERENCES User(UserID) ON DELETE CASCADE,
--     PlanID INT REFERENCES WorkoutPlan(PlanID) ON DELETE CASCADE,
--     StartDate DATE DEFAULT(CURRENT_DATE()),
--     PRIMARY KEY (UserID, PlanID)
-- );

-- CREATE TABLE User_WorkoutPlanProgress (
--     ProgressID SERIAL PRIMARY KEY,
--     UserID INT REFERENCES User(UserID) ON DELETE CASCADE,
--     PlanID INT REFERENCES WorkoutPlan(PlanID) ON DELETE CASCADE,
--     ProgressPercentage DECIMAL(5, 2), -- Stores progress in percentage
--     LastUpdated DATE DEFAULT(CURRENT_DATE())
-- );

-- CREATE TABLE User_DietPlan (
--     UserID INT REFERENCES User(UserID) ON DELETE CASCADE,
--     DietPlanID INT REFERENCES DietPlan(DietPlanID) ON DELETE CASCADE,
--     StartDate DATE DEFAULT(CURRENT_DATE()),
--     PRIMARY KEY (UserID, DietPlanID)
-- );


CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    DateJoined timestamp NOT NULL 
);
ALTER TABLE User
MODIFY DateJoined TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;


CREATE TABLE Trainer (
    TrainerID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Expertise VARCHAR(255),
    DateJoined DATE NOT NULL
);

ALTER TABLE Trainer
MODIFY DateJoined TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;


CREATE TABLE WorkoutPlan (
    PlanID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    CategoryID INT,
    TrainerID INT,
    DateCreated DATE NOT NULL,
    Level VARCHAR(50),
    FOREIGN KEY (TrainerID) REFERENCES Trainer(TrainerID) ON DELETE CASCADE
);

ALTER TABLE WorkoutPlan ADD COLUMN videoUrl VARCHAR(255);


CREATE TABLE Exercise (
    ExerciseID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    MediaURL VARCHAR(255),
    PlanID INT,
    FOREIGN KEY (PlanID) REFERENCES WorkoutPlan(PlanID) ON DELETE CASCADE
);

ALTER TABLE Exercise
DROP COLUMN MediaURL;

ALTER TABLE Exercise DROP FOREIGN KEY exercise_ibfk_1;
ALTER TABLE Exercise DROP COLUMN PlanID;


CREATE TABLE DietPlan (
    DietPlanID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    Calories INT,
    TrainerID INT,
    DateCreated DATE NOT NULL,
    FOREIGN KEY (TrainerID) REFERENCES Trainer(TrainerID) ON DELETE CASCADE
);

CREATE TABLE Equipment (
    EquipmentID INT AUTO_INCREMENT PRIMARY KEY,
    EquipmentName VARCHAR(100) NOT NULL,
    Description TEXT,
    ExerciseID INT,
    FOREIGN KEY (ExerciseID) REFERENCES Exercise(ExerciseID) ON DELETE CASCADE
);

ALTER TABLE Equipment DROP FOREIGN KEY equipment_ibfk_1;
ALTER TABLE Equipment DROP COLUMN ExerciseID;

CREATE TABLE UserWorkoutPlanProgress (
    UserID INT,
    PlanID INT,
    ExercisesCompleted INT DEFAULT 0,
    TotalExercises INT,
    ProgressPercentage DECIMAL(5,2),
    DateStarted DATE,
    DateCompleted DATE,
    PRIMARY KEY (UserID, PlanID),
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (PlanID) REFERENCES WorkoutPlan(PlanID) ON DELETE CASCADE
);




-- Create WorkoutPlanExercise Table to Link Exercises and Workout Plans
CREATE TABLE WorkoutPlanExercise (
    WorkoutPlanID INT,
    ExerciseID INT,
    PRIMARY KEY (WorkoutPlanID, ExerciseID),
    FOREIGN KEY (WorkoutPlanID) REFERENCES WorkoutPlan(PlanID) ON DELETE CASCADE,
    FOREIGN KEY (ExerciseID) REFERENCES Exercise(ExerciseID) ON DELETE CASCADE
);


-- Create the Exercise_Equipment association table
CREATE TABLE Exercise_Equipment (
    ExerciseID INT,
    EquipmentID INT,
    PRIMARY KEY (ExerciseID, EquipmentID),
    FOREIGN KEY (ExerciseID) REFERENCES Exercise(ExerciseID) ON DELETE CASCADE,
    FOREIGN KEY (EquipmentID) REFERENCES Equipment(EquipmentID) ON DELETE CASCADE
);



-- Trigger to automatically link Equipment to WorkoutPlan when an Exercise is added to WorkoutPlanExercise
DELIMITER //

CREATE TRIGGER LinkEquipmentToWorkoutPlan
AFTER INSERT ON WorkoutPlanExercise
FOR EACH ROW
BEGIN
    -- Insert into Equipment_Exercise for all equipment linked with the exercise being added
    INSERT INTO Equipment_Exercise (EquipmentID, ExerciseID)
    SELECT EquipmentID, NEW.ExerciseID
    FROM Equipment_Exercise
    WHERE ExerciseID = NEW.ExerciseID;
END //

DELIMITER ;