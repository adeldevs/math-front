import React from 'react';
import { BannerSlider } from '../components/BannerSlider';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { EventCard } from '../components/EventCard.jsx';
import { Footer } from '../components/Footer';
import axios from 'axios';
import logo from '../assets/logo.png';
import pmusha from '../assets/pm-usha.png';

export const HomePage = () => {
  const [events, setEvents] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    axios.get('https://math-back.up.railway.app/api/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  const featuredEvents = events.filter(e => e.isFeatured);
  const workshopEvents = events.filter(e => e.category === 'workshop');
  const seminarEvents = events.filter(e => e.category === 'seminar');

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };


  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-white to-white-100 text-white p-3 shadow-lg sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <img src={logo} alt="Campus Events" className=" w-[20vh]" />
          <img src={pmusha} alt="Campus Events" className=" w-[10vh]" />
        </div>
      </div>

      <div className="w-full mt-6 px-0">
        <BannerSlider events={featuredEvents} onEventClick={handleEventClick} />
      </div>

      <div className="w-full max-w-6xl mx-auto p-4" style={{ marginTop: '1.5rem' }}>
        {/* Section 1: Workshops */}
        <div style={{ marginBottom: '3vh' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900"># Workshops</h2>
          </div>
          {/* Horizontal Scroll Container */}
          <div className="flex overflow-x-auto gap-5 scrollbar-hide snap-x snap-mandatory scroll-smooth">
            {workshopEvents.map((event) => (
              <div key={event._id || event.id} className="flex-shrink-0 w-[320px] h-[420px] snap-start">
                <EventCard event={event} onClick={() => handleEventClick(event._id || event.id)} />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Seminars */}
        <div>
          <div className="flex items-center justify-between mb-4 mt-[-7vh]">
            <h2 className="text-xl font-bold text-gray-900"># Seminars</h2>
          </div>
          <div className="flex overflow-x-auto gap-5 scrollbar-hide snap-x snap-mandatory scroll-smooth">
            {seminarEvents.map((event) => (
              <div key={event._id || event.id} className="flex-shrink-0 w-[320px] h-[420px] snap-start">
                <EventCard event={event} onClick={() => handleEventClick(event._id || event.id)} />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CSS for hiding scrollbar but keeping functionality */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <Footer />
    </div>
  );
};