import { useState } from 'react';

export default function Navbar({ activeSection, setActiveSection }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'favorite', name: 'Favorite Team' },
    { id: 'teams', name: 'Teams' },
    { id: 'matches', name: 'Matches' },
    { id: 'standings', name: 'Standings' },
    { id: 'players', name: 'Players' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand/Logo - Light Theme Orange & White */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection('dashboard')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 via-orange-500 to-white flex items-center justify-center p-0.5 shadow-sm border border-orange-200">
            <span className="text-xl font-bold text-slate-950">🏆</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-wider text-slate-900 uppercase leading-none">FIFA WORLD CUP</span>
            <span className="text-[10px] text-orange-500 font-extrabold tracking-widest leading-none mt-0.5">DASHBOARD</span>
          </div>
        </div>

        {/* Desktop Navigation - Light Theme active tab */}
        <div className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 border ${
                  isActive
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-600 hover:text-slate-900 p-2 focus:outline-none transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-3 p-3 bg-white border border-slate-200 rounded-xl flex flex-col gap-1 shadow-lg animate-fadeIn">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-all border ${
                  isActive
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
