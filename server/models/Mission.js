// const mongoose = require('mongoose');

// const MissionSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   robot: { type: mongoose.Schema.Types.ObjectId, ref: 'Robot' }, // Reference to Robot
// });

// module.exports = mongoose.model('Mission', MissionSchema);

const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  robot: { type: mongoose.Schema.Types.ObjectId, ref: 'Robot', default: null }
});

module.exports = mongoose.model('Mission', MissionSchema);
