import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Add, Edit, Delete, PlayArrow, Visibility } from '@mui/icons-material';
import { fetchMissions, fetchRobots, deleteMission, deleteRobot } from '../services/api';
import MissionForm from './MissionForm';
import RobotForm from './RobotForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [missions, setMissions] = useState([]);
  const [robots, setRobots] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [openMissionDialog, setOpenMissionDialog] = useState(false);
  const [openRobotDialog, setOpenRobotDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getMissions = async () => {
      const response = await fetchMissions();
      setMissions(response.data);
    };

    const getRobots = async () => {
      const response = await fetchRobots();
      setRobots(response.data);
    };

    getMissions();
    getRobots();
  }, []);

  const handleDeleteMission = async (id) => {
    try {
      await deleteMission(id);
      setMissions(missions.filter((mission) => mission._id !== id));
      toast.success('Mission deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete mission.');
    }
  };

  const handleDeleteRobot = async (id) => {
    try {
      await deleteRobot(id);
      setRobots(robots.filter((robot) => robot._id !== id));
      toast.success('Robot deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete robot.');
    }
  };

  const handleEditMission = (mission) => {
    setSelectedMission(mission);
    setOpenMissionDialog(true);
  };

  const handleEditRobot = (robot) => {
    setSelectedRobot(robot);
    setOpenRobotDialog(true);
  };

  const handleViewMissionDetails = (mission) => {
    navigate(`/mission/${mission._id}`);
  };

  const handleTeleoperateRobot = (robotId) => {
    navigate(`/teleoperation/${robotId}`);
  };

  // Aggiorna una missione nella tabella delle missioni dopo la modifica
  const updateMissionInTable = (updatedMission) => {
    setMissions((prevMissions) =>
      prevMissions.map((mission) =>
        mission._id === updatedMission._id ? updatedMission : mission
      )
    );
  };

  return (
    <Container>
      <br />
      {/* Missions Table */}
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '30px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Missions</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />} 
            onClick={() => { setOpenMissionDialog(true); setSelectedMission(null); }}>
            Create New Mission
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Associated Robot</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {missions.map((mission) => (
              <TableRow key={mission._id}>
                <TableCell>{mission.name}</TableCell>
                <TableCell>{mission.description}</TableCell>
                <TableCell>{mission.robot ? mission.robot.name : 'No Robot'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleViewMissionDetails(mission)}>
                    <Visibility />
                  </IconButton>
                  <IconButton color="primary" onClick={() => handleEditMission(mission)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteMission(mission._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
                {console.log(mission)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Robots Table */}
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Robots</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />} 
            onClick={() => { setOpenRobotDialog(true); setSelectedRobot(null); }}>
            Create New Robot
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Position</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {robots.map((robot) => (
              <TableRow key={robot._id}>
                <TableCell>{robot.name}</TableCell>
                <TableCell>{robot.model_name}</TableCell>
                <TableCell>{`(${robot.pose_x}, ${robot.pose_y})`}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEditRobot(robot)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteRobot(robot._id)}>
                    <Delete />
                  </IconButton>
                  <IconButton color="default" onClick={() => handleTeleoperateRobot(robot._id)}>
                    <PlayArrow />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Mission Dialog */}
      <Dialog open={openMissionDialog} onClose={() => setOpenMissionDialog(false)}>
        <DialogTitle>{selectedMission ? 'Edit Mission' : 'Create New Mission'}</DialogTitle>
        <DialogContent>
        <MissionForm 
            mission={selectedMission} 
            setMissions={setMissions} 
            missions={missions} 
            closeForm={() => setOpenMissionDialog(false)} 
            updateMissionInTable={updateMissionInTable} // Passa la funzione di aggiornamento
          />
        </DialogContent>
      </Dialog>

      {/* Robot Dialog */}
      <Dialog open={openRobotDialog} onClose={() => setOpenRobotDialog(false)}>
        <DialogTitle>{selectedRobot ? 'Edit Robot' : 'Create New Robot'}</DialogTitle>
        <DialogContent>
          <RobotForm 
            robot={selectedRobot} 
            setRobots={setRobots} 
            robots={robots} 
            closeForm={() => setOpenRobotDialog(false)} 
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Dashboard;

