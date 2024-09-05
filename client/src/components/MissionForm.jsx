import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { createMission, updateMission, fetchRobots } from '../services/api';
import { toast } from 'react-toastify';

const MissionForm = ({ mission, setMissions, missions, closeForm, updateMissionInTable }) => {
  const [name, setName] = useState(mission ? mission.name : '');
  const [description, setDescription] = useState(mission ? mission.description : '');
  const [robot, setRobot] = useState(mission?.robot?._id || ''); 
  const [robots, setRobots] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMission = { name, description, robot: robot || null }; 

    try {
      if (mission) {
        const updatedMission = await updateMission(mission._id, newMission);
        updateMissionInTable(updatedMission.data);
        toast.success('Mission updated successfully!');
      } else {
        const createdMission = await createMission(newMission);
        setMissions([...missions, createdMission.data]);
        toast.success('Mission created successfully!');
      }

      closeForm();
    } catch (error) {
      toast.error('Error creating/updating mission');
      console.error('Error creating/updating mission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Mission Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="robot-select-label">Assign Robot</InputLabel>
        <Select
          labelId="robot-select-label"
          value={robot}
          onChange={(e) => setRobot(e.target.value)}
        >
          <MenuItem value="">None</MenuItem>
          {robots.map((theRobot) => (
            <MenuItem key={theRobot._id} value={theRobot._id}>
              {theRobot.name} - {theRobot.model_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        {mission ? 'Update Mission' : 'Create Mission'}
      </Button>
    </form>
  );
};

export default MissionForm;
