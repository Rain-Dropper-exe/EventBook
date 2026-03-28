const Event = require('../models/Event');
const AppError = require('../utils/AppError');

exports.getAllEvents = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 6 } = req.query;
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category.toLowerCase();
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Promise.all to fetch events and total in parallel
    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ date: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Event.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: events,
      pagination: {
        page: parseInt(page),
        totalPages,
        total
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return next(new AppError('Event not found', 404));
    }
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};
