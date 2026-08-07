import React, { useState, useEffect } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { BackgroundShader } from './components/BackgroundShader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Marquee } from './components/Marquee';
import { Skills } from './components/Skills';
import { WorkShowcase } from './components/WorkShowcase';
import { AIPersonaStudio } from './components/AIPersonaStudio';
import { Journey } from './components/Journey';
import { StatusDashboard } from './components/StatusDashboard';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { DEFAULT_SITE_SETTINGS, PROJECTS_DATA } from './data/portfolioData';
import { Project, SiteSettings } from './types';
import { db } from './lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export default function App() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('mohamed_soliman_site_settings_v1');
      return saved ? JSON.parse(saved) : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('mohamed_soliman_projects_v2');
      return saved ? JSON.parse(saved) : PROJECTS_DATA;
    } catch {
      return PROJECTS_DATA;
    }
  });

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'portfolio', 'settings'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteSettings;
        setSiteSettings(data);
        localStorage.setItem('mohamed_soliman_site_settings_v1', JSON.stringify(data));
      }
    }, (err) => {
      console.warn('Firestore settings listener info:', err);
    });

    const unsubProjects = onSnapshot(doc(db, 'portfolio', 'projects'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items)) {
          // Retrieve local projects to preserve local base64 video files if Firestore item is truncated
          const localStored = localStorage.getItem('mohamed_soliman_projects_v2');
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
          try {
            localStorage.setItem('mohamed_soliman_projects_v2', JSON.stringify(mergedProjects));
          } catch {}
        }
      }
    }, (err) => {
      console.warn('Firestore projects listener info:', err);
    });

    return () => {
      unsubSettings();
      unsubProjects();
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
    localStorage.setItem('mohamed_soliman_site_settings_v1', JSON.stringify(newSettings));
    try {
      await setDoc(doc(db, 'portfolio', 'settings'), newSettings);
    } catch (e) {
      console.error('Error writing settings to Firestore:', e);
    }
  };

  const handleSaveProjects = async (newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem('mohamed_soliman_projects_v2', JSON.stringify(newProjects));
    } catch (e) {
      console.warn('localStorage quota warning when saving projects:', e);
    }

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
    localStorage.removeItem('mohamed_soliman_projects_v2');
    localStorage.removeItem('mohamed_soliman_site_settings_v1');
    try {
      await setDoc(doc(db, 'portfolio', 'settings'), DEFAULT_SITE_SETTINGS);
      await setDoc(doc(db, 'portfolio', 'projects'), { items: PROJECTS_DATA });
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
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#111415] text-[#e1e3e4] font-body selection:bg-[#00e3fd] selection:text-[#001f24] overflow-x-hidden">
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
        <AIPersonaStudio />
        <Journey />
        <StatusDashboard />
        <Contact siteSettings={siteSettings} />
      </main>

      {/* Footer */}
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
