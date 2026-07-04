/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Post, SyllabusItem, HomeworkItem, Teacher, ContactSubmission, StaticContent, VisitorLog, SchoolDB } from '../db';
import { 
  BarChart, FileText, BookOpen, Layers, Users, Mail, Settings, Plus, Edit, Trash2, 
  Check, Save, Clipboard, Calendar, ExternalLink, X, MapPin, Phone, MessageSquare,
  Eye, Globe, Clock, Laptop, RefreshCw, Filter, Search, ArrowUpRight, Activity
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
  const [activeTab, setActiveTab] = useState<'stats' | 'posts' | 'syllabus' | 'homework' | 'teachers' | 'submissions' | 'site-editor' | 'visitors'>('stats');

  // Visitor states
  const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>(() => SchoolDB.getVisitorLogs());
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDevice, setFilterDevice] = useState<string>('all');
  const [filterPage, setFilterPage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [simPage, setSimPage] = useState<string>('Home');
  const [simType, setSimType] = useState<'Parent' | 'Student' | 'Teacher' | 'Guest' | 'Prospective Student'>('Parent');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simSuccess, setSimSuccess] = useState<string>('');

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
  const classesList = ['Nursery', 'KG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

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
          onClick={() => { setActiveTab('visitors'); resetForms(); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'visitors' ? 'bg-red-750 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Visitor Analytics</span>
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
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-slate-400 text-xs uppercase tracking-wider block">Teacher Staff</span>
              <span className="text-3xl font-extrabold text-slate-900">{teachers.length}</span>
              <p className="text-[10px] text-slate-500">Authorized instructors</p>
            </div>
            <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-200 shadow-2xs space-y-1 col-span-2 lg:col-span-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-slate-500 text-xs uppercase tracking-wider block">Site Page Views</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Activity className="w-2.5 h-2.5" />
                    Live
                  </span>
                </div>
                <span className="text-3xl font-extrabold text-red-800">{visitorLogs.length}</span>
              </div>
              <button 
                onClick={() => setActiveTab('visitors')}
                className="text-[10px] text-red-750 font-bold hover:underline flex items-center gap-0.5 mt-2 text-left"
              >
                <span>View Analytics Tab</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
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
                    type="text" required placeholder="e.g. Class 9, Class 10, Nursery, KG"
                    value={teacherForm.classes} onChange={e => setTeacherForm({ ...teacherForm, classes: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-slate-400 block">Separated by commas. Example: Class 10, Nursery, KG</span>
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

      {/* --- VISITOR ANALYTICS PANEL --- */}
      {activeTab === 'visitors' && (() => {
        // Compute statistics
        const totalVisitsCount = visitorLogs.length;
        const uniqueUsersCount = new Set(visitorLogs.map(l => l.visitorId)).size;
        
        const totalDuration = visitorLogs.reduce((acc, curr) => acc + curr.durationSeconds, 0);
        const avgDurationSecs = totalVisitsCount ? Math.round(totalDuration / totalVisitsCount) : 0;
        const avgDurationMinSec = `${Math.floor(avgDurationSecs / 60)}m ${avgDurationSecs % 60}s`;

        const uniqueLocationsCount = new Set(visitorLogs.map(l => l.location)).size;

        // 7-day trend
        const dates7 = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const trendData = dates7.map(date => {
          const displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const count = visitorLogs.filter(l => l.date === date).length;
          return { date, displayDate, count };
        });

        const maxTrendVal = Math.max(...trendData.map(t => t.count), 1);

        // Visitor types breakdown
        const visitorRolesList = ['Parent', 'Student', 'Teacher', 'Guest', 'Prospective Student'] as const;
        const roleColors: Record<string, string> = {
          'Parent': 'bg-red-750',
          'Student': 'bg-indigo-600',
          'Teacher': 'bg-emerald-600',
          'Guest': 'bg-slate-500',
          'Prospective Student': 'bg-amber-500'
        };
        const roleTextColors: Record<string, string> = {
          'Parent': 'text-red-750',
          'Student': 'text-indigo-600',
          'Teacher': 'text-emerald-600',
          'Guest': 'text-slate-500',
          'Prospective Student': 'text-amber-500'
        };
        const roleBadgeColors: Record<string, string> = {
          'Parent': 'bg-red-50 text-red-750 border-red-200/50',
          'Student': 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
          'Teacher': 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
          'Guest': 'bg-slate-50 text-slate-700 border-slate-200/50',
          'Prospective Student': 'bg-amber-50 text-amber-700 border-amber-200/50'
        };

        const roleCounts = visitorRolesList.map(role => {
          const count = visitorLogs.filter(l => l.visitorType === role).length;
          const pct = totalVisitsCount ? Math.round((count / totalVisitsCount) * 100) : 0;
          return { role, count, pct };
        }).sort((a, b) => b.count - a.count);

        // Device breakdown
        const deviceTypesList = ['Mobile', 'Desktop', 'Tablet'] as const;
        const deviceColors: Record<string, string> = {
          'Mobile': 'bg-purple-600',
          'Desktop': 'bg-sky-600',
          'Tablet': 'bg-amber-500'
        };
        const deviceCounts = deviceTypesList.map(dev => {
          const count = visitorLogs.filter(l => l.device === dev).length;
          const pct = totalVisitsCount ? Math.round((count / totalVisitsCount) * 100) : 0;
          return { dev, count, pct };
        }).sort((a, b) => b.count - a.count);

        // Top Pages
        const pageCountsMap: Record<string, number> = {};
        visitorLogs.forEach(l => {
          pageCountsMap[l.page] = (pageCountsMap[l.page] || 0) + 1;
        });
        const topPagesList = Object.entries(pageCountsMap)
          .map(([name, count]) => ({
            name,
            count,
            pct: totalVisitsCount ? Math.round((count / totalVisitsCount) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count);

        // Unique Pages List for dropdown filters
        const uniquePagesList = Array.from(new Set(visitorLogs.map(l => l.page)));

        // Top Referrers
        const referrerCountsMap: Record<string, number> = {};
        visitorLogs.forEach(l => {
          referrerCountsMap[l.referrer] = (referrerCountsMap[l.referrer] || 0) + 1;
        });
        const topReferrersList = Object.entries(referrerCountsMap)
          .map(([name, count]) => ({
            name,
            count,
            pct: totalVisitsCount ? Math.round((count / totalVisitsCount) * 100) : 0
          }))
          .sort((a, b) => b.count - a.count);

        // Filtering
        const filteredLogsList = visitorLogs.filter(l => {
          const matchType = filterType === 'all' || l.visitorType === filterType;
          const matchDevice = filterDevice === 'all' || l.device === filterDevice;
          const matchPage = filterPage === 'all' || l.page === filterPage;
          
          const query = searchQuery.toLowerCase().trim();
          const matchSearch = !query ? true : (
            l.visitorId.toLowerCase().includes(query) ||
            l.location.toLowerCase().includes(query) ||
            l.referrer.toLowerCase().includes(query) ||
            l.page.toLowerCase().includes(query) ||
            l.visitorType.toLowerCase().includes(query) ||
            l.date.includes(query)
          );
          return matchType && matchDevice && matchPage && matchSearch;
        });

        // Pagination
        const itemsPerPage = 12;
        const totalPages = Math.ceil(filteredLogsList.length / itemsPerPage) || 1;
        const paginatedLogs = filteredLogsList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        const handleSimulateVisit = async (e: React.FormEvent) => {
          e.preventDefault();
          setIsSimulating(true);
          setSimSuccess('');
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          SchoolDB.recordVisit(simPage, simType);
          const fresh = SchoolDB.getVisitorLogs();
          setVisitorLogs(fresh);
          setIsSimulating(false);
          setSimSuccess(`Dynamic entry logged: ${simType} clicked on standard "${simPage}" tab!`);
          setTimeout(() => setSimSuccess(''), 4000);
        };

        const handleResetVisitorLogs = () => {
          if (confirm("Are you sure you want to reset & re-seed visitor traffic logs? This will regenerate ~340 fresh records across the last 7 days.")) {
            const seeded = SchoolDB.generateMockVisitorLogs();
            SchoolDB.saveVisitorLogs(seeded);
            setVisitorLogs(seeded);
            setCurrentPage(1);
          }
        };

        return (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header section with reset */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-md">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-red-650 text-white font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">TELEMETRY</span>
                  <h2 className="text-lg md:text-xl font-bold tracking-tight">Website Traffic & Audience Insights</h2>
                </div>
                <p className="text-slate-400 text-xs max-w-xl">
                  Real-time reporting on PKLJSVM portal visitors, access devices, regional queries, and parent-student click interactions.
                </p>
              </div>
              <button 
                onClick={handleResetVisitorLogs}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2 rounded-lg text-xs tracking-wide uppercase transition shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-seed Mock Logs</span>
              </button>
            </div>

            {/* KPI metrics row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-50 text-red-700 shrink-0">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-bold">Total Page Views</span>
                  <span className="text-2xl font-extrabold text-slate-950">{totalVisitsCount}</span>
                  <p className="text-[9px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
                    <Activity className="w-3 h-3" /> Live session hits
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
                <div className="p-3 rounded-lg bg-indigo-50 text-indigo-700 shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-bold">Unique Visitors</span>
                  <span className="text-2xl font-extrabold text-slate-950">{uniqueUsersCount}</span>
                  <p className="text-[9px] text-slate-500 mt-0.5">Estimated by footprint ID</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-bold">Avg. Session Time</span>
                  <span className="text-2xl font-extrabold text-slate-950">{avgDurationMinSec}</span>
                  <p className="text-[9px] text-slate-500 mt-0.5">Active engagement portal average</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-50 text-amber-700 shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-bold">Regional Reach</span>
                  <span className="text-2xl font-extrabold text-slate-950">{uniqueLocationsCount} Locations</span>
                  <p className="text-[9px] text-slate-500 mt-0.5">NCR regional IP locations</p>
                </div>
              </div>
            </div>

            {/* Graphs row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: 7-Day Trend (8-span) */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs lg:col-span-7 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight mb-1">Page View Traffic Trend</h3>
                  <p className="text-slate-500 text-xs mb-4">Total recorded session views for each of the last seven calendar days.</p>
                </div>

                <div className="h-64 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
                  {trendData.map((day) => {
                    const pct = (day.count / maxTrendVal) * 100;
                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                        <div className="relative w-full flex flex-col items-center justify-end h-[85%]">
                          {/* Tooltip */}
                          <div className="absolute -top-9 scale-0 group-hover:scale-100 transition-all duration-150 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-10 pointer-events-none whitespace-nowrap">
                            {day.count} views ({day.date})
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {day.count}
                          </span>
                          <div 
                            style={{ height: `${pct}%` }} 
                            className="w-full bg-linear-to-t from-red-800 to-red-650 rounded-t group-hover:from-amber-500 group-hover:to-amber-400 transition-all duration-300 shadow-2xs relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-white/10 w-1/2 -skew-x-12" />
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 group-hover:text-slate-950 transition-colors whitespace-nowrap truncate max-w-full">
                          {day.displayDate}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Demographics Breakdowns (5-span) */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs lg:col-span-5 space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight mb-1">Audience Composition</h3>
                  <p className="text-slate-500 text-xs">Distribution of logged visits by verified visitor type and system devices.</p>
                </div>

                {/* Visitor Role Distribution */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">Interacting Roles</span>
                    <span className="text-slate-500 font-mono text-[10px]">{totalVisitsCount} records</span>
                  </div>

                  {/* Multi-colored Segmented Bar */}
                  <div className="w-full h-3.5 bg-slate-100 rounded-full flex overflow-hidden">
                    {roleCounts.map((item) => (
                      item.count > 0 && (
                        <div 
                          key={item.role} 
                          style={{ width: `${item.pct}%` }} 
                          className={`${roleColors[item.role]} transition-all duration-300 hover:opacity-85`}
                          title={`${item.role}: ${item.count} (${item.pct}%)`}
                        />
                      )
                    ))}
                  </div>

                  {/* Role Legend List */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {roleCounts.map((item) => (
                      <div key={item.role} className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600">
                        <span className={`w-2.5 h-2.5 rounded-full ${roleColors[item.role]} shrink-0`} />
                        <span className="truncate">{item.role}</span>
                        <span className="font-bold font-mono text-slate-900 shrink-0 ml-auto">{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device breakdown */}
                <div className="space-y-2 border-t border-slate-150 pt-4">
                  <span className="font-semibold text-slate-800 text-xs block">Device Analytics</span>
                  <div className="space-y-2">
                    {deviceCounts.map((item) => (
                      <div key={item.dev} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-slate-600">
                          <span className="capitalize">{item.dev} user session</span>
                          <span className="font-bold font-mono text-slate-950">{item.count} ({item.pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${item.pct}%` }} 
                            className={`h-full ${deviceColors[item.dev] || 'bg-slate-500'} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Pages and Referral Sources Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Popular Pages */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight">Most Visited Portals</h3>
                  <p className="text-slate-500 text-xs">Highly demanded modules ordered by school audience clicks.</p>
                </div>
                <div className="space-y-3">
                  {topPagesList.slice(0, 5).map((page, index) => (
                    <div key={page.name} className="flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-500 shrink-0">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-slate-800 truncate">{page.name} tab</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div style={{ width: `${page.pct}%` }} className="bg-red-800 h-full rounded-full" />
                        </div>
                        <span className="font-mono text-[10px] font-bold text-slate-900 w-12 text-right">
                          {page.count} hits
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Referrers */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight">Referral Channels</h3>
                  <p className="text-slate-500 text-xs">Origin sources sending traffic queries to our school website.</p>
                </div>
                <div className="space-y-3">
                  {topReferrersList.slice(0, 5).map((ref, index) => (
                    <div key={ref.name} className="flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 bg-indigo-50 text-indigo-700 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                          {index + 1}
                        </span>
                        <span className="font-semibold text-slate-800 truncate">{ref.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div style={{ width: `${ref.pct}%` }} className="bg-indigo-600 h-full rounded-full" />
                        </div>
                        <span className="font-mono text-[10px] font-bold text-slate-900 w-12 text-right">
                          {ref.pct}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive visit simulator tool */}
            <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-xl space-y-4 shadow-3xs">
              <div className="space-y-1">
                <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                  <Activity className="w-4.5 h-4.5 text-amber-700" />
                  Live Visitor Sandbox Simulator
                </h3>
                <p className="text-amber-800 text-xs leading-relaxed">
                  Test the responsive system reporting! Select a target page and user role below, then click "Simulate portal Visit". The dashboard will register a live hit in local storage and instantly animate the counts, percentages, and logs!
                </p>
              </div>

              <form onSubmit={handleSimulateVisit} className="flex flex-wrap items-end gap-4 bg-white/60 p-4 rounded-lg">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-amber-900 uppercase block">Portals to View</label>
                  <select 
                    value={simPage} 
                    onChange={e => setSimPage(e.target.value)}
                    className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 w-44"
                  >
                    <option value="Home">Home (Welcome Desk)</option>
                    <option value="Notices">Notices (Ledger)</option>
                    <option value="Syllabus">Syllabus (Curriculums)</option>
                    <option value="Homework">Homework (Registries)</option>
                    <option value="About">About (Values)</option>
                    <option value="Contact">Contact (Admission Desk)</option>
                    <option value="Gallery">Gallery (Campus)</option>
                    <option value="Login">Login Panel</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-amber-900 uppercase block">Visitor Persona Type</label>
                  <select 
                    value={simType} 
                    onChange={e => setSimType(e.target.value as any)}
                    className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 w-44"
                  >
                    <option value="Parent">Parent (Current Guardian)</option>
                    <option value="Student">Student (Class Nursery-10 batches)</option>
                    <option value="Prospective Student">Prospective Student / Family</option>
                    <option value="Guest">Guest (General Visitor)</option>
                    <option value="Teacher">Teacher (Staff account)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={isSimulating}
                  className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-extrabold text-xs px-5 py-2.5 rounded-md transition duration-200 uppercase cursor-pointer flex items-center gap-1.5"
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Registering hit...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Simulate Portal Visit</span>
                    </>
                  )}
                </button>
              </form>

              {simSuccess && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-4 py-2.5 rounded animate-bounce">
                  ✨ {simSuccess}
                </div>
              )}
            </div>

            {/* Interactive log table with Filters */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs space-y-4 p-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Granular Visitor Session Logs</h3>
                  <p className="text-slate-500 text-xs">Explore and inspect exact tracking events stored securely on this client.</p>
                </div>

                {/* Quick query filters reset */}
                {(filterType !== 'all' || filterDevice !== 'all' || filterPage !== 'all' || searchQuery !== '') && (
                  <button 
                    onClick={() => { setFilterType('all'); setFilterDevice('all'); setFilterPage('all'); setSearchQuery(''); setCurrentPage(1); }}
                    className="text-xs text-red-700 hover:underline font-bold flex items-center gap-0.5 shrink-0 self-start"
                  >
                    <span>Clear Search Filters</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filters grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-150">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase block">Search Location/Referrer/ID</span>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type keywords..." 
                      value={searchQuery}
                      onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-white border border-slate-350 rounded px-2.5 py-1 text-xs pl-7 focus:outline-hidden focus:border-red-700"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase block">Visitor Role</span>
                  <select 
                    value={filterType} 
                    onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-white border border-slate-350 rounded px-2 py-1 text-xs focus:outline-hidden"
                  >
                    <option value="all">All Roles</option>
                    {visitorRolesList.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase block">Access Device</span>
                  <select 
                    value={filterDevice} 
                    onChange={e => { setFilterDevice(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-white border border-slate-350 rounded px-2 py-1 text-xs focus:outline-hidden"
                  >
                    <option value="all">All Devices</option>
                    {deviceTypesList.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase block">Destination Page</span>
                  <select 
                    value={filterPage} 
                    onChange={e => { setFilterPage(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-white border border-slate-350 rounded px-2 py-1 text-xs focus:outline-hidden"
                  >
                    <option value="all">All Pages</option>
                    {uniquePagesList.sort().map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Total results match */}
              <div className="text-[11px] text-slate-500 flex justify-between items-center px-1">
                <span>Displaying <strong>{paginatedLogs.length}</strong> items of {filteredLogsList.length} matching criteria</span>
              </div>

              {/* Table ledger */}
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[9px]">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Visitor Footprint ID</th>
                      <th className="py-3 px-4">Role Persona</th>
                      <th className="py-3 px-4">Requested Page</th>
                      <th className="py-3 px-4">Regional NCR Location</th>
                      <th className="py-3 px-4">Access Device</th>
                      <th className="py-3 px-4">Referrer Source</th>
                      <th className="py-3 px-4 text-right">Stay Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {paginatedLogs.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          No matching visitor sessions found for current filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedLogs.map((log) => {
                        const dateFormatted = new Date(log.timestamp).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                        });
                        return (
                          <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono text-[10px] text-slate-500 whitespace-nowrap">{dateFormatted}</td>
                            <td className="py-3 px-4 font-mono text-slate-700">{log.visitorId}</td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] border uppercase ${roleBadgeColors[log.visitorType] || 'bg-slate-100 text-slate-600'}`}>
                                {log.visitorType}
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className="font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                                /{log.page.toLowerCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{log.location}</td>
                            <td className="py-3 px-4 text-slate-600 whitespace-nowrap capitalize">
                              <span className="mr-1">
                                {log.device === 'Mobile' ? '📱' : log.device === 'Tablet' ? '📟' : '💻'}
                              </span>
                              {log.device}
                            </td>
                            <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{log.referrer}</td>
                            <td className="py-3 px-4 font-mono text-right text-slate-900 whitespace-nowrap">
                              {log.durationSeconds}s
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 font-bold px-3 py-1.5 rounded border border-slate-300 text-xs transition uppercase tracking-wide cursor-pointer disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-slate-500 font-medium">
                    Page <strong>{currentPage}</strong> of {totalPages}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 font-bold px-3 py-1.5 rounded border border-slate-300 text-xs transition uppercase tracking-wide cursor-pointer disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

          </div>
        );
      })()}

    </div>
  );
};
