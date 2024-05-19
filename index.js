const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./model")
const User = require("./userModel")
const Level = require("./levelModel")


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




app.get("/api/v1/tasks" , async (req,res) => {
    try {
        const data = await Task.find();
        res.status(200).json(data); 
      } catch (error) {
        res.status(500).json({ error: error.message }); 
      }
})

app.get("/api/v1/user" , async (req,res) => {
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
    console.log("points ",points);
      // Find the user (assuming you only have one user)
      const user = await User.findOne();

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Update the currentLevel by adding points
      if(points === -1)
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


app.get("/api/v1/user/level" , async (req,res) => {
    try{
      const lvl = await Level.find();
      res.status(200).json(lvl);
    }
    catch(error)
    {
      res.status(500).json({error: error.message});
    }
})

app.listen((PORT) , () => {
    console.log("Server listening at " , PORT);
})