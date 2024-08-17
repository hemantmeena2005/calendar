"use client";
import { useContext, useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
} from "date-fns";
import { EventsContext } from "@/app/context/EventsContext";
import { useRouter } from 'next/navigation';
import Link from "next/link";

const categoryColors = {
  Work: 'bg-orange-500',
  Personal: 'bg-blue-500',
  Entertainment: 'bg-yellow-500',
  Others: 'bg-green-500',
};

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const { events, setEvents } = useContext(EventsContext);
  const router = useRouter(); // useRouter hook for navigation

  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, [setEvents]);

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const handleEventClick = (eventId) => {
    router.push(`/detail/${eventId}`); // Navigate to the detail page
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center py-4">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        Prev
      </button>
      <h2 className="text-lg font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        Next
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-bold" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-4">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        const eventsForDay = events.filter((event) =>
          isSameDay(new Date(event.date), day)
        );

        days.push(
          <div
            className={`relative p-4 border h-20 cursor-pointer ${
              !isSameMonth(day, monthStart) ? "text-gray-400" : ""
            } ${isSameDay(day, selectedDate) ? "bg-blue-200" : ""}`}
            key={day.toString()}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span className="block">{formattedDate}</span>
            {eventsForDay.length > 0 && (
              <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                {eventsForDay.map((event) => (
                  <div
                    key={event.id}
                    className={`w-3 h-3 rounded-full ${categoryColors[event.category]} cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the day click
                      handleEventClick(event.id); // Navigate to event detail
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const renderSelectedDateEvents = () => {
    if (!selectedDate) {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);

      const eventsForMonth = events.filter((event) =>
        isWithinInterval(new Date(event.date), {
          start: monthStart,
          end: monthEnd,
        })
      );

      return (
        <div className="mt-6">
          <h3 className="text-lg font-bold">
            Events in {format(currentMonth, "MMMM yyyy")}
          </h3>
          {eventsForMonth.length === 0 ? (
            <p>No events for this month.</p>
          ) : (
            <ul>
              {eventsForMonth.map((event) => (
                <li key={event.id} className="mt-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">{event.title}</p>
                    <div>
                      <a
                        href={`/update/${event.id}`}
                        className="text-blue-500 hover:underline ml-4"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-500 hover:underline ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    } else {
      const eventsForSelectedDate = events.filter((event) =>
        isSameDay(new Date(event.date), selectedDate)
      );

      return (
        <div className="mt-6">
          <h3 className="text-lg font-bold">
            Events on {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          {eventsForSelectedDate.length === 0 ? (
            <p>No events for this date.</p>
          ) : (
            <ul>
              {eventsForSelectedDate.map((event) => (
                <li key={event.id} className="mt-2">
                  <div className="flex items-center justify-between">
                    <Link href={`/detail/${event.id}`}>{event.title}</Link>
                    <div>
                      <a
                        href={`/update/${event.id}`}
                        className="text-blue-500 hover:underline ml-4"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-500 hover:underline ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>

      <div className="flex-1">
        <div className="mt-6">
          {selectedDate && (
            <p className="text-lg font-bold">
              Selected Date: {format(selectedDate, "MMMM d, yyyy")}
            </p>
          )}
          <a
            href={
              selectedDate
                ? `/add/${format(selectedDate, "yyyy-MM-dd")}`
                : `/add`
            }
            className="text-blue-500 hover:underline"
          >
            Add Event
          </a>
        </div>

        {renderSelectedDateEvents()}
      </div>
    </div>
  );
}
