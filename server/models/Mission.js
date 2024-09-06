const mongoose = require('mongoose');

// Defines a Mongoose schema for the Mission model
const MissionSchema = new mongoose.Schema({
  // Name field: required string
  name: { type: String, required: true },

  // Description field: required string
  description: { type: String, required: true },

  // Robot field: optional ObjectId reference to the Robot model
  robot: { type: mongoose.Schema.Types.ObjectId, ref: 'Robot', default: null }
});

// Creates the Mission model based on the defined schema
module.exports = mongoose.model('Mission', MissionSchema);