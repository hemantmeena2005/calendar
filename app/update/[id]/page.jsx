"use client";

import React, { useState, useEffect } from 'react';
import { useEvents } from '@/app/context/EventsContext';
import { usePathname, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Edit = () => {
    const { events, setEvents } = useEvents();
    const pathname = usePathname();
    const router = useRouter();

    // Extract the event ID from the URL
    const id = pathname.split('/').pop();

    const [obj, setObj] = useState({ title: '', desc: '' });
    const [loadedEvents, setLoadedEvents] = useState([]);

    useEffect(() => {
        // Load events from context or local storage
        let currentEvents = events.length ? events : JSON.parse(localStorage.getItem('events')) || [];

        setLoadedEvents(currentEvents);

        // Find the event by ID
        const eventToEdit = currentEvents.find((event) => event.id === id);

        if (eventToEdit) {
            setObj({ title: eventToEdit.title, desc: eventToEdit.desc });
        } else {
            toast.error('Event not found.');
        }
    }, [events, id]);

    const getInput = (name, value) => {
        setObj((prevObj) => ({
            ...prevObj,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedEvents = loadedEvents.map((event) =>
            event.id === id ? { ...event, ...obj } : event
        );

        // Update the events state and local storage
        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));

        toast.success('Event updated successfully!');
        router.push('/'); // Navigate back to the home page
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Edit Event</h1>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={obj.title}
                        onChange={(e) => getInput(e.target.name, e.target.value)}
                        placeholder="Enter title"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="desc">
                        Event Description
                    </label>
                    <input
                        type="text"
                        name="desc"
                        id="desc"
                        value={obj.desc}
                        onChange={(e) => getInput(e.target.name, e.target.value)}
                        placeholder="Enter event description"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Save Changes
                    </button>
                </div>
            </form>

            <ToastContainer />
        </div>
    );
};

export default Edit;
