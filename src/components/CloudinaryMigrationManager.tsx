import React, { useState, useEffect, useRef } from 'react';
import { Project, SiteSettings, GalleryItem } from '../types';
import {
  CLOUDINARY_CONFIG,
  ImageScanResult,
  detectImageSourceType,
  isCloudinaryUrl,
  uploadUrlOrBase64ToCloudinary,
  uploadFileToCloudinary,
} from '../utils/cloudinary';

interface CloudinaryMigrationManagerProps {
  projects: Project[];
  onSaveProjects: (projects: Project[]) => void;
  siteSettings: SiteSettings;
  onSaveSiteSettings: (settings: SiteSettings) => void;
  setSaveNotice?: (notice: string) => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

export const CloudinaryMigrationManager: React.FC<CloudinaryMigrationManagerProps> = ({
  projects,
  onSaveProjects,
  siteSettings,
  onSaveSiteSettings,
  setSaveNotice
}) => {
  const [scanResults, setScanResults] = useState<ImageScanResult[]>([]);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'migrating' | 'paused' | 'completed'>('idle');
  const [currentMigratingId, setCurrentMigratingId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'cloudinary' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);

  // Test manual upload state
  const [testUploadLoading, setTestUploadLoading] = useState(false);
  const [testUploadResult, setTestUploadResult] = useState<string | null>(null);

  const isPausedRef = useRef(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
    setLogs((prev) => [
      ...prev,
      {
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        timestamp: timeStr,
        type,
        message,
      },
    ]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Scan all images across projects, gallery, and siteSettings portrait
  const handleScanSystem = () => {
    setStatus('scanning');
    addLog('Starting comprehensive dry-run scan of all images in portfolio...', 'info');

    const results: ImageScanResult[] = [];

    // 1. Portrait Image
    if (siteSettings.portraitUrl && siteSettings.portraitUrl.trim()) {
      const pUrl = siteSettings.portraitUrl.trim();
      const isCld = isCloudinaryUrl(pUrl);
      results.push({
        id: 'scan_portrait',
        type: 'portrait',
        parentId: 'hero_settings',
        parentTitle: 'Hero Portrait / Bio Photo',
        fieldName: 'portraitUrl',
        currentUrl: pUrl,
        isCloudinary: isCld,
        sourceType: detectImageSourceType(pUrl),
        status: isCld ? 'migrated' : 'pending',
      });
    }

    // 2. Projects
    projects.forEach((proj, idx) => {
      if (proj.image && proj.image.trim()) {
        const pImg = proj.image.trim();
        const isCld = isCloudinaryUrl(pImg);
        results.push({
          id: `scan_proj_${proj.id || idx}`,
          type: 'project',
          parentId: proj.id || String(idx),
          parentTitle: proj.title || `Project #${idx + 1}`,
          fieldName: 'image',
          currentUrl: pImg,
          isCloudinary: isCld,
          sourceType: detectImageSourceType(pImg),
          status: isCld ? 'migrated' : 'pending',
        });
      }
    });

    // 3. Gallery Items
    const gallery = Array.isArray(siteSettings.galleryItems) ? siteSettings.galleryItems : [];
    gallery.forEach((item, idx) => {
      if (item.image && item.image.trim()) {
        const gImg = item.image.trim();
        const isCld = isCloudinaryUrl(gImg);
        results.push({
          id: `scan_gal_${item.id || idx}`,
          type: 'gallery',
          parentId: item.id || String(idx),
          parentTitle: item.title || item.personName || `Gallery Item #${idx + 1}`,
          fieldName: 'image',
          currentUrl: gImg,
          isCloudinary: isCld,
          sourceType: detectImageSourceType(gImg),
          status: isCld ? 'migrated' : 'pending',
        });
      }
    });

    setScanResults(results);
    const cldCount = results.filter((r) => r.isCloudinary).length;
    const pendingCount = results.filter((r) => !r.isCloudinary).length;

    addLog(
      `Scan complete: Found ${results.length} total images (${cldCount} hosted on Cloudinary, ${pendingCount} pending migration).`,
      'success'
    );
    setStatus('idle');
  };

  // Run initial scan on mount if results are empty
  useEffect(() => {
    if (scanResults.length === 0) {
      handleScanSystem();
    }
  }, [projects, siteSettings]);

  // Migrate a single image item
  const handleMigrateSingle = async (item: ImageScanResult) => {
    setCurrentMigratingId(item.id);
    addLog(`[Single Migration] Migrating image for "${item.parentTitle}"...`, 'info');

    // Update item status in state
    setScanResults((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: 'migrating', error: undefined } : r))
    );

    try {
      const res = await uploadUrlOrBase64ToCloudinary(item.currentUrl);
      const newCloudinaryUrl = res.secure_url;

      if (!newCloudinaryUrl) {
        throw new Error('Cloudinary response did not contain secure_url');
      }

      // Update data model based on type
      if (item.type === 'portrait') {
        const updatedSettings: SiteSettings = { ...siteSettings, portraitUrl: newCloudinaryUrl };
        onSaveSiteSettings(updatedSettings);
      } else if (item.type === 'project') {
        const updatedProjects = projects.map((p) =>
          p.id === item.parentId ? { ...p, image: newCloudinaryUrl } : p
        );
        onSaveProjects(updatedProjects);
      } else if (item.type === 'gallery') {
        const gallery = Array.isArray(siteSettings.galleryItems) ? siteSettings.galleryItems : [];
        const updatedGallery = gallery.map((g) =>
          g.id === item.parentId ? { ...g, image: newCloudinaryUrl } : g
        );
        const updatedSettings: SiteSettings = { ...siteSettings, galleryItems: updatedGallery };
        onSaveSiteSettings(updatedSettings);
      }

      setScanResults((prev) =>
        prev.map((r) =>
          r.id === item.id
            ? {
                ...r,
                status: 'migrated',
                isCloudinary: true,
                newUrl: newCloudinaryUrl,
                sourceType: 'cloudinary',
              }
            : r
        )
      );

      addLog(`✓ Successfully migrated "${item.parentTitle}" to Cloudinary: ${newCloudinaryUrl}`, 'success');
      if (setSaveNotice) setSaveNotice(`✓ Migrated "${item.parentTitle}" to Cloudinary!`);
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      addLog(`✗ Migration failed for "${item.parentTitle}": ${errMsg}`, 'error');
      setScanResults((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, status: 'failed', error: errMsg } : r))
      );
    } finally {
      setCurrentMigratingId(null);
    }
  };

  // Start batch migration of all pending/failed items
  const handleStartBatchMigration = async () => {
    isPausedRef.current = false;
    setStatus('migrating');
    addLog('Starting automated batch migration to Cloudinary...', 'info');

    const itemsToMigrate = scanResults.filter((r) => r.status === 'pending' || r.status === 'failed');

    if (itemsToMigrate.length === 0) {
      addLog('All images are already hosted on Cloudinary! No migration needed.', 'success');
      setStatus('completed');
      return;
    }

    let successCount = 0;
    let failCount = 0;

    let currentProjects = [...projects];
    let currentSettings = { ...siteSettings };
    let currentGallery = Array.isArray(siteSettings.galleryItems) ? [...siteSettings.galleryItems] : [];

    for (let i = 0; i < itemsToMigrate.length; i++) {
      if (isPausedRef.current) {
        addLog('Migration paused by admin.', 'warn');
        setStatus('paused');
        return;
      }

      const item = itemsToMigrate[i];
      setCurrentMigratingId(item.id);
      addLog(`[${i + 1}/${itemsToMigrate.length}] Uploading image for "${item.parentTitle}"...`, 'info');

      setScanResults((prev) =>
        prev.map((r) => (r.id === item.id ? { ...r, status: 'migrating', error: undefined } : r))
      );

      try {
        const res = await uploadUrlOrBase64ToCloudinary(item.currentUrl);
        const newCloudinaryUrl = res.secure_url;

        if (!newCloudinaryUrl) {
          throw new Error('Cloudinary response did not contain secure_url');
        }

        // Apply changes to working state copies
        if (item.type === 'portrait') {
          currentSettings = { ...currentSettings, portraitUrl: newCloudinaryUrl };
          onSaveSiteSettings(currentSettings);
        } else if (item.type === 'project') {
          currentProjects = currentProjects.map((p) =>
            p.id === item.parentId ? { ...p, image: newCloudinaryUrl } : p
          );
          onSaveProjects(currentProjects);
        } else if (item.type === 'gallery') {
          currentGallery = currentGallery.map((g) =>
            g.id === item.parentId ? { ...g, image: newCloudinaryUrl } : g
          );
          currentSettings = { ...currentSettings, galleryItems: currentGallery };
          onSaveSiteSettings(currentSettings);
        }

        setScanResults((prev) =>
          prev.map((r) =>
            r.id === item.id
              ? {
                  ...r,
                  status: 'migrated',
                  isCloudinary: true,
                  newUrl: newCloudinaryUrl,
                  sourceType: 'cloudinary',
                }
              : r
          )
        );

        successCount++;
        addLog(`✓ [${i + 1}/${itemsToMigrate.length}] Success: ${item.parentTitle} -> ${newCloudinaryUrl}`, 'success');
      } catch (err: any) {
        failCount++;
        const errMsg = err?.message || String(err);
        addLog(`✗ [${i + 1}/${itemsToMigrate.length}] Failed for ${item.parentTitle}: ${errMsg}`, 'error');
        setScanResults((prev) =>
          prev.map((r) => (r.id === item.id ? { ...r, status: 'failed', error: errMsg } : r))
        );
      }

      // Small throttle pause between requests to prevent rate limiting
      await new Promise((r) => setTimeout(r, 400));
    }

    setCurrentMigratingId(null);
    setStatus('completed');
    addLog(`🎉 Batch Migration Finished: ${successCount} successfully migrated, ${failCount} failed.`, 'success');
    if (setSaveNotice) setSaveNotice(`✓ Cloudinary Migration Finished (${successCount} migrated)!`);
  };

  const handlePauseMigration = () => {
    isPausedRef.current = true;
    setStatus('paused');
    addLog('Migration pause requested. Halting after current item...', 'warn');
  };

  const handleResumeMigration = () => {
    handleStartBatchMigration();
  };

  const handleRetryFailed = async () => {
    setScanResults((prev) =>
      prev.map((r) => (r.status === 'failed' ? { ...r, status: 'pending', error: undefined } : r))
    );
    setTimeout(() => {
      handleStartBatchMigration();
    }, 100);
  };

  // Test Upload direct file
  const handleTestFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTestUploadLoading(true);
    setTestUploadResult(null);
    addLog(`[Test Upload] Uploading "${file.name}" to Cloudinary (Preset: ${CLOUDINARY_CONFIG.uploadPreset})...`, 'info');

    try {
      const res = await uploadFileToCloudinary(file);
      setTestUploadResult(res.secure_url);
      addLog(`✓ Test Upload Success! URL: ${res.secure_url}`, 'success');
    } catch (err: any) {
      addLog(`✗ Test Upload Failed: ${err.message}`, 'error');
    } finally {
      setTestUploadLoading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrlId(id);
    setTimeout(() => setCopiedUrlId(null), 2000);
  };

  // Computed metrics
  const totalCount = scanResults.length;
  const cloudinaryCount = scanResults.filter((r) => r.isCloudinary || r.status === 'migrated').length;
  const pendingCount = scanResults.filter((r) => !r.isCloudinary && r.status !== 'migrated' && r.status !== 'failed').length;
  const failedCount = scanResults.filter((r) => r.status === 'failed').length;
  const progressPercent = totalCount > 0 ? Math.round((cloudinaryCount / totalCount) * 100) : 100;

  const filteredResults = scanResults.filter((item) => {
    if (filterType === 'pending' && (item.isCloudinary || item.status === 'migrated')) return false;
    if (filterType === 'cloudinary' && !item.isCloudinary && item.status !== 'migrated') return false;
    if (filterType === 'failed' && item.status !== 'failed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.parentTitle.toLowerCase().includes(q) ||
        item.currentUrl.toLowerCase().includes(q) ||
        item.sourceType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-mono-code text-xs">
      {/* 1. CLOUDINARY CONFIGURATION HEADER CARD */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#172023] via-[#121618] to-[#0c0f10] border border-[#00daf3]/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00daf3]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#00daf3] animate-pulse shadow-[0_0_10px_#00daf3]" />
              <span className="font-space text-lg sm:text-xl font-bold text-[#e1e3e4] tracking-wide">
                CLOUDINARY CLOUD STORAGE &amp; MIGRATION ENGINE
              </span>
            </div>
            <p className="text-[#919094] text-xs max-w-2xl leading-relaxed">
              إدارة وربط جميع صور الموقع (المشاريع، الألبومات، والصورة الشخصية) بخوادم <span className="text-[#00daf3] font-bold">Cloudinary</span> مع التفعيل التلقائي للتحسينات الذكية (<code className="text-[#00daf3]">f_auto, q_auto</code>) للسرعة الفائقة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-[#080a0b] p-3 rounded-xl border border-white/10 shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-[#00daf3]/10 border border-[#00daf3]/30">
              <span className="text-[#79797e] text-[10px] block uppercase">CLOUD NAME</span>
              <span className="text-[#00daf3] font-bold text-xs">{CLOUDINARY_CONFIG.cloudName}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#00daf3]/10 border border-[#00daf3]/30">
              <span className="text-[#79797e] text-[10px] block uppercase">UPLOAD PRESET</span>
              <span className="text-[#00daf3] font-bold text-xs">{CLOUDINARY_CONFIG.uploadPreset}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-green-950/60 border border-green-500/40 text-green-400 font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>UNSIGNED MODE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#1d2021] border border-white/10 space-y-1">
          <div className="text-[#79797e] text-[10px] uppercase font-bold flex items-center justify-between">
            <span>TOTAL IMAGES</span>
            <span className="material-symbols-outlined text-[#00daf3] text-sm">photo_library</span>
          </div>
          <div className="text-2xl font-bold text-[#e1e3e4] font-space">{totalCount}</div>
          <div className="text-[10px] text-[#919094]">All site media assets</div>
        </div>

        <div className="p-4 rounded-xl bg-[#1d2021] border border-[#00daf3]/30 space-y-1 shadow-[0_0_15px_rgba(0,218,243,0.1)]">
          <div className="text-[#00daf3] text-[10px] uppercase font-bold flex items-center justify-between">
            <span>CLOUDINARY HOSTED</span>
            <span className="material-symbols-outlined text-[#00daf3] text-sm">cloud_done</span>
          </div>
          <div className="text-2xl font-bold text-[#00daf3] font-space">{cloudinaryCount}</div>
          <div className="text-[10px] text-[#00daf3]/80">{progressPercent}% of portfolio</div>
        </div>

        <div className="p-4 rounded-xl bg-[#1d2021] border border-yellow-500/30 space-y-1">
          <div className="text-yellow-400 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>PENDING MIGRATION</span>
            <span className="material-symbols-outlined text-yellow-400 text-sm">hourglass_top</span>
          </div>
          <div className="text-2xl font-bold text-yellow-300 font-space">{pendingCount}</div>
          <div className="text-[10px] text-yellow-400/80">External / Unsplash / Base64</div>
        </div>

        <div className="p-4 rounded-xl bg-[#1d2021] border border-red-500/30 space-y-1">
          <div className="text-red-400 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>FAILED / RETRIES</span>
            <span className="material-symbols-outlined text-red-400 text-sm">error</span>
          </div>
          <div className="text-2xl font-bold text-red-400 font-space">{failedCount}</div>
          <div className="text-[10px] text-red-400/80">Require retry</div>
        </div>
      </div>

      {/* 3. PROGRESS BAR & STATUS */}
      <div className="p-5 rounded-xl bg-[#1d2021] border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00daf3] text-base">sync</span>
            <span className="text-[#e1e3e4] font-bold">MIGRATION PROGRESS STATUS:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                status === 'migrating'
                  ? 'bg-[#00daf3] text-[#001f24] animate-pulse'
                  : status === 'completed'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : status === 'paused'
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                  : 'bg-white/10 text-[#c7c6ca]'
              }`}
            >
              {status}
            </span>
          </div>

          <div className="text-xs text-[#00daf3] font-bold">
            {cloudinaryCount} / {totalCount} Images on Cloudinary ({progressPercent}%)
          </div>
        </div>

        {/* Bar */}
        <div className="w-full h-3 bg-[#0c0f10] rounded-full overflow-hidden border border-white/10 relative">
          <div
            className="h-full bg-gradient-to-r from-[#00daf3] to-[#00b2c7] transition-all duration-500 rounded-full shadow-[0_0_15px_rgba(0,218,243,0.8)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 4. PRIMARY CONTROLS ACTION BAR */}
      <div className="p-5 rounded-xl bg-[#121618] border border-[#00daf3]/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleScanSystem}
            disabled={status === 'migrating'}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Scan all images without moving anything (Dry Run)"
          >
            <span className="material-symbols-outlined text-sm">search</span>
            <span>SCAN SYSTEM (DRY RUN)</span>
          </button>

          {status !== 'migrating' ? (
            <button
              type="button"
              onClick={handleStartBatchMigration}
              disabled={pendingCount === 0 && failedCount === 0}
              className="btn-primary px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,227,253,0.4)] cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">rocket_launch</span>
              <span>START CLOUDINARY MIGRATION ({pendingCount + failedCount})</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePauseMigration}
              className="px-6 py-2.5 rounded-xl bg-yellow-500 text-black font-bold flex items-center gap-2 hover:bg-yellow-400 cursor-pointer shadow-lg"
            >
              <span className="material-symbols-outlined text-base">pause</span>
              <span>PAUSE MIGRATION</span>
            </button>
          )}

          {status === 'paused' && (
            <button
              type="button"
              onClick={handleResumeMigration}
              className="px-5 py-2.5 rounded-xl bg-[#00daf3] text-[#001f24] font-bold flex items-center gap-2 hover:bg-[#00c5dc] cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span>RESUME</span>
            </button>
          )}

          {failedCount > 0 && status !== 'migrating' && (
            <button
              type="button"
              onClick={handleRetryFailed}
              className="px-4 py-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 font-bold flex items-center gap-2 hover:bg-red-900 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">replay</span>
              <span>RETRY FAILED ({failedCount})</span>
            </button>
          )}
        </div>

        {/* Quick File Test Upload Button */}
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1d2021] border border-white/10 hover:border-[#00daf3] text-[#c7c6ca] hover:text-white cursor-pointer transition-all">
          <span className="material-symbols-outlined text-[#00daf3] text-sm">upload_file</span>
          <span>{testUploadLoading ? 'UPLOADING...' : 'TEST DIRECT UPLOAD'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleTestFileUpload}
            disabled={testUploadLoading}
            className="hidden"
          />
        </label>
      </div>

      {testUploadResult && (
        <div className="p-4 rounded-xl bg-[#081518] border border-[#00daf3]/50 text-xs text-[#00daf3] flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <span className="truncate">Test Uploaded to Cloudinary: <code className="text-white">{testUploadResult}</code></span>
          </div>
          <button
            onClick={() => handleCopyUrl(testUploadResult, 'test_uploaded')}
            className="px-3 py-1 bg-[#00daf3] text-[#001f24] font-bold rounded-lg shrink-0"
          >
            {copiedUrlId === 'test_uploaded' ? 'COPIED!' : 'COPY URL'}
          </button>
        </div>
      )}

      {/* 5. SCANNED ASSETS INVENTORY LIST & SEARCH */}
      <div className="p-6 rounded-xl bg-[#1d2021] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-space text-base font-bold text-[#e1e3e4] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00daf3]">image</span>
              <span>PORTFOLIO IMAGES INVENTORY ({scanResults.length})</span>
            </h4>
            <p className="text-[#79797e] text-[11px]">
              Review image locations, source types, and migrate individual assets on demand.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by title or URL..."
                className="bg-[#0c0f10] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#e1e3e4] focus:outline-none focus:border-[#00daf3] w-44 sm:w-56"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#79797e] hover:text-white"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-[#0c0f10] p-1 rounded-lg border border-white/10 text-[10px]">
              {(['all', 'pending', 'cloudinary', 'failed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-2.5 py-1 rounded capitalize font-bold ${
                    filterType === f
                      ? 'bg-[#00daf3] text-[#001f24]'
                      : 'text-[#79797e] hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Assets Table / List */}
        <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
          {filteredResults.length === 0 ? (
            <div className="text-center py-10 bg-[#0c0f10] rounded-xl border border-dashed border-white/10 text-[#79797e]">
              No images match the selected filter.
            </div>
          ) : (
            filteredResults.map((item) => {
              const isCurrentMigrating = currentMigratingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    item.status === 'migrated' || item.isCloudinary
                      ? 'bg-[#0e1315] border-[#00daf3]/30'
                      : item.status === 'failed'
                      ? 'bg-red-950/20 border-red-500/40'
                      : isCurrentMigrating
                      ? 'bg-[#00daf3]/10 border-[#00daf3] animate-pulse'
                      : 'bg-[#0c0f10] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail Preview */}
                    <div className="w-14 h-14 rounded-lg bg-black overflow-hidden border border-white/10 shrink-0 relative flex items-center justify-center">
                      <img
                        src={item.newUrl || item.currentUrl}
                        alt={item.parentTitle}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=200&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                      {item.isCloudinary && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#00daf3] text-[#001f24] flex items-center justify-center text-[9px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-space text-xs font-bold text-[#e1e3e4] truncate max-w-[220px] sm:max-w-xs">
                          {item.parentTitle}
                        </span>

                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/5 text-[#79797e]">
                          {item.type}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            item.sourceType === 'cloudinary'
                              ? 'bg-[#00daf3]/20 text-[#00daf3] border border-[#00daf3]/40'
                              : item.sourceType === 'unsplash'
                              ? 'bg-purple-950 text-purple-300 border border-purple-500/30'
                              : item.sourceType === 'base64'
                              ? 'bg-orange-950 text-orange-300 border border-orange-500/30'
                              : 'bg-white/10 text-[#c7c6ca]'
                          }`}
                        >
                          {item.sourceType}
                        </span>
                      </div>

                      <div className="text-[10px] text-[#79797e] truncate max-w-sm sm:max-w-md font-mono-code">
                        {item.newUrl ? (
                          <span className="text-[#00daf3]">Cloudinary: {item.newUrl}</span>
                        ) : (
                          <span>Source: {item.currentUrl.startsWith('data:') ? 'Base64 Data String' : item.currentUrl}</span>
                        )}
                      </div>

                      {item.error && (
                        <div className="text-[10px] text-red-400 font-bold truncate max-w-md">
                          Error: {item.error}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {(item.newUrl || item.isCloudinary) && (
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(item.newUrl || item.currentUrl, item.id)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#c7c6ca] hover:text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Copy Cloudinary Image URL"
                      >
                        <span className="material-symbols-outlined text-xs">content_copy</span>
                        <span>{copiedUrlId === item.id ? 'COPIED' : 'COPY'}</span>
                      </button>
                    )}

                    {!item.isCloudinary && item.status !== 'migrated' && (
                      <button
                        type="button"
                        onClick={() => handleMigrateSingle(item)}
                        disabled={isCurrentMigrating || status === 'migrating'}
                        className="px-3 py-1.5 rounded-lg bg-[#00daf3] hover:bg-[#00c5dc] text-[#001f24] font-bold text-[10px] flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-md shadow-[#00daf3]/20"
                      >
                        <span className="material-symbols-outlined text-xs">cloud_upload</span>
                        <span>{isCurrentMigrating ? 'MIGRATING...' : 'MIGRATE NOW'}</span>
                      </button>
                    )}

                    {(item.isCloudinary || item.status === 'migrated') && (
                      <span className="px-2.5 py-1 rounded-lg bg-green-950/60 border border-green-500/40 text-green-400 font-bold text-[10px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        <span>ON CLOUDINARY</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 6. REAL-TIME MIGRATION TERMINAL / AUDIT LOG */}
      <div className="p-5 rounded-xl bg-[#080a0b] border border-white/10 space-y-3 font-mono-code">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00daf3] animate-pulse" />
            <span className="text-xs font-bold text-[#00daf3] uppercase tracking-wider">
              REAL-TIME MIGRATION TERMINAL LOG
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLogs([])}
              className="text-[10px] text-[#79797e] hover:text-white uppercase font-bold"
            >
              CLEAR LOG
            </button>
          </div>
        </div>

        <div
          ref={logContainerRef}
          className="h-44 overflow-y-auto bg-[#040607] p-3 rounded-lg border border-white/5 space-y-1.5 text-[11px] leading-relaxed"
        >
          {logs.length === 0 ? (
            <div className="text-[#79797e] italic">
              Log is idle. Click "SCAN SYSTEM (DRY RUN)" or "START CLOUDINARY MIGRATION" to see live output.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2">
                <span className="text-[#56585c] shrink-0 font-mono-code">{log.timestamp}</span>
                <span
                  className={
                    log.type === 'success'
                      ? 'text-green-400'
                      : log.type === 'error'
                      ? 'text-red-400 font-bold'
                      : log.type === 'warn'
                      ? 'text-yellow-400'
                      : 'text-[#00daf3]'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudinaryMigrationManager;
