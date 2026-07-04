/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Post, SyllabusItem, HomeworkItem } from '../db';
import { FileText, BookOpen, Clipboard, Plus, Edit, Trash2, X, AlertTriangle, Calendar, Upload } from 'lucide-react';

interface DashboardTeacherProps {
  posts: Post[];
  syllabus: SyllabusItem[];
  homework: HomeworkItem[];
  teacherId: string;
  teacherName: string;
  assignedClasses: string[];
  assignedSubjects: string[];
  onUpdatePosts: (posts: Post[]) => void;
  onUpdateSyllabus: (syllabus: SyllabusItem[]) => void;
  onUpdateHomework: (homework: HomeworkItem[]) => void;
  onLogout: () => void;
}

interface FileUploaderProps {
  fileName: string;
  fileUrl?: string;
  onFileChange: (name: string, url: string) => void;
  onClear: () => void;
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  fileName, 
  fileUrl, 
  onFileChange, 
  onClear,
  label = "Attached File / Document" 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onFileChange(file.name, event.target.result as string);
      }
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5 text-left">
      <label className="text-xs font-bold text-slate-700 uppercase block">{label}</label>
      
      {isProcessing ? (
        <div className="flex items-center justify-center border border-slate-300 bg-slate-50 rounded-lg p-5">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-2" />
          <span className="text-xs text-slate-500">Reading file...</span>
        </div>
      ) : fileName ? (
        <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50/40 rounded-lg p-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-2 bg-emerald-500 text-white rounded-md flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate max-w-[200px] md:max-w-xs">{fileName}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">
                {fileUrl && fileUrl.startsWith('data:') ? '✓ Real File Ready' : '✓ Custom File Attached'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClear} 
            className="text-xs text-rose-600 hover:text-rose-800 font-bold p-1 hover:bg-rose-50 rounded"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition flex flex-col items-center justify-center gap-2 group cursor-pointer ${
            dragActive 
              ? 'border-amber-500 bg-amber-50/20' 
              : 'border-slate-300 hover:border-slate-400 bg-white'
          }`}
        >
          <input 
            type="file" 
            id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleChange}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.txt,.zip"
          />
          <Upload className="w-8 h-8 text-slate-400 group-hover:text-amber-500 transition" />
          <div>
            <p className="text-xs font-bold text-slate-700">
              Drag & drop your file here, or <span className="text-amber-600">browse</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Supports any type of file (PDF, Word, PPT, Excel, Images, etc.)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const DashboardTeacher: React.FC<DashboardTeacherProps> = ({
  posts, syllabus, homework, teacherId, teacherName, assignedClasses, assignedSubjects,
  onUpdatePosts, onUpdateSyllabus, onUpdateHomework,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'syllabus' | 'homework'>('posts');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter content authored by this teacher
  const myPosts = posts.filter(p => p.authorId === teacherId);
  const mySyllabus = syllabus.filter(s => s.authorId === teacherId);
  const myHomework = homework.filter(h => h.authorId === teacherId);

  // Form states - Post
  const [postForm, setPostForm] = useState({ title: '', description: '', attachmentName: '', attachmentUrl: '' });
  // Form states - Syllabus (defaulting to the first assigned class/subject)
  const [syllabusForm, setSyllabusForm] = useState({ 
    title: '', 
    classLevel: assignedClasses[0] || 'Class 9', 
    subject: assignedSubjects[0] || 'Mathematics', 
    fileName: '',
    fileUrl: '' 
  });
  // Form states - Homework
  const [homeworkForm, setHomeworkForm] = useState({ 
    title: '', 
    classLevel: assignedClasses[0] || 'Class 9', 
    subject: assignedSubjects[0] || 'Mathematics', 
    description: '', 
    dueDate: '', 
    fileName: '',
    fileUrl: '' 
  });

  const resetForms = () => {
    setShowForm(false);
    setEditingId(null);
    setPostForm({ title: '', description: '', attachmentName: '', attachmentUrl: '' });
    setSyllabusForm({ 
      title: '', 
      classLevel: assignedClasses[0] || 'Class 9', 
      subject: assignedSubjects[0] || 'Mathematics', 
      fileName: '',
      fileUrl: '' 
    });
    setHomeworkForm({ 
      title: '', 
      classLevel: assignedClasses[0] || 'Class 9', 
      subject: assignedSubjects[0] || 'Mathematics', 
      description: '', 
      dueDate: '', 
      fileName: '',
      fileUrl: '' 
    });
  };

  // --- TEACHER CRUD POSTS ---
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updated = posts.map(p => p.id === editingId ? { 
        ...p, 
        title: postForm.title, 
        description: postForm.description, 
        attachmentName: postForm.attachmentName || undefined,
        attachmentUrl: postForm.attachmentUrl || (postForm.attachmentName ? '#' : undefined)
      } : p);
      onUpdatePosts(updated);
    } else {
      const newPost: Post = {
        id: 'p_' + Date.now(),
        title: postForm.title,
        description: postForm.description,
        date: new Date().toISOString().split('T')[0],
        attachmentName: postForm.attachmentName || undefined,
        attachmentUrl: postForm.attachmentUrl || (postForm.attachmentName ? '#' : undefined),
        authorId: teacherId,
        authorName: teacherName
      };
      onUpdatePosts([newPost, ...posts]);
    }
    resetForms();
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement notice?")) {
      onUpdatePosts(posts.filter(p => p.id !== id));
    }
  };

  const handleEditPostClick = (p: Post) => {
    setEditingId(p.id);
    setPostForm({ 
      title: p.title, 
      description: p.description, 
      attachmentName: p.attachmentName || '', 
      attachmentUrl: p.attachmentUrl || '' 
    });
    setShowForm(true);
  };

  // --- TEACHER CRUD SYLLABUS ---
  const handleSaveSyllabus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!syllabusForm.fileName) {
      alert("Please upload a syllabus file.");
      return;
    }
    if (!assignedClasses.includes(syllabusForm.classLevel) || !assignedSubjects.includes(syllabusForm.subject)) {
      alert(`Error: You are only permitted to manage syllabus documents for your assigned classes (${assignedClasses.join(', ')}) and subjects (${assignedSubjects.join(', ')}).`);
      return;
    }

    if (editingId) {
      const updated = syllabus.map(s => s.id === editingId ? { 
        ...s, 
        title: syllabusForm.title, 
        classLevel: syllabusForm.classLevel, 
        subject: syllabusForm.subject, 
        fileName: syllabusForm.fileName || 'document.pdf',
        fileUrl: syllabusForm.fileUrl || s.fileUrl || '#'
      } : s);
      onUpdateSyllabus(updated);
    } else {
      const newItem: SyllabusItem = {
        id: 's_' + Date.now(),
        title: syllabusForm.title,
        classLevel: syllabusForm.classLevel,
        subject: syllabusForm.subject,
        fileName: syllabusForm.fileName || 'syllabus.pdf',
        fileUrl: syllabusForm.fileUrl || '#',
        authorId: teacherId,
        authorName: teacherName
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
    setSyllabusForm({ 
      title: s.title, 
      classLevel: s.classLevel, 
      subject: s.subject, 
      fileName: s.fileName, 
      fileUrl: s.fileUrl || '' 
    });
    setShowForm(true);
  };

  // --- TEACHER CRUD HOMEWORK ---
  const handleSaveHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignedClasses.includes(homeworkForm.classLevel) || !assignedSubjects.includes(homeworkForm.subject)) {
      alert(`Error: You are only permitted to assign homework for your assigned classes (${assignedClasses.join(', ')}) and subjects (${assignedSubjects.join(', ')}).`);
      return;
    }

    if (editingId) {
      const updated = homework.map(h => h.id === editingId ? { 
        ...h, 
        title: homeworkForm.title, 
        classLevel: homeworkForm.classLevel, 
        subject: homeworkForm.subject, 
        description: homeworkForm.description, 
        dueDate: homeworkForm.dueDate, 
        fileName: homeworkForm.fileName || undefined,
        fileUrl: homeworkForm.fileUrl || (homeworkForm.fileName ? '#' : undefined)
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
        fileUrl: homeworkForm.fileUrl || (homeworkForm.fileName ? '#' : undefined),
        authorId: teacherId,
        authorName: teacherName
      };
      onUpdateHomework([newItem, ...homework]);
    }
    resetForms();
  };

  const handleDeleteHomework = (id: string) => {
    if (confirm("Are you sure you want to delete this homework?")) {
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
      fileName: h.fileName || '',
      fileUrl: h.fileUrl || ''
    });
    setShowForm(true);
  };

  return (
    <div id="teacherDashboard" className="space-y-8">
      
      {/* Teacher Welcoming Banner */}
      <div className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white rounded-xl p-6 md:p-8 border border-indigo-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md">
        <div className="space-y-2">
          <span className="text-amber-400 font-bold uppercase tracking-wider text-xs">FACULTY DASHBOARD</span>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome, {teacherName}</h1>
          
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-1.5 text-xs text-slate-300">
            <div>
              <strong className="text-white">Assigned Classes:</strong> {assignedClasses.join(', ')}
            </div>
            <div>
              <strong className="text-white">Assigned Subjects:</strong> {assignedSubjects.join(', ')}
            </div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition cursor-pointer border border-white/20 self-start md:self-auto"
        >
          Logout Session
        </button>
      </div>

      {/* Nav tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button 
          onClick={() => { setActiveTab('posts'); resetForms(); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'posts' ? 'bg-indigo-950 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Notices ({myPosts.length})</span>
        </button>

        <button 
          onClick={() => { setActiveTab('syllabus'); resetForms(); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'syllabus' ? 'bg-indigo-950 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Syllabus ({mySyllabus.length})</span>
        </button>

        <button 
          onClick={() => { setActiveTab('homework'); resetForms(); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-bold transition cursor-pointer ${
            activeTab === 'homework' ? 'bg-indigo-950 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clipboard className="w-4 h-4" />
          <span>My Homework ({myHomework.length})</span>
        </button>
      </div>

      {/* --- NOTICE MANAGER --- */}
      {activeTab === 'posts' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Your Published Notices</h2>
            {!showForm && (
              <button 
                onClick={() => { resetForms(); setShowForm(true); }}
                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Create Announcement</span>
              </button>
            )}
          </div>

          {showForm ? (
            <form onSubmit={handleSavePost} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h3 className="font-bold text-sm text-slate-800">
                  {editingId ? 'Edit Announcement Notice' : 'Compose New Announcement Notice'}
                </h3>
                <button type="button" onClick={resetForms} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">Announcement Title *</label>
                <input 
                  type="text" required placeholder="e.g. Test schedules for Algebra Class 10"
                  value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">Details *</label>
                <textarea 
                  rows={4} required placeholder="State announcement details..."
                  value={postForm.description} onChange={e => setPostForm({ ...postForm, description: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <FileUploader 
                fileName={postForm.attachmentName}
                fileUrl={postForm.attachmentUrl}
                onFileChange={(name, url) => setPostForm({ ...postForm, attachmentName: name, attachmentUrl: url })}
                onClear={() => setPostForm({ ...postForm, attachmentName: '', attachmentUrl: '' })}
                label="Attached Notice File / Circular Document (Optional)"
              />

              <div className="pt-2 flex gap-3">
                <button type="submit" className="bg-indigo-950 hover:bg-indigo-900 text-white font-bold px-5 py-2 rounded-lg text-xs uppercase tracking-wide">
                  Publish Notice
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
                    <th className="p-4">Title & Description</th>
                    <th className="p-4">Attachment</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {myPosts.length > 0 ? myPosts.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-4 text-slate-400 whitespace-nowrap">{p.date}</td>
                      <td className="p-4">
                        <strong className="text-slate-900 block line-clamp-1">{p.title}</strong>
                        <span className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{p.description}</span>
                      </td>
                      <td className="p-4 font-semibold text-red-700">
                        {p.attachmentName ? p.attachmentName : 'None'}
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
                  )) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 italic">You haven't published any notice bulletins yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- SYLLABUS MANAGER --- */}
      {activeTab === 'syllabus' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Your Class Syllabus Documents</h2>
            {!showForm && (
              <button 
                onClick={() => { resetForms(); setShowForm(true); }}
                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase transition flex items-center gap-1"
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
                  {editingId ? 'Edit Syllabus Details' : 'Upload Scope Blueprint'}
                </h3>
                <button type="button" onClick={resetForms} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">Syllabus Title *</label>
                <input 
                  type="text" required placeholder="e.g. CBSE Term-1 Calculus syllabus breakdown"
                  value={syllabusForm.title} onChange={e => setSyllabusForm({ ...syllabusForm, title: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Class Level *</label>
                  <select 
                    value={syllabusForm.classLevel} onChange={e => setSyllabusForm({ ...syllabusForm, classLevel: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500 font-semibold"
                  >
                    {assignedClasses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Subject *</label>
                  <select 
                    value={syllabusForm.subject} onChange={e => setSyllabusForm({ ...syllabusForm, subject: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500 font-semibold"
                  >
                    {assignedSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <FileUploader 
                fileName={syllabusForm.fileName}
                fileUrl={syllabusForm.fileUrl}
                onFileChange={(name, url) => setSyllabusForm({ ...syllabusForm, fileName: name, fileUrl: url })}
                onClear={() => setSyllabusForm({ ...syllabusForm, fileName: '', fileUrl: '' })}
                label="Upload Syllabus Document (Required) *"
              />

              <div className="pt-2 flex gap-3">
                <button type="submit" className="bg-indigo-950 hover:bg-indigo-900 text-white font-bold px-5 py-2 rounded-lg text-xs uppercase tracking-wide">
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
                    <th className="p-4">Title</th>
                    <th className="p-4">File Name</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {mySyllabus.length > 0 ? mySyllabus.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-indigo-700 whitespace-nowrap">{s.classLevel}</td>
                      <td className="p-4 font-semibold text-slate-700 whitespace-nowrap">{s.subject}</td>
                      <td className="p-4 font-bold text-slate-900">{s.title}</td>
                      <td className="p-4 text-slate-500 font-semibold flex items-center gap-1 mt-1 whitespace-nowrap">
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
                  )) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic">You haven't uploaded any curriculum syllabus files yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- HOMEWORK MANAGER --- */}
      {activeTab === 'homework' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Your Assigned Homework List</h2>
            {!showForm && (
              <button 
                onClick={() => { resetForms(); setShowForm(true); }}
                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs uppercase transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Assign New Task</span>
              </button>
            )}
          </div>

          {showForm ? (
            <form onSubmit={handleSaveHomework} className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <h3 className="font-bold text-sm text-slate-800">
                  {editingId ? 'Edit Homework details' : 'Draft New Homework assignment'}
                </h3>
                <button type="button" onClick={resetForms} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase block">Homework Title *</label>
                <input 
                  type="text" required placeholder="e.g. NCERT Chapter 5 Arithmetic Progressions"
                  value={homeworkForm.title} onChange={e => setHomeworkForm({ ...homeworkForm, title: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Class Level *</label>
                  <select 
                    value={homeworkForm.classLevel} onChange={e => setHomeworkForm({ ...homeworkForm, classLevel: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500 font-semibold"
                  >
                    {assignedClasses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase block">Subject *</label>
                  <select 
                    value={homeworkForm.subject} onChange={e => setHomeworkForm({ ...homeworkForm, subject: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500 font-semibold"
                  >
                    {assignedSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
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
                <label className="text-xs font-bold text-slate-700 uppercase block">Instructions / Explanatory Description *</label>
                <textarea 
                  rows={4} required placeholder="Solve problems cleanly on notebooks..."
                  value={homeworkForm.description} onChange={e => setHomeworkForm({ ...homeworkForm, description: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs md:text-sm focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              <FileUploader 
                fileName={homeworkForm.fileName}
                fileUrl={homeworkForm.fileUrl}
                onFileChange={(name, url) => setHomeworkForm({ ...homeworkForm, fileName: name, fileUrl: url })}
                onClear={() => setHomeworkForm({ ...homeworkForm, fileName: '', fileUrl: '' })}
                label="Attached Worksheet File / Document (Optional)"
              />

              <div className="pt-2 flex gap-3">
                <button type="submit" className="bg-indigo-950 hover:bg-indigo-900 text-white font-bold px-5 py-2 rounded-lg text-xs uppercase tracking-wide">
                  Publish Homework
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
                    <th className="p-4">Title / Homework details</th>
                    <th className="p-4">Resource</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {myHomework.length > 0 ? myHomework.map(h => (
                    <tr key={h.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-rose-700 whitespace-nowrap flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{h.dueDate}</span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="font-extrabold text-indigo-700 block">{h.classLevel}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mt-0.5">{h.subject}</span>
                      </td>
                      <td className="p-4">
                        <strong className="text-slate-900 block">{h.title}</strong>
                        <span className="text-slate-500 text-[11px] line-clamp-1 mt-0.5">{h.description}</span>
                      </td>
                      <td className="p-4 text-slate-500 font-semibold whitespace-nowrap">
                        {h.fileName ? (
                          <span className="text-slate-700 flex items-center gap-1">
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
                  )) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic">You haven't assigned any active class homework assignments yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Safety Notice block */}
      <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 flex gap-3 items-start">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1 text-slate-600">
          <strong className="text-amber-800 uppercase block">Teacher Access Restrictions</strong>
          <p className="leading-relaxed">
            Your editing permissions are constrained to the classes ({assignedClasses.join(', ')}) and subjects ({assignedSubjects.join(', ')}) assigned to you by the School Administration. If you need modifications to your syllabus profile scope, please contact the Principal's administration office.
          </p>
        </div>
      </div>

    </div>
  );
};
