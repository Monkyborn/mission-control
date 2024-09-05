const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const routes = require('./routes/routes');
const Robot = require('./models/Robot'); // Modello del Robot per la teleoperazione

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

// Connessione a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Uscita se non riesce a connettersi a MongoDB
  });

app.use('/api', routes);

// Gestione WebSocket
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
      const maxPosition = 380; // Assuming 400 is the boundary

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

      // Broadcast della nuova posizione a tutti i client connessi
      io.emit('robot_position', { pose_x: robot.pose_x, pose_y: robot.pose_y });
    } catch (error) {
      console.error('Error moving robot:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
