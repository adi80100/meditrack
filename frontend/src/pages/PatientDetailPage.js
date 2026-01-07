import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, CircularProgress, Alert, List, ListItem, ListItemText, Chip } from '@mui/material';
import api from '../services/api';
import PatientFileUpload from '../components/PatientFileUpload';

const PatientDetailPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await api.get(`/patients/${id}`);
        setPatient(res.data);
      } catch (err) {
        setError('Failed to load patient details');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handleFileUpload = (newFile) => {
    setPatient((prev) => ({ ...prev, files: [...(prev.files || []), newFile] }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={6}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (!patient) return null;

  return (
    <Container>
      <Box mt={4}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {patient.name}
          </Typography>
          <Typography variant="body1">Gender: {patient.gender}</Typography>
          <Typography variant="body1">Date of Birth: {patient.dob ? new Date(patient.dob).toLocaleDateString() : ''}</Typography>
          <Typography variant="body1">Contact: {patient.contact}</Typography>
          <Typography variant="body1">Address: {patient.address}</Typography>
        </Paper>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Medical History</Typography>
          {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
            <List>
              {patient.medicalHistory.map((item, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No medical history recorded.</Typography>
          )}
        </Paper>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Vitals</Typography>
          {patient.vitals ? (
            <Box>
              <Chip label={`Height: ${patient.vitals.height || '-'} cm`} sx={{ mr: 1, mb: 1 }} />
              <Chip label={`Weight: ${patient.vitals.weight || '-'} kg`} sx={{ mr: 1, mb: 1 }} />
              <Chip label={`BP: ${patient.vitals.bloodPressure || '-'}`} sx={{ mr: 1, mb: 1 }} />
              <Chip label={`Temp: ${patient.vitals.temperature || '-'} °C`} sx={{ mr: 1, mb: 1 }} />
              <Chip label={`Pulse: ${patient.vitals.pulse || '-'} bpm`} sx={{ mr: 1, mb: 1 }} />
            </Box>
          ) : (
            <Typography>No vitals recorded.</Typography>
          )}
        </Paper>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Prescriptions</Typography>
          {patient.prescriptions && patient.prescriptions.length > 0 ? (
            <List>
              {patient.prescriptions.map((pres, idx) => (
                <ListItem key={idx}>
                  <ListItemText
                    primary={`${pres.medication} (${pres.dosage})`}
                    secondary={`Date: ${pres.date ? new Date(pres.date).toLocaleDateString() : ''} | Instructions: ${pres.instructions}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No prescriptions recorded.</Typography>
          )}
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Uploaded Files</Typography>
          <PatientFileUpload patientId={id} onUpload={handleFileUpload} />
          {patient.files && patient.files.length > 0 ? (
            <List>
              {patient.files.map((file, idx) => (
                <ListItem key={idx}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">{file.filename}</a>
                  <Typography variant="caption" sx={{ ml: 2 }}>
                    Uploaded: {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : ''}
                  </Typography>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No files uploaded.</Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default PatientDetailPage; 