const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('event', 'title date time venue image')
      .sort({ createdAt: -1 })
      .limit(50);
      
    // Format notifications for the frontend so it identically matches the previous frontend schema
    const formatted = notifications.map(n => ({
        id: n._id.toString(),
        message: n.message,
        type: n.type,
        read: n.read,
        time: n.createdAt,
        event: n.event
    }));
    res.json({ success: true, data: formatted });
  } catch (err) {
    next(err);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    res.json({ success: true, message: 'All notifications marked read' });
  } catch (err) {
    next(err);
  }
};
