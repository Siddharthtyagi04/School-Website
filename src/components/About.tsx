/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StaticContent } from '../db';
import { Target, Eye, ShieldCheck, Users, Milestone, Award } from 'lucide-react';

import schoolEntranceImg from '../assets/images/SchoolGate.jpeg';

interface AboutProps {
  staticContent: StaticContent;
}

export const About: React.FC<AboutProps> = ({ staticContent }) => {
  return (
    <div id="aboutPage" className="space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-red-750 font-bold uppercase tracking-wider text-xs">PKLJSVM SCHOOL</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          About Our Institution
        </h1>
        <div className="h-1.5 w-16 bg-amber-500 mx-auto rounded" />
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
          Premwati Kunji Lal Jain Saraswati Vidhya Mandir is a premier institute focused on cultural grounding and superior education.
        </p>
      </div>

      {/* Main Grid: History and Illustration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-700 rounded-lg">
              <Milestone className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Rich History</h2>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm text-justify">
            {staticContent.history}
          </p>
          <div className="bg-slate-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <p className="text-xs text-slate-500 leading-relaxed italic">
              "We strive to keep the flame of cultural values burning bright in the hearts of students, alongside imparting rigorous scientific, logical, and technical modern knowledge."
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-650 to-indigo-900 rounded-2xl transform rotate-2 opacity-10" />
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <img 
              src={schoolEntranceImg} 
              alt="School Campus Entrance Pathway" 
              className="w-full h-auto object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-xs">
              <p className="font-semibold">Saini, Bilaspur Campus</p>
              <p className="text-slate-300">Providing quality education across all levels of school development.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Sacred Mission</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed text-justify">
            {staticContent.mission}
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Pure Vision</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed text-justify">
            {staticContent.vision}
          </p>
        </div>
      </div>

      {/* Trust & Management Details */}
      <div className="bg-gradient-to-r from-red-900/5 to-indigo-900/5 rounded-2xl p-8 border border-red-900/10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Management & Trust</h3>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed text-justify">
            {staticContent.managementDetails}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
              <span className="text-xs text-slate-600">Registered Vidya Bharati educational body governing system.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
              <span className="text-xs text-slate-600">Strict adherence to national and state academic standards.</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-center space-y-4 shadow-xs">
          <div className="text-center space-y-2">
            <Award className="w-10 h-10 text-amber-500 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">Affiliation & Board</h4>
            <p className="text-slate-500 text-xs">
              Affiliated to CBSE Board, New Delhi and UP Board Curriculum systems. Providing education from Nursery up to Class 10 with comprehensive scientific and moral learning.
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg text-center text-xs font-semibold text-slate-700">
            Affiliation No: PKLJSVM-203202
          </div>
        </div>
      </div>
    </div>
  );
};
