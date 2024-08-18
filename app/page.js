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
  isToday,
} from "date-fns";
import { EventsContext } from "@/app/context/EventsContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

const categoryColors = {
  Work: "bg-orange-500",
  Personal: "bg-blue-500",
  Entertainment: "bg-yellow-500",
  Others: "bg-green-500",
};

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const { events, setEvents } = useContext(EventsContext);
  const router = useRouter();

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
    router.push(`/detail/${eventId}`);
  };

  const handleDeleteEvent = (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (confirmDelete) {
      const updatedEvents = events.filter((event) => event.id !== eventId);
      setEvents(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));
      toast.success("Event deleted successfully!");
    }
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center py-4">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="px-3 py-1 bg-[#f4f3ee] rounded hover:bg-gray-300"
      >
        Prev
      </button>
      <h2 className="text-lg font-bold text-white ">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="px-3 py-1 bg-[#f4f3ee] rounded hover:bg-gray-300"
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
    const today = new Date();

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
            className={`relative p-4 border h-15 md:h-20 lg:h-15 cursor-pointer ${
              !isSameMonth(day, monthStart) ? "text-gray-400" : ""
            } ${isSameDay(day, selectedDate) ? "bg-blue-200" : ""} ${
              isToday(day) ? "bg-green-200" : ""
            }`}
            key={day.toString()}
            onClick={() => handleDateClick(cloneDay)}
          >
            <span className="block">{formattedDate}</span>
            {eventsForDay.length > 0 && (
              <div className="absolute bottom-2 right-2 md:bottom-2 md:left-2 flex gap-1">
                {eventsForDay.slice(0, 1).map((event) => (
                  <div
                    key={event.id}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${
                      categoryColors[event.category]
                    } cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event.id);
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
        <div className="mt-6 p-3 ">
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
                    <p className="text-xl text-[#8a817c]  ">{event.title}</p>
                    <div>
                      <a
                        href={`/update/${event.id}`}
                        className="text-blue-500  hover:underline ml-4"
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
        <div className="mt-6  ">
          <h3 className="text-lg font-bold">
            Events on {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          {eventsForSelectedDate.length === 0 ? (
            <p>No events for this date.</p>
          ) : (
            <ul>
              {eventsForSelectedDate.map((event) => (
                <li key={event.id} className="mt-2 ">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/detail/${event.id}`}
                      className="text-[#8a817c] hover:text-black text-xl"
                    >
                      {event.title}
                    </Link>
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
    <div className="container bg-[#e0afa0]  min-h-screen mx-auto p-4 flex flex-col md:flex-row gap-6">
      <div className="flex-1 bg-[#463f3a] h-full p-4 rounded-md">
        {renderHeader()}
        <div className="bg-[#f4f3ee] p-2 rounded-lg">
          {renderDays()}
          {renderCells()}
        </div>
      </div>

      <div className="flex-1 bg-[#f4f3ee] p-4 h-[80vh] rounded-md">
        <div className="mb-4">
          {selectedDate && (
            <p className="text-2xl font-bold text-center">
              {format(selectedDate, "MMMM d, yyyy")}
            </p>
          )}
          <a
            href={
              selectedDate
                ? `/add/${format(selectedDate, "yyyy-MM-dd")}`
                : `/add`
            }
            className="text-blue-500 text-xl  hover:underline block text-center"
          >
            Add Event
          </a>
        </div>

        {renderSelectedDateEvents()}
      </div>
      <ToastContainer />
    </div>
  );
}
