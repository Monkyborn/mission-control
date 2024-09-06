const mongoose = require('mongoose');

// Defines a Mongoose schema for the Robot model
const RobotSchema = new mongoose.Schema({
  // Name field: required string
  name: { type: String, required: true },

  // Model name field: required string
  model_name: { type: String, required: true },

  // Pose X field: optional number, default value 0
  pose_x: { type: Number, default: 0 },

  // Pose Y field: optional number, default value 0
  pose_y: { type: Number, default: 0 },
});

// Creates the Robot model based on the defined schema
module.exports = mongoose.model('Robot', RobotSchema);