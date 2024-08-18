"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const DetailPage = () => {
  const pathname = usePathname();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventId = pathname.split("/").pop();
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      const events = JSON.parse(storedEvents);
      const foundEvent = events.find((e) => e.id === eventId);
      setEvent(foundEvent || null);
    }
    setLoading(false);
  }, [pathname]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (!event) {
    return <div className="text-center p-4">Event not found.</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#8a817c] p-4">
      <div className="w-full max-w-sm bg-[#f4f3ee] p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-center">
          {event.title}
        </h1>
        <p className="text-base md:text-lg mb-3 md:mb-4">
          <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-base md:text-lg mb-3 md:mb-4">
          <strong>Category:</strong> {event.category}
        </p>
        <p className="text-base md:text-lg mb-4 md:mb-6">
          <strong>Description:</strong> {event.desc}
        </p>
        <div className="text-center">
          <Link href={`/update/${event.id}`}>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full md:w-auto">
              Update
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
