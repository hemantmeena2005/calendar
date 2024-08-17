"use client";

import React, { useState, useEffect } from 'react';
import {
  format,
  startOfYear,
  endOfYear,
  addYears,
  subYears,
  startOfMonth,
  endOfMonth,
  isAfter,
  isSameMonth,
  isSameYear,
} from 'date-fns';

const categories = ['Work', 'Personal', 'Entertainment'];

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Load events from local storage on component mount
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(storedEvents);
  }, []);

  // Filter events based on category and date range
  useEffect(() => {
    const yearStart = startOfYear(currentYear);
    const yearEnd = endOfYear(currentYear);

    const updatedFilteredEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      const isInYear = isSameYear(eventDate, currentYear);
      const isUpcoming = isAfter(eventDate, new Date());
      const isCategoryMatch = selectedCategory ? event.category === selectedCategory : true;

      return isInYear && isUpcoming && isCategoryMatch;
    });

    setFilteredEvents(updatedFilteredEvents);
  }, [events, selectedCategory, currentYear]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleYearChange = (direction) => {
    setCurrentYear((prevYear) => (direction === 'prev' ? subYears(prevYear, 1) : addYears(prevYear, 1)));
  };

  const renderYearHeader = () => (
    <div className="flex justify-between items-center py-4">
      <button onClick={() => handleYearChange('prev')}>Prev</button>
      <h2 className="text-lg font-bold">{format(currentYear, "yyyy")}</h2>
      <button onClick={() => handleYearChange('next')}>Next</button>
    </div>
  );

  const renderEvents = () => {
    const groupedEvents = filteredEvents.reduce((acc, event) => {
      const eventDate = new Date(event.date);
      const year = format(eventDate, 'yyyy');
      const month = format(eventDate, 'MMMM yyyy');

      if (!acc[year]) {
        acc[year] = {};
      }

      if (!acc[year][month]) {
        acc[year][month] = [];
      }

      acc[year][month].push(event);
      return acc;
    }, {});

    return Object.keys(groupedEvents).map((year) => (
      <div key={year} className="mt-6">
        <h2 className="text-2xl font-bold">Events in {year}</h2>
        {Object.keys(groupedEvents[year]).map((month) => (
          <div key={month} className="mt-4">
            <h3 className="text-xl font-bold">
              {month} ({groupedEvents[year][month].length} events)
            </h3>
            <ul>
              {groupedEvents[year][month].map((event) => (
                <li key={event.id} className="mt-2 p-2 border rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{event.title}</span>
                    <span className="text-sm text-gray-500">{event.date}</span>
                  </div>
                  <p className="text-sm mt-1">{event.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-6">
      {renderYearHeader()}
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Filter by Category</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border rounded p-2"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      {renderEvents()}
    </div>
  );
};

export default ViewEvents;
