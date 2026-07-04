/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StaticContent, ContactSubmission } from '../db';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Navigation } from 'lucide-react';

interface ContactProps {
  staticContent: StaticContent;
  onSaveSubmission: (submission: Omit<ContactSubmission, 'id' | 'date' | 'status'>) => void;
}

export const Contact: React.FC<ContactProps> = ({ staticContent, onSaveSubmission }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert("Please fill in Name, Phone, and Message fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSaveSubmission(formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div id="contactPage" className="space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-red-750 font-bold uppercase tracking-wider text-xs">COMMUNICATION PATHWAYS</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Connect With Us
        </h1>
        <div className="h-1.5 w-16 bg-amber-500 mx-auto rounded" />
        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
          Have an inquiry about school bus routes, fees, admission schedules, or subject guidelines? Drop us a message below or call our admissions cell.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Simulated Map */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Contacts */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-base md:text-lg border-b border-slate-100 pb-3">
              Office Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-red-750 flex-shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm">
                  <h4 className="font-bold text-slate-900">Campus Address</h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">{staticContent.address}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Phone className="w-5 h-5 text-red-750 flex-shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm">
                  <h4 className="font-bold text-slate-900">Phone Numbers</h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">{staticContent.phone}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Mail className="w-5 h-5 text-red-750 flex-shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm">
                  <h4 className="font-bold text-slate-900">Admissions Email</h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">{staticContent.email}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Clock className="w-5 h-5 text-red-750 flex-shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm">
                  <h4 className="font-bold text-slate-900">Office Working Hours</h4>
                  <p className="text-slate-600 mt-1">Monday - Saturday: 08:00 AM - 02:00 PM</p>
                  <p className="text-slate-500 text-[10px]">Closed on Sundays & National Holidays</p>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Google Map simulation */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-indigo-700" />
              Location Map Representation
            </h4>
            
            {/* Interactive Map Block */}
            <div className="relative h-[220px] rounded-lg bg-emerald-50 border border-slate-200 overflow-hidden flex flex-col justify-between p-4">
              {/* Abstract Map Roads Drawing */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute h-full w-4 bg-slate-400 left-1/3 rotate-12" />
                <div className="absolute h-full w-3 bg-slate-400 left-2/3 -rotate-45" />
                <div className="absolute w-full h-4 bg-slate-400 top-1/4" />
                <div className="absolute w-full h-3 bg-slate-400 top-2/3" />
                <div className="absolute w-12 h-12 rounded-full border-4 border-slate-400 left-10 top-10" />
              </div>

              {/* Pin Accent */}
              <div className="absolute left-[45%] top-[40%] text-center animate-bounce z-10">
                <MapPin className="w-8 h-8 text-red-600 drop-shadow-md mx-auto fill-red-200" />
                <span className="inline-block bg-slate-950 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-md uppercase tracking-wider">
                  PKLJSVM School
                </span>
              </div>

              <div className="z-10 text-[10px] text-slate-500 leading-relaxed max-w-[200px] bg-white/90 p-2.5 rounded-md border border-slate-250 backdrop-blur-xs self-start mt-auto shadow-xs">
                <strong className="text-slate-800">Saini Bilaspur Highway Road</strong>
                <p>Greater Noida, Uttar Pradesh, India</p>
                <a 
                  href="https://maps.google.com/?q=Premwati+Kunji+Lal+Jain+Saraswati+Vidhya+Mandir" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-indigo-700 font-bold hover:underline block mt-1"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-slate-900 text-xl md:text-2xl tracking-tight">
              Admissions & General Enquiry Form
            </h3>
            <p className="text-slate-500 text-xs">
              Fill in your details. Submissions are saved to the administration inbox and reviewed promptly.
            </p>
          </div>

          {/* Success Banner */}
          {isSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-lg flex gap-3 items-center animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="text-xs md:text-sm">
                <strong className="font-bold">Message sent successfully!</strong>
                <p className="text-emerald-700 mt-0.5">We have registered your inquiry. Our administration committee will get in touch with you shortly.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Parent / Student Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Alok Dwivedi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Phone Number *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address (Optional)</label>
              <input 
                type="email" 
                placeholder="e.g. parent@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Detailed Query Message *</label>
              <textarea 
                rows={5}
                required
                placeholder="Describe your question or enrollment request in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs md:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 leading-relaxed"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-750 hover:bg-red-800 disabled:bg-slate-400 text-white font-bold py-2.5 rounded-lg text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Enquiry</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
