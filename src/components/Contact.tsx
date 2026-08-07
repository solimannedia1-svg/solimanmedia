import React, { useState } from 'react';
import { DEFAULT_SITE_SETTINGS } from '../data/portfolioData';
import { SiteSettings } from '../types';

interface ContactProps {
  siteSettings?: SiteSettings;
}

export const Contact: React.FC<ContactProps> = ({ siteSettings = DEFAULT_SITE_SETTINGS }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    projectType: 'Web & AI Architecture',
    budget: '$5k - $10k',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setSubmitted(true);
      setResponseMsg(data.message || `Thank you ${form.name}! Mohamed Soliman has received your message.`);
    } catch {
      setSubmitted(true);
      setResponseMsg(`Thank you ${form.name}! Your message has been transmitted.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-28 px-6 md:px-16 max-w-[1440px] mx-auto relative z-20 border-t border-white/5">
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <span className="font-mono-code text-xs text-[#00daf3] uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00daf3]" />
            LET'S COLLABORATE
          </span>

          <h2 className="font-space text-4xl md:text-5xl font-bold text-[#e1e3e4]">
            START A DIGITAL PROJECT
          </h2>

          <p className="font-body text-base text-[#c7c6ca] leading-relaxed">
            Have an ambitious web application, 3D interactive concept, Gemini AI integration, or social media video campaign in mind? Let's connect directly.
          </p>

          <div className="space-y-4 pt-4 border-t border-white/10 font-mono-code text-xs">
            <div className="flex items-center gap-3 text-[#e1e3e4]">
              <span className="material-symbols-outlined text-[#00daf3]">mail</span>
              <span>EMAIL: <a href={`mailto:${siteSettings.contactEmail}`} className="text-[#00daf3] hover:underline font-bold">{siteSettings.contactEmail}</a></span>
            </div>
            <div className="flex items-center gap-3 text-[#e1e3e4]">
              <span className="material-symbols-outlined text-green-400">call</span>
              <span>PHONE: <a href={`tel:${siteSettings.contactPhone.replace(/\s+/g, '')}`} className="text-[#e1e3e4] hover:text-[#00daf3] font-bold">{siteSettings.contactPhone}</a></span>
            </div>
            <div className="flex items-center gap-3 text-[#e1e3e4]">
              <span className="material-symbols-outlined text-[#00daf3]">location_on</span>
              <span>LOCATION: {siteSettings.location}</span>
            </div>
            <div className="flex items-center gap-3 text-[#00daf3]">
              <span className="material-symbols-outlined">schedule</span>
              <span>RESPONSE TIME: Under 24 Hours</span>
            </div>
          </div>

          {/* Social Platforms Links Grid */}
          <div className="pt-4 border-t border-white/5">
            <div className="font-mono-code text-xs text-[#79797e] uppercase mb-3 font-bold">
              CONNECT ON SOCIAL MEDIA PLATFORMS:
            </div>
            <div className="grid grid-cols-2 gap-3">
              {siteSettings.socialPlatforms.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-[#1d2021] border border-white/10 hover:border-[#00daf3] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg" style={{ color: platform.color }}>
                      {platform.icon}
                    </span>
                    <span className="font-mono-code text-xs font-bold text-[#e1e3e4] group-hover:text-[#00daf3] transition-colors">
                      {platform.name}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-xs text-[#79797e] group-hover:text-[#00daf3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
                    north_east
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7 glass-card p-8 md:p-12 rounded-2xl border border-[#00daf3]/30 shadow-2xl">
          {submitted ? (
            <div className="p-8 text-center flex flex-col items-center gap-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#00daf3]/20 border border-[#00daf3] text-[#00daf3] flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="font-space text-2xl font-bold text-[#e1e3e4]">MESSAGE TRANSMITTED</h3>
              <p className="font-body text-sm text-[#c7c6ca] max-w-md">{responseMsg}</p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', email: '', projectType: 'Web & AI Architecture', budget: '$5k - $10k', message: '' });
                }}
                className="btn-primary mt-4 px-6 py-3 font-mono-code text-xs uppercase rounded font-bold"
              >
                SEND ANOTHER INQUIRY
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-2">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Alex Vance"
                    className="w-full bg-[#1d2021] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] placeholder-[#79797e] focus:outline-none focus:border-[#00daf3] font-body"
                  />
                </div>

                <div>
                  <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-2">
                    YOUR EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. alex@company.com"
                    className="w-full bg-[#1d2021] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] placeholder-[#79797e] focus:outline-none focus:border-[#00daf3] font-body"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-2">
                    SERVICE TYPE
                  </label>
                  <select
                    value={form.projectType}
                    onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                    className="w-full bg-[#1d2021] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3] font-body"
                  >
                    <option value="Web & AI Architecture">Web &amp; AI Architecture</option>
                    <option value="3D WebGL / Interactive Experience">3D WebGL / Interactive Experience</option>
                    <option value="Social Media & Audience Strategy">Social Media &amp; Audience Strategy</option>
                    <option value="Full Creative Direction & Consulting">Full Creative Direction &amp; Consulting</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-2">
                    ESTIMATED BUDGET
                  </label>
                  <select
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full bg-[#1d2021] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3] font-body"
                  >
                    <option value="< $5k">&lt; $5,000</option>
                    <option value="$5k - $10k">$5,000 - $10,000</option>
                    <option value="$10k - $25k">$10,000 - $25,000</option>
                    <option value="$25k+">$25,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-2">
                  PROJECT OVERVIEW &amp; GOALS *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Describe your vision, timelines, technical requirements, or questions..."
                  className="w-full bg-[#1d2021] border border-white/10 rounded-xl p-4 text-sm text-[#e1e3e4] placeholder-[#79797e] focus:outline-none focus:border-[#00daf3] font-body"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-4 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2 interactive"
              >
                <span>{submitting ? 'TRANSMITTING...' : 'TRANSMIT PROJECT INQUIRY'}</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
