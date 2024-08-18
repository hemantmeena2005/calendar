"use client";

import React, { useState, useEffect } from 'react';
import {
  format,
  startOfYear,
  endOfYear,
  addYears,
  subYears,
  isAfter,
  isSameYear,
} from 'date-fns';
import Link from 'next/link';

const categories = ['Work', 'Personal', 'Entertainment'];

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(storedEvents);
  }, []);

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
    <div className="flex justify-between items-center py-4 ">
      <button
        onClick={() => handleYearChange('prev')}
        className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
      >
        Prev
      </button>
      <h2 className="sm:text-3xl text-lg font-bold">{format(currentYear, "yyyy")}</h2>
      <button
        onClick={() => handleYearChange('next')}
        className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
      >
        Next
      </button>
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
      <div key={year} className="mt-4">
        <h2 className="text-lg sm:text-2xl font-bold text-blue-600">Events in {year}</h2>
        {Object.keys(groupedEvents[year]).map((month) => (
          <div key={month} className="mt-2">
            <h3 className="text-base sm:text-xl font-semibold text-gray-800">
              {month} ({groupedEvents[year][month].length} events)
            </h3>
            <ul className="mt-2 space-y-2">
              {groupedEvents[year][month].map((event) => (
                <li key={event.id} className="p-3 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition">
                  <Link href={`/detail/${event.id}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-base sm:text-lg font-medium text-gray-900">{event.title}</span>
                      <span className="text-xs text-gray-500">{event.date}</span>
                    </div>
                  </Link>
                  <p className="text-sm text-gray-700">{event.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-[#f4f3ee] min-h-screen rounded-lg shadow-lg">
      {renderYearHeader()}
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 text-sm font-semibold mb-2">Filter by Category</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
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
