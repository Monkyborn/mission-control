import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { createMission, updateMission, fetchRobots } from '../services/api';
import { toast } from 'react-toastify';

const MissionForm = ({
  mission, // Object representing the mission to edit (optional)
  setMissions, // Function to update the missions state in the parent component
  missions, // Array of existing missions (used for creating new mission)
  closeForm, // Function to close the mission form modal
  updateMissionInTable, // Function to update the mission in the table (used for editing)
}) => {
  // State variables to manage form data
  const [name, setName] = useState(mission ? mission.name : '');
  const [description, setDescription] = useState(mission ? mission.description : '');
  const [robot, setRobot] = useState(mission?.robot?._id || ''); // Selected robot ID (empty string if none)
  const [robots, setRobots] = useState([]); // Array of available robots

  // Fetches robots on component mount
  useEffect(() => {
    const getRobots = async () => {
      try {
        const response = await fetchRobots();
        setRobots(response.data);
      } catch (error) {
        toast.error('Error fetching robots');
        console.error('Error fetching robots:', error);
      }
    };

    getRobots();
  }, []);

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Creates the new mission object with form data
    const newMission = { name, description, robot: robot || null }; 

    try {
      if (mission) {
        // Updates existing mission
        const updatedMission = await updateMission(mission._id, newMission);
        updateMissionInTable(updatedMission.data); // Update mission in parent component table
        toast.success('Mission updated successfully!');
      } else {
        // Creates a new mission
        const createdMission = await createMission(newMission);
        setMissions([...missions, createdMission.data]); // Add new mission to parent component state
        toast.success('Mission created successfully!');
      }

      closeForm(); // Close the form modal after successful operation
    } catch (error) {
      toast.error('Error creating/updating mission');
      console.error('Error creating/updating mission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Text field for mission name */}
      <TextField
        fullWidth
        label="Mission Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      {/* Text field for mission description */}
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />
      {/* Select dropdown to choose a robot for the mission */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="robot-select-label">Assign Robot</InputLabel>
        <Select
          labelId="robot-select-label"
          value={robot}
          onChange={(e) => setRobot(e.target.value)}
        >
          <MenuItem value="">None</MenuItem>
          {/* Maps through available robots to create menu items */}
          {robots.map((theRobot) => (
            <MenuItem key={theRobot._id} value={theRobot._id}>
              {theRobot.name} - {theRobot.model_name} - Displays robot name and model
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Submit button with appropriate text based on editing or creating a mission */}
      <Button type="submit" variant="contained" color="primary">
        {mission ? 'Update Mission' : 'Create Mission'}
      </Button>
    </form>
  );
};

export default MissionForm;