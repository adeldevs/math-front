import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Upload } from 'lucide-react';
import { uploadToImgbb } from '../utils/imgbbUpload';
import axios from 'axios';

const categories = ["workshop", "seminar"];

const EventFormPage = () => {
  const navigate = useNavigate();
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [googleMap, setGoogleMap] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [banner, setBanner] = useState(null);
  const [speakerName, setSpeakerName] = useState("");
  const [aboutSpeaker, setAboutSpeaker] = useState("");
  const [speakerImage, setSpeakerImage] = useState(null);
  const [contact, setContact] = useState("");
  const [registerLink, setRegisterLink] = useState("");
  const [socialLinks, setSocialLinks] = useState([""]);
  const [brochures, setBrochures] = useState([]);
  const [posters, setPosters] = useState([]);

  // Banner image preview
  const [bannerPreview, setBannerPreview] = useState(null);
  const [speakerImagePreview, setSpeakerImagePreview] = useState(null);

  // Featured event
  const [isFeatured, setIsFeatured] = useState(false);

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBanner(file);
    setBannerPreview(file ? URL.createObjectURL(file) : null);
  };
  const handleSpeakerImageChange = (e) => {
    const file = e.target.files[0];
    setSpeakerImage(file);
    setSpeakerImagePreview(file ? URL.createObjectURL(file) : null);
  };
  const handleBrochuresChange = (e) => {
    setBrochures(Array.from(e.target.files));
  };
  const handlePostersChange = (e) => {
    // Allow adding multiple images at once, appending to existing posters
    const files = Array.from(e.target.files);
    setPosters(prev => [...prev, ...files]);
  };
  const handleSocialLinkChange = (idx, value) => {
    const updated = [...socialLinks];
    updated[idx] = value;
    setSocialLinks(updated);
  };
  const addSocialLink = () => setSocialLinks([...socialLinks, ""]);
  const removeSocialLink = (idx) => setSocialLinks(socialLinks.filter((_, i) => i !== idx));

  // Upload all images to imgbb and return their URLs
  const uploadImages = async () => {
    let bannerUrl = null;
    let speakerImageUrl = null;
    let posterUrls = [];
    if (banner) bannerUrl = await uploadToImgbb(banner);
    if (speakerImage) speakerImageUrl = await uploadToImgbb(speakerImage);
    if (posters.length > 0) {
      posterUrls = await Promise.all(posters.map(file => uploadToImgbb(file)));
    }
    return { bannerUrl, speakerImageUrl, posterUrls };
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Upload images to imgbb
      const { bannerUrl, speakerImageUrl, posterUrls } = await uploadImages();
      // 2. Prepare event data
      const eventData = {
        title,
        description,
        date,
        time,
        location,
        googleMap,
        category,
        bannerUrl,
        speakerName,
        aboutSpeaker,
        speakerImageUrl,
        contact,
        registerLink,
        socialLinks: socialLinks.filter(l => l.trim()),
        brochures: [], // Will handle below
        posterUrls,
        isFeatured,
      };
      // 3. Upload brochures (PDFs) to backend (not imgbb)
      if (brochures.length > 0) {
        const formData = new FormData();
        brochures.forEach((file, i) => formData.append('brochures', file));
        const res = await axios.post('https://math-back.up.railway.app/api/events/upload-brochures', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        eventData.brochures = res.data.urls || [];
      }
      // 4. Send event data to backend
      const res = await axios.post('https://math-back.up.railway.app/api/events', eventData);
      alert('Event created successfully!');
      const eventId = res.data._id || res.data.id;
      if (eventId) {
        navigate(`/event/${eventId}`);
      }
    } catch (err) {
      alert('Failed to create event: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8 font-sans">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto p-4 flex items-center">
          <button className="p-2 hover:bg-gray-100 rounded-lg mr-3">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Create New Event</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <p className="text-gray-500 mb-8 border-b border-gray-100 pb-4">
            Fill in the details below to publish your event.
          </p>
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="space-y-5">
                            <div className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                id="isFeatured"
                                checked={isFeatured}
                                onChange={e => setIsFeatured(e.target.checked)}
                                className="mr-2"
                              />
                              <label htmlFor="isFeatured" className="text-sm font-bold text-gray-700">Featured Event (show in homepage banner)</label>
                            </div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600 rounded-full block"></span>
                Basic Information
              </h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Title *</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date *</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Time *</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Google Map Link *</label>
                <input type="url" value={googleMap} onChange={e => setGoogleMap(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Category *</label>
                <select value={category} onChange={e => setCategory(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image *</label>
                <input type="file" accept="image/*" onChange={handleBannerChange} required className="block" />
                {bannerPreview && <img src={bannerPreview} alt="Banner Preview" className="w-full h-48 object-cover rounded-xl border mt-2" />}
              </div>
            </div>
            {/* Speaker Info */}
            <div className="space-y-5 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-600 rounded-full block"></span>
                Speaker (optional)
              </h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Speaker Name</label>
                <input type="text" value={speakerName} onChange={e => setSpeakerName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">About Speaker</label>
                <textarea rows={2} value={aboutSpeaker} onChange={e => setAboutSpeaker(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Speaker Image</label>
                <input type="file" accept="image/*" onChange={handleSpeakerImageChange} className="block" />
                {speakerImagePreview && <img src={speakerImagePreview} alt="Speaker Preview" className="w-32 h-32 object-cover rounded-full border mt-2" />}
              </div>
            </div>
            {/* Contact & Links */}
            <div className="space-y-5 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-600 rounded-full block"></span>
                Contact & Registration
              </h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contact Information *</label>
                <input type="text" value={contact} onChange={e => setContact(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Register Link *</label>
                <input type="url" value={registerLink} onChange={e => setRegisterLink(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Social Media Links</label>
                {socialLinks.map((link, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input type="url" value={link} onChange={e => handleSocialLinkChange(idx, e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                    <button type="button" onClick={() => removeSocialLink(idx)} className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addSocialLink} className="mt-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Add Link</button>
              </div>
            </div>
            {/* Brochures & Posters */}
            <div className="space-y-5 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-yellow-600 rounded-full block"></span>
                Brochures & Posters
              </h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Brochures (PDF, optional)</label>
                <input type="file" accept="application/pdf" multiple onChange={handleBrochuresChange} className="block" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Posters (Images, optional)</label>
                <input type="file" accept="image/*" multiple onChange={handlePostersChange} className="block" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {posters.map((file, idx) => (
                    <img key={idx} src={URL.createObjectURL(file)} alt="Poster Preview" className="w-24 h-24 object-cover rounded border" />
                  ))}
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-4 pt-8 border-t border-gray-100">
              <button type="submit" className="flex-[2] py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">Publish Event</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { EventFormPage };