import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import api from '../services/api';
import ScheduleAppointmentModal from '../components/ScheduleAppointmentModal';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments');
        setAppointments(res.data);
      } catch (err) {
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleSchedule = async (data) => {
    try {
      const res = await api.post('/appointments', data);
      setAppointments((prev) => [res.data, ...prev]);
      setSnackbar({ open: true, message: 'Appointment scheduled!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to schedule', severity: 'error' });
      throw err;
    }
  };

  return (
    <Container>
      <Box mt={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" gutterBottom>
            Appointments
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
            Schedule Appointment
          </Button>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Meeting</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt._id}>
                    <TableCell>{appt.patient?.name || appt.patient}</TableCell>
                    <TableCell>{appt.doctor?.name || appt.doctor}</TableCell>
                    <TableCell>{appt.date ? new Date(appt.date).toLocaleDateString() : ''}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.status}</TableCell>
                    <TableCell>
                      {appt.meetLink ? (
                        <Button size="small" variant="outlined" href={appt.meetLink} target="_blank" rel="noopener noreferrer">
                          Join
                        </Button>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <ScheduleAppointmentModal open={modalOpen} onClose={() => setModalOpen(false)} onSchedule={handleSchedule} />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          ContentProps={{
            style: { backgroundColor: snackbar.severity === 'success' ? '#43a047' : '#d32f2f', color: '#fff' },
          }}
        />
      </Box>
    </Container>
  );
};

export default AppointmentsPage; 