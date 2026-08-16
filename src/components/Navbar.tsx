import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ArrowUpRight, Menu, X, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onTalkClick: () => void;
  onAiStudioClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onTalkClick, onAiStudioClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Web Audio Synth for interactive sound FX
  const playSound = (type: 'hover' | 'click') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (type === 'hover') {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch {
      // Audio context policy
    }
  };

  const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Skills', href: '#skills' },
    { name: 'AI Studio', href: '#ai-studio', onClick: onAiStudioClick },
    { name: 'Journey', href: '#journey' },
    { name: 'Status', href: '#status' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#111415]/80 backdrop-blur-[20px] border-b border-white/10 py-4 shadow-2xl'
          : 'bg-[#111415]/40 backdrop-blur-[12px] border-b border-white/5 py-6'
      }`}
    >
      <div className="flex justify-between items-center px-6 md:px-16 max-w-[1440px] mx-auto">
        {/* Logo */}
        <a
          href="#"
          onMouseEnter={() => playSound('hover')}
          onClick={() => playSound('click')}
          className="font-space text-2xl font-bold text-[#e1e3e4] tracking-tighter interactive hover:text-[#00daf3] transition-colors flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#00daf3] animate-pulse" />
          MS.
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center font-mono-code text-xs uppercase tracking-[0.15em]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onMouseEnter={() => playSound('hover')}
              onClick={(e) => {
                playSound('click');
                if (link.onClick) {
                  e.preventDefault();
                  link.onClick();
                  const el = document.querySelector(link.href);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-[#c7c6ca] hover:text-[#00daf3] transition-colors duration-300 interactive flex items-center gap-1 group"
            >
              <span className="text-[#00daf3] opacity-0 group-hover:opacity-100 transition-opacity">&gt;</span>
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Audio Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSound('click');
            }}
            title={soundEnabled ? 'Disable Audio FX' : 'Enable Audio FX'}
            className="p-2.5 rounded-xl border border-white/10 text-[#c7c6ca] hover:text-[#00daf3] hover:border-[#00daf3]/40 transition-all interactive flex items-center gap-1.5 font-mono-code text-xs"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00daf3]" /> : <VolumeX className="w-4 h-4 text-[#79797e]" />}
            <span className="hidden lg:inline">{soundEnabled ? 'FX ON' : 'FX OFF'}</span>
          </button>

          {/* Let's Talk CTA */}
          <a
            href="#contact"
            onClick={() => {
              playSound('click');
              onTalkClick();
            }}
            onMouseEnter={() => playSound('hover')}
            className="btn-primary px-6 py-2.5 font-mono-code text-xs uppercase rounded interactive scale-95 active:scale-90 transition-transform flex items-center gap-2 font-semibold"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            playSound('click');
          }}
          className="md:hidden text-[#e1e3e4] p-2 border border-white/10 rounded interactive flex items-center justify-center"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-white/10 px-6 py-8 flex flex-col gap-6 font-mono-code text-sm uppercase tracking-wider bg-[#111415]/95 backdrop-blur-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                setMobileMenuOpen(false);
                playSound('click');
                if (link.onClick) {
                  e.preventDefault();
                  link.onClick();
                  const el = document.querySelector(link.href);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-[#e1e3e4] hover:text-[#00daf3] flex items-center justify-between py-2 border-b border-white/5"
            >
              <span>{link.name}</span>
              <ChevronRight className="w-4 h-4 text-[#00daf3]" />
            </a>
          ))}

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playSound('click');
              }}
              className="w-full py-3 rounded-xl border border-white/10 text-xs text-[#c7c6ca] flex items-center justify-center gap-2"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00daf3]" /> : <VolumeX className="w-4 h-4 text-[#79797e]" />}
              <span>AUDIO EFFECTS: {soundEnabled ? 'ENABLED' : 'DISABLED'}</span>
            </button>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full py-3 text-center text-xs uppercase rounded font-bold"
            >
              LET'S TALK
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
