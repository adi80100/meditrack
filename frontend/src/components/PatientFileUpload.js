import React, { useState } from 'react';
import { Box, Button, LinearProgress, Alert } from '@mui/material';
import api from '../services/api';

const PatientFileUpload = ({ patientId, onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setUploading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Attach file to patient
      await api.put(`/patients/${patientId}`, {
        $push: { files: [{ filename: res.data.filename, url: res.data.url, uploadedAt: new Date() }] },
      });
      setSuccess('File uploaded successfully!');
      setFile(null);
      if (onUpload) onUpload({ filename: res.data.filename, url: res.data.url, uploadedAt: new Date() });
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box mt={2} mb={2}>
      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        style={{ display: 'inline-block', marginRight: 8 }}
      />
      <Button variant="contained" color="primary" onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? 'Uploading...' : 'Upload File'}
      </Button>
      {uploading && <LinearProgress sx={{ mt: 1 }} />}
      {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 1 }}>{success}</Alert>}
    </Box>
  );
};

export default PatientFileUpload; 