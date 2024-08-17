"use client";

import React, { useContext, useState, useEffect } from 'react';
import { EventsContext } from '@/app/context/EventsContext';
import { usePathname, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Add = () => {
    const [obj, setObj] = useState({ id: '', title: '', desc: '', date: '', category: '' });
    const [localEvents, setLocalEvents] = useState([]);
    const pathname = usePathname();
    const router = useRouter();
    const event = useContext(EventsContext);

    // Extract the date from the URL using pathname
    const dateFromUrl = pathname.split('/').pop();

    useEffect(() => {
        // Load events from local storage on component mount
        const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
        setLocalEvents(savedEvents);

        if (dateFromUrl) {
            const selectedDate = new Date(dateFromUrl);

            // Check if the parsed date is valid
            if (!isNaN(selectedDate)) {
                setObj((prevObj) => ({
                    ...prevObj,
                    date: formatDate(selectedDate),
                }));
            } else {
                console.error("Invalid date format:", dateFromUrl);
                toast.error('Invalid date format. Please ensure the date is in YYYY-MM-DD format.');
            }
        }
    }, [dateFromUrl]);

    // Function to format date as YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const generateRandomId = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    const getInput = (name, value) => {
        setObj((prevObj) => ({
            ...prevObj,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensure date is set from params
        if (!obj.date) {
            toast.error('Invalid or missing date.');
            return;
        }

        // Generate a unique ID for the event
        const newEvent = { ...obj, id: generateRandomId() };

        // Add the event to the localEvents array
        const updatedEvents = [...localEvents, newEvent];
        setLocalEvents(updatedEvents);

        // Store the updated events in localStorage
        localStorage.setItem('events', JSON.stringify(updatedEvents));

        // Update the global event context (if needed)
        event.setEvents(updatedEvents);

        toast.success('Event added successfully!');
        setObj({ id: '', title: '', desc: '', date: obj.date, category: '' });

        // Navigate back to the home page or handle as needed
        // router.push('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Add New Event</h1>

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

                <div className="mb-4">
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

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                        Category
                    </label>
                    <select
                        name="category"
                        id="category"
                        value={obj.category}
                        onChange={(e) => getInput(e.target.name, e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Select category</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Submit
                    </button>
                </div>
            </form>

            <ToastContainer />
        </div>
    );
};

export default Add;
