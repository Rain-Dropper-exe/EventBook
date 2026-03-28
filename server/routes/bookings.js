const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createPaymentIntent, confirmBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');

const router = express.Router();
router.use(auth);

router.post('/create-payment-intent', [
  body('eventId').notEmpty().withMessage('Event ID is required'),
  body('seats').isInt({ min: 1, max: 10 }).withMessage('Seats must be between 1 and 10'),
  validate
], createPaymentIntent);

router.post('/confirm', confirmBooking);
router.get('/my', getMyBookings);
router.delete('/:id/cancel', cancelBooking);

module.exports = router;
