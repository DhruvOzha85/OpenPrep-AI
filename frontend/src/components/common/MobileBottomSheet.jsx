import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Swords, Users, Bot, Settings } from 'lucide-react';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/flashcards/review', label: 'Flashcards', icon: BookOpen },
  { to: '/battle', label: 'Battle Arena', icon: Swords },
  { to: '/study-group', label: 'Study Group', icon: Users },
  { to: '/ai-assistant', label: 'AI Mentor', icon: Bot },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function MobileBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const location = useLocation();
  const startY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    setIsOpen(false);
    setOffsetY(0);
  }, [location.pathname]);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) {
      setOffsetY(diff);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (offsetY > 100) {
      setIsOpen(false);
    }
    setOffsetY(0);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] p-4 rounded-full bg-indigo-600 text-white shadow-lg border-2 border-white dark:border-slate-800"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[65] bg-black/50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-[70] bg-white dark:bg-slate-900 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] flex flex-col"
        style={{ 
          transform: `translateY(${isOpen ? offsetY : 100}%)`,
          transition: isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '75vh'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull handle */}
        <div className="flex justify-center pt-4 pb-2 w-full cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-600 rounded-full" />
        </div>
        
        <div className="flex justify-between items-center px-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 font-playfair">Menu</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 text-neutral-500 bg-neutral-100 dark:bg-neutral-800 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-12">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  isActive 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-neutral-50 dark:bg-slate-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl ${
                  isActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg tracking-wide">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
