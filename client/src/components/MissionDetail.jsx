import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Switch, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchMission, fetchRobots, assignRobotToMission, removeRobotFromMission } from '../services/api';

const MissionDetail = () => {
  const { id } = useParams();
  const [mission, setMission] = useState(null);
  const [robots, setRobots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getMissionDetails = async () => {
      const missionResponse = await fetchMission(id);
      setMission(missionResponse.data);

      const robotsResponse = await fetchRobots();
      setRobots(robotsResponse.data);
    };

    getMissionDetails();
  }, [id]);

  const handleAssignRobot = async (robotId) => {
    try {
      await assignRobotToMission(mission._id, robotId);
      const updatedMission = await fetchMission(mission._id);
      setMission(updatedMission.data);
      toast.success('Robot assigned to mission successfully!');
    } catch (error) {
      console.error('Failed to assign robot to mission:', error);
      toast.error('Failed to assign robot to mission.');
    }
  };

  const handleRemoveRobot = async () => {
    try {
      const updatedMission = await removeRobotFromMission(id, mission.robot._id);
      setMission(updatedMission.data);
      toast.success('Robot removed from mission successfully!');
    } catch (error) {
      console.error('Failed to remove robot from mission:', error);
      toast.error('Failed to remove robot from mission.');
    }
  };

  if (!mission) return <Typography>Loading...</Typography>;

  return (
    <Container style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '30px' }}>
        <Typography variant="h4" gutterBottom>
          Mission Details
        </Typography>
        <Typography variant="h7"><b>Name:</b> {mission.name}</Typography><br/>
        <Typography variant="h7"><b>Description:</b> {mission.description}</Typography><br/>
        <Typography variant="h7"><b>Assigned Robot:</b> {mission.robot ? mission.robot.name : 'No Robot Assigned'}</Typography>
      </Paper>

      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          <b>Available Robots</b>
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Robot Name</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Assign/Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {robots.map((robot) => (
              <TableRow key={robot._id}>
                <TableCell>{robot.name}</TableCell>
                <TableCell>{robot.model_name}</TableCell>
                <TableCell>
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
          color="primary"
          onClick={() => navigate('/')}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default MissionDetail;
