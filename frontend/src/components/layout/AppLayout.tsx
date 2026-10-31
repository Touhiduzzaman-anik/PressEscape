import React, { useState } from 'react';
import { PageId } from './Sidebar';
import {
  LayoutDashboard,
  Trophy,
  Users,
  Activity,
  MapPin,
  Database,
  Menu,
  X,
  FileSpreadsheet,
  ChevronDown,
} from 'lucide-react';
import { CsvModal } from '../ui/CsvModal';
import { useAnalyticsData } from '../../hooks/useAnalyticsData';

interface AppLayoutProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  selectedYear: string;
  onSelectYear: (year: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentPage,
  onSelectPage,
  selectedYear,
  onSelectYear,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const { stats } = useAnalyticsData();

  const navItems: Array<{ id: PageId; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Home', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'match-explorer', label: 'Match Explorer', icon: <Trophy className="w-4 h-4" /> },
    { id: 'team-comparison', label: 'Team Comparison', icon: <Users className="w-4 h-4" /> },
    { id: 'pressure-analysis', label: 'Pressure Analysis', icon: <Activity className="w-4 h-4" /> },
    { id: 'tactical-pitch', label: 'Pitch Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'methodology', label: 'Methodology & Data', icon: <Database className="w-4 h-4" /> },
  ];

  const years = ['2015', '2016', '2017', '2018', '2019'];

  return (
    <div className="min-h-screen bg-[#FFFBEA] text-[#171717] flex flex-col font-sans select-none antialiased">
      {/* CSV Sync Modal */}
      <CsvModal isOpen={csvModalOpen} onClose={() => setCsvModalOpen(false)} />

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* TOP BRAND HEADER (Exact match to screenshot composition) */}
      <div className="bg-[#FFE500] border-b-3 border-[#171717] px-4 sm:px-6 py-3.5 relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Football Hexagon Icon */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FFFDF3] border-3 border-[#171717] shadow-[3px_3px_0px_#171717] flex items-center justify-center rounded-none shrink-0">
                <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 fill-[#171717]">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 3.1l2.9 2.1-1.1 3.4H9.2L8.1 7.2 11 5.1h2zm-5.9 3.5l1 3.2L6 14.8l-1.9-2.6 4-3.6zm-1.8 7.3l2.2-1.6 2.4 1.7-.8 3.5-3.8-3.6zm11.4 0l-3.8 3.6-.8-3.5 2.4-1.7 2.2 1.6zm-1.7-4.1l-2.1-3 1-3.2 4 3.6-2.9 2.6z" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#171717] leading-none">
                    PressEscape
                  </h1>
                  <span className="text-[10px] font-mono-nums font-extrabold px-1.5 py-0.2 bg-[#FFFDF3] border border-[#171717] shadow-[1px_1px_0px_#171717]">
                    v1.0
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#171717] uppercase">
                    FOOTBALL ANALYTICS
                  </span>
                  <span className="text-[#171717] text-[10px] font-bold">·</span>
                  <span className="text-[10px] font-extrabold text-[#171717]/80 uppercase hidden sm:inline">
                    PRESS RESISTANCE INTELLIGENCE
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 bg-[#FFFDF3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] ml-2"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Middle: Tilted Sticky Note Badge & Editorial Artwork */}
          <div className="hidden xl:flex items-center gap-6">
            <div className="relative transform -rotate-3 hover:rotate-0 transition-transform">
              <div className="absolute -top-2 left-6 w-8 h-3 bg-[#E6DFC8]/90 border-t border-b border-[#171717]/40 shadow-xs"></div>
              <div className="bg-[#FFFDF3] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] px-3.5 py-1.5 text-center">
                <span className="text-[11px] font-black uppercase text-[#171717] tracking-tight block leading-tight">
                  TURN PRESSURE
                </span>
                <span className="text-[11px] font-black uppercase text-[#171717] tracking-tight block leading-tight">
                  INTO ➔ INSIGHT
                </span>
              </div>
            </div>

            {/* Silhouette celebration graphics */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#171717] bg-[#FFFBEA]/80 border-2 border-[#171717] px-3 py-1.5 shadow-[2px_2px_0px_#171717]">
              <span className="font-mono-nums font-black">1,206</span>
              <span className="text-[#64748B]">Audited Events Across</span>
              <span className="font-mono-nums font-black">5</span>
              <span className="text-[#64748B]">Finals</span>
            </div>
          </div>

          {/* Right: UEFA Champions League Box with Year Pills */}
          <div className="bg-[#FFFDF3] border-2 border-[#171717] shadow-[4px_4px_0px_#171717] p-2.5 sm:p-3 shrink-0">
            <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-[#E6DFC8]">
              <span className="text-xs sm:text-sm font-black uppercase tracking-tight text-[#171717]">
                UEFA CHAMPIONS LEAGUE
              </span>
              <ChevronDown className="w-4 h-4 text-[#171717]" />
            </div>

            {/* Year buttons in a row */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelectYear('ALL')}
                className={`px-2 py-1 text-xs font-extrabold font-mono-nums border-2 border-[#171717] transition-all cursor-pointer ${
                  selectedYear === 'ALL'
                    ? 'bg-[#FFE500] shadow-[2px_2px_0px_#171717] translate-x-0.5'
                    : 'bg-[#FFFBEA] hover:bg-[#F2EDD9]'
                }`}
              >
                ALL
              </button>
              {years.map((yr) => (
                <button
                  key={yr}
                  onClick={() => onSelectYear(yr)}
                  className={`px-2.5 py-1 text-xs font-extrabold font-mono-nums border-2 border-[#171717] transition-all cursor-pointer ${
                    selectedYear === yr
                      ? 'bg-[#FFE500] shadow-[2px_2px_0px_#171717] translate-x-0.5'
                      : 'bg-[#FFFBEA] hover:bg-[#F2EDD9]'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE BODY */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col lg:flex-row gap-5 p-4 sm:p-6">
        {/* LEFT SIDEBAR (Sticky on desktop, drawer on mobile) */}
        <aside
          className={`fixed lg:sticky top-6 left-0 z-50 h-[calc(100vh-3rem)] lg:h-[calc(100vh-8rem)] w-[260px] bg-[#FFFBEA] lg:bg-transparent flex flex-col justify-between transition-transform duration-200 shrink-0 ${
            mobileMenuOpen ? 'translate-x-0 p-4 border-r-3 border-[#171717]' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Navigation Links */}
          <div className="space-y-4">
            <div className="bg-[#FFFDF3] border-3 border-[#171717] shadow-[4px_4px_0px_#171717] p-2 space-y-1.5">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectPage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 font-black text-xs border-2 border-[#171717] transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#FFE500] text-[#171717] shadow-[3px_3px_0px_#171717] translate-x-1'
                        : 'bg-[#FFFDF3] text-[#171717] hover:bg-[#F2EDD9] hover:shadow-[2px_2px_0px_#171717]'
                    }`}
                  >
                    <span className="text-[#171717] shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* CSV Data Pipeline Trigger Button */}
            <button
              onClick={() => {
                setCsvModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-black border-2 border-[#171717] bg-[#FFFDF3] shadow-[3px_3px_0px_#171717] hover:bg-[#FFE500] transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#171717]" />
              <span>Pipeline CSV Sync</span>
            </button>
          </div>

          {/* Bottom Editorial Illustration (Exact match to screenshot bottom-left) */}
          <div className="hidden lg:block mt-auto pt-4">
            <div className="bg-[#FFFDF3] border-3 border-[#171717] shadow-[4px_4px_0px_#171717] p-4 text-center relative overflow-hidden">
              {/* Crown sketch over player */}
              <div className="flex justify-center mb-1">
                <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-[#171717] stroke-2 fill-[#FFE500]">
                  <path d="M2 17l3-9 4 5 3-7 3 7 4-5 3 9H2z" />
                </svg>
              </div>

              {/* Player Silhouette & Quote */}
              <div className="text-center space-y-1">
                <div className="text-xs font-black tracking-tight uppercase text-[#171717]">
                  GOOD TEAMS
                </div>
                <div className="text-base font-black tracking-tight uppercase text-[#171717] bg-[#FFE500] inline-block px-1 border border-[#171717]">
                  ESCAPE
                </div>
                <div className="text-xs font-black tracking-tight uppercase text-[#171717]">
                  PRESSURE.
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#E6DFC8] text-[10px] font-mono-nums font-bold text-[#64748B]">
                StatsBomb UCL Corpus
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Minimal Footer */}
      <footer className="border-t-2 border-[#171717] bg-[#F2EDD9] py-3 px-6 text-center text-xs font-bold text-[#64748B] flex flex-col sm:flex-row items-center justify-between max-w-[1600px] w-full mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-[#171717]">PressEscape</span>
          <span>·</span>
          <span>Football Analytics &amp; Press Resistance Intelligence</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono-nums mt-1 sm:mt-0">
          <span>StatsBomb 120×80 Coordinates</span>
          <span>·</span>
          <span>10-Event Retention Window</span>
        </div>
      </footer>
    </div>
  );
};
