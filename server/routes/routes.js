const express = require('express');
const router = express.Router();
const Mission = require('../models/Mission');
const Robot = require('../models/Robot');

// Fetch all missions and populate the robot field
router.get('/missions', async (req, res) => {
  try {
    const missions = await Mission.find().populate('robot');
    res.send(missions);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Fetch a specific mission by ID and populate robot
router.get('/missions/:id', async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id).populate('robot');
    if (!mission) return res.status(404).send('Mission not found');
    res.send(mission);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new mission
router.post('/missions', async (req, res) => {
  try {
    const { name, description, robot } = req.body;
    const newMission = new Mission({ name, description, robot });
    await newMission.save();
    const populatedMission = await Mission.findById(newMission._id).populate('robot');
    res.send(populatedMission);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a mission (including assigning or changing the robot)
router.put('/missions/:id', async (req, res) => {
  try {
    const { name, description, robot } = req.body;
    const updatedMission = await Mission.findByIdAndUpdate(
      req.params.id,
      { name, description, robot },
      { new: true } // This returns the updated mission
    ).populate('robot'); // Populate robot details

    if (!updatedMission) return res.status(404).send('Mission not found');
    res.send(updatedMission);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a mission by ID
router.delete('/missions/:id', async (req, res) => {
  try {
    const mission = await Mission.findByIdAndDelete(req.params.id);
    if (!mission) return res.status(404).send('Mission not found');
    res.send(mission);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Fetch all robots
router.get('/robots', async (req, res) => {
  try {
    const robots = await Robot.find();
    res.send(robots);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Fetch a specific robot by ID
router.get('/robots/:id', async (req, res) => {
  try {
    const robot = await Robot.findById(req.params.id);
    if (!robot) return res.status(404).send('Robot not found');
    res.send(robot);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Create a new robot
router.post('/robots', async (req, res) => {
  try {
    const newRobot = new Robot(req.body);
    await newRobot.save();
    res.status(201).json(newRobot); // Ensure the response sends back the created robot
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a robot by ID
router.put('/robots/:id', async (req, res) => {
  try {
    const updatedRobot = await Robot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRobot) return res.status(404).send('Robot not found');
    res.send(updatedRobot);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete a robot by ID
router.delete('/robots/:id', async (req, res) => {
  try {
    const robot = await Robot.findByIdAndDelete(req.params.id);
    if (!robot) return res.status(404).send('Robot not found');
    res.send({ message: 'Robot deleted' });
  } catch (error) {
    res.status(500).send('Error deleting robot');
  }
});

// Assign a robot to a mission
router.put('/missions/:id/assign-robot', async (req, res) => {
  try {
    const { robotId } = req.body;
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).send('Mission not found');
    mission.robot = robotId;
    await mission.save();
    res.send(mission);
  } catch (error) {
    res.status(500).send('Error assigning robot to mission');
  }
});

// Remove a robot from a mission
router.put('/missions/:id/remove-robot', async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).send('Mission not found');
    mission.robot = null; // Remove robot
    await mission.save();
    res.send(mission);
  } catch (error) {
    res.status(500).send('Error removing robot from mission');
  }
});

module.exports = router;
