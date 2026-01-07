import React, { useEffect, useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Alert, Box } from '@mui/material';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const ScheduleAppointmentModal = ({ open, onClose, onSchedule }) => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ patient: '', date: '', time: '', reason: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      (async () => {
        try {
          const res = await api.get('/patients');
          setPatients(res.data);
        } catch (e) {
          setError('Failed to load patients');
        }
      })();
    }
  }, [open]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.patient || !form.date || !form.time) {
      setError('Patient, date, and time are required.');
      return;
    }
    setLoading(true);
    try {
      await onSchedule({ ...form, doctor: user?.id });
      setForm({ patient: '', date: '', time: '', reason: '' });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule Appointment</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            select
            label="Patient"
            name="patient"
            value={form.patient}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            {patients.map((p) => (
              <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
            ))}
          </TextField>
          <Box display="flex" gap={2}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Time"
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <TextField
            label="Reason"
            name="reason"
            value={form.reason}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Scheduling...' : 'Schedule'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ScheduleAppointmentModal;
