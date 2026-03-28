import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  addMonths, 
  subMonths 
} from 'date-fns';
import './AdminCalendarView.css';

const AdminCalendarView = ({ events, onEdit, onDelete }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  // Header days
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const dayEvents = events.filter(e => isSameDay(new Date(e.date), cloneDay));
      
      days.push(
        <div
          className={`col cell ${!isSameMonth(day, monthStart) ? "disabled" : ""}`}
          key={day}
        >
          <span className="number">{format(day, dateFormat)}</span>
          <div className="cell-events">
            {dayEvents.map(event => (
              <div key={event._id} className="cal-event-card">
                <div 
                  className="cal-event-img" 
                  style={{ backgroundImage: `url(${event.image})` }}
                  title={event.title}
                />
                <div className="cal-event-details">
                  <div className="cal-event-title">{event.title}</div>
                  <div className="cal-event-actions">
                    <button onClick={() => onEdit(event)}>Edit</button>
                    <button onClick={() => onDelete(event._id)} style={{color: '#ef4444'}}>Del</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="row" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="admin-calendar-view">
      <div className="header row flex-middle">
        <div className="col col-start">
          <button className="icon-btn" onClick={prevMonth}>
            &#10094; Prev
          </button>
        </div>
        <div className="col col-center">
          <span>{format(currentMonth, "MMMM yyyy")}</span>
        </div>
        <div className="col col-end">
          <button className="icon-btn" onClick={nextMonth}>
            Next &#10095;
          </button>
        </div>
      </div>
      <div className="days row">
        {dayNames.map((d, i) => (
          <div className="col col-center" key={i}>
            {d}
          </div>
        ))}
      </div>
      <div className="body">{rows}</div>
    </div>
  );
};

export default AdminCalendarView;
