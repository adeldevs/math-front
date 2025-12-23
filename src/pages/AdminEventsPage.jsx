import React, { useState } from 'react';
import { ArrowLeft, Plus, Calendar, Trash2 } from 'lucide-react';
import { EventCard } from '../components/EventCard.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminEventsPage = () => {
  const [allEvents, setAllEvents] = React.useState([]);
  const navigate = useNavigate();


  const fetchEvents = () => {
    axios.get('http://localhost:5000/api/events')
      .then(res => setAllEvents(res.data))
      .catch(err => console.error(err));
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  // Delete event handler
  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}`);
      setAllEvents(allEvents.filter(ev => (ev._id || ev.id) !== eventId));
      // Optionally, refetch from server:
      // fetchEvents();
    } catch (err) {
      alert('Failed to delete event.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
            </div>
            <button
              className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-medium shadow-lg shadow-blue-100"
              onClick={() => navigate('/admin/events/new')}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Event
            </button>
          </div>

          {/* No filter tabs */}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4">
        {allEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-1">No events found</h3>
            <p className="text-gray-500 mb-6 text-sm">There are no events yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allEvents.map((event) => (
              <div key={event._id || event.id} className="relative group">
                <EventCard event={event} onClick={() => navigate(`/admin/events/edit/${event._id || event.id}`)} />
                {/* Edit Overlay */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors rounded-lg pointer-events-none" />
                {/* Delete Button */}
                <button
                  className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow hover:bg-red-100 transition-colors"
                  title="Delete Event"
                  onClick={e => { e.stopPropagation(); handleDelete(event._id || event.id); }}
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventsPage;