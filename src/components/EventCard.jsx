import React, { useState } from 'react';
import { Heart, MapPin, Calendar, Users } from 'lucide-react';

export const EventCard = ({ event, onClick }) => {
  const [liked, setLiked] = useState(false);

  // Helper to format date purely for UI
  const formatDate = (dateStr, timeStr) => {
    // Fallback if date is invalid
    if (!dateStr) return `${timeStr}`;
    const date = new Date(dateStr);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} • ${timeStr}`;
  };


  return (
    <div
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow h-[360px] flex flex-col border border-gray-100"
      onClick={onClick}
    >
      {/* Banner Image */}
      <div className="relative h-44 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden flex-shrink-0">
        {event.bannerUrl || event.image ? (
          <img
            src={event.bannerUrl || event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white text-xl font-bold">
            {event.title?.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Date & Time */}
        <div className="flex items-center text-xs text-gray-600 mb-2">
          <Calendar className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
          <span className="truncate">{formatDate(event.date, event.time)}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">{event.title}</h3>

        {/* Location */}
        <div className="flex items-start text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        {/* Category & Stats */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {Array.isArray(event.tags) && event.tags.length > 0 && event.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium truncate max-w-[60%]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};