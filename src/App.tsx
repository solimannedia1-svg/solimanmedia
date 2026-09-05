import React, { useState, useEffect } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { BackgroundShader } from './components/BackgroundShader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Marquee } from './components/Marquee';
import { Skills } from './components/Skills';
import { WorkShowcase } from './components/WorkShowcase';
import { Gallery } from './components/Gallery';
import { AIPersonaStudio } from './components/AIPersonaStudio';
import { Journey } from './components/Journey';
import { StatusDashboard } from './components/StatusDashboard';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { DEFAULT_SITE_SETTINGS, PROJECTS_DATA, DEFAULT_GALLERY_ITEMS } from './data/portfolioData';
import { Project, SiteSettings, ContactMessage } from './types';
import { db } from './lib/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

const SETTINGS_CACHE_KEY = 'mohamed_soliman_site_settings_v5';
const PROJECTS_CACHE_KEY = 'mohamed_soliman_projects_v5';
const MESSAGES_CACHE_KEY = 'mohamed_soliman_messages_v2';

// Purge legacy cache keys from previous versions to prevent showing outdated projects
try {
  const legacyKeys = [
    'mohamed_soliman_projects_v1',
    'mohamed_soliman_projects_v2',
    'mohamed_soliman_projects_v3',
    'mohamed_soliman_projects_v4',
    'mohamed_soliman_site_settings_v1',
    'mohamed_soliman_site_settings_v2',
    'mohamed_soliman_site_settings_v3',
    'mohamed_soliman_site_settings_v4'
  ];
  legacyKeys.forEach((key) => localStorage.removeItem(key));
} catch {}

// Helper to safely store objects/arrays in localStorage without quota crashes
function safeSaveToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // If quota exceeded (e.g. large base64 strings), strip massive base64 media before saving
    try {
      if (Array.isArray(value)) {
        const sanitized = value.map((item: any) => {
          if (item && typeof item === 'object') {
            const copy = { ...item };
            if (copy.videoUrl && copy.videoUrl.startsWith('data:') && copy.videoUrl.length > 200000) {
              copy.videoUrl = '';
            }
            if (copy.image && copy.image.startsWith('data:') && copy.image.length > 200000) {
              copy.image = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
            }
            return copy;
          }
          return item;
        });
        localStorage.setItem(key, JSON.stringify(sanitized));
      }
    } catch {
      console.warn('Unable to persist to localStorage cache');
    }
  }
}

