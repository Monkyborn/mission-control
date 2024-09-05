import React, { useState, useEffect } from 'react';
import { Button, TextField, DialogActions } from '@mui/material';
import { createRobot, updateRobot } from '../services/api';
import { toast } from 'react-toastify';

const RobotForm = ({ robot, setRobots, robots, closeForm }) => {
  // Declare state variables for each input field
  const [robotName, setRobotName] = useState('');
  const [modelName, setModelName] = useState('');
  const [poseX, setPoseX] = useState(0);
  const [poseY, setPoseY] = useState(0);

  useEffect(() => {
    if (robot) {
      setRobotName(robot.name);
      setModelName(robot.model_name);
      setPoseX(robot.pose_x);
      setPoseY(robot.pose_y);
    }
  }, [robot]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let response;
      if (robot) {
        // Update existing robot
        response = await updateRobot(robot._id, { name: robotName, model_name: modelName, pose_x: poseX, pose_y: poseY });
      } else {
        // Create a new robot
        response = await createRobot({ name: robotName, model_name: modelName, pose_x: poseX, pose_y: poseY });
      }

      if (response && response.data) {
        const newOrUpdatedRobot = response.data;

        // Update robots in the list
        if (robot) {
          setRobots(robots.map((r) => (r._id === newOrUpdatedRobot._id ? newOrUpdatedRobot : r)));
        } else {
          setRobots([...robots, newOrUpdatedRobot]);
        }

        toast.success('Robot created/updated successfully!');
        closeForm();
      } else {
        toast.error('Error: Failed to create/update robot');
      }
    } catch (error) {
      console.error('Error creating/updating robot:', error);
      toast.error('Error creating/updating robot');
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
        <Button onClick={closeForm} color="secondary">
          Cancel
        </Button>
        <Button type="submit" color="primary">
          {robot ? 'Update Robot' : 'Create Robot'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default RobotForm;
