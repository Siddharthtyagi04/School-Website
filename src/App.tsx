/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SchoolDB, Post, SyllabusItem, HomeworkItem, Teacher, ContactSubmission, StaticContent } from './db';
import { SchoolLogo, VidyaBharatiLogo } from './components/Logos';
import { Home } from './components/Home';
import { About } from './components/About';
import { Academics } from './components/Academics';
import { Notices } from './components/Notices';
import { Syllabus } from './components/Syllabus';
import { Homework } from './components/Homework';
import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';
import { Login } from './components/Login';
import { DashboardAdmin } from './components/DashboardAdmin';
import { DashboardTeacher } from './components/DashboardTeacher';

import { 
  Menu, X, Phone, Mail, MapPin, ShieldAlert, GraduationCap, 
  BookOpen, Calendar, ShieldCheck, Key, User, Star, Clock, ChevronRight 
} from 'lucide-react';

type TabRoute = 'home' | 'about' | 'academics' | 'notices' | 'syllabus' | 'homework' | 'gallery' | 'contact' | 'login' | 'dashboard';

interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'teacher';
  name: string;
  assignedClasses?: string[];
  assignedSubjects?: string[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabRoute>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Database States
  const [posts, setPosts] = useState<Post[]>([]);
  const [syllabus, setSyllabus] = useState<SyllabusItem[]>([]);
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [staticContent, setStaticContent] = useState<StaticContent>(SchoolDB.getStaticContent());
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Load from database on startup
  useEffect(() => {
    SchoolDB.init();
    refreshAllData();
    SchoolDB.recordVisit('Home');
  }, []);

  const refreshAllData = () => {
    setPosts(SchoolDB.getPosts());
    setSyllabus(SchoolDB.getSyllabus());
    setHomework(SchoolDB.getHomework());
    setTeachers(SchoolDB.getTeachers());
    setSubmissions(SchoolDB.getSubmissions());
    setStaticContent(SchoolDB.getStaticContent());
  };

  // State update handlers
  const handleUpdatePosts = (newPosts: Post[]) => {
    SchoolDB.savePosts(newPosts);
    setPosts(newPosts);
  };

  const handleUpdateSyllabus = (newSyllabus: SyllabusItem[]) => {
    SchoolDB.saveSyllabus(newSyllabus);
    setSyllabus(newSyllabus);
  };

  const handleUpdateHomework = (newHomework: HomeworkItem[]) => {
    SchoolDB.saveHomework(newHomework);
    setHomework(newHomework);
  };

  const handleUpdateTeachers = (newTeachers: Teacher[]) => {
    SchoolDB.saveTeachers(newTeachers);
    setTeachers(newTeachers);
  };

  const handleUpdateSubmissions = (newSubs: ContactSubmission[]) => {
    SchoolDB.saveSubmissions(newSubs);
    setSubmissions(newSubs);
  };

  const handleUpdateStaticContent = (newContent: StaticContent) => {
    SchoolDB.saveStaticContent(newContent);
    setStaticContent(newContent);
  };

  // Save Contact Form submissions
  const handleSaveContactSubmission = (submission: Omit<ContactSubmission, 'id' | 'date' | 'status'>) => {
    const newSub: ContactSubmission = {
      ...submission,
      id: 'sub_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'new'
    };
    const updated = [newSub, ...submissions];
    handleUpdateSubmissions(updated);
  };

  // Handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('login');
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as TabRoute);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const pageName = tab.charAt(0).toUpperCase() + tab.slice(1);
    SchoolDB.recordVisit(pageName);
  };

  // Render correct route
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home 
            staticContent={staticContent}
            latestPosts={posts}
            onNavigate={handleNavigate}
          />
        );
      case 'about':
        return <About staticContent={staticContent} />;
      case 'academics':
        return <Academics />;
      case 'notices':
        return <Notices posts={posts} />;
      case 'syllabus':
        return <Syllabus syllabus={syllabus} />;
      case 'homework':
        return <Homework homework={homework} />;
      case 'gallery':
        return <Gallery />;
      case 'contact':
        return (
          <Contact 
            staticContent={staticContent}
            onSaveSubmission={handleSaveContactSubmission}
          />
        );
      case 'login':
        return (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onNavigateHome={() => handleNavigate('home')}
            teachers={teachers}
          />
        );
      case 'dashboard':
        if (!currentUser) {
          return (
            <Login 
              onLoginSuccess={handleLoginSuccess}
              onNavigateHome={() => handleNavigate('home')}
              teachers={teachers}
            />
          );
        }
        if (currentUser.role === 'admin') {
          return (
            <DashboardAdmin 
              posts={posts}
              syllabus={syllabus}
              homework={homework}
              teachers={teachers}
              submissions={submissions}
              staticContent={staticContent}
              onUpdatePosts={handleUpdatePosts}
              onUpdateSyllabus={handleUpdateSyllabus}
              onUpdateHomework={handleUpdateHomework}
              onUpdateTeachers={handleUpdateTeachers}
              onUpdateSubmissions={handleUpdateSubmissions}
              onUpdateStaticContent={handleUpdateStaticContent}
              onLogout={handleLogout}
              adminName={currentUser.name}
            />
          );
        } else {
          return (
            <DashboardTeacher 
              posts={posts}
              syllabus={syllabus}
              homework={homework}
              teacherId={currentUser.id}
              teacherName={currentUser.name}
              assignedClasses={currentUser.assignedClasses || []}
              assignedSubjects={currentUser.assignedSubjects || []}
              onUpdatePosts={handleUpdatePosts}
              onUpdateSyllabus={handleUpdateSyllabus}
              onUpdateHomework={handleUpdateHomework}
              onLogout={handleLogout}
            />
          );
        }
      default:
        return (
          <Home 
            staticContent={staticContent}
            latestPosts={posts}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFAF5] text-slate-800 antialiased font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. TOP SCROLLING ANNOUNCEMENT TICKER BANNER */}
      <div className="bg-rose-950 text-white text-[10px] md:text-xs font-bold py-2.5 px-4 shadow-sm border-b border-red-900/30 relative z-20 overflow-hidden shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-2 shrink-0 z-10 bg-rose-950 pr-2">
            <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-extrabold animate-pulse">LATEST NOTICE</span>
          </div>
          <div className="flex-1 overflow-hidden relative py-0.5">
            <div 
              onClick={() => handleNavigate('notices')}
              className="animate-ticker hover:cursor-pointer flex items-center gap-12 whitespace-nowrap"
            >
              {(posts && posts.length > 0 ? posts.slice(0, 6) : [
                { id: '1', title: 'Admissions Open for Session 2026-2027', date: '2026-04-01' },
                { id: '2', title: 'Nursery, KG, and Classes 1 to 10 registrations are active', date: '2026-04-02' },
                { id: '3', title: 'Science & Computer Labs completely renovated with modern equipment', date: '2026-04-03' },
                { id: '4', title: 'Weekly Sanskrit, Yoga & Modern Coding curriculum introduced', date: '2026-04-04' }
              ]).map((notice, idx) => (
                <span key={notice.id || idx} className="inline-flex items-center gap-2 text-slate-100 hover:text-amber-300 transition shrink-0">
                  <span className="text-amber-400 font-bold text-sm">★</span>
                  <span className="font-serif italic font-bold">
                    {notice.title}
                  </span>
                  {notice.date && (
                    <span className="text-[10px] text-slate-300 font-light font-mono bg-rose-900/40 px-1.5 py-0.5 rounded">
                      {new Date(notice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div className="shrink-0 z-10 bg-rose-950 pl-2">
            <button 
              onClick={() => handleNavigate('contact')}
              className="text-[9px] uppercase tracking-widest text-amber-300 font-bold hover:underline"
            >
              Enquire Now &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 2. SCHOOL COORDINATES TOP BAR */}
      <div className="bg-white/95 border-b border-slate-100 py-2.5 px-4 hidden lg:block text-slate-500 text-xs shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 font-light">
              <MapPin className="w-3.5 h-3.5 text-indigo-900" />
              Saini, Bilaspur, Greater Noida, G.B. Nagar, UP, India
            </span>
            <span className="h-3 w-[1px] bg-slate-200" />
            <span className="flex items-center gap-1.5 font-light">
              <Phone className="w-3.5 h-3.5 text-red-750" />
              +91-9871542150, +91-8800543210
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-light text-[11px] font-mono">
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              info@pkljsvm.com
            </span>
            <span className="h-3 w-[1px] bg-slate-200" />
            <span className="text-[10px] text-amber-600 font-serif italic font-medium">Sanskriti & Vigyan Board Standards</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN HEADER AND NAVIGATION BRANDING */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/50 shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          
          {/* Logo Crest with branding typography */}
          <div 
            onClick={() => handleNavigate('home')} 
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <div className="flex items-center gap-2">
              <SchoolLogo className="w-12 h-12 group-hover:scale-105 transition" />
            </div>
            
            <div className="space-y-0.5">
              <h1 className="font-serif font-black text-slate-800 text-base md:text-lg leading-none tracking-tight uppercase">
                PKLJSVM <span className="text-indigo-900">School</span>
              </h1>
              <p className="text-[9px] text-red-750 uppercase font-bold tracking-widest leading-none">
                Premwati Kunji Lal Jain Saraswati Vidya Mandir
              </p>
              <p className="text-[8px] text-slate-400 font-light leading-none italic hidden md:block">
                Saini, Bilaspur, Greater Noida, Uttar Pradesh
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About Us' },
              { id: 'academics', label: 'Academics' },
              { id: 'notices', label: 'Notices' },
              { id: 'syllabus', label: 'Syllabus' },
              { id: 'homework', label: 'Homework' },
              { id: 'gallery', label: 'Gallery' },
              { id: 'contact', label: 'Contact Us' }
            ].map((route) => (
              <button
                key={route.id}
                onClick={() => handleNavigate(route.id)}
                className={`px-3 py-2 rounded-lg transition-all cursor-pointer ${activeTab === route.id ? 'bg-indigo-900 text-white shadow-xs' : 'hover:bg-slate-50 hover:text-indigo-900'}`}
              >
                {route.label}
              </button>
            ))}

            {/* Staff direct access */}
            <button
              onClick={() => handleNavigate(currentUser ? 'dashboard' : 'login')}
              className={`ml-3 px-3.5 py-2 rounded-lg font-bold flex items-center gap-1 transition-all border border-red-750/20 text-red-750 hover:bg-red-750 hover:text-white cursor-pointer ${activeTab === 'login' || activeTab === 'dashboard' ? 'bg-red-750 text-white border-red-750' : ''}`}
            >
              <ShieldCheck className="w-4 h-4" />
              {currentUser ? `${currentUser.name}` : 'Staff Login'}
            </button>
          </nav>

          {/* Mobile drawer toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition focus:outline-hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-2 animate-slide-down">
            {[
              { id: 'home', label: 'Home Page' },
              { id: 'about', label: 'About Us' },
              { id: 'academics', label: 'Academics' },
              { id: 'notices', label: 'Notices' },
              { id: 'syllabus', label: 'Syllabus' },
              { id: 'homework', label: 'Homework' },
              { id: 'gallery', label: 'School Gallery' },
              { id: 'contact', label: 'Contact Us' }
            ].map((route) => (
              <button
                key={route.id}
                onClick={() => handleNavigate(route.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === route.id ? 'bg-indigo-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
              >
                {route.label}
              </button>
            ))}
            <div className="h-[1px] bg-slate-100 my-2" />
            <button
              onClick={() => handleNavigate(currentUser ? 'dashboard' : 'login')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${activeTab === 'login' || activeTab === 'dashboard' ? 'bg-red-750 text-white border-red-750' : 'bg-red-750/5 text-red-750 border-red-750/15'}`}
            >
              <ShieldCheck className="w-4 h-4" />
              {currentUser ? `${currentUser.name} (Dashboard)` : 'Acharya & Staff Login'}
            </button>
          </div>
        )}
      </header>

      {/* 4. MAIN ROUTER CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        {renderTabContent()}
      </main>

      {/* 5. COHESIVE TRADITIONAL FOOTER */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 shrink-0">
        
        {/* Upper Grid columns */}
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Identity block */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SchoolLogo className="w-14 h-14 bg-white/5 p-1 rounded-xl" />
              <VidyaBharatiLogo className="w-10 h-12 bg-white/5 p-1 rounded-xl" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-100 uppercase tracking-tight">PKLJSVM School</h3>
              <p className="text-xs text-slate-300 font-light uppercase tracking-wider">Premwati Kunji Lal Jain SVM</p>
              <p className="text-[10px] text-amber-400 italic font-medium tracking-widest uppercase mt-1">शारीरिक, मानसिक व नैतिक विकास</p>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-light">
              Nurturing character, physical wisdom, CBSE academic excellence, and traditional sanskara for our student's tomorrow in Saini.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">Academic Sections</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {[
                { id: 'about', label: 'About History' },
                { id: 'academics', label: 'Academics & Labs' },
                { id: 'notices', label: 'Live Notice Board' },
                { id: 'syllabus', label: 'Syllabus Guides' },
                { id: 'homework', label: 'Daily Assignments' },
                { id: 'gallery', label: 'Campus Tour Gallery' }
              ].map(link => (
                <li key={link.id}>
                  <button 
                    onClick={() => handleNavigate(link.id)}
                    className="hover:text-amber-300 hover:translate-x-1 transition flex items-center gap-1 cursor-pointer font-light"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Affiliations */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">Affiliation details</h4>
            <div className="space-y-3.5 text-[11px] text-slate-400 font-light">
              <p className="leading-relaxed">
                Premwati Kunji Lal Jain Saraswati Vidhya Mandir aligns strictly with CBSE frameworks and is a proud constituent unit of <strong>Vidya Bharati Akhil Bharatiya Shiksha Sansthan</strong>.
              </p>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400 block uppercase tracking-widest font-mono">Affiliation Standards</span>
                <p className="text-[10px] text-slate-300 leading-normal">CBSE Syllabus Board & UP Board Guidelines Compliant.</p>
              </div>
            </div>
          </div>

          {/* Location Coordinates */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">School coordinates</h4>
            <ul className="space-y-3 text-xs text-slate-400 font-light">
              <li className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 text-indigo-900 shrink-0 mt-0.5" />
                <span>Saini, near Bilaspur, Greater Noida, G.B. Nagar, UP - 203201</span>
              </li>
              <li className="flex gap-2 items-start">
                <Phone className="w-4 h-4 text-red-750 shrink-0 mt-0.5" />
                <span className="font-mono">+91 9871542150</span>
              </li>
              <li className="flex gap-2 items-start">
                <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="font-mono">info@pkljsvm.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower footer copyright */}
        <div className="bg-slate-950 py-6 px-4 border-t border-slate-800/40 text-xs text-slate-500 text-center">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-light">
              &copy; 2026 Premwati Kunji Lal Jain Saraswati Vidhya Mandir, Saini. All Rights Reserved.
            </p>
            <p className="text-[10px] text-slate-600 font-light">
              Affiliated to CBSE Board & UP State Board. Guided under Saraswati Shiksha Samiti & Vidya Bharati Shiksha Sansthan.
            </p>
          </div>
        </div>

      </footer>

    </div>
  );
}
