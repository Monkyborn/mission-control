import React, { useState, useEffect } from 'react'; // Import React hooks for state management and lifecycle methods
import { Button, TextField, DialogActions } from '@mui/material'; // Import Material UI components for form elements
import { createRobot, updateRobot } from '../services/api'; // Import API service functions for interacting with backend
import { toast } from 'react-toastify'; // Import toast notification library

const RobotForm = ({
  robot, // Optional object representing the robot to edit (passed as a prop)
  setRobots, // Function to update the robots state in the parent component (passed as a prop)
  robots, // Array of existing robots (used for setting initial state or updating list) (passed as a prop)
  closeForm, // Function to close the robot form modal (passed as a prop)
}) => {
  // State variables to manage form data
  const [robotName, setRobotName] = useState(''); // State for robot name
  const [modelName, setModelName] = useState(''); // State for model name
  const [poseX, setPoseX] = useState(0); // State for initial pose X value (default 0)
  const [poseY, setPoseY] = useState(0); // State for initial pose Y value (default 0)

  // Update form state with robot data on component mount or when robot prop changes
  useEffect(() => {
    if (robot) {
      setRobotName(robot.name); // Set robot name state
      setModelName(robot.model_name); // Set model name state
      setPoseX(robot.pose_x); // Set pose X state
      setPoseY(robot.pose_y); // Set pose Y state
    }
  }, [robot]); // Dependency array ensures useEffect runs on robot prop change

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
      let response; // Variable to store API response
      if (robot) { // Check if editing an existing robot
        response = await updateRobot(robot._id, { // Update robot data on server
          name: robotName,
          model_name: modelName,
          pose_x: poseX,
          pose_y: poseY,
        });
      } else { // Creating a new robot
        response = await createRobot({ // Create new robot on server
          name: robotName,
          model_name: modelName,
          pose_x: poseX,
          pose_y: poseY,
        });
      }

      if (response && response.data) {
        const newOrUpdatedRobot = response.data; // Get the created/updated robot data

        if (robot) { // Update robots state in parent component if editing
          setRobots(robots.map((r) => (r._id === newOrUpdatedRobot._id ? newOrUpdatedRobot : r))); // Update robot data in the list
        } else { // Add new robot to robots state if creating
          setRobots([...robots, newOrUpdatedRobot]); // Add the new robot to the list
        }

        toast.success('Robot created/updated successfully!'); // Show success notification
        closeForm(); // Close the form modal
      } else {
        toast.error('Error: Failed to create/update robot'); // Show error notification
      }
    } catch (error) {
      console.error('Error creating/updating robot:', error); // Log error details for debugging
      toast.error('Error creating/updating robot'); // Show error notification
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Robot Name"
        value={robotName}
        onChange={(e) => setRobotName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Model Name"
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Pose X"
        type="number"
        value={poseX}
        onChange={(e) => setPoseX(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Pose Y"
        type="number"
        value={poseY}
        onChange={(e) => setPoseY(e.target.value)}
        fullWidth
        margin="normal"
      />
      <DialogActions>
        <Button onClick={closeForm} variant="contained" color="secondary">
          Close
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {robot ? 'Update Robot' : 'Create Robot'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default RobotForm;