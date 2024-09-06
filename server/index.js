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
    origin: '*', // Allow all origins (or restrict to your frontend domain in production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow sending cookies across origins
  },
});

// Enable CORS middleware for handling cross-origin requests
app.use(cors());

// Enable parsing of JSON data in request bodies
app.use(express.json());

// MongoDB Connection Logic
const mongoURI = process.env.MONGODB_URI || 'fallback-mongo-uri'; // Get MongoDB URI from environment variable or fallback
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit the process with an error code if connection fails
  });

// API Routes: Define routes for API endpoints using the imported 'routes' module
app.use('/api', routes);

// Serve static assets in production environment
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the 'build' folder within the 'client' directory
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Redirect all unmatched routes to 'index.html' in production
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Websocket management: Handle real-time communication
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle 'get_robot_position' event from client:
  // - Retrieve robot position from the database
  // - Emit 'robot_position' event to connected clients with retrieved position data
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

  // Handle 'move_robot' event from client:
  // - Update robot position in the database based on the direction
  // - Broadcast updated robot position to all connected clients via 'robot_position' event
  socket.on('move_robot', async ({ robotId, direction }) => {
    try {
      const robot = await Robot.findById(robotId);
      if (!robot) return;

      const moveAmount = 20; // Define robot movement amount per key press
      const maxPosition = 380; // Define maximum allowed position value

      switch (direction) {
        case 'up':
          robot.pose_y = Math.max(robot.pose_y - moveAmount, 0); // Update y-coordinate (up)
          break;
        case 'down':
          robot.pose_y = Math.min(robot.pose_y + moveAmount, maxPosition); // Update y-coordinate (down)
          break;
        case 'left':
          robot.pose_x = Math.max(robot.pose_x - moveAmount, 0); // Update x-coordinate (left)
          break;
        case 'right':
          robot.pose_x = Math.min(robot.pose_x + moveAmount, maxPosition); // Update x-coordinate (right)
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