import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FeaturedSlider = ({ events, onEventClick }) => {
    if (!events || events.length === 0) return null;

    return (
        <div className="relative ml-2 mr-2 max-w-3xl mx-auto h-[220px] sm:h-[300px] md:h-[420px] rounded-2xl shadow-lg bg-gray-900 overflow-hidden group">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                className="h-full"
            >
                {events.map((event) => (
                  <SwiperSlide key={event._id || event.id}>
                    <div
                      className="relative w-full h-full flex items-center justify-center cursor-pointer"
                      onClick={() => onEventClick && onEventClick(event)}
                    >
                            {/* Background Image */}
                            <img
                                src={event.image}
                                alt={event.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Dark Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                            {/* Content */}
                            <div className="absolute bottom-2 left-0 p-4 sm:p-6 text-white w-full z-10">

                                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 leading-tight">
                                    {event.title}
                                </h2>

                                <p className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 mb-2">
                                    <span>📅 {event.date}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>⏰ {event.time}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="truncate">📍 {event.location}</span>
                                </p>

                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom styles for Swiper navigation arrows */}
            <style>{`
        .swiper-pagination-bullet-active {
          background-color: #2563eb !important;
        }
        .swiper-button-next, .swiper-button-prev {
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          color: #2563eb;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          background: #ffffff;
          transform: scale(1.1);
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }
        @media (max-width: 640px) {
          .swiper-button-next, .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
        </div>
    );
};

export default FeaturedSlider;