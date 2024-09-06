import React, { useState, useEffect } from 'react'; // Import React hooks for state management and lifecycle methods
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, DialogActions } from '@mui/material'; // Import Material UI components for form elements
import { createMission, updateMission, fetchRobots } from '../services/api'; // Import API service functions for interacting with backend
import { toast } from 'react-toastify'; // Import toast notification library

const MissionForm = ({
  mission, // Optional object representing the mission to edit (passed as a prop)
  setMissions, // Function to update the missions state in the parent component (passed as a prop)
  missions, // Array of existing missions (used for creating new mission) (passed as a prop)
  closeForm, // Function to close the mission form modal (passed as a prop)
  updateMissionInTable, // Function to update the mission in the table (used for editing) (passed as a prop)
}) => {
  const [name, setName] = useState(mission ? mission.name : ''); // Initialize mission name state with default value (empty string or edited mission name)
  const [description, setDescription] = useState(mission ? mission.description : ''); // Initialize mission description state with default value (empty string or edited mission description)
  const [robot, setRobot] = useState(mission?.robot?._id || ''); // Initialize selected robot ID state (empty string if none, or edited mission's robot ID)
  const [robots, setRobots] = useState([]); // Set initial state for available robots array

  useEffect(() => {
    const getRobots = async () => {
      try {
        const response = await fetchRobots(); // Fetch robots data from API
        setRobots(response.data); // Update robots state with fetched data
      } catch (error) {
        toast.error('Error fetching robots'); // Show error notification
        console.error('Error fetching robots:', error); // Log error details for debugging
      }
    };

    getRobots(); // Call the function to fetch robots on component mount
  }, []); // Empty dependency array ensures useEffect runs only once after initial render
  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Creates the new mission object with form data
    const newMission = { name, description, robot: robot || null }; // Create a new mission object with form data

    try {
      if (mission) { // Check if editing an existing mission
        const updatedMission = await updateMission(mission._id, newMission); // Update mission data on the server
        updateMissionInTable(updatedMission.data); // Update mission data in the table using the provided function
        toast.success('Mission updated successfully!'); // Show success notification
      } else { // Creating a new mission
        const createdMission = await createMission(newMission); // Create a new mission on the server
        setMissions([...missions, createdMission.data]); // Update missions state in parent component by adding the created mission
        toast.success('Mission created successfully!'); // Show success notification
      }

      closeForm(); // Close the form modal after successful submission
    } catch (error) {
      toast.error('Error creating/updating mission'); // Show error notification
      console.error('Error creating/updating mission:', error); // Log error details for debugging
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
              {theRobot.name} - {theRobot.model_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Submit button with appropriate text based on editing or creating a mission */}
      <DialogActions>
        <Button onClick={closeForm} variant="contained" color="secondary">
          Close
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {mission ? 'Update Mission' : 'Create Mission'}
        </Button>
      </DialogActions>
    </form>
  );
};

export default MissionForm;