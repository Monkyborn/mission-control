const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const routes = require('./routes/routes');
const Robot = require('./models/Robot');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins or restrict to your frontend domain in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  },
});

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'fallback-mongo-uri';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// API routes
app.use('/api', routes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// WebSocket management
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('get_robot_position', async (robotId) => {
    try {
      const robot = await Robot.findById(robotId);
      if (robot) {
        socket.emit('robot_position', { pose_x: robot.pose_x, pose_y: robot.pose_y });
      }
    } catch (error) {
      console.error('Error fetching robot position:', error.message);
    }
  });

  socket.on('move_robot', async ({ robotId, direction }) => {
    try {
      const robot = await Robot.findById(robotId);
      if (!robot) return;

      const moveAmount = 20;
      const maxPosition = 380;

      switch (direction) {
        case 'up':
          robot.pose_y = Math.max(robot.pose_y - moveAmount, 0);
          break;
        case 'down':
          robot.pose_y = Math.min(robot.pose_y + moveAmount, maxPosition);
          break;
        case 'left':
          robot.pose_x = Math.max(robot.pose_x - moveAmount, 0);
          break;
        case 'right':
          robot.pose_x = Math.min(robot.pose_x + moveAmount, maxPosition);
          break;
        default:
          break;
      }

      await robot.save();
      io.emit('robot_position', { pose_x: robot.pose_x, pose_y: robot.pose_y });
    } catch (error) {
      console.error('Error moving robot:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
