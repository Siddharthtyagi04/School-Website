/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HomeworkItem } from '../db';
import { Calendar, BookOpen, Clock, FileText, Download, CheckCircle, Search, HelpCircle } from 'lucide-react';

interface HomeworkProps {
  homework: HomeworkItem[];
}

export const Homework: React.FC<HomeworkProps> = ({ homework }) => {
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Class list
  const classesList = [
    'All', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
  ];

  // Derive unique subject list from homework array
  const subjectsList = ['All', ...Array.from(new Set(homework.map(item => item.subject)))];

  // Filter homework
  const filteredHomework = homework.filter(item => {
    const classMatch = selectedClass === 'All' || item.classLevel === selectedClass;
    const subjectMatch = selectedSubject === 'All' || item.subject === selectedSubject;
    return classMatch && subjectMatch;
  });

  const handleDownload = (id: string, fileName: string, fileUrl?: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      if (fileUrl && fileUrl !== '#') {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(`Successfully downloaded assignment material: ${fileName}`);
      }
    }, 1200);
  };

  const isOverdue = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    return dueDate < today;
  };

  return (
    <div id="homeworkPage" className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <span className="text-red-750 font-bold uppercase tracking-wider text-xs">STUDENT ZONE</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Daily Homework & Portfolios</h1>
        <p className="text-slate-500 text-xs">Public board for parents and students to monitor daily homework assignments. No login required.</p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Select Class</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            {classesList.map(cls => (
              <option key={cls} value={cls}>{cls === 'All' ? 'All Classes' : cls}</option>
            ))}
          </select>
        </div>

        {/* Subject Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Select Subject</label>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            {subjectsList.map(sub => (
              <option key={sub} value={sub}>{sub === 'All' ? 'All Subjects' : sub}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Homework Cards */}
      {filteredHomework.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredHomework.map((item) => {
            const overdue = isOverdue(item.dueDate);
            return (
              <div 
                key={item.id} 
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-sm transition"
              >
                {/* Status Bar */}
                <div className={`px-6 py-2.5 flex items-center justify-between text-xs font-bold ${
                  overdue 
                    ? 'bg-rose-50 text-rose-700 border-b border-rose-100' 
                    : 'bg-emerald-50 text-emerald-800 border-b border-emerald-100'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Due Date: {new Date(item.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-sm uppercase text-[9px] ${
                    overdue ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
                  }`}>
                    {overdue ? 'Past Due' : 'Active'}
                  </span>
                </div>

                {/* Content body */}
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h2>
                    <div className="flex gap-2">
                      <span className="bg-slate-100 text-slate-700 border border-slate-250 px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                        {item.classLevel}
                      </span>
                      <span className="bg-amber-100 text-amber-800 border border-amber-250 px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                        {item.subject}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed text-justify whitespace-pre-line">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-100">
                    <CheckCircle className="w-4 h-4 text-slate-300" />
                    <span>Assigned by: <strong className="text-slate-600 font-semibold">{item.authorName}</strong></span>
                  </div>

                  {/* Optional File download */}
                  {item.fileName && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-slate-700">
                        <FileText className="w-4 h-4 text-red-700" />
                        <span className="text-xs font-semibold">{item.fileName}</span>
                      </div>
                      <button
                        onClick={() => handleDownload(item.id, item.fileName!, item.fileUrl)}
                        disabled={downloadingId === item.id}
                        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5"
                      >
                        {downloadingId === item.id ? (
                          <>
                            <div className="w-3 h-3 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin" />
                            <span>...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-indigo-700" />
                            <span>Download Resource</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-2">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 text-xs md:text-sm">No homework items found matching these selections.</p>
          <p className="text-slate-400 text-[11px]">Select another class or subject using the filter dropdowns above.</p>
        </div>
      )}
    </div>
  );
};
