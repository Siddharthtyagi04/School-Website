/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Image, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Import original school photos
import schoolBuildingImg from '../assets/images/school_building_1783165045771.jpg';
import playgroundImg from '../assets/images/playground_1783165067122.jpg';
import schoolEntranceImg from '../assets/images/school_entrance_1783165105852.jpg';
import principalDeskImg from '../assets/images/principal_desk_1783165084646.jpg';

export const Gallery: React.FC = () => {
  const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null);

  // Photos matching the school assets uploaded by user
  const galleryItems = [
    {
      title: "Main Campus Building",
      category: "Campus Infrastructure",
      img: schoolBuildingImg,
      desc: "Our beautiful multi-story school building styled in vibrant red with white structural highlights and standard classrooms with volleyball net in the forefront."
    },
    {
      title: "Principal Office & Administration",
      category: "Administration",
      img: principalDeskImg,
      desc: "Principal's desk, administrative files, folders, and management office."
    },
    {
      title: "School Entrance Pathway",
      category: "Campus Infrastructure",
      img: schoolEntranceImg,
      desc: "Lush green hedges and brick pathways welcoming students with the 'WELCOME' archway."
    },
    {
      title: "Playground & Sports Field",
      category: "Facilities",
      img: playgroundImg,
      desc: "Our wide grassy student playground configured with swings, slides, and trees."
    },
    {
      title: "Campus Pathway & Building View",
      category: "Campus Infrastructure",
      img: schoolBuildingImg,
      desc: "Serene view of our campus building showing the main entrance brick pathways and beautiful trees."
    },
    {
      title: "Smart Science & Physics Lab",
      category: "Facilities",
      img: schoolEntranceImg,
      desc: "Physics, biology, and chemistry instrumentation workbench used by senior secondary CBSE batches."
    }
  ];

  const handleNext = () => {
    if (activeImageIdx !== null) {
      setActiveImageIdx((activeImageIdx + 1) % galleryItems.length);
    }
  };

  const handlePrev = () => {
    if (activeImageIdx !== null) {
      setActiveImageIdx((activeImageIdx - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  return (
    <div id="galleryPage" className="space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-red-750 font-bold uppercase tracking-wider text-xs">VISUAL JOURNEY</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          School Media Gallery
        </h1>
        <div className="h-1.5 w-16 bg-amber-500 mx-auto rounded" />
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
          Explore campus infrastructure, principal administration, laboratories, and green sports fields of Premwati Kunji Lal Jain Saraswati Vidya Mandir.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item, idx) => (
          <div 
            key={idx}
            className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer"
            onClick={() => setActiveImageIdx(idx)}
          >
            {/* Image Container */}
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
              <span className="absolute top-3 left-3 bg-slate-900/80 text-amber-400 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full backdrop-blur-xs">
                {item.category}
              </span>
            </div>

            {/* Text details */}
            <div className="p-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-red-750 transition">{item.title}</h3>
              <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox / Carousel Overlay */}
      {activeImageIdx !== null && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col justify-between p-4 md:p-8 animate-fade-in">
          {/* Header Controls */}
          <div className="flex items-center justify-between text-white pb-4 border-b border-white/10">
            <div>
              <span className="text-amber-500 text-[10px] font-bold uppercase tracking-widest block">
                {galleryItems[activeImageIdx].category}
              </span>
              <h4 className="font-bold text-base md:text-lg">
                {galleryItems[activeImageIdx].title}
              </h4>
            </div>
            <button 
              onClick={() => setActiveImageIdx(null)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Area (Arrows and Image) */}
          <div className="relative flex-1 flex items-center justify-center max-h-[70vh]">
            <button 
              onClick={handlePrev}
              className="absolute left-0 md:left-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-xs transition z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img 
              src={galleryItems[activeImageIdx].img} 
              alt={galleryItems[activeImageIdx].title} 
              className="max-w-full max-h-[65vh] object-contain rounded-lg border border-white/10 shadow-2xl"
              referrerPolicy="no-referrer"
            />

            <button 
              onClick={handleNext}
              className="absolute right-0 md:right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-xs transition z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Footer Area */}
          <div className="text-center text-white/80 max-w-2xl mx-auto space-y-1 pt-4 border-t border-white/10">
            <p className="text-xs md:text-sm leading-relaxed">
              {galleryItems[activeImageIdx].desc}
            </p>
            <span className="text-[10px] text-white/40 block">
              Image {activeImageIdx + 1} of {galleryItems.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
