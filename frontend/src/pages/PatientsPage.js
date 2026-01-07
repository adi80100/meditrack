import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AddPatientModal from '../components/AddPatientModal';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/patients');
      setPatients(res.data);
    } catch (err) {
      setError('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (patient) => {
    try {
      const res = await api.post('/patients', patient);
      setPatients((prev) => [res.data, ...prev]);
      setSnackbar({ open: true, message: 'Patient added successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to add patient', severity: 'error' });
      throw err;
    }
  };

  const handleRowClick = (id) => {
    navigate(`/patients/${id}`);
  };

  return (
    <Container>
      <Box mt={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" gutterBottom>
            Patients
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
            Add Patient
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
                  <TableCell>Name</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Date of Birth</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow
                    key={patient._id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleRowClick(patient._id)}
                  >
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.dob ? new Date(patient.dob).toLocaleDateString() : ''}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <AddPatientModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={handleAddPatient}
        />
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

export default PatientsPage; 