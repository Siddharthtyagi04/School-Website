/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { Teacher } from '../db';

interface LoginProps {
  onLoginSuccess: (user: { email: string; role: 'admin' | 'teacher'; name: string; id: string; assignedClasses?: string[]; assignedSubjects?: string[] }) => void;
  onNavigateHome: () => void;
  teachers: Teacher[];
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigateHome, teachers }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    // 1. Admin login check
    if (email.toLowerCase() === 'admin@pkljsvm.com' && password === 'admin') {
      onLoginSuccess({
        id: 'admin',
        email: 'admin@pkljsvm.com',
        role: 'admin',
        name: 'Administrator'
      });
      return;
    }

    // 2. Teacher login check (We matches against our preseeded or newly created list of teachers!)
    // For demo purposes, we will check if it matches a preseeded teacher. They can all login with password 'teacher'!
    const matchedTeacher = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());
    if (matchedTeacher && password === 'teacher') {
      onLoginSuccess({
        id: matchedTeacher.id,
        email: matchedTeacher.email,
        role: 'teacher',
        name: matchedTeacher.name,
        assignedClasses: matchedTeacher.classes,
        assignedSubjects: matchedTeacher.subjects
      });
      return;
    }

    // 3. Fallback invalid credentials
    setErrorMsg('Invalid email credentials or incorrect password. Please refer to the test logins card below.');
  };

  const autofill = (role: 'admin' | 'teacher') => {
    if (role === 'admin') {
      setEmail('admin@pkljsvm.com');
      setPassword('admin');
    } else {
      // Find the first preseeded teacher
      const primaryTeacher = teachers[0] || { email: 'ramesh.sharma@pkljsvm.com' };
      setEmail(primaryTeacher.email);
      setPassword('teacher');
    }
    setErrorMsg('');
  };

  return (
    <div id="loginPage" className="max-w-md mx-auto space-y-6 py-6">
      
      {/* Login Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        {/* Banner Accent */}
        <div className="bg-gradient-to-r from-red-800 to-slate-900 text-white p-6 text-center space-y-2">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-xs">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Staff Portal Login</h2>
          <p className="text-slate-300 text-xs">For School Administrators and Class Teachers</p>
        </div>

        <form onSubmit={handleLogin} className="p-6 md:p-8 space-y-4">
          
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-300 text-rose-800 p-3 rounded-lg text-xs leading-relaxed">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Staff Email</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                required
                placeholder="email@pkljsvm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-2.5 rounded-lg text-xs tracking-wider uppercase transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>

          <button 
            type="button"
            onClick={onNavigateHome}
            className="w-full text-slate-500 hover:text-slate-800 text-xs font-medium py-1 text-center transition flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public School Site</span>
          </button>
        </form>
      </div>

      {/* Demo Credentials Quick Reference Guide */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Staff Login Credentials (For Testing)</span>
        </div>
        <p className="text-slate-600 text-xs leading-relaxed">
          Use these quick links to automatically fill in valid credentials and explore the specific dashboards:
        </p>
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button 
            onClick={() => autofill('admin')}
            className="bg-white hover:bg-amber-100/50 text-slate-700 border border-amber-200 rounded-lg p-2.5 text-left transition flex flex-col justify-between h-20"
          >
            <span className="text-[10px] font-bold text-red-700 uppercase tracking-widest block">Role: Admin</span>
            <span className="text-[11px] font-bold text-slate-900 line-clamp-1">admin@pkljsvm.com</span>
            <span className="text-[10px] text-slate-500">Password: admin</span>
          </button>

          <button 
            onClick={() => autofill('teacher')}
            className="bg-white hover:bg-amber-100/50 text-slate-700 border border-amber-200 rounded-lg p-2.5 text-left transition flex flex-col justify-between h-20"
          >
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest block">Role: Teacher</span>
            <span className="text-[11px] font-bold text-slate-900 line-clamp-1">{teachers[0]?.email || 'ramesh.sharma@pkljsvm.com'}</span>
            <span className="text-[10px] text-slate-500">Password: teacher</span>
          </button>
        </div>
      </div>
    </div>
  );
};
