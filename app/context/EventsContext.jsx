"use client"
import React, { createContext, useState, useContext } from 'react';

export const EventsContext = createContext(null);

export const EventsProvider = ({ children }) => {
    const [events, setEvents] = useState([]);

    return (
        <EventsContext.Provider value={{ events ,setEvents}}>
            {children}
        </EventsContext.Provider>
    );
};

export const useEvents = () => useContext(EventsContext);
