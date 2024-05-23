const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cron = require("node-cron");
const cors = require("cors");
const Task = require("./model")
const User = require("./userModel")
const Level = require("./levelModel")
const DailyTask = require('./dailyTask');
const MockDate = require('mockdate');



const app = express();


const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());

/*
db connection part start*/

const url = process.env.MONGO_URI;

const connectDB = async () => {

  try {

    await mongoose.connect(url)

    console.log('MongoDB Connected')

  } catch (error) {
    console.log(error)

    process.exit(1)

  }
}


connectDB();



/*
db connection part end*/




app.get("/api/v1/tasks", async (req, res) => {
  try {
    const data = await Task.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.get("/api/v1/user", async (req, res) => {
  try {
    const data = await User.find();
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.post("/api/v1/user/addPoints", async (req, res) => {
  try {
    const { points } = req.body; // Assuming points are sent in the request body
    console.log("points ", points);
    // Find the user (assuming you only have one user)
    const user = await User.findOne();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the currentLevel by adding points
    if (points === -1)
      user.currentLevel = 0;
    else
      user.currentLevel += points;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Points added successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/api/v1/user/level", async (req, res) => {
  try {
    const lvl = await Level.find();
    res.status(200).json(lvl);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})



app.get("/api/v1/dailyTasks", async (req, res) => {
  try {
    // conosle.log("daily !!");
    const tasks = await DailyTask.find();
    // console.log("tasks here!");
    res.status(200).json({ tasks });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.post("/api/v1/dailyTasks/:id", async (req, res) => {

  try {
    const task = await DailyTask.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.isDone = true;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})



// Cron job to check at the end of every day (for testing, we'll run it every minute)
cron.schedule('0 0 * * *', () => {
  console.log('Cron job triggered at:', new Date());
  const scheduleMyJob = async () => {
    try {
      const tasks = await DailyTask.find();
      console.log('Tasks fetched:', tasks);
      let pointsToDeduct = 0;

      for (const task of tasks) {
        if (!task.isDone) {
          pointsToDeduct += task.ashers; // Assuming ashers is the correct field
        }
        task.isDone = false; // Reset task for the next day
        await task.save();
      }

      const user = await User.findOne();
      if (user) {
        console.log('User before deduction:', user);
        user.currentLevel -= pointsToDeduct;
        await user.save();
        console.log('User after deduction:', user);
      }

      console.log('Cron job completed. Points deducted:', pointsToDeduct);
    } catch (error) {
      console.error('Error during cron job:', error);
    }
  }

  scheduleMyJob();



}, {
  timezone: "Asia/Kolkata" // Set your timezone
});



app.listen((PORT), () => {
  console.log("Server listening at ", PORT);
})
