import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = [
  { name: 'Mon', patients: 5, appointments: 3 },
  { name: 'Tue', patients: 8, appointments: 6 },
  { name: 'Wed', patients: 4, appointments: 2 },
  { name: 'Thu', patients: 7, appointments: 5 },
  { name: 'Fri', patients: 6, appointments: 4 },
];

const DashboardPage = () => (
  <Container>
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>
        Welcome to MediTrack Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Total Patients</Typography>
            <Typography variant="h4">120</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Total Appointments</Typography>
            <Typography variant="h4">45</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Active Users</Typography>
            <Typography variant="h4">8</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Overview
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sampleData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#1976d2" name="Patients" />
                <Bar dataKey="appointments" fill="#00bcd4" name="Appointments" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  </Container>
);

export default DashboardPage; 