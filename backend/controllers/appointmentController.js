const Appointment = require('../models/Appointment');
const { createCalendarEventWithMeet } = require('../utils/googleCalendar');

exports.createAppointment = async (req, res) => {
  try {
    const { patient, date, time, reason, status } = req.body;
    if (!patient || !date || !time) {
      return res.status(400).json({ message: 'Patient, date, and time are required' });
    }
    const startISO = new Date(`${date}T${time}:00`).toISOString();
    const endISO = new Date(new Date(startISO).getTime() + 30 * 60 * 1000).toISOString();

    let googleEventId = null;
    let meetLink = null;
    try {
      const { eventId, hangoutLink } = await createCalendarEventWithMeet({
        summary: 'Medical Appointment',
        description: reason || 'Appointment scheduled via MediTrack',
        startISO,
        endISO,
        attendees: [],
      });
      googleEventId = eventId;
      meetLink = hangoutLink;
    } catch (e) {
      console.error('Google Calendar event creation failed:', e?.message || e);
      googleEventId = null;
      meetLink = null;
    }

    const appointment = new Appointment({
      patient,
      doctor: req.user._id,
      date: new Date(date),
      time,
      reason,
      status: status || 'scheduled',
      googleEventId,
      meetLink,
    });
    await appointment.save();
    const populated = await Appointment.findById(appointment._id).populate('patient doctor');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('patient doctor');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('patient doctor');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.doctor) delete update.doctor; // prevent changing doctor from client
    let appointment = await Appointment.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    appointment = await appointment.populate('patient doctor');
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 