/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Post, StaticContent } from '../db';
import { ArrowRight, BookOpen, Calendar, MapPin, Phone, GraduationCap, Award, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';

// Import original school photos
import schoolBuildingImg from '../assets/images/school_building_1783165045771.jpg';
import playgroundImg from '../assets/images/playground_1783165067122.jpg';
import schoolEntranceImg from '../assets/images/school_entrance_1783165105852.jpg';
import principalDeskImg from '../assets/images/principal_desk_1783165084646.jpg';

interface HomeProps {
  staticContent: StaticContent;
  latestPosts: Post[];
  onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ staticContent, latestPosts, onNavigate }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // High-quality photos descriptions matching user inputs
  const slides = [
    {
      title: "Welcome to PKLJSVM School",
      desc: "Premwati Kunji Lal Jain Saraswati Vidhya Mandir School, Saini, Bilaspur.",
      img: schoolBuildingImg,
      caption: "Our Majestic Red Brick Campus Facade with brick walkway."
    },
    {
      title: "Lush Green Sports Ground",
      desc: "Nurturing physical excellence, teamwork, and healthy outdoor activities.",
      img: playgroundImg,
      caption: "Spacious playground equipped with swings, slides, and sports facilities."
    },
    {
      title: "Traditional Welcome Entrance",
      desc: "Invoking custom values under the traditional school system.",
      img: schoolEntranceImg,
      caption: "Brick pathway and welcome arch with green hedges leading to the main entrance."
    }
  ];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div id="homePage" className="space-y-12">
      {/* Hero Slider */}
      <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-xl border border-red-900/10">
        <div className="absolute inset-0 bg-black/45 z-10" />
        <img 
          src={slides[activeSlide].img} 
          alt={slides[activeSlide].title} 
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
          referrerPolicy="no-referrer"
        />
        
        {/* Navigation Arrows */}
        <button 
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Content Overlay */}
        <div className="absolute bottom-12 left-6 right-6 md:left-12 md:right-12 z-20 text-white max-w-2xl space-y-4">
          <span className="inline-block bg-amber-500 text-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
            AFFILIATED TO CBSE / VIDYA BHARATI
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
            {slides[activeSlide].title}
          </h1>
          <p className="text-base md:text-lg text-slate-100 drop-shadow">
            {slides[activeSlide].desc}
          </p>
          <p className="text-xs italic text-amber-300">
            {slides[activeSlide].caption}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button 
              onClick={() => onNavigate('contact')} 
              className="bg-red-750 hover:bg-red-800 text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-md flex items-center gap-2 text-sm"
            >
              Admissions Enquiry <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigate('about')} 
              className="bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 px-6 py-2.5 rounded-lg font-semibold transition backdrop-blur-sm text-sm"
            >
              Explore Our History
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${activeSlide === idx ? 'bg-amber-500 w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Action Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white p-6 rounded-xl shadow-lg border border-indigo-900/30 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Admissions 2026-27</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Registrations are active for Class Nursery to 11. Secure your child's moral and intellectual growth with Vidya Bharati's values.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('contact')}
            className="mt-6 text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-2 text-sm group"
          >
            Apply Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-red-950 to-slate-900 text-white p-6 rounded-xl shadow-lg border border-red-950/30 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Latest Circulars</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Check all recent exam guidelines, holiday notifications, syllabus requirements, and school news published by the administration.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('notices')}
            className="mt-6 text-red-400 hover:text-red-300 font-semibold flex items-center gap-2 text-sm group"
          >
            View Notices <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-xl shadow-lg border border-slate-800 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Homework & Studies</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Stay updated with daily homework, assignments, projects, and learning guides uploaded by assigned class teachers.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('homework')}
            className="mt-6 text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-2 text-sm group"
          >
            Access Homework <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Grid: Welcome Message & Latest News */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Welcome & Principal Desk */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <span className="text-red-750 font-bold tracking-wider text-xs uppercase block">ABOUT PREMWATI KUNJI LAL JAIN SVM</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Igniting Wisdom, Cultivating Culture
            </h2>
            <div className="h-1 w-20 bg-amber-500 rounded" />
            <p className="text-slate-600 leading-relaxed text-sm">
              {staticContent.history}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-lg flex gap-3 items-start">
                <Award className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Vidya Bharati Sanksara</h4>
                  <p className="text-slate-500 text-xs mt-1">Grooming character, moral duty, patriotism, and traditional discipline.</p>
                </div>
              </div>
              <div className="bg-red-50/50 border border-red-150/50 p-4 rounded-lg flex gap-3 items-start">
                <BookOpen className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">CBSE & UP Board Academic Core</h4>
                  <p className="text-slate-500 text-xs mt-1">Excellent classroom learning equipped with state of the art labs and facilities.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Principal's Desk */}
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 space-y-2">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border-2 border-amber-500 shadow-sm bg-slate-100">
                <img 
                  src={principalDeskImg} 
                  alt="Principal Desk" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-center md:text-left">
                <h4 className="font-bold text-slate-900 text-sm">{staticContent.principalName}</h4>
                <p className="text-xs text-amber-700 font-medium">Head of Institution</p>
              </div>
            </div>
            <div className="md:col-span-2 space-y-3">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-wider block">FROM THE PRINCIPAL'S DESK</span>
              <h3 className="text-xl font-bold text-slate-900">Message to Parents & Students</h3>
              <p className="text-slate-600 text-xs italic leading-relaxed">
                "{staticContent.principalMessage}"
              </p>
              <p className="text-slate-500 text-xs mt-2">
                "Our school is located in Saini, Bilaspur, Greater Noida. We welcome parents to visit and experience our serene educational atmosphere."
              </p>
            </div>
          </div>
        </div>

        {/* Announcements Sidebar (Latest News) */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-700" />
                Latest Notices
              </h3>
              <button 
                onClick={() => onNavigate('notices')} 
                className="text-xs text-red-750 font-bold hover:underline"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {latestPosts.slice(0, 4).map((post) => (
                <div 
                  key={post.id}
                  className="bg-white p-4 rounded-lg border border-slate-200 hover:border-amber-400 transition shadow-xs cursor-pointer group"
                  onClick={() => onNavigate('notices')}
                >
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs group-hover:text-red-750 transition line-clamp-1">
                    {post.title}
                  </h4>
                  <p className="text-slate-500 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>Saini, Bilaspur, Greater Noida, UP</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>+91-9871542150</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
