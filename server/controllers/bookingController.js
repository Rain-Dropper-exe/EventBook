const stripe = require('stripe')(require('../config/config').stripe.secretKey);
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const AppError = require('../utils/AppError');

exports.createPaymentIntent = async (req, res, next) => {
  // Bypassed for testing
  res.json({ success: true, clientSecret: 'mock_secret' });
};

exports.confirmBooking = async (req, res, next) => {
  try {
    const { eventId, seats } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return next(new AppError('Event not found.', 404));

    if (event.availableSeats < seats) {
      return next(new AppError('Not enough seats available.', 400));
    }

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      seats: seats,
      totalAmount: (event.price * seats),
      stripePaymentIntentId: 'mock_tx_' + Date.now(),
      status: 'pending' // Send to Admin Approvals Queue instead of instant confirmation
    });

    await booking.save();

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event', 'title date time venue image')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!booking) return next(new AppError('Booking not found.', 404));
    if (booking.status === 'cancelled') return next(new AppError('Booking already cancelled.', 400));

    if (booking.status === 'confirmed') {
      const event = await Event.findById(booking.event);
      if (event) {
        event.availableSeats += booking.seats;
        await event.save();
      }
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};
