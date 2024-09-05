const mongoose = require('mongoose');

const RobotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model_name: { type: String, required: true },
  pose_x: { type: Number, default: 0 },
  pose_y: { type: Number, default: 0 },
});

module.exports = mongoose.model('Robot', RobotSchema);
