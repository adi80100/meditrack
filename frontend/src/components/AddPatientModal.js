import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Alert } from '@mui/material';

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const AddPatientModal = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState({ name: '', dob: '', gender: '', contact: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.dob || !form.gender) {
      setError('Name, Date of Birth, and Gender are required.');
      return;
    }
    setLoading(true);
    try {
      await onAdd(form);
      setForm({ name: '', dob: '', gender: '', contact: '', address: '' });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Patient</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            select
            fullWidth
            required
            margin="normal"
          >
            {genders.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Contact"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Patient'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddPatientModal; 