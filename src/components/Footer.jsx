import React from 'react';

export const Footer = () => (
  <footer className="w-full bg-gray-900 text-gray-100 py-8 mt-10">
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column */}
      <div>
        <h2 className="text-xl font-bold mb-2">Kannur University</h2>
        <p className="mb-2">Mangattuparamba, Kannur, Kerala 670567</p>
        <p className="mb-2">Email: <a href="mailto:info@kannuruniversity.ac.in" className="underline text-blue-300">info@kannuruniversity.ac.in</a></p>
      </div>
      {/* Right Column */}
      <div>
        <h2 className="text-xl font-bold mb-2">Contact</h2>
        <p className="mb-2">Phone: <a href="tel:+914972715888" className="underline text-blue-300">+91 497 2715888</a></p>
        <p className="mb-2">Email: <a href="mailto:info@kannuruniversity.ac.in" className="underline text-blue-300">info@kannuruniversity.ac.in</a></p>
      </div>
    </div>
    <div className="text-center text-xs text-gray-400 mt-6">&copy; {new Date().getFullYear()} Kannur University. All rights reserved.</div>
  </footer>
);
