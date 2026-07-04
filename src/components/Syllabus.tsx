/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SyllabusItem } from '../db';
import { BookOpen, Filter, FileText, Download, Layers } from 'lucide-react';

interface SyllabusProps {
  syllabus: SyllabusItem[];
}

export const Syllabus: React.FC<SyllabusProps> = ({ syllabus }) => {
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Class list up to Class 10
  const classesList = [
    'All', 'Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
  ];

  // Filter syllabus by class
  const filteredSyllabus = selectedClass === 'All' 
    ? syllabus 
    : syllabus.filter(item => item.classLevel === selectedClass);

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
        alert(`Syllabus downloaded successfully: ${fileName}`);
      }
    }, 1200);
  };

  return (
    <div id="syllabusPage" className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <span className="text-red-750 font-bold uppercase tracking-wider text-xs">CURRICULUM ARCHIVE</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Academic Syllabus & Course Outlines</h1>
        <p className="text-slate-500 text-xs">Download term-wise syllabus breakdowns and board exam marking weightage grids.</p>
      </div>

      {/* Class Selector Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
          <Filter className="w-4 h-4 text-amber-500" />
          <span>Filter by Class:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {classesList.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                selectedClass === cls
                  ? 'bg-red-750 border-red-800 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {filteredSyllabus.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSyllabus.map((item) => (
            <div 
              key={item.id} 
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-400 transition flex flex-col justify-between shadow-2xs group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {item.classLevel}
                  </span>
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                    {item.subject}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base leading-tight group-hover:text-red-750 transition line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Uploaded by: {item.authorName}</span>
                </div>
              </div>

              {/* PDF Action Bar */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-slate-500 overflow-hidden max-w-[60%]">
                  <FileText className="w-4 h-4 text-red-700 flex-shrink-0" />
                  <span className="text-[11px] font-medium truncate">{item.fileName}</span>
                </div>
                <button
                  onClick={() => handleDownload(item.id, item.fileName, item.fileUrl)}
                  disabled={downloadingId === item.id}
                  className="bg-slate-950 hover:bg-slate-900 text-white px-3.5 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5"
                >
                  {downloadingId === item.id ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-xs md:text-sm">No syllabus documents have been uploaded yet for {selectedClass}.</p>
        </div>
      )}
    </div>
  );
};
