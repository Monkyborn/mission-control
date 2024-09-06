const express = require('express');
const router = express.Router(); // Creates an Express router

// Imports Mongoose models for Missions and Robots
const Mission = require('../models/Mission');
const Robot = require('../models/Robot');

// ** Missions API Endpoints **

// GET /missions: Fetches all missions and populates the 'robot' field with the associated robot details
router.get('/missions', async (req, res) => {
  try {
    const missions = await Mission.find().populate('robot'); // Populate robot data
    res.send(missions);
  } catch (error) {
    res.status(500).send('Internal Server Error'); // Generic error message
  }
});

// GET /missions/:id: Fetches a specific mission by ID and populates the 'robot' field
router.get('/missions/:id', async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id).populate('robot');
    if (!mission) return res.status(404).send('Mission not found');
    res.send(mission);
  } catch (error) {
    res.status(500).send(error.message); // Send specific error message
  }
});

// POST /missions: Creates a new mission
router.post('/missions', async (req, res) => {
  try {
    const { name, description, robot } = req.body; // Destructure request body
    const newMission = new Mission({ name, description, robot });
    await newMission.save();
    const populatedMission = await Mission.findById(newMission._id).populate('robot');
    res.send(populatedMission); // Send the created mission with populated robot data
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// PUT /missions/:id: Updates a mission (including assigning or changing the robot)
router.put('/missions/:id', async (req, res) => {
  try {
    const { name, description, robot } = req.body;
    const updatedMission = await Mission.findByIdAndUpdate(
      req.params.id,
      { name, description, robot },
      { new: true } // Returns the updated mission
    ).populate('robot');

    if (!updatedMission) return res.status(404).send('Mission not found');
    res.send(updatedMission);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// DELETE /missions/:id: Deletes a mission by ID
router.delete('/missions/:id', async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);
    if (!mission) return res.status(404).send('Mission not found');
    res.send(mission);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// ** Robots API Endpoints **

// GET /robots: Fetches all robots
router.get('/robots', async (req, res) => {
  try {
    const robots = await Robot.find();
    res.send(robots);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// GET /robots/:id: Fetches a specific robot by ID
router.get('/robots/:id', async (req, res) => {
  try {
    const robot = await Robot.findById(req.params.id);
    if (!robot) return res.status(404).send('Robot not found');
    res.send(robot);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// POST /robots: Creates a new robot
router.post('/robots', async (req, res) => {
  try {
    const newRobot = new Robot(req.body);
    await newRobot.save();
    res.status(201).json(newRobot); // Send the created robot with appropriate status code and response format
  } catch (error) {
    res.status(400).json({ message: error.message }); // Send specific error message
  }
});

// PUT /robots/:id: Updates a robot by ID
router.put('/robots/:id', async (req, res) => {
  try {
    const updatedRobot = await Robot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRobot) return res.status(404).send('Robot not found');
    res.send(updatedRobot);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// DELETE /robots/:id: Deletes a robot by ID
router.delete('/robots/:id', async (req, res) => {
  try {
    const robot = await Robot.findByIdAndDelete(req.params.id);
    if (!robot) return res.status(404).send('Robot not found');
    res.send({ message: 'Robot deleted' });
  } catch (error) {
    res.status(500).send('Error deleting robot');
  }
});

// ** Additional API Endpoints (if needed) **

// PUT /robots/:id/update-position: Updates the robot's position
router.put('/robots/:id/update-position', async (req, res) => {
  try {
    const { pose_x, pose_y } = req.body;
    const updatedRobot = await Robot.findByIdAndUpdate(req.params.id, { pose_x, pose_y }, { new: true });
    if (!updatedRobot) return res.status(404).send('Robot not found');
    res.send(updatedRobot);
  } catch (error) {
    res.status(500).send('Error updating robot position');
  }
});

// ** Export the router **
module.exports = router;