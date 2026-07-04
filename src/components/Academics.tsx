/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, FlaskConical, Laptop, Award, Library, Users, CheckCircle } from 'lucide-react';

export const Academics: React.FC = () => {
  const facilities = [
    {
      title: "Science Laboratories",
      desc: "Fully equipped physics, chemistry, and biology laboratories allowing students to execute hands-on experiments for board examinations.",
      icon: <FlaskConical className="w-6 h-6 text-indigo-600" />
    },
    {
      title: "Computer Center",
      desc: "Modern computer terminal network equipped with high-speed internet enabling software familiarity, coding basics, and digital literacy.",
      icon: <Laptop className="w-6 h-6 text-indigo-600" />
    },
    {
      title: "Spacious Library",
      desc: "A quiet sanctuary containing over 10,000 reference books, encyclopedias, board papers, and journals in Hindi, English, and Sanskrit.",
      icon: <Library className="w-6 h-6 text-indigo-600" />
    },
    {
      title: "Lush Sports Grounds",
      desc: "A wide, grassy sporting field configured for volleyball, cricket, basketball, yoga drills, and standard athletics with full-time physical trainers.",
      icon: <Award className="w-6 h-6 text-indigo-600" />
    }
  ];

  const levels = [
    {
      name: "Primary Section",
      classes: "Nursery to Class 5",
      desc: "Constructing strong pillars of literacy, math, basic science, and morality. Focus is on play-way and value-based learning.",
      features: ["Cognitive Skill Development", "Basic Sanskrit and Shlokas", "Physical Drills and Moral Science", "Intimate student-teacher ratio"]
    },
    {
      name: "Middle School",
      classes: "Class 6 to Class 8",
      desc: "Introducing structural analytical study with scientific foundations, language structures, and social sciences.",
      features: ["Advanced Sanskrit Grammar", "Computer Programming Introduction", "Laboratory Exposure", "Co-curricular Clubs"]
    },
    {
      name: "Secondary Section",
      classes: "Class 9 to Class 10",
      desc: "Rigorous CBSE & UP Board examination training spanning core sciences, mathematics, languages, and computer studies with practical testing.",
      features: ["Core Board Preparation", "Mock Board Assessments", "Competitive Entrance Foundations", "Advanced Laboratory Projects"]
    }
  ];

  return (
    <div id="academicsPage" className="space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-red-750 font-bold uppercase tracking-wider text-xs">ACADEMIC EXCELLENCE</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Curriculum & Facilities
        </h1>
        <div className="h-1.5 w-16 bg-amber-500 mx-auto rounded" />
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
          At Premwati Kunji Lal Jain Saraswati Vidhya Mandir, we maintain an international teaching standard under national educational guidelines.
        </p>
      </div>

      {/* Class Levels */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-red-700" />
          <h2 className="text-2xl font-bold text-slate-900">Academic Segments</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {levels.map((level, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-amber-400 transition">
              <div className="space-y-3">
                <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">{level.classes}</span>
                <h3 className="text-lg font-bold text-slate-900">{level.name}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{level.desc}</p>
              </div>
              <ul className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                {level.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Facilities Section */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-red-700" />
          <h2 className="text-2xl font-bold text-slate-900">Campus Infrastructure & Facilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {facilities.map((fac, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex items-start gap-4">
              <div className="p-3 bg-white rounded-lg shadow-xs border border-slate-200/50 flex-shrink-0">
                {fac.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm md:text-base">{fac.title}</h3>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{fac.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curriculum Board Affiliation Notice */}
      <div className="bg-indigo-950 text-white rounded-2xl p-8 border border-indigo-900 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-bold">Comprehensive Board Exam Preparations</h3>
          <p className="text-indigo-200 text-xs md:text-sm max-w-2xl leading-relaxed">
            Our secondary students excel in both Central Board of Secondary Education (CBSE) and Uttar Pradesh Board curricula. We conduct mock exam assessments, practical evaluations, and remedial classes to guarantee excellent pass rates.
          </p>
        </div>
        <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs tracking-wider uppercase transition flex-shrink-0">
          Enquire Admissions
        </button>
      </div>
    </div>
  );
};
