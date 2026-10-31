import React from 'react';
import { PageId } from './Sidebar';
import { Menu, Database, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  currentPage: PageId;
  onOpenMobileSidebar: () => void;
  onOpenCsvModal: () => void;
  selectedSeason: string;
  onSelectSeason: (season: string) => void;
}

const PAGE_METAS: Record<PageId, { title: string; subtitle: string; breadcrumb: string }> = {
  'overview': {
    title: 'Executive Overview',
    subtitle: 'Cross-match benchmark of opponent pressure volume and 10-event possession retention.',
    breadcrumb: 'Analytics / Overview',
  },
  'match-explorer': {
    title: 'Match Explorer',
    subtitle: 'Micro-timeline and 10-event sequence inspection for individual Champions League finals.',
    breadcrumb: 'Analytics / Match Explorer',
  },
  'team-comparison': {
    title: 'Team Comparison',
    subtitle: 'Head-to-head evaluation of pressing resistance and retention rates between two teams.',
    breadcrumb: 'Analytics / Team Comparison',
  },
  'pressure-analysis': {
    title: 'Pressure Analysis',
    subtitle: 'Comprehensive distribution across all 4 mutually exclusive possession outcome categories.',
    breadcrumb: 'Analytics / Pressure Analysis',
  },
  'tactical-pitch': {
    title: 'Tactical Pitch Map',
    subtitle: '2D StatsBomb coordinate spatial analysis (120x80) with scatter points and pressure density zones.',
    breadcrumb: 'Analytics / Tactical Pitch',
  },
  'methodology': {
    title: 'Methodology & Data',
    subtitle: 'Mathematical formulations, observation window constraints, audit report, and pipeline data.',
    breadcrumb: 'Analytics / Methodology',
  },
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onOpenMobileSidebar,
  onOpenCsvModal,
  selectedSeason,
  onSelectSeason,
}) => {
  const currentMeta = PAGE_METAS[currentPage];

  return (
    <header className="sticky top-0 z-30 bg-[#FFFBEA]/95 backdrop-blur-xs border-b-2 border-[#171717] px-4 sm:px-6 py-3.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Mobile trigger & breadcrumb + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 bg-[#FFE500] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#FFFDF3] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4 text-[#171717]" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#64748B]">
              <span>PressEscape</span>
              <span>/</span>
              <span className="text-[#171717]">{currentMeta.breadcrumb}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#171717] tracking-tight leading-tight">
              {currentMeta.title}
            </h1>
          </div>
        </div>

        {/* Right: Competition, Season & Action badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Competition Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#FFFDF3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] text-xs font-bold text-[#171717]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#171717]" />
            <span>UEFA Champions League — Men's</span>
          </div>

          {/* Season Selector */}
          <div className="flex items-center bg-[#FFFDF3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
            <span className="px-2 py-1 text-[11px] font-extrabold uppercase bg-[#F2EDD9] border-r-2 border-[#171717] text-[#171717]">
              Season
            </span>
            <select
              value={selectedSeason}
              onChange={(e) => onSelectSeason(e.target.value)}
              className="px-2 py-1 text-xs font-bold font-mono-nums bg-transparent text-[#171717] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Finals (2014-2019)</option>
              <option value="2014/15">2014/15 (Berlin)</option>
              <option value="2015/16">2015/16 (Milan)</option>
              <option value="2016/17">2016/17 (Cardiff)</option>
              <option value="2017/18">2017/18 (Kyiv)</option>
              <option value="2018/19">2018/19 (Madrid)</option>
            </select>
          </div>

          {/* CSV Sync Button */}
          <Button
            variant="accent"
            size="sm"
            icon={<FileSpreadsheet className="w-3.5 h-3.5" />}
            onClick={onOpenCsvModal}
          >
            <span className="hidden sm:inline">CSV Sync</span>
            <span className="sm:hidden">CSV</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
