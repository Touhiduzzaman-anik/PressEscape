import React from 'react';
import {
  LayoutDashboard,
  Trophy,
  Users,
  Activity,
  MapPin,
  Database,
  FileSpreadsheet,
  X,
  ShieldAlert,
} from 'lucide-react';

export type PageId =
  | 'overview'
  | 'match-explorer'
  | 'team-comparison'
  | 'pressure-analysis'
  | 'tactical-pitch'
  | 'methodology';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenCsvModal: () => void;
  isCustomDataLoaded?: boolean;
}

interface NavItem {
  id: PageId;
  number: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', number: '01', label: 'Overview', icon: LayoutDashboard },
  { id: 'match-explorer', number: '02', label: 'Match Explorer', icon: Trophy },
  { id: 'team-comparison', number: '03', label: 'Team Comparison', icon: Users },
  { id: 'pressure-analysis', number: '04', label: 'Pressure Analysis', icon: Activity },
  { id: 'tactical-pitch', number: '05', label: 'Tactical Pitch Map', icon: MapPin },
  { id: 'methodology', number: '06', label: 'Methodology & Data', icon: Database },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpenMobile,
  onCloseMobile,
  onOpenCsvModal,
  isCustomDataLoaded = false,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[270px] bg-[#FFFBEA] border-r-3 border-[#171717] flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 select-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Block */}
        <div>
          <div className="p-5 border-b-2 border-[#171717] bg-[#FFFDF3]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FFE500] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center font-extrabold text-lg text-[#171717]">
                  PE
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-[#171717] leading-none">
                    PressEscape
                  </h1>
                  <span className="text-[10px] font-extrabold tracking-widest text-[#64748B] uppercase">
                    FOOTBALL ANALYTICS
                  </span>
                </div>
              </div>
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1 border border-[#171717] hover:bg-[#FFE500]"
                aria-label="Close menu"
              >
                <X className="w-4 h-4 text-[#171717]" />
              </button>
            </div>
            <div className="mt-2 pt-2 border-t border-[#E6DFC8] flex items-center justify-between text-[11px]">
              <span className="text-[#64748B] font-semibold">Press Resistance AI</span>
              <span className="font-mono-nums font-bold text-[#171717]">v1.0.0</span>
            </div>
          </div>

          {/* Dataset Status Banner */}
          <div className="px-4 py-2 border-b-2 border-[#171717] bg-[#F2EDD9] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#171717]" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#171717]">
                {isCustomDataLoaded ? 'CUSTOM CSV ACTIVE' : 'BENCHMARK DATASET'}
              </span>
            </div>
            <span className="font-mono-nums text-[10px] font-bold px-1.5 py-0.2 bg-[#FFE500] border border-[#171717]">
              1,206 EV
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">
              Navigation
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectPage(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 font-bold text-xs border-2 border-[#171717] transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FFE500] text-[#171717] shadow-[3px_3px_0px_#171717] translate-x-0.5'
                      : 'bg-[#FFFDF3] text-[#171717] hover:bg-[#F2EDD9] hover:shadow-[2px_2px_0px_#171717]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#171717] shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-mono-nums text-[11px] opacity-75 font-semibold">
                    {item.number}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & Data Source */}
        <div className="p-4 border-t-2 border-[#171717] bg-[#FFFDF3] space-y-3">
          <button
            onClick={onOpenCsvModal}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold border-2 border-[#171717] bg-[#FFFBEA] shadow-[2px_2px_0px_#171717] hover:bg-[#FFE500] hover:shadow-[3px_3px_0px_#171717] transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#171717]" />
            <span>Sync CSV Pipeline</span>
          </button>

          <div className="text-[10px] text-[#64748B] space-y-1">
            <div className="flex items-center justify-between">
              <span>Source:</span>
              <span className="font-semibold text-[#171717]">StatsBomb Open Data</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Coverage:</span>
              <span className="font-semibold text-[#171717]">5 UCL Finals</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Coordinate Grid:</span>
              <span className="font-mono-nums font-semibold text-[#171717]">120 x 80</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
