/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Post, SyllabusItem, HomeworkItem, Teacher, ContactSubmission, StaticContent } from '../db';
import { 
  BarChart, FileText, BookOpen, Layers, Users, Mail, Settings, Plus, Edit, Trash2, 
  Check, Save, Clipboard, Calendar, ExternalLink, X, MapPin, Phone, MessageSquare 
} from 'lucide-react';

interface DashboardAdminProps {
  posts: Post[];
  syllabus: SyllabusItem[];
  homework: HomeworkItem[];
  teachers: Teacher[];
  submissions: ContactSubmission[];
  staticContent: StaticContent;
  onUpdatePosts: (posts: Post[]) => void;
  onUpdateSyllabus: (syllabus: SyllabusItem[]) => void;
  onUpdateHomework: (homework: HomeworkItem[]) => void;
  onUpdateTeachers: (teachers: Teacher[]) => void;
  onUpdateSubmissions: (subs: ContactSubmission[]) => void;
  onUpdateStaticContent: (content: StaticContent) => void;
  onLogout: () => void;
  adminName: string;
}

export const DashboardAdmin: React.FC<DashboardAdminProps> = ({
  posts, syllabus, homework, teachers, submissions, staticContent,
  onUpdatePosts, onUpdateSyllabus, onUpdateHomework, onUpdateTeachers, onUpdateSubmissions, onUpdateStaticContent,
  onLogout, adminName
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'posts' | 'syllabus' | 'homework' | 'teachers' | 'submissions' | 'site-editor'>('stats');

  // Generic UI state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states - Post
  const [postForm, setPostForm] = useState({ title: '', description: '', attachmentName: '' });
  // Form states - Syllabus
  const [syllabusForm, setSyllabusForm] = useState({ title: '', classLevel: 'Class 10', subject: '', fileName: '' });
  // Form states - Homework
  const [homeworkForm, setHomeworkForm] = useState({ title: '', classLevel: 'Class 10', subject: '', description: '', dueDate: '', fileName: '' });
  // Form states - Teacher
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', phone: '', subjects: '', classes: '' });
  // Form states - Static Content (instantiated with current values)
  const [siteForm, setSiteForm] = useState<StaticContent>({ ...staticContent });

  // Class & Subject options
  const classesList = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  const resetForms = () => {
    setShowForm(false);
    setEditingId(null);
    setPostForm({ title: '', description: '', attachmentName: '' });
    setSyllabusForm({ title: '', classLevel: 'Class 10', subject: '', fileName: '' });
    setHomeworkForm({ title: '', classLevel: 'Class 10', subject: '', description: '', dueDate: '', fileName: '' });
    setTeacherForm({ name: '', email: '', phone: '', subjects: '', classes: '' });
  };

  // --- CRUD POSTS ---
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = posts.map(p => p.id === editingId ? { 
        ...p, 
        title: postForm.title, 
        description: postForm.description, 
        attachmentName: postForm.attachmentName || undefined,
        attachmentUrl: postForm.attachmentName ? '#' : undefined
      } : p);
      onUpdatePosts(updated);
    } else {
      const newPost: Post = {
        id: 'p_' + Date.now(),
        title: postForm.title,
        description: postForm.description,
        date: new Date().toISOString().split('T')[0],
        attachmentName: postForm.attachmentName || undefined,
        attachmentUrl: postForm.attachmentName ? '#' : undefined,
        authorId: 'admin',
        authorName: 'Admin'
      };
      onUpdatePosts([newPost, ...posts]);
    }
    resetForms();
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      onUpdatePosts(posts.filter(p => p.id !== id));
    }
  };

  const handleEditPostClick = (p: Post) => {
    setEditingId(p.id);
    setPostForm({ title: p.title, description: p.description, attachmentName: p.attachmentName || '' });
    setShowForm(true);
  };

  // --- CRUD SYLLABUS ---
  const handleSaveSyllabus = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = syllabus.map(s => s.id === editingId ? { 
        ...s, 
        title: syllabusForm.title, 
        classLevel: syllabusForm.classLevel, 
        subject: syllabusForm.subject, 
        fileName: syllabusForm.fileName || 'document.pdf' 
      } : s);
      onUpdateSyllabus(updated);
    } else {
      const newItem: SyllabusItem = {
        id: 's_' + Date.now(),
        title: syllabusForm.title,
        classLevel: syllabusForm.classLevel,
        subject: syllabusForm.subject,
        fileName: syllabusForm.fileName || 'syllabus_blueprint.pdf',
        fileUrl: '#',
        authorId: 'admin',
        authorName: 'Admin'
      };
      onUpdateSyllabus([newItem, ...syllabus]);
    }
    resetForms();
  };

  const handleDeleteSyllabus = (id: string) => {
    if (confirm("Are you sure you want to delete this syllabus?")) {
      onUpdateSyllabus(syllabus.filter(s => s.id !== id));
    }
  };

  const handleEditSyllabusClick = (s: SyllabusItem) => {
    setEditingId(s.id);
    setSyllabusForm({ title: s.title, classLevel: s.classLevel, subject: s.subject, fileName: s.fileName });
    setShowForm(true);
  };

  // --- CRUD HOMEWORK ---
  const handleSaveHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = homework.map(h => h.id === editingId ? { 
        ...h, 
        title: homeworkForm.title, 
        classLevel: homeworkForm.classLevel, 
        subject: homeworkForm.subject, 
        description: homeworkForm.description, 
        dueDate: homeworkForm.dueDate, 
        fileName: homeworkForm.fileName || undefined,
        fileUrl: homeworkForm.fileName ? '#' : undefined
      } : h);
      onUpdateHomework(updated);
    } else {
      const newItem: HomeworkItem = {
        id: 'h_' + Date.now(),
        title: homeworkForm.title,
        classLevel: homeworkForm.classLevel,
        subject: homeworkForm.subject,
        description: homeworkForm.description,
        dueDate: homeworkForm.dueDate || new Date().toISOString().split('T')[0],
        fileName: homeworkForm.fileName || undefined,
        fileUrl: homeworkForm.fileName ? '#' : undefined,
        authorId: 'admin',
        authorName: 'Admin'
      };
      onUpdateHomework([newItem, ...homework]);
    }
    resetForms();
  };

  const handleDeleteHomework = (id: string) => {
    if (confirm("Are you sure you want to delete this homework assignment?")) {
      onUpdateHomework(homework.filter(h => h.id !== id));
    }
  };

  const handleEditHomeworkClick = (h: HomeworkItem) => {
    setEditingId(h.id);
    setHomeworkForm({ 
      title: h.title, 
      classLevel: h.classLevel, 
      subject: h.subject, 
      description: h.description, 
      dueDate: h.dueDate, 
      fileName: h.fileName || '' 
    });
    setShowForm(true);
  };

  // --- CRUD TEACHERS ---
  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectsArr = teacherForm.subjects.split(',').map(s => s.trim()).filter(Boolean);
    const classesArr = teacherForm.classes.split(',').map(c => c.trim()).filter(Boolean);

    if (editingId) {
      const updated = teachers.map(t => t.id === editingId ? { 
        ...t, 
        name: teacherForm.name, 
        email: teacherForm.email, 
        phone: teacherForm.phone, 
        subjects: subjectsArr, 
        classes: classesArr 
      } : t);
      onUpdateTeachers(updated);
    } else {
      const newTeacher: Teacher = {
        id: 't_' + Date.now(),
        name: teacherForm.name,
        email: teacherForm.email,
        phone: teacherForm.phone,
        subjects: subjectsArr,
        classes: classesArr
      };
      onUpdateTeachers([...teachers, newTeacher]);
    }
    resetForms();
  };

  const handleDeleteTeacher = (id: string) => {
    if (confirm("Are you sure you want to remove this teacher account? They will lose access to login.")) {
      onUpdateTeachers(teachers.filter(t => t.id !== id));
    }
  };

  const handleEditTeacherClick = (t: Teacher) => {
    setEditingId(t.id);
    setTeacherForm({ 
      name: t.name, 
      email: t.email, 
      phone: t.phone, 
      subjects: t.subjects.join(', '), 
      classes: t.classes.join(', ') 
    });
    setShowForm(true);
  };

  // --- REVIEW SUBMISSIONS ---
  const handleToggleSubStatus = (id: string) => {
    const updated = submissions.map(s => s.id === id ? { 
      ...s, 
      status: (s.status === 'new' ? 'read' : 'new') as 'new' | 'read' 
    } : s);
    onUpdateSubmissions(updated);
  };

  const handleDeleteSub = (id: string) => {
    if (confirm("Are you sure you want to delete this parent inquiry?")) {
      onUpdateSubmissions(submissions.filter(s => s.id !== id));
    }
  };

  // --- SITE EDITOR ---
  const handleSaveSiteStatic = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStaticContent(siteForm);
    alert("Static page details updated successfully! These changes will reflect immediately on the public site.");
  };

  return (
    <div id="adminDashboard" className="space-y-8">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <span className="text-red-750 font-bold uppercase tracking-wider text-xs">ADMINISTRATION CONSOLE</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Namaste, {adminName}</h1>
          <p className="text-slate-500 text-xs">You have full administrative privileges to oversee site content, teachers, and syllabus files.</p>
        </div>
        <button 
          onClick={onLogout}
          className="bg-rose-950 hover:bg-rose-900 text-white font-bold px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition self-start cursor-pointer"
        >
          Logout Session
        </button>
      </div>

      {/* Primary Navigation Sidebar / Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button 
          onClick={() => { setActiveTab('stats'); resetForms(); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'stats' ? 'bg-red-750 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart className="w-4 h-4" />
          <span>General Stats</span>
        </button>

        <button 
          onClick={() => { setActiveTab('posts'); resetForms(); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'posts' ? 'bg-red-750 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Manage Notices</span>
        </button>

        <button 
          onClick={() => { setActiveTab('syllabus'); resetForms(); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'syllabus' ? 'bg-red-750 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Manage Syllabus</span>
        </button>

        <button 
          onClick={() => { setActiveTab('homework'); resetForms(); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'homework' ? 'bg-red-750 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clipboard className="w-4 h-4" />
          <span>Manage Homework</span>
        </button>

        <button 
          onClick={() => { setActiveTab('teachers'); resetForms(); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'teachers' ? 'bg-red-750 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Manage Teachers</span>
        </button>

        <button 
          onClick={() => { setActiveTab('submissions'); resetForms(); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-bold transition cursor-pointer relative ${
            activeTab === 'submissions' ? 'bg-red-750 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Inquiries</span>
          {submissions.filter(s => s.status === 'new').length > 0 && (
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-amber-500 text-slate-950 font-extrabold text-[9px] rounded-full flex items-center justify-center border border-white">
              {submissions.filter(s => s.status === 'new').length}
            </span>
          )}
        </button>

        <button 
          onClick={() => { setActiveTab('site-editor'); resetForms(); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'site-editor' ? 'bg-red-750 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Site Static Editor</span>
        </button>
      </div>

      {/* --- STATS PANEL --- */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-slate-400 text-xs uppercase tracking-wider block">Total Notices</span>
              <span className="text-3xl font-extrabold text-slate-900">{posts.length}</span>
              <p className="text-[10px] text-slate-500">Visible on public stream</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-slate-400 text-xs uppercase tracking-wider block">Syllabus Files</span>
              <span className="text-3xl font-extrabold text-slate-900">{syllabus.length}</span>
              <p className="text-[10px] text-slate-500">Organized by Class level</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-slate-400 text-xs uppercase tracking-wider block">Active Homework</span>
              <span className="text-3xl font-extrabold text-slate-900">{homework.length}</span>
              <p className="text-[10px] text-slate-500">Parent-accessible tasks</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1 col-span-2 md:col-span-1">
              <span className="text-slate-400 text-xs uppercase tracking-wider block">Teacher Staff</span>
              <span className="text-3xl font-extrabold text-slate-900">{teachers.length}</span>
              <p className="text-[10px] text-slate-500">Authorized instructors</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick overview notice */}
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 space-y-3">
              <h4 className="font-bold text-amber-800 text-xs uppercase tracking-widest flex items-center gap-2">
                <Clipboard className="w-4 h-4" />
                Administrative Scope Guidance
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                As an Admin of Premwati Kunji Lal Jain Saraswati Vidya Mandir, your modifications here propagate instantly to the live public pages of the website. 
              </p>
              <p className="text-slate-500 text-[11px]">
                - Try updating the school history or principal message in the <strong>Site Static Editor</strong> tab.<br/>
                - Manage parent feedback submissions and mark inquiries as read.<br/>
                - Add a mock teacher profile and assign them subjects, or log in as a teacher using the help reference card.
              </p>
            </div>

            {/* Submissions Summary */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Mail className="w-4.5 h-4.5 text-indigo-700" />
                Recent Parent Inquiries
              </h4>
              <div className="space-y-2">
                {submissions.slice(0, 2).map(sub => (
                  <div key={sub.id} className="bg-white p-3 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 block">{sub.name}</span>
                      <span className="text-slate-500 text-[10px] line-clamp-1">{sub.message}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-sm uppercase ${
                      sub.status === 'new' ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                ))}
                <button 
                  onClick={() => setActiveTab('submissions')} 
                  className="text-indigo-700 hover:underline font-semibold text-xs block mt-1"
                >
                  View all inquiries ({submissions.length}) →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- NOTICES CONSOLE --- */}
      {activeTab === 'posts' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">School Notices Ledger</h2>
            {!showForm && (
              <button 
                onClick={() => { resetForms(); setShowForm(true); }}
                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wide transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Notice</span>
              </button>
            )}
          </div>

          {showForm ? (
            <form onSubmit={handleSavePost} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h3 className="font-bold text-sm text-slate-800">
                  {editingId ? 'Edit Existing Notice' : 'Compose New Notice Announcement'}
                </h3>
                <button type="button" onClick={resetForms} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">Notice Title *</label>
                <input 
                  type="text" required placeholder="e.g. Winter Vacation Dates 2026-27"
                  value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">Notice Body Description *</label>
                <textarea 
                  rows={4} required placeholder="State details clearly..."
                  value={postForm.description} onChange={e => setPostForm({ ...postForm, description: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">Attached File Name (Optional Mockup)</label>
                <input 
                  type="text" placeholder="e.g. circular_winter_holidays_2026.pdf"
                  value={postForm.attachmentName} onChange={e => setPostForm({ ...postForm, attachmentName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[10px] text-slate-400 block italic">Leave blank if no downloadable document is attached.</span>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="submit" className="bg-red-750 hover:bg-red-800 text-white font-bold px-5 py-2 rounded-lg text-xs uppercase tracking-wide">
                  {editingId ? 'Update Notice' : 'Publish Notice'}
                </button>
                <button type="button" onClick={resetForms} className="bg-white border border-slate-300 text-slate-700 px-5 py-2 rounded-lg text-xs font-semibold">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Date</th>
                    <th className="p-4">Title & Details</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Attachment</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {posts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-4 text-slate-400 font-medium whitespace-nowrap">{p.date}</td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block line-clamp-1">{p.title}</span>
                        <span className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{p.description}</span>
                      </td>
                      <td className="p-4 text-slate-600 font-semibold whitespace-nowrap">{p.authorName}</td>
                      <td className="p-4 text-slate-500 italic">
                        {p.attachmentName ? (
                          <span className="text-red-700 font-semibold flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            {p.attachmentName}
                          </span>
                        ) : 'None'}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="inline-flex gap-1.5">
                          <button onClick={() => handleEditPostClick(p)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeletePost(p.id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- SYLLABUS CONSOLE --- */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Syllabus Outlines Ledger</h2>
            {!showForm && (
              <button 
                onClick={() => { resetForms(); setShowForm(true); }}
                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wide transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Syllabus</span>
              </button>
            )}
          </div>

          {showForm ? (
            <form onSubmit={handleSaveSyllabus} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h3 className="font-bold text-sm text-slate-800">
                  {editingId ? 'Edit Syllabus Document' : 'Upload New Syllabus Document'}
                </h3>
                <button type="button" onClick={resetForms} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">Syllabus Title *</label>
                <input 
                  type="text" required placeholder="e.g. Class 10 Board Physics Theory and Practicals"
                  value={syllabusForm.title} onChange={e => setSyllabusForm({ ...syllabusForm, title: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Class Level *</label>
                  <select 
                    value={syllabusForm.classLevel} onChange={e => setSyllabusForm({ ...syllabusForm, classLevel: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                  >
                    {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Subject *</label>
                  <input 
                    type="text" required placeholder="e.g. Mathematics"
                    value={syllabusForm.subject} onChange={e => setSyllabusForm({ ...syllabusForm, subject: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">File PDF Name *</label>
                <input 
                  type="text" required placeholder="e.g. class_10_physics_blueprint.pdf"
                  value={syllabusForm.fileName} onChange={e => setSyllabusForm({ ...syllabusForm, fileName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="submit" className="bg-red-750 hover:bg-red-800 text-white font-bold px-5 py-2 rounded-lg text-xs uppercase tracking-wide">
                  Save Syllabus
                </button>
                <button type="button" onClick={resetForms} className="bg-white border border-slate-300 text-slate-700 px-5 py-2 rounded-lg text-xs font-semibold">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Class</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Title & Details</th>
                    <th className="p-4">File Name</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {syllabus.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-indigo-700 whitespace-nowrap">{s.classLevel}</td>
                      <td className="p-4 font-semibold text-slate-700 whitespace-nowrap">{s.subject}</td>
                      <td className="p-4 text-slate-900 font-bold">{s.title}</td>
                      <td className="p-4 font-medium text-slate-500 flex items-center gap-1 mt-1">
                        <FileText className="w-3.5 h-3.5 text-red-700" />
                        <span>{s.fileName}</span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="inline-flex gap-1.5">
                          <button onClick={() => handleEditSyllabusClick(s)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteSyllabus(s.id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- HOMEWORK CONSOLE --- */}
      {activeTab === 'homework' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Homework Assignments Ledger</h2>
            {!showForm && (
              <button 
                onClick={() => { resetForms(); setShowForm(true); }}
                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wide transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Assign Homework</span>
              </button>
            )}
          </div>

          {showForm ? (
            <form onSubmit={handleSaveHomework} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h3 className="font-bold text-sm text-slate-800">
                  {editingId ? 'Edit Homework Assignment' : 'Assign New Homework Homework'}
                </h3>
                <button type="button" onClick={resetForms} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">Homework Title *</label>
                <input 
                  type="text" required placeholder="e.g. Quadratic Equations Derivation & Exercises"
                  value={homeworkForm.title} onChange={e => setHomeworkForm({ ...homeworkForm, title: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Class Level *</label>
                  <select 
                    value={homeworkForm.classLevel} onChange={e => setHomeworkForm({ ...homeworkForm, classLevel: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                  >
                    {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Subject *</label>
                  <input 
                    type="text" required placeholder="e.g. Mathematics"
                    value={homeworkForm.subject} onChange={e => setHomeworkForm({ ...homeworkForm, subject: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Due Date *</label>
                  <input 
                    type="date" required 
                    value={homeworkForm.dueDate} onChange={e => setHomeworkForm({ ...homeworkForm, dueDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">Task Instructions / Description *</label>
                <textarea 
                  rows={4} required placeholder="State instructions explicitly..."
                  value={homeworkForm.description} onChange={e => setHomeworkForm({ ...homeworkForm, description: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">Attached Worksheet File Name (Optional)</label>
                <input 
                  type="text" placeholder="e.g. algebra_assignment_worksheet.pdf"
                  value={homeworkForm.fileName} onChange={e => setHomeworkForm({ ...homeworkForm, fileName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="submit" className="bg-red-750 hover:bg-red-800 text-white font-bold px-5 py-2 rounded-lg text-xs uppercase tracking-wide">
                  Assign Homework
                </button>
                <button type="button" onClick={resetForms} className="bg-white border border-slate-300 text-slate-700 px-5 py-2 rounded-lg text-xs font-semibold">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Class & Subject</th>
                    <th className="p-4">Title / Instructions</th>
                    <th className="p-4">Resource</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {homework.map(h => (
                    <tr key={h.id} className="hover:bg-slate-50/50">
                      <td className="p-4 text-rose-750 font-bold whitespace-nowrap flex items-center gap-1.5 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{h.dueDate}</span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="font-bold text-indigo-700 block">{h.classLevel}</span>
                        <span className="text-slate-500 font-medium text-[10px] uppercase tracking-wider block mt-0.5">{h.subject}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-extrabold text-slate-900 block">{h.title}</span>
                        <span className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{h.description}</span>
                      </td>
                      <td className="p-4 text-slate-500 italic whitespace-nowrap">
                        {h.fileName ? (
                          <span className="text-slate-700 font-semibold flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-red-700" />
                            {h.fileName}
                          </span>
                        ) : 'None'}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="inline-flex gap-1.5">
                          <button onClick={() => handleEditHomeworkClick(h)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteHomework(h.id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- TEACHERS CONSOLE --- */}
      {activeTab === 'teachers' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Instructors & Staff Registry</h2>
            {!showForm && (
              <button 
                onClick={() => { resetForms(); setShowForm(true); }}
                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wide transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Teacher Staff</span>
              </button>
            )}
          </div>

          {showForm ? (
            <form onSubmit={handleSaveTeacher} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h3 className="font-bold text-sm text-slate-800">
                  {editingId ? 'Edit Teacher Profile' : 'Register New Teacher Faculty'}
                </h3>
                <button type="button" onClick={resetForms} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Instructor Name *</label>
                  <input 
                    type="text" required placeholder="e.g. Mr. Ramesh Sharma"
                    value={teacherForm.name} onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Email Address *</label>
                  <input 
                    type="email" required placeholder="e.g. ramesh@pkljsvm.com"
                    value={teacherForm.email} onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Contact Phone *</label>
                  <input 
                    type="tel" required placeholder="e.g. 9876543210"
                    value={teacherForm.phone} onChange={e => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Assigned Subjects *</label>
                  <input 
                    type="text" required placeholder="e.g. Mathematics, Physics"
                    value={teacherForm.subjects} onChange={e => setTeacherForm({ ...teacherForm, subjects: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 block">Separated by commas. Scope limits what syllabus/homework they edit.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Assigned Classes *</label>
                  <input 
                    type="text" required placeholder="e.g. Class 9, Class 10, Class 12"
                    value={teacherForm.classes} onChange={e => setTeacherForm({ ...teacherForm, classes: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 block">Separated by commas. Example: Class 10, Class 12</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="submit" className="bg-red-750 hover:bg-red-800 text-white font-bold px-5 py-2 rounded-lg text-xs uppercase tracking-wide">
                  Register Faculty Profile
                </button>
                <button type="button" onClick={resetForms} className="bg-white border border-slate-300 text-slate-700 px-5 py-2 rounded-lg text-xs font-semibold">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Faculty Member</th>
                    <th className="p-4">Assigned Subjects</th>
                    <th className="p-4">Assigned Classes</th>
                    <th className="p-4">Contact Detail</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {teachers.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <span className="font-extrabold text-slate-900 block">{t.name}</span>
                        <span className="text-indigo-700 text-[10px] block mt-0.5">{t.email}</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">
                        <div className="flex flex-wrap gap-1">
                          {t.subjects.map(s => <span key={s} className="bg-slate-100 border border-slate-200 text-[10px] px-2 py-0.5 rounded-sm">{s}</span>)}
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 font-medium">
                        <div className="flex flex-wrap gap-1">
                          {t.classes.map(c => <span key={c} className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] px-2 py-0.5 rounded-sm">{c}</span>)}
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 whitespace-nowrap">📞 {t.phone}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="inline-flex gap-1.5">
                          <button onClick={() => handleEditTeacherClick(t)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteTeacher(t.id)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- SUBMISSIONS INBOX --- */}
      {activeTab === 'submissions' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-700" />
              <span>Parent Admissions Inquiry Inbox</span>
            </h2>
            <span className="text-slate-500 text-xs font-semibold">{submissions.length} total inquiries logged</span>
          </div>

          {submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map(sub => (
                <div 
                  key={sub.id} 
                  className={`p-6 rounded-xl border transition ${
                    sub.status === 'new' 
                      ? 'bg-amber-50/20 border-amber-400/50 shadow-xs' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-slate-900 text-sm block">{sub.name}</span>
                      <span className="text-slate-400 text-[11px]">Submitted Date: {sub.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-sm uppercase text-[9px] font-bold ${
                        sub.status === 'new' ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {sub.status === 'new' ? 'Unresolved' : 'Read'}
                      </span>
                      <span className="text-slate-500 font-medium">📞 {sub.phone}</span>
                      {sub.email && <span className="text-indigo-700 font-medium">✉️ {sub.email}</span>}
                    </div>
                  </div>

                  <p className="text-slate-700 text-xs md:text-sm leading-relaxed whitespace-pre-line text-justify">
                    "{sub.message}"
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleToggleSubStatus(sub.id)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{sub.status === 'new' ? 'Mark Resolved/Read' : 'Mark Unread'}</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteSub(sub.id)}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Enquiry</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-xs">No contact form inquiries are present in the inbox database.</p>
            </div>
          )}
        </div>
      )}

      {/* --- SITE STATIC EDITOR --- */}
      {activeTab === 'site-editor' && (
        <form onSubmit={handleSaveSiteStatic} className="space-y-6 animate-fade-in bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-2xs">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-extrabold text-slate-900 text-lg md:text-xl flex items-center gap-2">
              <Settings className="w-5 h-5 text-red-750" />
              <span>Static Site Information Editor</span>
            </h3>
            <p className="text-slate-500 text-xs">Update critical history, mission statements, contact details, and principal greeting lines instantaneously.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase block">School History Narrative</label>
              <textarea 
                rows={4} required
                value={siteForm.history} onChange={e => setSiteForm({ ...siteForm, history: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">School Mission statement</label>
                <textarea 
                  rows={4} required
                  value={siteForm.mission} onChange={e => setSiteForm({ ...siteForm, mission: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">School Vision statement</label>
                <textarea 
                  rows={4} required
                  value={siteForm.vision} onChange={e => setSiteForm({ ...siteForm, vision: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase block">Management & Trust Details</label>
              <textarea 
                rows={3} required
                value={siteForm.managementDetails} onChange={e => setSiteForm({ ...siteForm, managementDetails: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">Principal Name Greeting</label>
                <input 
                  type="text" required
                  value={siteForm.principalName} onChange={e => setSiteForm({ ...siteForm, principalName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">Principal Message Text</label>
                <textarea 
                  rows={3} required
                  value={siteForm.principalMessage} onChange={e => setSiteForm({ ...siteForm, principalMessage: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold text-slate-700 uppercase block">Phone Numbers Detail</label>
                <input 
                  type="text" required
                  value={siteForm.phone} onChange={e => setSiteForm({ ...siteForm, phone: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold text-slate-700 uppercase block">Admissions Email Detail</label>
                <input 
                  type="text" required
                  value={siteForm.email} onChange={e => setSiteForm({ ...siteForm, email: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold text-slate-700 uppercase block">School Full Address Location</label>
                <input 
                  type="text" required
                  value={siteForm.address} onChange={e => setSiteForm({ ...siteForm, address: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button 
              type="submit"
              className="bg-red-750 hover:bg-red-800 text-white font-bold py-2.5 px-6 rounded-lg text-xs tracking-wider uppercase transition flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes Globally</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
