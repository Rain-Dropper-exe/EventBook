import React, { useState, useRef, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isToday,
  isAfter,
  isBefore,
  startOfToday,
  addYears
} from 'date-fns';
import './CalendarPicker.css';

const CalendarPicker = ({ onRangeChange, initialDateFrom }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(initialDateFrom ? new Date(initialDateFrom) : startOfToday());
  const dropdownRef = useRef(null);

  const [fullRange, setFullRange] = useState(true);
  const rangeText = fullRange && isToday(selectedDate) 
    ? `📅 Calendar`
    : `📅 ${format(selectedDate, 'MMM d')} — ${format(endOfMonth(selectedDate), 'MMM d, yyyy')}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setFullRange(false);
    const from = format(day, 'yyyy-MM-dd');
    const to = format(endOfMonth(day), 'yyyy-MM-dd');
    onRangeChange(from, to);
    setIsOpen(false);
  };

  const handleToday = (e) => {
    e.stopPropagation();
    const today = startOfToday();
    setSelectedDate(today);
    setCurrentMonth(today);
    setFullRange(true);
    const from = format(today, 'yyyy-MM-dd');
    const to = format(addYears(today, 1), 'yyyy-MM-dd');
    onRangeChange(from, to);
    setIsOpen(false);
  };

  const renderHeader = () => {
    return (
      <div className="cal-header">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>&#10094;</button>
        <span>{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>&#10095;</button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return (
      <div className="cal-days-grid">
        {days.map((day, i) => (
          <div key={i} className="cal-day-label">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <div
            key={day}
            className={`cal-cell ${
              !isSameMonth(day, monthStart)
                ? 'disabled'
                : isSameDay(day, selectedDate)
                ? 'selected'
                : isToday(day)
                ? 'today'
                : ''
            }`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span className="number">{format(day, 'd')}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="cal-row" key={day}>
          {days}
        </div>
      );
      days = [];
    }

    return <div className="cal-body">{rows}</div>;
  };

  return (
    <div className="calendar-picker-wrapper" ref={dropdownRef}>
      <div className="cal-trigger-area">
        <button className="btn-today" onClick={handleToday}>All from today</button>
        <div className={`cal-toggle-text ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
          {rangeText} <span className="chevron"></span>
        </div>
      </div>

      {isOpen && (
        <div className="cal-dropdown">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
