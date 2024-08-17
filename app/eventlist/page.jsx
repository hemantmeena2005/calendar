"use client"; // Ensures this component runs on the client side

import React from 'react';
import { useEvents } from '../context/EventsContext';

const EventsList = () => {
    const { events } = useEvents(); // Get the events from context

    return (
        <div>
            <h2>Upcoming Events</h2>
            <ul>
                {events.map((event, index) => (
                    <li key={index}>
                        <h3>{event.title}</h3>
                        <p>{event.desc}</p>
                        <p>{new Date(event.date).toISOString().split('T')[0]}</p> {/* Format the date as YYYY-MM-DD */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventsList;
