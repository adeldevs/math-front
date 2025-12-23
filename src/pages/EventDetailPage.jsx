import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Heart, ExternalLink, Phone, Mail, Share2, Download, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  // Poster carousel state
  const [posterIndex, setPosterIndex] = useState(0);
  const [showFullPoster, setShowFullPoster] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios.get(`https://math-back.up.railway.app/api/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => setEvent(null));
  }, [id]);

  const [isLiked, setIsLiked] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
    if (event && event.registerLink) {
      window.open(event.registerLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (!event) return <div>Event not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button className="p-2 hover:bg-gray-100 rounded-full mr-3 transition-colors" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Event Details</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Banner */}
        <div className="relative h-64 md:h-80 bg-gray-200 rounded-2xl overflow-hidden mb-6 shadow-md">
          <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          {/* Category */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
              {event.category}
            </span>
            {isRegistered && (
              <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-medium">
                Applied
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{event.title}</h1>

          {/* Meta Info Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">{event.date}</p>
                <p className="text-sm text-gray-500">{event.time}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 mr-3 mt-0.5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">{event.location}</p>
                <a href={event.googleMap} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline inline-flex items-center mt-1 font-medium">
                   Open Map <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>


          {/* Brochures */}
          {event.brochures && event.brochures.length > 0 && (
            <div className="mb-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
              <h2 className="text-xl font-bold text-blue-800 mb-2">📄 Brochures</h2>
              <ul className="list-disc pl-5">
                {event.brochures.map((url, idx) => (
                  <li key={idx}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-medium">Brochure {idx+1}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Posters Carousel (robust for all data shapes) */}
          {(() => {
            const posters = event.posterImages || event.posterUrls || event.posters || [];
            if (!Array.isArray(posters) || posters.length === 0) return null;
            // Normalize: each poster is {url, name} or string
            const postersArr = posters.map(p => typeof p === 'string' ? { url: p, name: '' } : p);
            return (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Event Posters</h2>
                <div className="relative bg-gray-50 border border-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  <img
                    src={postersArr[posterIndex]?.url}
                    alt={postersArr[posterIndex]?.name || `Poster ${posterIndex + 1}`}
                    className="w-full h-full object-contain bg-white"
                  />
                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <a
                      href={postersArr[posterIndex]?.url}
                      download={postersArr[posterIndex]?.name || `Poster ${posterIndex + 1}`}
                      className="bg-white/90 hover:bg-white rounded-full p-2 shadow transition-colors"
                      title="Download poster"
                    >
                      <Download className="w-5 h-5 text-gray-700" />
                    </a>
                    <button
                      onClick={() => setShowFullPoster(true)}
                      className="bg-white/90 hover:bg-white rounded-full p-2 shadow transition-colors"
                      title="View fullscreen"
                    >
                      <Maximize2 className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  {postersArr.length > 1 && (
                    <>
                      <button
                        onClick={() => setPosterIndex((prev) => (prev - 1 + postersArr.length) % postersArr.length)}
                        className="absolute top-1/2 -translate-y-1/2 left-2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setPosterIndex((prev) => (prev + 1) % postersArr.length)}
                        className="absolute top-1/2 -translate-y-1/2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
                {postersArr.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {postersArr.map((poster, idx) => (
                      <button
                        key={poster.url || idx}
                        onClick={() => setPosterIndex(idx)}
                        className={`border-2 rounded-md overflow-hidden flex-shrink-0 transition-all ${idx === posterIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                        style={{ width: '100px', height: '100px' }}
                      >
                        <img src={poster.url} alt={poster.name || `Poster ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Speaker Info */}
          {(event.speakerName || event.aboutSpeaker || event.speakerImageUrl) && (
            <div className="mb-8 p-5 bg-green-50 rounded-xl border border-green-100">
              <h2 className="text-xl font-bold text-green-800 mb-2">🎤 Speaker</h2>
              {event.speakerImageUrl && (
                <img src={event.speakerImageUrl} alt={event.speakerName} className="w-24 h-24 object-cover rounded-full border mb-3" />
              )}
              {event.speakerName && <h3 className="text-lg font-bold text-gray-900">{event.speakerName}</h3>}
              {event.aboutSpeaker && <p className="text-gray-700 mt-2">{event.aboutSpeaker}</p>}
            </div>
          )}

          {/* Contact & Registration */}
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact & Registration</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg flex-1">
                <Mail className="w-5 h-5 mr-3 text-blue-600" />
                <span className="text-gray-700 text-sm font-medium">{event.contact}</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg flex-1">
                <ExternalLink className="w-5 h-5 mr-3 text-blue-600" />
                <a href={event.registerLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-medium">Register Here</a>
              </div>
            </div>
            {/* Social Media Links */}
            {event.socialLinks && event.socialLinks.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-bold text-gray-700 mb-2">Social Media</h3>
                <ul className="flex flex-wrap gap-2">
                  {event.socialLinks.map((url, idx) => (
                    <li key={idx}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Link {idx+1}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Action Buttons */}
        <div className="sticky bottom-4 bg-white rounded-xl shadow-xl border border-gray-100 p-4 flex gap-3 z-30">
          <button
            onClick={handleRegister}
            className={`flex-1 font-bold text-lg py-3 rounded-xl transition-transform active:scale-95 flex items-center justify-center shadow-lg shadow-blue-200 bg-blue-600 text-white hover:bg-blue-700`}
          >
            Register Now
            {event.externalRegistration && <ExternalLink className="w-5 h-5 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};