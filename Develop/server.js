// Add code to userModel.js to complete the model

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path")

const PORT = process.env.PORT || 3000;

const db = require("./models");



const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

// Routes

app.get("/exercise", (req, res)=>{
 res.sendFile(path.join(__dirname, 'public', 'exercise.html'))

})


app.get("/stats", (req, res)=>{
  res.sendFile(path.join(__dirname, 'public', 'stats.html'))
 
 })


//createWorkout
app.post("/api/workouts", ({body}, res)=>{
  
  const workout = new db.Workout(body);
  db.Workout.create(workout)
  .then(dbWorkouts =>{
    console.log(dbWorkouts)
    res.json(dbWorkouts);
  }).catch(err=>{
    res.json(err);
  })
})

//readWorkout
app.get("/api/workouts", (req, res)=>{
  console.log("hello")
  db.Workout.find({})
  // .populate("exercises")
  .then(dbWorkouts =>{
    console.log(dbWorkouts)
    res.json(dbWorkouts);
  }).catch(err=>{
    res.json(err);
  })
})

//addExercise
app.put("/api/workouts/:id", ({body, params}, res) => {
   //create exercise .. 
  // const exercise = new db.Exercise(body)
  const id = params.id
  //pulled id from exercise and add into exercise on Workout model
  // db.Exercise.create(exercise)
  // .then(({_id}) => {
    db.Workout.findByIdAndUpdate(id, {$push:{exercises: body }}, {new: true})
      .then(dbWorkout => {
        console.log(dbWorkout)
        res.json(dbWorkout);
      })
      .catch(err => {
        res.json(err)
      })
    
  // })
 
});



//getWorkoutsInRange

app.get("/api/workouts/range", (req, res) =>{
  //get duration of all workout 
  db.Workout.aggregate( [
    {
      $addFields: {
        totalDuration: { $sum: "$exercises.duration" } ,
        
      }
    }
 ]).then(dbWorkouts =>{
   res.json(dbWorkouts)
 })
 .catch(err => {
  res.json(err)
})
 

 }
)


// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
