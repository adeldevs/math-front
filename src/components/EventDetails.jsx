// EventDetails.jsx
import React from 'react';
import FeaturedSlider from './FeaturedSlider';
import { EVENTS } from '../data';
import {
  ArrowLeft, ExternalLink, Calendar, MapPin,
  Mail, Phone, Heart, Share2
} from 'lucide-react';

const EventDetails = ({ event, onBack }) => {
  if (!event) return null;
  const featuredEvents = EVENTS.filter(e => e.isFeatured);

  <div className="bg-white min-h-screen relative animate-in fade-in slide-in-from-right-4 duration-300">
    <div className="bg-white min-h-screen relative animate-in fade-in slide-in-from-right-4 duration-300">

      {/* Container for centering on desktop */}
      <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-2xl shadow-gray-200/50 pb-24 md:pb-0">

        {/* Top Nav */}
        <div className="sticky top-0 bg-white z-20 flex items-center justify-between p-4 md:py-6 shadow-sm border-b border-gray-100">
          <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-800" />
            </button>
            <h2 className="font-bold text-lg text-slate-900 hidden md:block">Back to Events</h2>
            <h2 className="font-bold text-lg text-slate-900 md:hidden">Event Details</h2>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <Share2 className="w-5 h-5" />
            {/* Featured Events Slider */}
            <div className="mb-8 mt-4">
              <FeaturedSlider events={featuredEvents} />
            </div>

          </button>
        </div>

        <div className="p-4 md:p-8">
          {/* Main Image - Taller on desktop */}
          <div className="w-full h-56 md:h-96 rounded-2xl overflow-hidden mb-6 shadow-md md:mb-8">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>

          <div className="md:flex md:gap-12">
            {/* Left Column (Main Info) */}
            <div className="md:w-2/3">
              {/* Title Section */}
              <div className="mb-6">
                <div className="flex gap-2 mb-3">
                  {event.tags?.map((tag, i) => (
                    <span key={i} className={`text-xs md:text-sm px-3 py-1 rounded-full font-medium 
                      ${tag === 'Free Entry' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
                  {event.title}
                </h1>

                <div className="space-y-4 text-gray-600 bg-gray-50 p-4 rounded-xl md:bg-transparent md:p-0">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm md:bg-blue-50 md:shadow-none">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-bold text-slate-900">{event.date}</p>
                      <p className="text-xs md:text-sm text-gray-500">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm md:bg-blue-50 md:shadow-none">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm md:text-base font-bold text-slate-900">{event.location}</p>
                      {event.locationShort && <p className="text-xs md:text-sm text-gray-500 mb-1">{event.locationShort}</p>}
                      <a href="#" className="text-xs md:text-sm text-blue-600 font-medium inline-flex items-center hover:underline">
                        View on Google Maps <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm md:bg-blue-50 md:shadow-none w-10 h-10 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">👥</span>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 font-medium">{event.attendees || 0} people registered</p>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-8">
                <section>
                  <h3 className="font-bold text-xl text-slate-900 mb-3">About</h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {event.about || "No description available."}
                  </p>
                </section>

                {event.prizes && (
                  <section>
                    <h3 className="font-bold text-xl text-slate-900 mb-3">Prizes</h3>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                      {event.prizes}
                    </p>
                  </section>
                )}
              </div>
            </div>

            {/* Right Column (Sidebar for Contact/Registration on Desktop) */}
            <div className="mt-8 md:mt-0 md:w-1/3 md:border-l md:border-gray-100 md:pl-8">
              <div className="sticky top-24 space-y-6">
                <section>
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Contact</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    {event.contactEmail && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <a href={`mailto:${event.contactEmail}`} className="hover:text-blue-600 font-medium">{event.contactEmail}</a>
                      </div>
                    )}
                    {event.contactPhone && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <a href={`tel:${event.contactPhone}`} className="hover:text-blue-600 font-medium">{event.contactPhone}</a>
                      </div>
                    )}
                  </div>
                </section>

                {event.externalRegistration && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                    <h4 className="text-blue-800 font-bold mb-2">Registration Method</h4>
                    <p className="text-blue-600 text-sm leading-relaxed">
                      This event uses external registration. You'll be redirected to complete registration on the external platform.
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Organized by</p>
                  <p className="font-bold text-slate-900 text-lg">{event.organizer || "Admin"}</p>
                </div>

                {/* Desktop Action Buttons (Hidden on Mobile) */}
                <div className="hidden md:flex flex-col gap-3 pt-4">
                  <button className="w-full bg-blue-600 text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Register Now
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 text-slate-700 font-bold hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5" />
                    Save for later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Bar (Mobile Only) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-4 z-20">
          <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 text-slate-700 font-medium hover:bg-gray-50 transition-colors">
            <Heart className="w-5 h-5" />
            Like
          </button>
          <button className="flex-[2] bg-blue-600 text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            Register Now
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  </div>
};

export default EventDetails;