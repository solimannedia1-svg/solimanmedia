import React, { useState, useEffect } from 'react';
import { Project, SiteSettings, SocialPlatform, GalleryItem, ContactMessage } from '../types';
import { SKILL_CATEGORIES, JOURNEY_MILESTONES, SYSTEM_METRICS, QUICK_PROMPTS, DEFAULT_GALLERY_ITEMS, DEFAULT_BUDGET_OPTIONS, DEFAULT_SERVICE_OPTIONS } from '../data/portfolioData';
import { getVideoSourceInfo, getYouTubeThumbnail, getItemDisplayImage, DEFAULT_FALLBACK_IMAGE, isReelVideo } from '../utils/videoUtils';
import { SocialIcon } from './SocialIcon';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onSaveProjects: (projects: Project[]) => void;
  onResetDefaults: () => void;
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
  isStandalonePage?: boolean;
  messages?: ContactMessage[];
  onSaveMessages?: (messages: ContactMessage[]) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  projects,
  onSaveProjects,
  onResetDefaults,
  siteSettings,
  onSaveSiteSettings,
  isStandalonePage = false,
  messages = [],
  onSaveMessages
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

  // Tabs
  const [activeTab, setActiveTab] = useState<'projects' | 'hero' | 'about' | 'gallery' | 'gallery-form' | 'contact' | 'security' | 'export' | 'project-form' | 'messages'>('messages');

  // Messages state
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [messageSearch, setMessageSearch] = useState<string>('');
  const [showDirectMsgForm, setShowDirectMsgForm] = useState<boolean>(false);
  const [directMsgForm, setDirectMsgForm] = useState({
    name: 'Admin Direct Message',
    email: 'soliman@solimanmedia.site',
    projectType: 'Web & AI Architecture',
    budget: '$5,000 - $10,000',
    message: ''
  });
  
  // Projects State
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmRestore, setConfirmRestore] = useState<boolean>(false);

  // Gallery CMS State
  const [editingGalleryItem, setEditingGalleryItem] = useState<Partial<GalleryItem> | null>(null);

  // Settings State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [saveNotice, setSaveNotice] = useState<string>('');

  useEffect(() => {
    if (siteSettings) {
      setSettingsForm({
        ...siteSettings,
        galleryItems: Array.isArray(siteSettings.galleryItems)
          ? siteSettings.galleryItems
          : DEFAULT_GALLERY_ITEMS
      });
    }
  }, [siteSettings]);

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
      aspectRatio: 'landscape',
      metrics: [
        { label: 'FPS TARGET', value: '120 FPS' },
        { label: 'PERFORMANCE', value: '100 / 100' },
        { label: 'SECURITY', value: 'AES-256' }
      ]
    });
    setActiveTab('project-form');
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({
      ...project,
      metrics: project.metrics ? project.metrics.map(m => ({ ...m })) : [
        { label: 'FPS TARGET', value: '120 FPS' },
        { label: 'PERFORMANCE', value: '100 / 100' },
        { label: 'SECURITY', value: 'AES-256' }
      ]
    });
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
      metrics: editingProject.metrics || []
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

  // Gallery CRUD Handlers
  const currentGalleryItems = Array.isArray(settingsForm.galleryItems)
    ? settingsForm.galleryItems
    : DEFAULT_GALLERY_ITEMS;

  const handleOpenNewGalleryItem = () => {
    setEditingGalleryItem({
      id: 'gal_' + Date.now(),
      title: '',
      personName: '',
      personRole: '',
      category: 'celebrity',
      mediaType: 'image',
      image: '',
      videoUrl: '',
      description: '',
      date: '2025',
      featured: true
    });
    setActiveTab('gallery-form');
  };

  const handleOpenEditGalleryItem = (item: GalleryItem) => {
    setEditingGalleryItem({ ...item });
    setActiveTab('gallery-form');
  };

  const handleDeleteGalleryItem = (id: string) => {
    const updatedItems = currentGalleryItems.filter((g) => g.id !== id);
    const updatedSettings = { ...settingsForm, galleryItems: updatedItems };
    setSettingsForm(updatedSettings);
    onSaveSiteSettings(updatedSettings);
    setSaveNotice('✓ Gallery item removed');
    setTimeout(() => setSaveNotice(''), 3000);
  };

  const handleSaveGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGalleryItem || !editingGalleryItem.title) return;

    const computedVideoUrl = editingGalleryItem.videoUrl ? editingGalleryItem.videoUrl.trim() : '';
    const computedMediaType = (editingGalleryItem.mediaType as any) || (computedVideoUrl ? 'video' : 'image');

    const fullItem: GalleryItem = {
      id: editingGalleryItem.id || 'gal_' + Date.now(),
      title: editingGalleryItem.title,
      personName: editingGalleryItem.personName || '',
      personRole: editingGalleryItem.personRole || '',
      category: (editingGalleryItem.category as any) || 'celebrity',
      mediaType: computedMediaType,
      image: (editingGalleryItem.image && editingGalleryItem.image.trim())
        ? editingGalleryItem.image.trim()
        : getItemDisplayImage({ image: editingGalleryItem.image, videoUrl: computedVideoUrl, mediaType: computedMediaType }),
      videoUrl: computedVideoUrl,
      description: editingGalleryItem.description || '',
      date: editingGalleryItem.date || '2025',
      featured: editingGalleryItem.featured ?? true
    };

    const idx = currentGalleryItems.findIndex((g) => g.id === fullItem.id);
    let updatedList: GalleryItem[];
    if (idx >= 0) {
      updatedList = [...currentGalleryItems];
      updatedList[idx] = fullItem;
    } else {
      updatedList = [...currentGalleryItems, fullItem];
    }

    const updatedSettings = { ...settingsForm, galleryItems: updatedList };
    setSettingsForm(updatedSettings);
    onSaveSiteSettings(updatedSettings);
    setEditingGalleryItem(null);
    setActiveTab('gallery');
    setSaveNotice('✓ Gallery item saved successfully!');
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

  // Messages Management Handlers
  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  const handleToggleReadMessage = (id: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, read: !m.read } : m));
    onSaveMessages?.(updated);
  };

  const handleMarkAllRead = () => {
    const updated = messages.map((m) => ({ ...m, read: true }));
    onSaveMessages?.(updated);
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    onSaveMessages?.(updated);
  };

  const handleClearAllMessages = () => {
    if (window.confirm('Are you sure you want to delete ALL messages?')) {
      onSaveMessages?.([]);
    }
  };

  const handleSendAdminDirectMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directMsgForm.message.trim()) return;

    const newMsg: ContactMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: directMsgForm.name.trim() || 'Admin Note',
      email: directMsgForm.email.trim(),
      projectType: directMsgForm.projectType,
      budget: directMsgForm.budget,
      message: directMsgForm.message.trim(),
      createdAt: new Date().toISOString(),
      read: true
    };

    onSaveMessages?.([newMsg, ...messages]);
    setDirectMsgForm((prev) => ({ ...prev, message: '' }));
    setShowDirectMsgForm(false);
    setSaveNotice('✓ Direct message recorded successfully!');
    setTimeout(() => setSaveNotice(''), 3000);
  };

  // Budget Options Management Handlers
  const currentBudgetOptions = (settingsForm.budgetOptions && settingsForm.budgetOptions.length > 0)
    ? settingsForm.budgetOptions
    : DEFAULT_BUDGET_OPTIONS;

  const handleAddBudgetOption = () => {
    const updated = [...currentBudgetOptions, 'New Budget Range'];
    setSettingsForm((prev) => ({ ...prev, budgetOptions: updated }));
  };

  const handleUpdateBudgetOption = (idx: number, val: string) => {
    const updated = [...currentBudgetOptions];
    updated[idx] = val;
    setSettingsForm((prev) => ({ ...prev, budgetOptions: updated }));
  };

  const handleRemoveBudgetOption = (idx: number) => {
    const updated = currentBudgetOptions.filter((_, i) => i !== idx);
    setSettingsForm((prev) => ({ ...prev, budgetOptions: updated }));
  };

  const handleMoveBudgetOption = (idx: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === currentBudgetOptions.length - 1)) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...currentBudgetOptions];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSettingsForm((prev) => ({ ...prev, budgetOptions: updated }));
  };

  const handleApplyBudgetPreset = (presetList: string[]) => {
    setSettingsForm((prev) => ({ ...prev, budgetOptions: presetList }));
    setSaveNotice('✓ Budget preset applied!');
    setTimeout(() => setSaveNotice(''), 3000);
  };

  // Service Options Management Handlers
  const currentServiceOptions = (settingsForm.serviceOptions && settingsForm.serviceOptions.length > 0)
    ? settingsForm.serviceOptions
    : DEFAULT_SERVICE_OPTIONS;

  const handleAddServiceOption = () => {
    const updated = [...currentServiceOptions, 'New Service Category'];
    setSettingsForm((prev) => ({ ...prev, serviceOptions: updated }));
  };

  const handleUpdateServiceOption = (idx: number, val: string) => {
    const updated = [...currentServiceOptions];
    updated[idx] = val;
    setSettingsForm((prev) => ({ ...prev, serviceOptions: updated }));
  };

  const handleRemoveServiceOption = (idx: number) => {
    const updated = currentServiceOptions.filter((_, i) => i !== idx);
    setSettingsForm((prev) => ({ ...prev, serviceOptions: updated }));
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
                  onClick={() => setActiveTab('messages')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 relative cursor-pointer ${
                    activeTab === 'messages'
                      ? 'bg-[#00daf3] text-[#001f24] font-bold shadow-lg shadow-[#00daf3]/20'
                      : 'text-[#c7c6ca] hover:text-white border border-white/10 hover:border-[#00daf3]/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">mark_email_unread</span>
                  <span>MESSAGES ({messages.length})</span>
                  {unreadMessagesCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
                      {unreadMessagesCount} NEW
                    </span>
                  )}
                </button>

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
                  onClick={() => setActiveTab('gallery')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'gallery' || activeTab === 'gallery-form'
                      ? 'bg-[#00daf3] text-[#001f24] font-bold'
                      : 'text-[#c7c6ca] hover:text-white border border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">stars</span>
                  <span>GALLERY ({currentGalleryItems.length})</span>
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

              {/* TAB 0: MESSAGES & PROJECT INQUIRIES */}
              {activeTab === 'messages' && (
                <div className="space-y-6">
                  {/* Messages Header Bar & Action Stats */}
                  <div className="p-6 rounded-xl bg-[#1d2021] border border-[#00daf3]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-space text-lg font-bold text-[#e1e3e4] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#00daf3]">inbox</span>
                        <span>RECEIVED PROJECT INQUIRIES &amp; MESSAGES</span>
                      </h4>
                      <p className="font-body text-xs text-[#919094] mt-1">
                        رسائل وطلبات المشاريع الواردة مباشرة من نموذج الاتصال بالوقع
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowDirectMsgForm(!showDirectMsgForm)}
                        className="px-3.5 py-2 rounded-xl bg-[#00daf3]/10 text-[#00daf3] border border-[#00daf3]/40 hover:bg-[#00daf3] hover:text-[#001f24] font-mono-code text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">add_comment</span>
                        <span>{showDirectMsgForm ? 'CANCEL NOTE' : '+ RECORD ADMIN NOTE'}</span>
                      </button>

                      {unreadMessagesCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="px-3.5 py-2 rounded-xl bg-green-950/60 text-green-300 border border-green-500/40 hover:bg-green-600 hover:text-white font-mono-code text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">done_all</span>
                          <span>MARK ALL READ</span>
                        </button>
                      )}

                      {messages.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearAllMessages}
                          className="px-3.5 py-2 rounded-xl bg-red-950/60 text-red-400 border border-red-500/40 hover:bg-red-600 hover:text-white font-mono-code text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">delete_sweep</span>
                          <span>CLEAR ALL</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Direct Admin Note Form */}
                  {showDirectMsgForm && (
                    <form onSubmit={handleSendAdminDirectMsg} className="p-6 rounded-xl bg-[#1d2021] border border-[#00daf3]/50 space-y-4 animate-fadeIn">
                      <h5 className="font-mono-code text-xs font-bold text-[#00daf3] uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">edit_note</span>
                        <span>RECORD A DIRECT MESSAGE / INTERNAL NOTE</span>
                      </h5>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-mono-code text-[11px] text-[#79797e] uppercase mb-1">
                            SENDER NAME
                          </label>
                          <input
                            type="text"
                            value={directMsgForm.name}
                            onChange={(e) => setDirectMsgForm({ ...directMsgForm, name: e.target.value })}
                            className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                          />
                        </div>
                        <div>
                          <label className="block font-mono-code text-[11px] text-[#79797e] uppercase mb-1">
                            SENDER EMAIL
                          </label>
                          <input
                            type="email"
                            value={directMsgForm.email}
                            onChange={(e) => setDirectMsgForm({ ...directMsgForm, email: e.target.value })}
                            className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-mono-code text-[11px] text-[#79797e] uppercase mb-1">
                            SERVICE TYPE
                          </label>
                          <select
                            value={directMsgForm.projectType}
                            onChange={(e) => setDirectMsgForm({ ...directMsgForm, projectType: e.target.value })}
                            className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                          >
                            {currentServiceOptions.map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block font-mono-code text-[11px] text-[#79797e] uppercase mb-1">
                            BUDGET
                          </label>
                          <select
                            value={directMsgForm.budget}
                            onChange={(e) => setDirectMsgForm({ ...directMsgForm, budget: e.target.value })}
                            className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                          >
                            {currentBudgetOptions.map((opt, i) => (
                              <option key={i} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono-code text-[11px] text-[#79797e] uppercase mb-1">
                          MESSAGE CONTENT *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={directMsgForm.message}
                          onChange={(e) => setDirectMsgForm({ ...directMsgForm, message: e.target.value })}
                          placeholder="Type your note or test message here..."
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl p-3 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>

                      <div className="flex gap-3 justify-end">
                        <button
                          type="button"
                          onClick={() => setShowDirectMsgForm(false)}
                          className="px-4 py-2 rounded-xl bg-white/5 text-[#c7c6ca] font-mono-code text-xs uppercase"
                        >
                          CANCEL
                        </button>
                        <button
                          type="submit"
                          className="btn-primary px-6 py-2 rounded-xl font-mono-code text-xs uppercase font-bold"
                        >
                          SAVE NOTE
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111415] p-3 rounded-xl border border-white/10 font-mono-code text-xs">
                    <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                      <button
                        type="button"
                        onClick={() => setMessageFilter('all')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          messageFilter === 'all'
                            ? 'bg-[#00daf3] text-[#001f24] font-bold'
                            : 'text-[#c7c6ca] hover:text-white'
                        }`}
                      >
                        ALL ({messages.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setMessageFilter('unread')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          messageFilter === 'unread'
                            ? 'bg-red-500 text-white font-bold'
                            : 'text-[#c7c6ca] hover:text-white'
                        }`}
                      >
                        UNREAD ({unreadMessagesCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setMessageFilter('read')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          messageFilter === 'read'
                            ? 'bg-[#00daf3]/20 text-[#00daf3] font-bold'
                            : 'text-[#c7c6ca] hover:text-white'
                        }`}
                      >
                        READ ({messages.length - unreadMessagesCount})
                      </button>
                    </div>

                    <div className="w-full sm:w-64 relative">
                      <span className="material-symbols-outlined text-sm text-[#79797e] absolute left-3 top-2.5">
                        search
                      </span>
                      <input
                        type="text"
                        value={messageSearch}
                        onChange={(e) => setMessageSearch(e.target.value)}
                        placeholder="Search name, email, or message..."
                        className="w-full bg-[#1d2021] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                      />
                    </div>
                  </div>

                  {/* Messages List */}
                  <div className="space-y-4">
                    {messages
                      .filter((msg) => {
                        if (messageFilter === 'unread') return !msg.read;
                        if (messageFilter === 'read') return msg.read;
                        return true;
                      })
                      .filter((msg) => {
                        if (!messageSearch.trim()) return true;
                        const q = messageSearch.toLowerCase();
                        return (
                          msg.name.toLowerCase().includes(q) ||
                          msg.email.toLowerCase().includes(q) ||
                          msg.message.toLowerCase().includes(q) ||
                          msg.projectType.toLowerCase().includes(q) ||
                          msg.budget.toLowerCase().includes(q)
                        );
                      })
                      .map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-6 rounded-2xl border transition-all space-y-4 ${
                            !msg.read
                              ? 'bg-[#182022] border-[#00daf3] shadow-lg shadow-[#00daf3]/10'
                              : 'bg-[#151819] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
                            <div className="flex items-center gap-3">
                              {!msg.read ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-mono-code text-[10px] font-bold uppercase animate-pulse">
                                  NEW UNREAD
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[#79797e] border border-white/10 font-mono-code text-[10px] font-bold uppercase">
                                  READ
                                </span>
                              )}

                              <div>
                                <h5 className="font-space text-base font-bold text-[#e1e3e4]">
                                  {msg.name}
                                </h5>
                                <a
                                  href={`mailto:${msg.email}`}
                                  className="font-mono-code text-xs text-[#00daf3] hover:underline"
                                >
                                  {msg.email}
                                </a>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-mono-code text-[11px] text-[#79797e]">
                                {new Date(msg.createdAt).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggleReadMessage(msg.id)}
                                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                    msg.read
                                      ? 'bg-white/5 text-[#79797e] border-white/10 hover:text-white'
                                      : 'bg-[#00daf3]/20 text-[#00daf3] border-[#00daf3]/40 hover:bg-[#00daf3] hover:text-[#001f24]'
                                  }`}
                                  title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    {msg.read ? 'mark_as_unread' : 'check_circle'}
                                  </span>
                                </button>

                                <a
                                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                                    msg.projectType
                                  )} Inquiry - Mohamed Soliman&body=${encodeURIComponent(
                                    `Hi ${msg.name},\n\nThank you for reaching out regarding your project.\n\nBest regards,\nMohamed Soliman`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg bg-[#00daf3]/10 text-[#00daf3] border border-[#00daf3]/30 hover:bg-[#00daf3] hover:text-[#001f24] transition-all cursor-pointer"
                                  title="Reply via Email"
                                >
                                  <span className="material-symbols-outlined text-sm">reply</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="p-2 rounded-lg bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                                  title="Delete Message"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Details Badges */}
                          <div className="flex flex-wrap gap-2 font-mono-code text-xs">
                            <div className="px-3 py-1 rounded-lg bg-[#111415] border border-white/10 text-[#c7c6ca] flex items-center gap-1.5">
                              <span className="text-[#00daf3] font-bold">SERVICE:</span>
                              <span>{msg.projectType}</span>
                            </div>

                            <div className="px-3 py-1 rounded-lg bg-[#00daf3]/10 border border-[#00daf3]/30 text-[#00daf3] font-bold flex items-center gap-1.5">
                              <span>BUDGET:</span>
                              <span className="text-white">{msg.budget}</span>
                            </div>
                          </div>

                          {/* Message Text Box */}
                          <div className="p-4 rounded-xl bg-[#0c0f10] border border-white/10 text-sm text-[#e1e3e4] font-body leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </div>
                        </div>
                      ))}

                    {messages.length === 0 && (
                      <div className="py-16 text-center font-mono-code text-xs text-[#79797e] bg-[#1d2021] rounded-2xl border border-dashed border-white/10 space-y-3">
                        <span className="material-symbols-outlined text-4xl text-[#00daf3]">
                          mark_email_read
                        </span>
                        <p>NO RECEIVED MESSAGES YET.</p>
                        <p className="text-[11px] text-[#919094]">
                          Inquiries submitted from the website Contact Form will appear here automatically in real time!
                        </p>
                      </div>
                    )}
                  </div>
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

                    <p className="font-mono-code text-[11px] text-[#919094] leading-relaxed">
                      💡 <strong className="text-[#00daf3]">نصيحة هامة لتشغيل الفيديو على الموبايل:</strong> يمكنك إضافة رابط فيديو مباشر من (YouTube, Shorts, Google Drive, Vimeo, Streamable) أو رابط ملف MP4. استخدام الروابط يضمن تشغيل الفيديو فوراً وبسلاسة على جميع الهواتف الذكية والأجهزة المحمولة!
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

                  {/* PROJECT METRICS & SPECIFICATIONS EDITOR */}
                  <div className="p-4 rounded-xl bg-[#1d2021] border border-[#00daf3]/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="font-mono-code text-xs text-[#00daf3] uppercase font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">analytics</span>
                        <span>PROJECT METRICS &amp; SPECIFICATIONS (مؤشرات ومواصفات المشروع)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const currentMetrics = editingProject?.metrics || [];
                          setEditingProject((prev) => ({
                            ...prev,
                            metrics: [...currentMetrics, { label: 'METRIC', value: '100%' }]
                          }));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#00daf3]/10 text-[#00daf3] border border-[#00daf3]/30 font-mono-code text-xs font-bold hover:bg-[#00daf3] hover:text-[#001f24] transition-colors self-start sm:self-auto cursor-pointer"
                      >
                        + ADD METRIC
                      </button>
                    </div>

                    <p className="font-mono-code text-[11px] text-[#919094]">
                      تظهر هذه المؤشرات مباشرة أسفل بطاقة المشروع في المعرض (مثل FPS TARGET, PERFORMANCE, SECURITY).
                    </p>

                    {/* Quick presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="font-mono-code text-[10px] text-[#79797e]">إضافة سريعة:</span>
                      {[
                        { label: 'FPS TARGET', value: '120 FPS' },
                        { label: 'PERFORMANCE', value: '100 / 100' },
                        { label: 'SECURITY', value: 'AES-256' },
                        { label: 'LATENCY', value: '< 120ms' },
                        { label: 'STATUS', value: 'Live' }
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            const current = editingProject?.metrics || [];
                            if (!current.some((m) => m.label.toUpperCase() === preset.label.toUpperCase())) {
                              setEditingProject((prev) => ({
                                ...prev,
                                metrics: [...current, preset]
                              }));
                            }
                          }}
                          className="px-2 py-1 rounded bg-[#0c0f10] text-[#00daf3] border border-white/10 hover:border-[#00daf3]/40 font-mono-code text-[10px] font-semibold cursor-pointer"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3 pt-2">
                      {(editingProject?.metrics || []).map((metric, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-[#0c0f10] p-3 rounded-xl border border-white/5">
                          <div className="flex-1 grid grid-cols-2 gap-3">
                            <div>
                              <label className="block font-mono-code text-[10px] text-[#79797e] uppercase mb-1">LABEL (اسم المؤشر)</label>
                              <input
                                type="text"
                                value={metric.label}
                                onChange={(e) => {
                                  const updated = [...(editingProject?.metrics || [])];
                                  updated[idx] = { ...updated[idx], label: e.target.value };
                                  setEditingProject((prev) => ({ ...prev, metrics: updated }));
                                }}
                                placeholder="FPS TARGET"
                                className="w-full bg-[#1d2021] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3] font-mono-code font-bold uppercase"
                              />
                            </div>
                            <div>
                              <label className="block font-mono-code text-[10px] text-[#79797e] uppercase mb-1">VALUE (قيمة المؤشر)</label>
                              <input
                                type="text"
                                value={metric.value}
                                onChange={(e) => {
                                  const updated = [...(editingProject?.metrics || [])];
                                  updated[idx] = { ...updated[idx], value: e.target.value };
                                  setEditingProject((prev) => ({ ...prev, metrics: updated }));
                                }}
                                placeholder="120 FPS"
                                className="w-full bg-[#1d2021] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3] font-mono-code"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingProject?.metrics || []).filter((_, i) => i !== idx);
                              setEditingProject((prev) => ({ ...prev, metrics: updated }));
                            }}
                            className="text-red-400 hover:text-red-300 p-2 rounded hover:bg-red-500/10 font-bold self-end cursor-pointer"
                            title="Remove Metric"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      ))}

                      {(!editingProject?.metrics || editingProject.metrics.length === 0) && (
                        <div className="text-center py-4 font-mono-code text-xs text-[#79797e] bg-[#0c0f10] rounded-xl border border-dashed border-white/10">
                          لا توجد مؤشرات حالياً لهذا المشروع. اضغط على "+ ADD METRIC" للإضافة.
                        </div>
                      )}
                    </div>
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

              {/* TAB GALLERY: GALLERY ITEMS LIST */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#1d2021] border border-[#00daf3]/30">
                    <div>
                      <h4 className="font-space text-base font-bold text-[#e1e3e4] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#00daf3]">stars</span>
                        <span>VIP GALLERY &amp; TESTIMONIALS MANAGEMENT</span>
                      </h4>
                      <p className="font-mono-code text-xs text-[#919094] mt-1">
                        Manage VIP showcase photos, executive encounters, video testimonials, and media highlights.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenNewGalleryItem}
                      className="px-4 py-2.5 rounded-xl bg-[#00daf3] text-[#001f24] font-mono-code text-xs font-bold hover:bg-[#00daf3]/80 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,218,243,0.3)] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>ADD GALLERY ITEM</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentGalleryItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#1d2021] border border-white/10 rounded-xl p-4 flex gap-4 items-start hover:border-[#00daf3]/40 transition-colors"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-[#0c0f10]">
                          <img
                            src={getItemDisplayImage(item)}
                            alt={item.title}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                            }}
                            className="w-full h-full object-cover"
                          />
                          {(item.mediaType === 'video' || item.videoUrl) && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[#00daf3] text-xl drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
                                play_circle
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          {item.personName && (
                            <span className="inline-block text-[10px] font-mono-code font-bold text-[#00daf3] bg-[#00daf3]/10 px-2 py-0.5 rounded">
                              {item.personName} ({item.personRole})
                            </span>
                          )}
                          <h5 className="font-bold text-sm text-[#e1e3e4] truncate">{item.title}</h5>
                          <p className="text-xs text-[#919094] line-clamp-2">{item.description}</p>
                          <div className="flex items-center gap-2 pt-2 text-[10px] font-mono-code text-[#79797e]">
                            <span>TYPE: {item.mediaType === 'video' ? '🎬 VIDEO' : '🖼️ IMAGE'}</span>
                            <span>•</span>
                            <span>CATEGORY: {item.category === 'celebrity' ? 'VIP GUEST' : 'TESTIMONIAL'}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditGalleryItem(item)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-[#00daf3] hover:text-[#001f24] text-[#00daf3] border border-white/10 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-600 text-red-300 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {currentGalleryItems.length === 0 && (
                      <div className="col-span-full py-12 text-center font-mono-code text-xs text-[#919094] bg-[#1d2021] rounded-xl border border-dashed border-white/10">
                        No gallery items found. Click "ADD GALLERY ITEM" to create one.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB GALLERY FORM: ADD / EDIT GALLERY ITEM */}
              {activeTab === 'gallery-form' && editingGalleryItem && (
                <form onSubmit={handleSaveGalleryItem} className="space-y-6">
                  <div className="p-6 rounded-xl bg-[#1d2021] border border-[#00daf3]/40 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h4 className="font-space text-base font-bold text-[#e1e3e4] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#00daf3]">stars</span>
                        <span>
                          {editingGalleryItem.id ? 'EDIT GALLERY ITEM' : 'ADD NEW GALLERY ITEM'}
                        </span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setActiveTab('gallery')}
                        className="text-xs font-mono-code text-[#919094] hover:text-white"
                      >
                        CANCEL ✕
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          TITLE / EVENT NAME *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingGalleryItem.title || ''}
                          onChange={(e) =>
                            setEditingGalleryItem((prev) => ({ ...prev, title: e.target.value }))
                          }
                          placeholder="e.g. Executive Strategic Summit with Tech Leaders"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          VIP GUEST NAME / CLIENT (Person Name)
                        </label>
                        <input
                          type="text"
                          value={editingGalleryItem.personName || ''}
                          onChange={(e) =>
                            setEditingGalleryItem((prev) => ({ ...prev, personName: e.target.value }))
                          }
                          placeholder="e.g. Dr. Ahmed El-Awady"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          ROLE / TITLE (Person Title)
                        </label>
                        <input
                          type="text"
                          value={editingGalleryItem.personRole || ''}
                          onChange={(e) =>
                            setEditingGalleryItem((prev) => ({ ...prev, personRole: e.target.value }))
                          }
                          placeholder="e.g. Founder & CEO — CELESTE Group"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>

                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          CATEGORY
                        </label>
                        <select
                          value={editingGalleryItem.category || 'celebrity'}
                          onChange={(e) =>
                            setEditingGalleryItem((prev) => ({ ...prev, category: e.target.value as any }))
                          }
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        >
                          <option value="celebrity">VIP GUESTS</option>
                          <option value="testimonial">TESTIMONIALS</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          MEDIA TYPE
                        </label>
                        <select
                          value={editingGalleryItem.mediaType || 'image'}
                          onChange={(e) =>
                            setEditingGalleryItem((prev) => ({ ...prev, mediaType: e.target.value as any }))
                          }
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        >
                          <option value="image">Image Only</option>
                          <option value="video">Video (YouTube / MP4)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                          DATE / OCCASION
                        </label>
                        <input
                          type="text"
                          value={editingGalleryItem.date || '2025'}
                          onChange={(e) =>
                            setEditingGalleryItem((prev) => ({ ...prev, date: e.target.value }))
                          }
                          placeholder="e.g. 2025 or Tech Summit"
                          className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                        IMAGE / THUMBNAIL URL {editingGalleryItem.mediaType === 'video' || editingGalleryItem.videoUrl ? '(اختياري بالفيديو)' : '*'}
                      </label>
                      <input
                        type="text"
                        required={editingGalleryItem.mediaType !== 'video' && !editingGalleryItem.videoUrl}
                        value={editingGalleryItem.image || ''}
                        onChange={(e) =>
                          setEditingGalleryItem((prev) => ({ ...prev, image: e.target.value }))
                        }
                        placeholder="https://... (يمكن تركه فارغاً بالفيديو وسيجلب صورة اليوتيوب تلقائياً)"
                        className="w-full bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                      />
                    </div>

                    {editingGalleryItem.mediaType === 'video' && (
                      <div>
                        <label className="block font-mono-code text-xs text-[#00daf3] uppercase mb-1 font-bold">
                          VIDEO URL (YouTube, YouTube Shorts, MP4)
                        </label>
                        <input
                          type="text"
                          value={editingGalleryItem.videoUrl || ''}
                          onChange={(e) => {
                            const newVideoUrl = e.target.value;
                            const autoThumb = getYouTubeThumbnail(newVideoUrl);
                            setEditingGalleryItem((prev) => ({
                              ...prev,
                              videoUrl: newVideoUrl,
                              mediaType: 'video',
                              image: (prev?.image && prev.image.trim() && !prev.image.includes('img.youtube.com'))
                                ? prev.image
                                : (autoThumb || prev?.image || '')
                            }));
                          }}
                          placeholder="https://youtube.com/shorts/... or https://youtu.be/..."
                          className="w-full bg-[#0c0f10] border border-[#00daf3]/40 rounded-xl px-4 py-2.5 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block font-mono-code text-xs text-[#79797e] uppercase mb-1">
                        DESCRIPTION &amp; DETAILS
                      </label>
                      <textarea
                        rows={3}
                        value={editingGalleryItem.description || ''}
                        onChange={(e) =>
                          setEditingGalleryItem((prev) => ({ ...prev, description: e.target.value }))
                        }
                        placeholder="Provide details about the encounter or testimonial..."
                        className="w-full bg-[#0c0f10] border border-white/10 rounded-xl p-3 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="gal-featured"
                        checked={editingGalleryItem.featured ?? true}
                        onChange={(e) =>
                          setEditingGalleryItem((prev) => ({ ...prev, featured: e.target.checked }))
                        }
                        className="w-4 h-4 accent-[#00daf3] rounded"
                      />
                      <label htmlFor="gal-featured" className="text-xs font-mono-code text-[#e1e3e4] cursor-pointer">
                        FEATURED IN HERO GRID
                      </label>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setActiveTab('gallery')}
                        className="px-6 py-3 font-mono-code text-xs uppercase rounded-xl border border-white/10 text-[#c7c6ca]"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        className="btn-primary flex-1 py-3 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">save</span>
                        <span>SAVE GALLERY ITEM</span>
                      </button>
                    </div>
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

                  {/* ESTIMATED BUDGET OPTIONS MANAGEMENT */}
                  <div className="p-6 rounded-xl bg-[#1d2021] border border-[#00daf3]/40 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/10">
                      <div>
                        <h4 className="font-space text-base font-bold text-[#e1e3e4] flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#00daf3]">payments</span>
                          <span>ESTIMATED BUDGET RANGES (تعديل أسعار الميزانية)</span>
                        </h4>
                        <p className="font-body text-xs text-[#919094] mt-1">
                          تعديل قائمة أسعار الميزانيات المتاحة للعملاء في القائمة المنسدلة بنموذج التواصل
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddBudgetOption}
                        className="px-3.5 py-2 rounded-xl bg-[#00daf3]/10 text-[#00daf3] border border-[#00daf3]/30 font-mono-code text-xs font-bold hover:bg-[#00daf3] hover:text-[#001f24] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>ADD BUDGET RANGE</span>
                      </button>
                    </div>

                    {/* Quick Presets Buttons */}
                    <div className="p-3 rounded-xl bg-[#0c0f10] border border-white/5 font-mono-code text-xs space-y-2">
                      <span className="text-[#79797e] font-bold uppercase block text-[11px]">
                        QUICK CURRENCY &amp; SCALE PRESETS:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleApplyBudgetPreset(['< $5,000', '$5,000 - $10,000', '$10,000 - $25,000', '$25,000+'])}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-[#00daf3]/20 hover:text-[#00daf3] border border-white/10 text-[#c7c6ca] transition-all cursor-pointer"
                        >
                          💵 USD ($) Standard
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyBudgetPreset(['أقل من 25,000 ج.م', '25,000 - 50,000 ج.م', '50,000 - 100,000 ج.م', '100,000+ ج.م'])}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-[#00daf3]/20 hover:text-[#00daf3] border border-white/10 text-[#c7c6ca] transition-all cursor-pointer"
                        >
                          🇪🇬 EGP (ج.م) Egyptian
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyBudgetPreset(['أقل من 10,000 ر.س', '10,000 - 25,000 ر.س', '25,000 - 50,000 ر.س', '50,000+ ر.س'])}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-[#00daf3]/20 hover:text-[#00daf3] border border-white/10 text-[#c7c6ca] transition-all cursor-pointer"
                        >
                          🇸🇦 SAR (ر.س) Saudi
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyBudgetPreset(['Micro Project ($1k - $3k)', 'Growth App ($5k - $15k)', 'Enterprise Platform ($25k+)', 'Monthly Retainer ($3k/mo)'])}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-[#00daf3]/20 hover:text-[#00daf3] border border-white/10 text-[#c7c6ca] transition-all cursor-pointer"
                        >
                          🚀 Tiered Packages
                        </button>
                      </div>
                    </div>

                    {/* Editable Budget Options Inputs */}
                    <div className="space-y-2">
                      {currentBudgetOptions.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="font-mono-code text-xs text-[#00daf3] font-bold w-6 text-center">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleUpdateBudgetOption(idx, e.target.value)}
                            className="flex-1 bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#e1e3e4] font-mono-code focus:outline-none focus:border-[#00daf3]"
                            placeholder="e.g. $5,000 - $10,000"
                          />
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveBudgetOption(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 rounded bg-white/5 text-[#c7c6ca] hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <span className="material-symbols-outlined text-xs">arrow_upward</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveBudgetOption(idx, 'down')}
                              disabled={idx === currentBudgetOptions.length - 1}
                              className="p-1.5 rounded bg-white/5 text-[#c7c6ca] hover:text-white disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <span className="material-symbols-outlined text-xs">arrow_downward</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveBudgetOption(idx)}
                              className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                              title="Remove"
                            >
                              <span className="material-symbols-outlined text-xs">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SERVICE TYPES MANAGEMENT */}
                  <div className="p-6 rounded-xl bg-[#1d2021] border border-white/10 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/10">
                      <div>
                        <h4 className="font-space text-base font-bold text-[#e1e3e4] flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#00daf3]">design_services</span>
                          <span>SERVICE TYPES (أنواع الخدمات)</span>
                        </h4>
                        <p className="font-body text-xs text-[#919094] mt-1">
                          تعديل قائمة الخدمات المتاحة للعملاء في القائمة المنسدلة
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddServiceOption}
                        className="px-3.5 py-2 rounded-xl bg-[#00daf3]/10 text-[#00daf3] border border-[#00daf3]/30 font-mono-code text-xs font-bold hover:bg-[#00daf3] hover:text-[#001f24] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>ADD SERVICE</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {currentServiceOptions.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="font-mono-code text-xs text-[#00daf3] font-bold w-6 text-center">
                            #{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleUpdateServiceOption(idx, e.target.value)}
                            className="flex-1 bg-[#0c0f10] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                            placeholder="e.g. Web & AI Architecture"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveServiceOption(idx)}
                            className="p-1.5 rounded bg-red-950/40 text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                            title="Remove"
                          >
                            <span className="material-symbols-outlined text-xs">delete</span>
                          </button>
                        </div>
                      ))}
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
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1">
                              <div className="p-1.5 rounded-lg bg-[#1d2021] border border-white/10 flex items-center justify-center">
                                <SocialIcon platform={platform} className="w-4 h-4 flex-shrink-0" />
                              </div>
                              <input
                                type="text"
                                value={platform.name}
                                onChange={(e) => {
                                  const updated = [...settingsForm.socialPlatforms];
                                  updated[idx] = { ...updated[idx], name: e.target.value };
                                  setSettingsForm({ ...settingsForm, socialPlatforms: updated });
                                }}
                                className="w-full bg-[#1d2021] border border-white/10 rounded px-2.5 py-1 text-xs font-bold text-[#e1e3e4] focus:outline-none focus:border-[#00daf3]"
                                placeholder="Platform Name (e.g. Facebook)"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSocialPlatform(platform.id)}
                              className="text-red-400 hover:text-red-300 text-xs font-bold px-1"
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
