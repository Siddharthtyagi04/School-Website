/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Post } from '../db';
import { Search, Calendar, FileText, Download, User, ArrowRight } from 'lucide-react';

interface NoticesProps {
  posts: Post[];
}

export const Notices: React.FC<NoticesProps> = ({ posts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter posts by search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (id: string, fileName: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Successfully downloaded attachment: ${fileName}`);
    }, 1200);
  };

  return (
    <div id="noticesPage" className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <span className="text-red-750 font-bold uppercase tracking-wider text-xs">COMMUNICATIONS</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Notices & Announcements</h1>
          <p className="text-slate-500 text-xs">Newest announcements from school administrators and class faculty.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search notices..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-transparent transition bg-white"
          />
        </div>
      </div>

      {/* Notices Stream */}
      {filteredPosts.length > 0 ? (
        <div className="relative border-l-2 border-amber-200 pl-4 md:pl-8 space-y-8 py-2">
          {filteredPosts.map((post) => (
            <div key={post.id} className="relative space-y-3 bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition">
              
              {/* Timeline Bullet Accent */}
              <div className="absolute -left-[23px] md:-left-[39px] top-7 w-4 h-4 bg-amber-500 rounded-full border-4 border-white shadow-xs" />
              
              {/* Header Details */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-sm">
                  <Calendar className="w-3.5 h-3.5 text-red-750" />
                  <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 font-medium">
                  <User className="w-3.5 h-3.5 text-indigo-700" />
                  <span>{post.authorName}</span>
                </div>
              </div>

              {/* Title & Body */}
              <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                {post.title}
              </h2>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed text-justify whitespace-pre-line">
                {post.description}
              </p>

              {/* Optional Attachment */}
              {post.attachmentName && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-amber-50/20 px-4 py-3 rounded-lg border border-amber-500/10">
                  <div className="flex items-center gap-2 text-slate-700">
                    <FileText className="w-4 h-4 text-red-700" />
                    <span className="text-xs font-semibold">{post.attachmentName}</span>
                  </div>
                  <button 
                    onClick={() => handleDownload(post.id, post.attachmentName!)}
                    disabled={downloadingId === post.id}
                    className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-1.5 rounded-md text-xs font-bold transition shadow-2xs hover:border-slate-400 disabled:opacity-50"
                  >
                    {downloadingId === post.id ? (
                      <>
                        <div className="w-3 h-3 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-indigo-700" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-sm">No notices match your search criteria. Try a different query.</p>
        </div>
      )}
    </div>
  );
};
