import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Switch, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchMission, fetchRobots, assignRobotToMission, removeRobotFromMission } from '../services/api';

const MissionDetail = () => {
  // Extracts mission ID from URL parameters
  const { id } = useParams();

  // State variables to store mission details and available robots
  const [mission, setMission] = useState(null);
  const [robots, setRobots] = useState([]);

  // useNavigate hook for programmatic navigation
  const navigate = useNavigate();

  // Fetches mission details and available robots on component mount and whenever ID changes
  useEffect(() => {
    const getMissionDetails = async () => {
      try {
        // Fetches the mission details for the provided ID
        const missionResponse = await fetchMission(id);
        setMission(missionResponse.data);

        // Fetches all available robots
        const robotsResponse = await fetchRobots();
        setRobots(robotsResponse.data);
      } catch (error) {
        console.error('Error fetching mission details or robots:', error);
        toast.error('Failed to load mission details.');
      }
    };

    getMissionDetails();
  }, [id]);

  // Handles assigning a robot to the mission
  const handleAssignRobot = async (robotId) => {
    try {
      // Calls the API to assign the robot to the mission
      await assignRobotToMission(mission._id, robotId);

      // Refetches the updated mission details with the assigned robot
      const updatedMission = await fetchMission(mission._id);
      setMission(updatedMission.data);

      toast.success('Robot assigned to mission successfully!');
    } catch (error) {
      console.error('Failed to assign robot to mission:', error);
      toast.error('Failed to assign robot to mission.');
    }
  };

  // Handles removing the assigned robot from the mission
  const handleRemoveRobot = async () => {
    try {
      // Calls the API to remove the assigned robot
      const updatedMission = await removeRobotFromMission(id, mission.robot._id);
      setMission(updatedMission.data);

      toast.success('Robot removed from mission successfully!');
    } catch (error) {
      console.error('Failed to remove robot from mission:', error);
      toast.error('Failed to remove robot from mission.');
    }
  };

  // Displays a loading message while fetching data
  if (!mission) return <Typography>Loading...</Typography>;

  return (
    <Container style={{ marginTop: '20px' }}>
      {/* Paper component for mission details section */}
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '30px' }}>
        <Typography variant="h4" gutterBottom>
          Mission Details
        </Typography>
        <Typography variant="h7"><b>Name:</b> {mission.name}</Typography><br />
        <Typography variant="h7"><b>Description:</b> {mission.description}</Typography><br />
        <Typography variant="h7">
          <b>Assigned Robot:</b> {mission.robot ? mission.robot.name : 'No Robot Assigned'}
        </Typography>
      </Paper>

      {/* Paper component for available robots section */}
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          <b>Available Robots</b>
        </Typography>
        <Table>
          {/* Table header with columns for robot name, model, and assign/remove action */}
          <TableHead>
            <TableRow>
              <TableCell>Robot Name</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Assign/Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Maps through available robots and displays them in a table row */}
            {robots.map((robot) => (
              <TableRow key={robot._id}>
                <TableCell>{robot.name}</TableCell>
                <TableCell>{robot.model_name}</TableCell>
                <TableCell>
                  {/* Switch component used to toggle robot assignment */}
                  <Switch
                    checked={mission.robot && mission.robot._id === robot._id}
                    onChange={(e) =>
                      e.target.checked
                        ? handleAssignRobot(robot._id)
                        : handleRemoveRobot(robot._id)
                    }
                    color="primary"
                    inputProps={{ 'aria-label': 'Assign Robot' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Box mt={3} mb={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default MissionDetail;