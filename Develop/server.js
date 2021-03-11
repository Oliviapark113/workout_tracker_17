// Add code to userModel.js to complete the model

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");
const Exercise = require("./models/Exercise");
const Workout = require("./models/Workout");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

// Routes

app.get("/exercise", (req, res)=>{
 res.render("exercise")

})

//createWorkout
app.post("/api/workouts", (req, res)=>{

  db.Workout.find({})
  .populate("exercise")
  .then(dbWorkouts =>{
    res.json(dbWorkouts);
  }).catch(err=>{
    res.json(err);
  })
})


//addExercise
app.put("/api/workouts/:id", ({body}, res) => {
  // Create a new workout req.body
  const workout = new Workout(body);
 
  Workout.create(workout)
    .then(({_id}) => db.Workout.findOneAndUpdate({}, {$push:{exercise:_id}}, {new:true}))
    .then(dbWorkout =>{
      res.json(dbWorkout)
    })
    .catch(err => {
      // If an error occurs, send the error to the client
      res.json(err);
    });
});


// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
