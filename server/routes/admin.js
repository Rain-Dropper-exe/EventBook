const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const validate = require('../middleware/validate');
const { getAllEventsAdmin, createEvent, updateEvent, deleteEvent, getAllBookingsAdmin, approveBooking, rejectBooking } = require('../controllers/adminController');

const router = express.Router();
router.use(auth, isAdmin);

router.get('/events', getAllEventsAdmin);

router.post('/events', [
  body('title').notEmpty().withMessage('Title is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('totalSeats').isInt({ min: 1 }).withMessage('Seats must be at least 1'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('category').isIn(['concert', 'conference', 'workshop', 'other']).withMessage('Invalid category'),
  validate
], createEvent);

router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/bookings', getAllBookingsAdmin);
router.patch('/bookings/:id/approve', approveBooking);
router.patch('/bookings/:id/reject', rejectBooking);

module.exports = router;
