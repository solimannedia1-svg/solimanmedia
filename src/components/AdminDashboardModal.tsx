import React, { useState } from 'react';
import { Project, SiteSettings, SocialPlatform } from '../types';
import { SKILL_CATEGORIES, JOURNEY_MILESTONES, SYSTEM_METRICS, QUICK_PROMPTS } from '../data/portfolioData';
import { getVideoSourceInfo } from '../utils/videoUtils';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSaveProjects: (projects: Project[]) => void;
  onResetDefaults: () => void;
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
  isStandalonePage?: boolean;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSaveProjects,
  onResetDefaults,
  siteSettings,
  onSaveSiteSettings,
  isStandalonePage = false
}) => {
  // Security State
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Password Change State
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [passwordChangeNotice, setPasswordChangeNotice] = useState<string>('');

  // Tabs: 'projects' | 'hero' | 'about' | 'contact' | 'security' | 'export' | 'project-form'
  const [activeTab, setActiveTab] = useState<'projects' | 'hero' | 'about' | 'contact' | 'security' | 'export' | 'project-form'>('projects');
  
  // Projects State
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmRestore, setConfirmRestore] = useState<boolean>(false);

  // Settings State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [saveNotice, setSaveNotice] = useState<string>('');

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = siteSettings.adminPassword || 'admin';
    if (passwordInput === correctPassword) {
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Incorrect Password. Access Denied.');
    }
  };

  // Handle Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPass = siteSettings.adminPassword || 'admin';
    if (oldPassword !== currentPass) {
      setPasswordChangeNotice('Error: Current password is incorrect.');
      return;
    }
    if (newPassword.length < 3) {
      setPasswordChangeNotice('Error: Password must be at least 3 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeNotice('Error: New passwords do not match.');
      return;
    }

    const updatedSettings = { ...settingsForm, adminPassword: newPassword };
    setSettingsForm(updatedSettings);
    onSaveSiteSettings(updatedSettings);
    setPasswordChangeNotice('✓ Admin Password successfully updated!');
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setTimeout(() => setPasswordChangeNotice(''), 4000);
  };

  // Handle Projects Form
  const handleOpenNew = () => {
    setEditingProject({
      id: 'proj_' + Date.now(),
      title: '',
      subtitle: '',
      category: 'web-app',
      description: '',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      videoUrl: '',
      liveUrl: '',
      tags: ['React', 'AI', 'WebGL'],
      featured: true,
      mediaType: 'image',
      aspectRatio: 'landscape'
    });
    setActiveTab('project-form');
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({ ...project });
    setActiveTab('project-form');
  };

  const handleConfirmDelete = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    onSaveProjects(updated);
    setDeletingId(null);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditingProject((prev) => ({
            ...prev,
            image: event.target!.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePortraitFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSettingsForm((prev) => ({
            ...prev,
            portraitUrl: event.target!.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditingProject((prev) => ({
            ...prev,
            videoUrl: event.target!.result as string,
            mediaType: 'video',
            aspectRatio: prev?.category === 'ai-videos' || prev?.aspectRatio === 'reel' ? 'reel' : 'reel',
            category: prev?.category || 'ai-videos'
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) return;

    const fullProject: Project = {
      id: editingProject.id || 'proj_' + Date.now(),
      title: editingProject.title || 'Untitled Project',
      subtitle: editingProject.subtitle || '',
      category: (editingProject.category as any) || 'web-app',
      description: editingProject.description || '',
      image: editingProject.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      videoUrl: editingProject.videoUrl || '',
      mediaType: editingProject.videoUrl ? 'video' : 'image',
      aspectRatio: editingProject.aspectRatio || (editingProject.category === 'ai-videos' ? 'reel' : 'landscape'),
      tags: Array.isArray(editingProject.tags)
        ? editingProject.tags
        : typeof editingProject.tags === 'string'
        ? (editingProject.tags as string).split(',').map((t) => t.trim())
        : ['Creative'],
      featured: editingProject.featured ?? true,
      liveUrl: editingProject.liveUrl || '#',
      codeSnippet: editingProject.codeSnippet || '',
      metrics: editingProject.metrics || [
        { label: 'Status', value: 'Live' },
        { label: 'Quality', value: 'High Definition' }
      ]
    };

    const index = projects.findIndex((p) => p.id === fullProject.id);
    let updated: Project[];
    if (index >= 0) {
      updated = [...projects];
      updated[index] = fullProject;
    } else {
      updated = [fullProject, ...projects];
    }

    onSaveProjects(updated);
    setActiveTab('projects');
    setEditingProject(null);
  };

  const handleSaveAllSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSiteSettings(settingsForm);
    setSaveNotice('✓ Website settings successfully saved!');
    setTimeout(() => setSaveNotice(''), 3000);
  };

  // Export portfolioData.ts file for GitHub & Vercel
  const handleDownloadCodeFile = () => {
    const fileContent = `import { Project, SkillCategory, JourneyMilestone, SystemMetric, SiteSettings } from '../types';

export const PORTRAIT_IMAGE_URL = ${JSON.stringify(settingsForm.portraitUrl, null, 2)};

export const DEFAULT_SITE_SETTINGS: SiteSettings = ${JSON.stringify(settingsForm, null, 2)};

export const PROJECTS_DATA: Project[] = ${JSON.stringify(projects, null, 2)};

export const SKILL_CATEGORIES: SkillCategory[] = ${JSON.stringify(SKILL_CATEGORIES, null, 2)};

export const JOURNEY_MILESTONES: JourneyMilestone[] = ${JSON.stringify(JOURNEY_MILESTONES, null, 2)};

export const SYSTEM_METRICS: SystemMetric[] = ${JSON.stringify(SYSTEM_METRICS, null, 2)};

export const QUICK_PROMPTS = ${JSON.stringify(QUICK_PROMPTS, null, 2)};
`;

    const blob = new Blob([fileContent], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolioData.ts';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const backupData = {
      projects,
      siteSettings: settingsForm
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (imported.projects && Array.isArray(imported.projects)) {
            onSaveProjects(imported.projects);
          }
          if (imported.siteSettings) {
            onSaveSiteSettings(imported.siteSettings);
            setSettingsForm(imported.siteSettings);
          }
          alert('✓ Portfolio data imported successfully!');
        } catch {
          alert('Error: Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAddSocialPlatform = () => {
    const newPlatform: SocialPlatform = {
      id: 'platform_' + Date.now(),
      name: 'New Social',
      url: 'https://',
      icon: 'share',
      color: '#00daf3'
    };
    setSettingsForm((prev) => ({
      ...prev,
      socialPlatforms: [...prev.socialPlatforms, newPlatform]
    }));
  };

  const handleRemoveSocialPlatform = (id: string) => {
    setSettingsForm((prev) => ({
      ...prev,
      socialPlatforms: prev.socialPlatforms.filter((p) => p.id !== id)
    }));
  };

  return (
    <div className={isStandalonePage ? "fixed inset-0 z-[100] p-3 md:p-6 bg-[#0c0f10] overflow-y-auto flex flex-col justify-center items-center" : "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn"}>
      <div className={`glass-card max-w-6xl w-full flex flex-col shadow-2xl bg-[#111415] rounded-2xl border border-[#00daf3]/50 overflow-hidden ${isStandalonePage ? "min-h-[85vh] max-h-[95vh]" : "max-h-[92vh]"}`}>
        {/* Top Header Bar */}
        <div className="p-5 bg-[#171a1b] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00daf3]/20 border border-[#00daf3] flex items-center justify-center text-[#00daf3]">
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
            </div>
            <div>
              <h3 className="font-space text-lg font-bold text-[#e1e3e4]">
                CMS CONTROL PANEL / ADMIN DASHBOARD
              </h3>
              <p className="font-mono-code text-xs text-[#00daf3]">
                Isolate URL Access • Secret Password • Vercel &amp; GitHub Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
              }}
              className="px-3.5 py-2 rounded-xl border border-[#00daf3]/50 bg-[#00daf3]/10 hover:bg-[#00daf3] hover:text-[#001f24] text-[#00daf3] font-mono-code text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,227,253,0.2)]"
              title="Return to Main Client Website"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              <span className="hidden sm:inline">VIEW PUBLIC WEBSITE</span>
            </a>
            {!isStandalonePage && (
              <button
                onClick={onClose}
                className="p-2 rounded-full border border-white/10 text-[#c7c6ca] hover:text-[#00daf3] hover:border-[#00daf3] transition-all"
                title="Close Panel"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        </div>

        {/* PASSWORD AUTHENTICATION MODAL STEP */}
        {!isAuthenticated ? (
          <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#00daf3]/10 border border-[#00daf3] flex items-center justify-center text-[#00daf3] shadow-[0_0_20px_rgba(0,227,253,0.3)]">
              <span className="material-symbols-outlined text-3xl">lock</span>
            </div>

            <div>
              <h4 className="font-space text-2xl font-bold text-[#e1e3e4]">
                ADMIN ACCESS REQUIRED
              </h4>
              <p className="font-body text-xs text-[#919094] mt-2 leading-relaxed">
                Enter your secret Admin Password to access full CMS customization controls.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              {authError && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 font-mono-code text-xs font-bold animate-fadeIn">
                  {authError}
                </div>
              )}

              <div>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter Secret Admin Password"
                  className="w-full bg-[#0c0f10] border border-[#00daf3]/40 rounded-xl px-4 py-3.5 text-center text-sm font-mono-code text-[#e1e3e4] focus:outline-none focus:border-[#00daf3] focus:ring-1 focus:ring-[#00daf3]"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3.5 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">key</span>
                <span>UNLOCK CONTROL PANEL</span>
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Navigation Tabs Header */}
            <div className="px-6 py-3 bg-[#1d2021] border-b border-white/5 flex flex-wrap items-center justify-between font-mono-code text-xs gap-2">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('hero')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'hero' ? 'bg-[#00daf3] text-[#001f24] font-bold' : 'text-[#c7c6ca] hover:text-white border border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">badge</span>
                  <span>HERO &amp; BIO</span>
                </button>

                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'about' ? 'bg-[#00daf3] text-[#001f24] font-bold' : 'text-[#c7c6ca] hover:text-white border border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">info</span>
                  <span>ABOUT &amp; STATS</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'projects' || activeTab === 'project-form'
                      ? 'bg-[#00daf3] text-[#001f24] font-bold'
                      : 'text-[#c7c6ca] hover:text-white border border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">view_carousel</span>
                  <span>PROJECTS ({projects.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('contact')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'contact' ? 'bg-[#00daf3] text-[#001f24] font-bold' : 'text-[#c7c6ca] hover:text-white border border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">share</span>
                  <span>SOCIAL &amp; CONTACT</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'security' ? 'bg-[#00daf3] text-[#001f24] font-bold' : 'text-[#c7c6ca] hover:text-white border border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">security</span>
                  <span>PASSWORD</span>
                </button>

                <button
                  onClick={() => setActiveTab('export')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'export' ? 'bg-[#00daf3] text-[#001f24] font-bold' : 'text-[#c7c6ca] hover:text-white border border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">cloud_sync</span>
                  <span>VERCEL / GITHUB EXPORT</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-2.5 py-1 rounded bg-red-950/60 text-red-400 border border-red-500/30 hover:bg-red-900 font-bold flex items-center gap-1"
                  title="Lock Dashboard"
                >
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span>LOCK</span>
                </button>
              </div>
            </div>

            {/* Dashboard Content Panel */}
            <div className="flex-1 p-6 overflow-y-auto bg-[#0c0f10]">
              {saveNotice && (
                <div className="p-4 mb-4 rounded-xl bg-green-950/80 border border-green-500/50 text-green-300 font-mono-code text-xs font-bold animate-fadeIn">
                  {saveNotice}
                </div>
              )}

              {/* TAB 1: HERO & PERSONAL INFO */}
              {activeTab === 'hero' && (
                <form onSubmit={handleSaveAllSettings} className="space-y-6">
                  <div className="p-6 rounded-xl bg-[#1d2021] border border-white/10 space-y-4">
                    <h4 className="font-space text-base font-bold text-[#e1e3e4] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00daf3]">badge</span>
                      <span>HERO SECTION &amp; PERSONAL IDENTITY</span>
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          FULL NAME *
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.name}
                          onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                          placeholder="e.g. MOHAMED SOLIMAN"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          TITLE / SUBTITLE *
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.title}
                          onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
                          placeholder="e.g. FULL-STACK ENGINEER & AI CREATIVE STRATEGIST"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                        HERO TAGLINE / MAIN HEADLINE *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        placeholder="e.g. I Build Digital Experiences Where Code, AI & Creativity Meet."
                        className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                        HERO BIO / SUMMARY
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.bio}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                        placeholder="Brief intro text..."
                        className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          PORTRAIT IMAGE URL OR FILE UPLOAD
                        </label>
                        <input
                          type="text"
                          value={settingsForm.portraitUrl}
                          onChange={(e) => setSettingsForm({ ...settingsForm, portraitUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3] mb-2"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePortraitFileUpload}
                          className="w-full text-xs font-mono-code text-[#c7c6ca] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#00daf3] file:text-[#001f24] file:font-bold cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center gap-3 bg-[#0c0f10] p-3 rounded-xl border border-white/5">
                        <img
                          src={settingsForm.portraitUrl}
                          alt="Portrait Preview"
                          className="w-20 h-24 object-cover rounded-lg border border-white/10 shrink-0"
                        />
                        <div className="font-mono-code text-xs text-[#919094]">
                          <span className="text-[#00daf3] block font-bold">PORTRAIT PREVIEW</span>
                          <span>Will render in Hero 3D Card</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          LOCATION
                        </label>
                        <input
                          type="text"
                          value={settingsForm.location}
                          onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
                          placeholder="e.g. Cairo, Egypt / Remote Worldwide"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          AVAILABILITY STATUS
                        </label>
                        <input
                          type="text"
                          value={settingsForm.availability}
                          onChange={(e) => setSettingsForm({ ...settingsForm, availability: e.target.value })}
                          placeholder="e.g. AVAILABLE FOR SELECT PROJECTS"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-4 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">save</span>
                    <span>SAVE HERO &amp; BIO CHANGES</span>
                  </button>
                </form>
              )}

              {/* TAB 2: ABOUT SECTION & STATS */}
              {activeTab === 'about' && (
                <form onSubmit={handleSaveAllSettings} className="space-y-6">
                  <div className="p-6 rounded-xl bg-[#1d2021] border border-white/10 space-y-4">
                    <h4 className="font-space text-base font-bold text-[#e1e3e4] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00daf3]">info</span>
                      <span>ABOUT ME SECTION &amp; KEY METRICS</span>
                    </h4>

                    <div>
                      <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                        ABOUT SECTION SUBHEADING
                      </label>
                      <input
                        type="text"
                        value={settingsForm.aboutHeading || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, aboutHeading: e.target.value })}
                        placeholder="e.g. ARCHITECTING NEXT-GEN DIGITAL EXPERIENCES"
                        className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                        ABOUT ME DETAILED BIO
                      </label>
                      <textarea
                        rows={4}
                        value={settingsForm.aboutBio || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, aboutBio: e.target.value })}
                        placeholder="Extended description of your background and achievements..."
                        className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                      />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          YEARS EXP.
                        </label>
                        <input
                          type="text"
                          value={settingsForm.yearsExp || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, yearsExp: e.target.value })}
                          placeholder="e.g. 5+"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          PROJECTS COUNT
                        </label>
                        <input
                          type="text"
                          value={settingsForm.projectsCount || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, projectsCount: e.target.value })}
                          placeholder="e.g. 40+"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          MEDIA REACH
                        </label>
                        <input
                          type="text"
                          value={settingsForm.impressions || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, impressions: e.target.value })}
                          placeholder="e.g. 3.5M+"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          SATISFACTION
                        </label>
                        <input
                          type="text"
                          value={settingsForm.clientSatisfaction || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, clientSatisfaction: e.target.value })}
                          placeholder="e.g. 100%"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-4 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">save</span>
                    <span>SAVE ABOUT SECTION CHANGES</span>
                  </button>
                </form>
              )}

              {/* TAB 3: PROJECTS SHOWCASE */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-[#1d2021] p-4 rounded-xl border border-white/5">
                    <span className="font-mono-code text-xs text-[#c7c6ca] font-bold">
                      PORTFOLIO SHOWCASE ITEMS ({projects.length})
                    </span>
                    <button
                      onClick={handleOpenNew}
                      className="px-4 py-2 rounded-xl bg-[#00daf3] text-[#001f24] font-mono-code text-xs font-bold hover:bg-[#00daf3]/80 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>ADD NEW PROJECT</span>
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="p-4 rounded-xl bg-[#1d2021] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#00daf3]/40 transition-colors"
                      >
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          {project.videoUrl ? (
                            <div className="w-20 h-14 rounded-lg bg-black overflow-hidden border border-white/10 shrink-0 relative flex items-center justify-center">
                              {(() => {
                                const info = getVideoSourceInfo(project.videoUrl);
                                if (info.type === 'youtube' || info.type === 'vimeo') {
                                  return (
                                    <iframe
                                      src={info.embedUrl}
                                      className="w-full h-full border-0 pointer-events-none"
                                      title={project.title}
                                    />
                                  );
                                }
                                return <video src={info.embedUrl} className="w-full h-full object-cover" muted />;
                              })()}
                              <span className="absolute inset-0 flex items-center justify-center text-[#00daf3] bg-black/40 pointer-events-none">
                                <span className="material-symbols-outlined text-sm">play_circle</span>
                              </span>
                            </div>
                          ) : (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-20 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                            />
                          )}
                          <div>
                            <span className="font-mono-code text-[10px] px-2 py-0.5 rounded bg-[#00daf3]/10 text-[#00daf3] border border-[#00daf3]/30 uppercase font-semibold">
                              {project.category === 'web-app'
                                ? 'WEB APP'
                                : project.category === 'brand-media'
                                ? 'BRAND & MEDIA'
                                : 'AI REEL / VIDEO'}
                            </span>
                            <h4 className="font-space text-base font-bold text-[#e1e3e4] mt-1">
                              {project.title}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(project)}
                            className="px-3 py-1.5 font-mono-code text-xs rounded bg-white/10 text-[#e1e3e4] hover:bg-[#00daf3] hover:text-[#001f24] transition-colors flex items-center gap-1 font-bold"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            <span>EDIT</span>
                          </button>

                          {deletingId === project.id ? (
                            <div className="flex items-center gap-1 bg-red-950/80 p-1 rounded border border-red-500/50">
                              <span className="font-mono-code text-[10px] text-red-300 font-bold px-1">CONFIRM?</span>
                              <button
                                type="button"
                                onClick={() => handleConfirmDelete(project.id)}
                                className="px-2 py-1 font-mono-code text-[11px] rounded bg-red-600 text-white font-bold hover:bg-red-500"
                              >
                                DELETE
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingId(null)}
                                className="px-2 py-1 font-mono-code text-[11px] rounded bg-white/10 text-white"
                              >
                                X
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeletingId(project.id)}
                              className="px-3 py-1.5 font-mono-code text-xs rounded bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1 font-bold"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              <span>DELETE</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECT EDIT / ADD FORM TAB */}
              {activeTab === 'project-form' && (
                <form onSubmit={handleSaveProjectForm} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-2">
                        PROJECT TITLE *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject?.title || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => ({ ...prev, title: e.target.value }))
                        }
                        placeholder="e.g. AURA MIND WEB APP"
                        className="w-full bg-[#1d2021] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                      />
                    </div>

                    <div>
                      <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-2">
                        SUBTITLE / TAGLINE
                      </label>
                      <input
                        type="text"
                        value={editingProject?.subtitle || ''}
                        onChange={(e) =>
                          setEditingProject((prev) => ({ ...prev, subtitle: e.target.value }))
                        }
                        placeholder="e.g. AI Multimodal Spatial Canvas Engine"
                        className="w-full bg-[#1d2021] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-2">
                      CATEGORY *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'web-app', label: 'WEB APPLICATION', icon: 'web' },
                        { id: 'brand-media', label: 'BRAND & MEDIA', icon: 'campaign' },
                        { id: 'ai-videos', label: 'AI VIDEOS & REELS', icon: 'movie' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() =>
                            setEditingProject((prev) => ({
                              ...prev,
                              category: cat.id as any,
                              mediaType: cat.id === 'ai-videos' ? 'video' : prev?.mediaType,
                              aspectRatio: cat.id === 'ai-videos' ? 'reel' : prev?.aspectRatio
                            }))
                          }
                          className={`p-4 rounded-xl border font-mono-code text-xs flex flex-col items-center gap-2 transition-all ${
                            editingProject?.category === cat.id
                              ? 'bg-[#00daf3]/20 border-[#00daf3] text-[#00daf3] font-bold shadow-[0_0_15px_rgba(0,227,253,0.2)]'
                              : 'bg-[#1d2021] border-white/10 text-[#c7c6ca] hover:border-white/30'
                          }`}
                        >
                          <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                          <span>{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {editingProject?.category === 'ai-videos' && (
                    <div className="p-4 rounded-xl bg-[#1d2021] border border-[#00daf3]/30 space-y-3">
                      <label className="block font-mono-code text-xs text-[#00daf3] uppercase font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">crop_portrait</span>
                        <span>VIDEO DISPLAY FORMAT (ASPECT RATIO)</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3 font-mono-code text-xs">
                        <button
                          type="button"
                          onClick={() => setEditingProject((prev) => ({ ...prev, aspectRatio: 'reel' }))}
                          className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${
                            editingProject.aspectRatio === 'reel' || !editingProject.aspectRatio
                              ? 'bg-[#00daf3] text-[#001f24] font-bold border-[#00daf3]'
                              : 'bg-[#0c0f10] text-[#c7c6ca] border-white/10'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">stay_current_portrait</span>
                          <span>REEL 9:16 VERTICAL (TIKTOK/SHORTS)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingProject((prev) => ({ ...prev, aspectRatio: 'landscape' }))}
                          className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${
                            editingProject.aspectRatio === 'landscape'
                              ? 'bg-[#00daf3] text-[#001f24] font-bold border-[#00daf3]'
                              : 'bg-[#0c0f10] text-[#c7c6ca] border-white/10'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">crop_landscape</span>
                          <span>16:9 LANDSCAPE CINEMATIC</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-2">
                      PROJECT DESCRIPTION *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={editingProject?.description || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="Detailed explanation of features..."
                      className="w-full bg-[#1d2021] border border-white/10 rounded-xl p-4 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#1d2021] border border-white/10 space-y-4">
                    <label className="block font-mono-code text-xs text-[#00daf3] uppercase font-bold">
                      COVER IMAGE / THUMBNAIL
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-code text-[11px] text-[#79797e] mb-1">
                          Option A: Image URL
                        </label>
                        <input
                          type="text"
                          value={editingProject?.image || ''}
                          onChange={(e) =>
                            setEditingProject((prev) => ({ ...prev, image: e.target.value }))
                          }
                          placeholder="https://..."
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code text-[11px] text-[#79797e] mb-1">
                          Option B: Upload Image File
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="w-full text-xs font-mono-code text-[#c7c6ca] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#00daf3] file:text-[#001f24] file:font-bold cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#1d2021] border border-[#00daf3]/30 space-y-4">
                    <label className="block font-mono-code text-xs text-[#00daf3] uppercase font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">movie</span>
                      <span>VIDEO SOURCE (YOUTUBE, SHORTS, VIMEO, OR DIRECT MP4)</span>
                    </label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-code text-[11px] text-[#79797e] mb-1">
                          Option A: Video Link (YouTube, Shorts, Vimeo, MP4)
                        </label>
                        <input
                          type="text"
                          value={editingProject?.videoUrl || ''}
                          onChange={(e) =>
                            setEditingProject((prev) => ({
                              ...prev,
                              videoUrl: e.target.value,
                              mediaType: e.target.value ? 'video' : 'image',
                              category: prev?.category || 'ai-videos'
                            }))
                          }
                          placeholder="https://youtube.com/watch?v=... or https://youtu.be/... or .mp4"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code text-[11px] text-[#79797e] mb-1">
                          Option B: Upload Local Video File
                        </label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoFileUpload}
                          className="w-full text-xs font-mono-code text-[#c7c6ca] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#00daf3] file:text-[#001f24] file:font-bold cursor-pointer"
                        />
                      </div>
                    </div>

                    <p className="font-mono-code text-[11px] text-[#919094]">
                      💡 <strong className="text-[#00daf3]">Tip:</strong> You can paste any YouTube link, YouTube Shorts link, Vimeo link, or MP4 URL. They will play seamlessly on the main website!
                    </p>

                    {/* Live Preview Box */}
                    {editingProject?.videoUrl && editingProject.videoUrl.trim() !== '' && (
                      <div className="p-3 bg-[#0c0f10] rounded-xl border border-[#00daf3]/40 space-y-2">
                        <div className="font-mono-code text-[11px] text-[#00daf3] font-bold flex items-center justify-between">
                          <span>INSTANT VIDEO LIVE PREVIEW</span>
                          <span className="text-[10px] text-[#79797e] px-2 py-0.5 rounded bg-white/5 uppercase">
                            {getVideoSourceInfo(editingProject.videoUrl).type}
                          </span>
                        </div>
                        <div className="h-52 rounded-lg overflow-hidden bg-black flex items-center justify-center relative border border-white/10">
                          {(() => {
                            const info = getVideoSourceInfo(editingProject.videoUrl);
                            if (info.type === 'youtube' || info.type === 'vimeo') {
                              return (
                                <iframe
                                  src={info.embedUrl}
                                  title="Admin Video Preview"
                                  className="w-full h-full border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              );
                            }
                            return (
                              <video
                                src={info.embedUrl}
                                controls
                                className="w-full h-full object-contain"
                              />
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-2">
                      LIVE WEBSITE DEMO URL
                    </label>
                    <input
                      type="text"
                      value={editingProject?.liveUrl || ''}
                      onChange={(e) =>
                        setEditingProject((prev) => ({ ...prev, liveUrl: e.target.value }))
                      }
                      placeholder="https://..."
                      className="w-full bg-[#1d2021] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-2">
                      TAGS (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={
                        Array.isArray(editingProject?.tags)
                          ? editingProject.tags.join(', ')
                          : editingProject?.tags || ''
                      }
                      onChange={(e) =>
                        setEditingProject((prev) => ({
                          ...prev,
                          tags: e.target.value as any
                        }))
                      }
                      placeholder="React, AI, WebGL"
                      className="w-full bg-[#1d2021] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                    />
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setActiveTab('projects')}
                      className="px-6 py-3 font-mono-code text-xs uppercase rounded-xl border border-white/10 text-[#c7c6ca]"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1 py-3 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">save</span>
                      <span>SAVE PROJECT</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: SOCIAL MEDIA & DIRECT CONTACT */}
              {activeTab === 'contact' && (
                <form onSubmit={handleSaveAllSettings} className="space-y-6">
                  <div className="p-6 rounded-xl bg-[#1d2021] border border-white/10 space-y-4">
                    <h4 className="font-space text-base font-bold text-[#e1e3e4] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00daf3]">contact_phone</span>
                      <span>DIRECT CONTACT DETAILS</span>
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          EMAIL ADDRESS *
                        </label>
                        <input
                          type="email"
                          required
                          value={settingsForm.contactEmail}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          PHONE NUMBER *
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.contactPhone}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-[#1d2021] border border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-space text-base font-bold text-[#e1e3e4] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#00daf3]">share</span>
                        <span>SOCIAL MEDIA PLATFORMS</span>
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddSocialPlatform}
                        className="px-3 py-1.5 rounded-lg bg-[#00daf3]/10 text-[#00daf3] border border-[#00daf3]/30 font-mono-code text-xs font-bold hover:bg-[#00daf3] hover:text-[#001f24]"
                      >
                        + ADD PLATFORM
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {settingsForm.socialPlatforms.map((platform, idx) => (
                        <div key={platform.id} className="p-4 rounded-xl bg-[#0c0f10] border border-white/5 space-y-3">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={platform.name}
                              onChange={(e) => {
                                const updated = [...settingsForm.socialPlatforms];
                                updated[idx] = { ...updated[idx], name: e.target.value };
                                setSettingsForm({ ...settingsForm, socialPlatforms: updated });
                              }}
                              className="bg-[#1d2021] border border-white/10 rounded px-2.5 py-1 text-xs font-bold text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveSocialPlatform(platform.id)}
                              className="text-red-400 hover:text-red-300 text-xs font-bold"
                            >
                              REMOVE
                            </button>
                          </div>

                          <div>
                            <label className="block font-mono-code text-[10px] text-[#79797e] uppercase mb-1">
                              PROFILE URL
                            </label>
                            <input
                              type="url"
                              value={platform.url}
                              onChange={(e) => {
                                const updated = [...settingsForm.socialPlatforms];
                                updated[idx] = { ...updated[idx], url: e.target.value };
                                setSettingsForm({ ...settingsForm, socialPlatforms: updated });
                              }}
                              className="w-full bg-[#1d2021] border border-white/10 rounded-lg px-3 py-2 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-4 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">save</span>
                    <span>SAVE SOCIAL &amp; CONTACT DETAILS</span>
                  </button>
                </form>
              )}

              {/* TAB 5: SECURITY & ADMIN PASSWORD */}
              {activeTab === 'security' && (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="p-6 rounded-xl bg-[#1d2021] border border-[#00daf3]/30 space-y-4">
                    <h4 className="font-space text-base font-bold text-[#e1e3e4] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#00daf3]">security</span>
                      <span>CHANGE ADMIN CONTROL PANEL PASSWORD</span>
                    </h4>

                    <p className="font-body text-xs text-[#919094] leading-relaxed">
                      Update the password required to log in to this control panel. The password is saved securely in your browser and never shown publicly.
                    </p>

                    {passwordChangeNotice && (
                      <div className={`p-4 rounded-xl border font-mono-code text-xs font-bold animate-fadeIn ${
                        passwordChangeNotice.startsWith('✓')
                          ? 'bg-green-950/80 border-green-500/50 text-green-300'
                          : 'bg-red-950/80 border-red-500/50 text-red-300'
                      }`}>
                        {passwordChangeNotice}
                      </div>
                    )}

                    <div>
                      <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                        CURRENT ADMIN PASSWORD *
                      </label>
                      <input
                        type="password"
                        required
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          NEW ADMIN PASSWORD *
                        </label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          CONFIRM NEW PASSWORD *
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          placeholder="Re-type new password"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full py-4 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">lock_reset</span>
                    <span>UPDATE ADMIN PASSWORD</span>
                  </button>
                </form>
              )}

              {/* TAB 6: VERCEL & GITHUB DEPLOYMENT EXPORT */}
              {activeTab === 'export' && (
                <div className="space-y-6 font-mono-code text-xs">
                  <div className="p-6 rounded-xl bg-[#1d2021] border border-[#00daf3]/40 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#00daf3] text-2xl">cloud_sync</span>
                      <div>
                        <h4 className="font-space text-lg font-bold text-[#e1e3e4]">
                          SAVE &amp; EXPORT FOR GITHUB &amp; VERCEL DEPLOYMENT
                        </h4>
                        <p className="text-[#00daf3]">
                          تصدير البيانات لحفظ التعديلات نهائياً على جيت هوب وفيرسل
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0c0f10] border border-white/10 text-[#c7c6ca] space-y-3 leading-relaxed">
                      <p>
                        <strong>How to keep changes permanent on Vercel:</strong>
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-[11px] text-[#919094]">
                        <li>All modifications made in this panel are active immediately in your current browser session via <code>localStorage</code>.</li>
                        <li>To make your updates permanent when pushing code to <strong>GitHub</strong> and deploying to <strong>Vercel</strong>, click <span className="text-[#00daf3] font-bold">"DOWNLOAD portfolioData.ts"</span> below.</li>
                        <li>Replace the file at <code className="text-[#00daf3]">src/data/portfolioData.ts</code> in your project repository before committing to GitHub.</li>
                        <li>Your Vercel site will automatically build with all your latest projects, links, and hero text!</li>
                      </ol>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                      <button
                        type="button"
                        onClick={handleDownloadCodeFile}
                        className="p-5 rounded-xl bg-[#00daf3] text-[#001f24] font-bold hover:bg-[#00daf3]/80 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,227,253,0.3)] text-xs"
                      >
                        <span className="material-symbols-outlined text-xl">file_download</span>
                        <span>DOWNLOAD portfolioData.ts (FOR GITHUB/VERCEL)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportJSON}
                        className="p-5 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-xs"
                      >
                        <span className="material-symbols-outlined text-xl">download</span>
                        <span>DOWNLOAD JSON BACKUP</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-[#1d2021] border border-white/10 space-y-4">
                    <h4 className="font-space text-base font-bold text-[#e1e3e4]">
                      RESTORE DATA FROM BACKUP FILE
                    </h4>
                    <p className="text-[#919094]">
                      Import a previously downloaded <code>portfolio_backup.json</code> file to restore all projects and site settings.
                    </p>

                    <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 cursor-pointer transition-colors">
                      <span className="material-symbols-outlined text-sm">upload_file</span>
                      <span>SELECT BACKUP JSON FILE</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJSON}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
