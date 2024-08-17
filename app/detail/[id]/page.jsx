"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const DetailPage = () => {
  const pathname = usePathname(); // Get the current path
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventId = pathname.split('/').pop(); // Extract the ID from the path
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-lg mb-2"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p className="text-lg mb-2"><strong>Category:</strong> {event.category}</p>
      <p className="text-lg mb-4"><strong>Description:</strong> {event.desc}</p>
      <Link href={`/update/${event.id}`}>
        <button className="text-blue-500 hover:underline">Update</button>
      </Link>
    </div>
  );
};

export default DetailPage;
