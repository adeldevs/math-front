import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, X, Upload, Trash2 } from 'lucide-react';

export default function AdminEventEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`https://math-back.up.railway.app/api/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => setEvent(null));
  }, [id]);

  // imgbb upload helper
  const uploadToImgbb = async (file) => {
    const apiKey = 'c31b5340081dec80f2fdc7b4c878a037';
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data && data.data && data.data.url) return data.data.url;
    throw new Error('Image upload failed');
  };

  // Banner upload
  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadToImgbb(file);
      setBannerUrl(url);
    } catch {
      alert('Banner upload failed');
    }
  };
  // Brochure upload (PDF)
  const handleBrochureUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    try {
      const urls = await Promise.all(files.map(file => uploadToImgbb(file)));
      setBrochures(brochures => [...brochures, ...urls]);
    } catch {
      alert('Brochure upload failed');
    }
  };
  // Poster upload (multiple images)
  const handlePosterUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    try {
      const uploaded = await Promise.all(files.map(async (file) => {
        const url = await uploadToImgbb(file);
        return { url, name: file.name };
      }));
      setPosters(prev => [...prev, ...uploaded]);
    } catch {
      alert('Poster upload failed');
    }
  };

  // Editable states for all fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  // New: Brochure and Posters
  const [brochures, setBrochures] = useState([]); // array of URLs
  const [posters, setPosters] = useState([]); // array of {url, name} or URLs
  const [tags, setTags] = useState('');
  const [attendees, setAttendees] = useState(0);
  const [prizes, setPrizes] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Populate state when event loads
  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || event.about || '');
      setDate(event.date || '');
      setTime(event.time || '');
      setLocation(event.location || '');
      setCategory(event.category || '');
      setBannerUrl(event.bannerUrl || event.image || '');
      setBrochures(event.brochures || (event.brochureUrl ? [event.brochureUrl] : []));
      // Normalize posters to array of {url, name}
      const postersRaw = event.posterImages || event.posterUrls || event.posters || [];
      setPosters(
        postersRaw.map(p =>
          typeof p === 'string' ? { url: p, name: '' } : (p.url ? p : { url: '', name: '' })
        )
      );
      setTags(event.tags ? event.tags.join(', ') : '');
      setAttendees(event.attendees || 0);
      setPrizes(event.prizes || '');
      setContactEmail(event.contactEmail || '');
      setContactPhone(event.contactPhone || '');
      setOrganizer(event.organizer || '');
      setIsFeatured(!!event.isFeatured);
    }
  }, [event]);

  // If creating new event, allow form; if editing, require event to load
  if (id && !event) return <div className="p-8 text-center">Event not found</div>;


  // Save (create or update)
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      date,
      time,
      location,
      category,
      bannerUrl,
      brochures,
      posters,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      attendees,
      prizes,
      contactEmail,
      contactPhone,
      organizer,
      isFeatured
    };
    try {
      if (id) {
        // Update
        await axios.put(`https://math-back.up.railway.app/api/events/${id}`, payload);
        alert('Event updated!');
        navigate(`/event/${id}`);
      } else {
        // Create
        const res = await axios.post('https://math-back.up.railway.app/api/events', payload);
        alert('Event created!');
        const eventId = res.data._id || res.data.id;
        if (eventId) {
          navigate(`/event/${eventId}`);
        } else {
          navigate('/admin/events');
        }
      }
    } catch (err) {
      alert('Failed to save event.');
    }
  };

  // Delete event
  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`https://math-back.up.railway.app/api/events/${id}`);
      alert('Event deleted!');
      navigate('/admin/events');
    } catch {
      alert('Failed to delete event.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8 font-sans">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto p-4 flex items-center">
          <button className="p-2 hover:bg-gray-100 rounded-lg mr-3" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Edit Event</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Delete button (edit mode only) */}
          {id && (
            <div className="flex justify-end mb-2">
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-bold"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" /> Delete Event
              </button>
            </div>
          )}
          <form className="space-y-8" onSubmit={handleSave}>
            {/* Basic Info */}
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-blue-600 rounded-full block"></span>
                Basic Information
              </h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              {/* Banner Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image</label>
                {bannerUrl ? (
                  <div className="mb-3 relative group">
                    <img src={bannerUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => setBannerUrl('')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 hover:border-blue-400 transition-all cursor-pointer group block">
                    <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                    <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Click to upload banner</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 3MB)</p>
                  </label>
                )}
              </div>

              {/* Brochures Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Brochures (PDFs)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {brochures.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Brochure {idx+1}</a>
                      <button
                        type="button"
                        onClick={() => setBrochures(brochures => brochures.filter((_, i) => i !== idx))}
                        className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="border-2 border-dashed border-gray-300 rounded-lg w-32 h-12 flex items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-all cursor-pointer group">
                    <input type="file" accept="application/pdf" multiple className="hidden" onChange={handleBrochureUpload} />
                    <Upload className="w-5 h-5 text-blue-600" />
                  </label>
                </div>
              </div>

              {/* Posters Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Posters (Images)</label>
                <div className="flex flex-wrap gap-3 mb-2">
                  {posters.map((poster, idx) => (
                    <div key={idx} className="relative group">
                      <img src={poster.url} alt={poster.name || `Poster ${idx+1}`} className="w-32 h-20 object-cover rounded-lg border border-gray-200" />
                      <button
                        type="button"
                        onClick={() => setPosters(posters => posters.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="border-2 border-dashed border-gray-300 rounded-lg w-32 h-20 flex items-center justify-center text-center hover:bg-gray-50 hover:border-blue-400 transition-all cursor-pointer group">
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePosterUpload} />
                    <Upload className="w-5 h-5 text-blue-600" />
                  </label>
                </div>
              </div>
            </div>

            {/* Categories, Tags, Featured */}
            <div className="space-y-5 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-600 rounded-full block"></span>
                Categories & Tags
              </h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  id="isFeatured"
                  className="mr-2"
                />
                <label htmlFor="isFeatured" className="text-sm font-bold text-gray-700">Featured Event</label>
              </div>
            </div>

            {/* Extra Data */}
            <div className="space-y-5 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-600 rounded-full block"></span>
                Extra Data
              </h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Attendees</label>
                <input
                  type="number"
                  value={attendees}
                  onChange={e => setAttendees(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Prizes</label>
                <input
                  type="text"
                  value={prizes}
                  onChange={e => setPrizes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Organizer</label>
                <input
                  type="text"
                  value={organizer}
                  onChange={e => setOrganizer(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-8 border-t border-gray-100">
              <button
                type="button"
                className="flex-1 py-3.5 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                onClick={() => alert('Draft saved! (MongoDB integration needed)')}
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="flex-[2] py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
