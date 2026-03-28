const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/sendEmail');
const { bookingConfirmationEmail, newEventEmail } = require('../utils/emailTemplates');

exports.getAllEventsAdmin = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    const eventsWithCount = await Promise.all(events.map(async event => {
      const bookingCount = await Booking.countDocuments({ event: event._id, status: 'confirmed' });
      return { ...event.toObject(), bookingCount };
    }));
    res.json({ success: true, data: eventsWithCount });
  } catch (err) {
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.user.id,
      availableSeats: req.body.totalSeats
    });
    await event.save();
    
    if (event.isActive) {
      // Find all confirmed bookings
      const allBookings = await Booking.find({ status: 'confirmed' })
        .populate('event')
        .populate('user')

      // Find users who previously booked the SAME category as this new event
      const matchingBookers = allBookings.filter(b =>
        b.event !== null &&
        b.event.category === event.category
      )

      // Unique users only
      const uniqueUsers = []
      const seenIds = new Set()
      matchingBookers.forEach(b => {
        if (b.user && !seenIds.has(b.user._id.toString())) {
          seenIds.add(b.user._id.toString())
          uniqueUsers.push(b.user)
        }
      })

      // Send email to each — non blocking
      uniqueUsers.forEach(user => {
        const emailTemplate = newEventEmail(user, event)
        sendEmail({
          to: user.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html
        })
      })

      console.log(`New ${event.category} notification sent to ${uniqueUsers.length} users`)
    }

    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const existingEvent = await Event.findById(req.params.id);
    if (!existingEvent) return next(new AppError('Event not found.', 404));

    let updateData = { ...req.body };

    // Auto-adjust availableSeats if totalSeats is being modified
    if (updateData.totalSeats !== undefined) {
      const newTotal = Number(updateData.totalSeats);
      const oldTotal = existingEvent.totalSeats;
      const difference = newTotal - oldTotal;

      // Ensure we have a base to apply difference to (it comes back from frontend as old availableSeats)
      let currentAvailable = updateData.availableSeats !== undefined 
          ? Number(updateData.availableSeats) 
          : existingEvent.availableSeats;

      if (difference !== 0) {
        currentAvailable = currentAvailable + difference;
      }
      
      // Ensure constraints
      if (currentAvailable < 0) currentAvailable = 0;
      if (currentAvailable > newTotal) currentAvailable = newTotal;

      updateData.availableSeats = currentAvailable;
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return next(new AppError('Event not found.', 404));
    
    event.isActive = false;
    await event.save();
    res.json({ success: true, message: 'Event deactivated' });
  } catch (err) {
    next(err);
  }
};

exports.getAllBookingsAdmin = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email avatar')
      .populate('event', 'title date time venue image')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

exports.approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user')
      .populate('event');
      
    if (!booking) return next(new AppError('Booking not found', 404));

    if (booking.status !== 'confirmed') {
      if (booking.event) {
        if (booking.event.availableSeats < booking.seats) {
          return next(new AppError('Not enough available seats to approve this booking!', 400));
        }
        booking.event.availableSeats -= booking.seats;
        await booking.event.save();
      }
      booking.status = 'confirmed';
      await booking.save();
      
      // Send confirmation email to user — non blocking
      const emailTemplate = bookingConfirmationEmail(
        booking.user,
        booking.event,
        booking
      );
      sendEmail({
        to: booking.user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html
      });
    }
    
    // Register the cross-device notification into the DB
    await Notification.create({
      user: booking.user,
      event: booking.event._id,
      message: `Your ${booking.event?.title} tickets have been approved!`,
      type: 'booking_confirmed'
    });
    
    res.json({ success: true, message: 'Booking approved', data: booking });
  } catch (err) {
    next(err);
  }
};

exports.rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('event');
    if (!booking) return next(new AppError('Booking not found', 404));
    
    if (booking.status !== 'cancelled') {
        // If we reject a PREVIOUSLY confirmed ticket, refund the seats!
        if (booking.status === 'confirmed') {
           if (booking.event) {
             booking.event.availableSeats += booking.seats;
             await booking.event.save();
           }
        }
        
        booking.status = 'cancelled';
        await booking.save();
    }

    // Register the cross-device notification into the DB
    await Notification.create({
      user: booking.user,
      event: booking.event._id,
      message: `Your ${booking.event?.title} tickets have been rejected.`,
      type: 'booking_cancelled'
    });

    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};