export default function App() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_CACHE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(PROJECTS_CACHE_KEY);
      return saved ? JSON.parse(saved) : PROJECTS_DATA;
    } catch {
      return PROJECTS_DATA;
    }
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(MESSAGES_CACHE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Controls the instant real-time synchronization barrier
  const [isInitialSyncing, setIsInitialSyncing] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    // Do not block admin dashboard routes
    if (path === '/admin' || path === '/admin/' || hash === '#admin') {
      return false;
    }
    return true;
  });

  // Ensure site always loads at the top on page open/refresh
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Aggressive parallel fetch + real-time Firestore listeners for immediate, flawless data
  useEffect(() => {
    let isMounted = true;
    let syncSettled = false;

    // Safety timeout: Unlock UI within 1.2s max if user is offline or on slow network
    const safetyTimeout = setTimeout(() => {
      if (isMounted && !syncSettled) {
        syncSettled = true;
        setIsInitialSyncing(false);
      }
    }, 1200);

    const markSyncComplete = () => {
      if (!syncSettled && isMounted) {
        syncSettled = true;
        clearTimeout(safetyTimeout);
        // Small buffer ensuring React DOM updates are committed before fading splash
        setTimeout(() => {
          if (isMounted) setIsInitialSyncing(false);
        }, 120);
      }
    };

    // 1. Fast direct parallel getDoc calls for instant cloud data fetch
    Promise.allSettled([
      getDoc(doc(db, 'portfolio', 'settings')),
      getDoc(doc(db, 'portfolio', 'projects'))
    ]).then(([settingsSnap, projectsSnap]) => {
      if (!isMounted) return;

      if (settingsSnap.status === 'fulfilled' && settingsSnap.value.exists()) {
        const data = settingsSnap.value.data() as SiteSettings;
        setSiteSettings(data);
        safeSaveToLocalStorage(SETTINGS_CACHE_KEY, data);
      }

      if (projectsSnap.status === 'fulfilled' && projectsSnap.value.exists()) {
        const data = projectsSnap.value.data();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          setProjects(data.items);
          safeSaveToLocalStorage(PROJECTS_CACHE_KEY, data.items);
        }
      }

      markSyncComplete();
    }).catch(() => {
      markSyncComplete();
    });

    // 2. Real-time onSnapshot listeners for ongoing live updates
    const unsubSettings = onSnapshot(doc(db, 'portfolio', 'settings'), (snapshot) => {
      if (snapshot.exists() && isMounted) {
        const data = snapshot.data() as SiteSettings;
        setSiteSettings(data);
        safeSaveToLocalStorage(SETTINGS_CACHE_KEY, data);
        markSyncComplete();
      }
    }, (err) => {
      console.warn('Firestore settings listener info:', err);
      markSyncComplete();
    });

    const unsubProjects = onSnapshot(doc(db, 'portfolio', 'projects'), (snapshot) => {
      if (snapshot.exists() && isMounted) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const localStored = localStorage.getItem(PROJECTS_CACHE_KEY);
          let localProjects: Project[] = [];
          if (localStored) {
            try { localProjects = JSON.parse(localStored); } catch {}
          }

          const mergedProjects = data.items.map((remoteProj: Project) => {
            const localMatch = localProjects.find((lp) => lp.id === remoteProj.id);
            if (
              localMatch &&
              localMatch.videoUrl &&
              localMatch.videoUrl.startsWith('data:video') &&
              (!remoteProj.videoUrl || remoteProj.videoUrl.includes('...[large video'))
            ) {
              return { ...remoteProj, videoUrl: localMatch.videoUrl };
            }
            return remoteProj;
          });

          setProjects(mergedProjects);
          safeSaveToLocalStorage(PROJECTS_CACHE_KEY, mergedProjects);
          markSyncComplete();
        }
      }
    }, (err) => {
      console.warn('Firestore projects listener info:', err);
      markSyncComplete();
    });

    const unsubMessages = onSnapshot(doc(db, 'portfolio', 'messages'), (snapshot) => {
      if (snapshot.exists() && isMounted) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items)) {
          setMessages(data.items);
          safeSaveToLocalStorage(MESSAGES_CACHE_KEY, data.items);
        }
      }
    }, (err) => {
      console.warn('Firestore messages listener info:', err);
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      unsubSettings();
      unsubProjects();
      unsubMessages();
    };
  }, []);

  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.pathname.toLowerCase();
  });

  const [currentHash, setCurrentHash] = useState<string>(() => {
    return window.location.hash.toLowerCase();
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(window.location.pathname.toLowerCase());
      setCurrentHash(window.location.hash.toLowerCase());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const isAdminRoute =
    currentRoute === '/admin' ||
    currentRoute === '/admin/' ||
    currentHash === '#admin';

  const handleSaveSiteSettings = async (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    safeSaveToLocalStorage(SETTINGS_CACHE_KEY, newSettings);
    try {
      await setDoc(doc(db, 'portfolio', 'settings'), newSettings);
    } catch (e) {
      console.error('Error writing settings to Firestore:', e);
    }
  };

  const handleSaveMessages = async (newMessages: ContactMessage[]) => {
    setMessages(newMessages);
    safeSaveToLocalStorage(MESSAGES_CACHE_KEY, newMessages);
    try {
      await setDoc(doc(db, 'portfolio', 'messages'), { items: newMessages });
    } catch (e) {
      console.error('Error writing messages to Firestore:', e);
    }
  };

  const handleSendMessage = (msg: ContactMessage) => {
    const updated = [msg, ...messages];
    handleSaveMessages(updated);
  };

  const handleSaveProjects = async (newProjects: Project[]) => {
    setProjects(newProjects);
    safeSaveToLocalStorage(PROJECTS_CACHE_KEY, newProjects);

    try {
      // Clean oversized data URLs if necessary so Firestore 1MB limit is respected
      const firestoreCleanProjects = newProjects.map((p) => {
        if (p.videoUrl && p.videoUrl.startsWith('data:') && p.videoUrl.length > 950000) {
          // If a base64 video is too large for single Firestore doc, keep local blob or clear for firestore
          return { ...p, videoUrl: p.videoUrl.slice(0, 100) + '...[large video stored locally]' };
        }
        return p;
      });
      await setDoc(doc(db, 'portfolio', 'projects'), { items: firestoreCleanProjects });
    } catch (e) {
      console.error('Error writing projects to Firestore:', e);
    }
  };

  const handleResetDefaults = async () => {
    setProjects(PROJECTS_DATA);
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setMessages([]);
    localStorage.removeItem('mohamed_soliman_projects_v2');
    localStorage.removeItem('mohamed_soliman_site_settings_v1');
    localStorage.removeItem(MESSAGES_CACHE_KEY);
    try {
      await setDoc(doc(db, 'portfolio', 'settings'), DEFAULT_SITE_SETTINGS);
      await setDoc(doc(db, 'portfolio', 'projects'), { items: PROJECTS_DATA });
      await setDoc(doc(db, 'portfolio', 'messages'), { items: [] });
    } catch (e) {
      console.error('Error resetting Firestore defaults:', e);
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAiStudio = () => {
    const el = document.getElementById('ai-studio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#111415] text-[#e1e3e4] font-body selection:bg-[#00e3fd] selection:text-[#001f24] overflow-x-hidden relative">
        <CustomCursor />
        <BackgroundShader />
        <AdminDashboardModal
          isOpen={true}
          isStandalonePage={true}
          onClose={() => {
            window.location.href = '/';
          }}
          projects={projects}
          onSaveProjects={handleSaveProjects}
          onResetDefaults={handleResetDefaults}
          siteSettings={siteSettings}
          onSaveSiteSettings={handleSaveSiteSettings}
          messages={messages}
          onSaveMessages={handleSaveMessages}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#111415] text-[#e1e3e4] font-body selection:bg-[#00e3fd] selection:text-[#001f24] overflow-x-hidden">
      {/* Real-Time Cloud Sync Preloader to ensure zero stale data or project pop-in */}
      <div
        className={`fixed inset-0 z-[9999] bg-[#0c0e0f] flex flex-col items-center justify-center transition-all duration-300 ease-out ${
          isInitialSyncing
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isInitialSyncing}
      >
        <div className="flex flex-col items-center space-y-5 max-w-xs px-4 text-center select-none">
          {/* Glowing Monogram Logo */}
          <div className="relative w-16 h-16 rounded-2xl bg-[#131719] border border-[#00daf3]/50 flex items-center justify-center shadow-[0_0_35px_rgba(0,218,243,0.3)]">
            <span className="font-space font-black text-xl text-[#00daf3] tracking-widest">
              MS
            </span>
            <div className="absolute -inset-1 rounded-2xl border border-[#00daf3]/30 animate-pulse pointer-events-none" />
          </div>

          {/* Identity & Status */}
          <div className="space-y-1.5">
            <div className="font-space text-xs sm:text-sm font-bold tracking-[0.25em] text-[#e1e3e4] uppercase">
              MOHAMED SOLIMAN
            </div>
            <div className="font-mono-code text-[10px] tracking-wider text-[#00daf3] uppercase flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00daf3] animate-ping" />
              <span>SYNCING REAL-TIME SYSTEM</span>
            </div>
          </div>

          {/* Progress Shimmer */}
          <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-[#00daf3] to-transparent w-full rounded-full animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Custom Lag Ring Cursor */}
      <CustomCursor />

      {/* WebGL Fragment Shader Background Canvas */}
      <BackgroundShader />

      {/* Main Glassmorphic Navigation */}
      <Navbar onTalkClick={scrollToContact} onAiStudioClick={scrollToAiStudio} />

      {/* Content Stack */}
      <main className="relative z-10">
        <Hero onAiTalkClick={scrollToAiStudio} siteSettings={siteSettings} />
        <About siteSettings={siteSettings} />
        <Marquee />
        <Skills />
        <WorkShowcase projects={projects} onSaveProjects={handleSaveProjects} onResetDefaults={handleResetDefaults} />
        <Gallery galleryItems={Array.isArray(siteSettings.galleryItems) ? siteSettings.galleryItems : DEFAULT_GALLERY_ITEMS} />
        <AIPersonaStudio />
        <Journey />
        <StatusDashboard />
        <Contact siteSettings={siteSettings} onSendMessage={handleSendMessage} />
      </main>

      {/* Footer */}
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
