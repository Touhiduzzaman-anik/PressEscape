import React from 'react';
import { DatasetStats } from '../../types/analytics';

interface OutcomeDistributionChartProps {
  stats: DatasetStats;
  className?: string;
}

export const OutcomeDistributionChart: React.FC<OutcomeDistributionChartProps> = ({ stats, className = '' }) => {
  const total = stats.totalPressures || 1206;
  const retained = stats.totalRetained || 672;
  const changed = stats.totalChanged || 448;
  const periodEnded = stats.totalPeriodEnded || 46;
  const insufficient = stats.totalInsufficient || 40;

  const retainedPct = (retained / total) * 100;
  const changedPct = (changed / total) * 100;
  const periodEndedPct = (periodEnded / total) * 100;
  const insufficientPct = (insufficient / total) * 100;

  // Donut chart geometry (viewBox 0 0 100 100, center 50 50, radius 38, strokeWidth 16)
  const radius = 35;
  const circumference = 2 * Math.PI * radius;

  const retainedDash = (retainedPct / 100) * circumference;
  const changedDash = (changedPct / 100) * circumference;
  const periodDash = (periodEndedPct / 100) * circumference;
  const insufficientDash = (insufficientPct / 100) * circumference;

  const offsetRetained = 0;
  const offsetChanged = -retainedDash;
  const offsetPeriod = -(retainedDash + changedDash);
  const offsetInsufficient = -(retainedDash + changedDash + periodDash);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-5 p-2 ${className}`}>
      {/* Donut SVG */}
      <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Base stroke background */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#F2EDD9"
            strokeWidth="15"
          />

          {/* Slices with 2px borders */}
          {/* 1. Retained (Yellow) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#FFE500"
            strokeWidth="15"
            strokeDasharray={`${retainedDash} ${circumference}`}
            strokeDashoffset={offsetRetained}
            className="transition-all duration-300"
          />

          {/* 2. Possession Changed (Coral / Red) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#F16B6B"
            strokeWidth="15"
            strokeDasharray={`${changedDash} ${circumference}`}
            strokeDashoffset={offsetChanged}
            className="transition-all duration-300"
          />

          {/* 3. Period Ended (Sky Blue) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#3B82F6"
            strokeWidth="15"
            strokeDasharray={`${periodDash} ${circumference}`}
            strokeDashoffset={offsetPeriod}
            className="transition-all duration-300"
          />

          {/* 4. Insufficient Events (Gray) */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#94A3B8"
            strokeWidth="15"
            strokeDasharray={`${insufficientDash} ${circumference}`}
            strokeDashoffset={offsetInsufficient}
            className="transition-all duration-300"
          />

          {/* Inner circle border line */}
          <circle
            cx="50"
            cy="50"
            r={radius - 7.5}
            fill="transparent"
            stroke="#171717"
            strokeWidth="1.5"
          />
          {/* Outer circle border line */}
          <circle
            cx="50"
            cy="50"
            r={radius + 7.5}
            fill="transparent"
            stroke="#171717"
            strokeWidth="1.5"
          />
        </svg>

        {/* Center Hole Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-extrabold font-mono-nums text-[#171717] leading-none">
            {total.toLocaleString()}
          </span>
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mt-0.5">
            Events
          </span>
        </div>
      </div>

      {/* Legend Column with Exact Match from Screenshot */}
      <div className="flex-1 w-full space-y-2 text-xs font-bold text-[#171717]">
        <div className="flex items-center justify-between p-1.5 hover:bg-[#F2EDD9] border-b border-[#E6DFC8]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#FFE500] border-2 border-[#171717] inline-block shrink-0 shadow-[1px_1px_0px_#171717]"></span>
            <span className="truncate">Retained (10 events)</span>
          </div>
          <div className="flex items-center gap-2 font-mono-nums shrink-0">
            <span className="text-[#64748B] text-[11px] font-medium">({retained})</span>
            <span>{retainedPct.toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-1.5 hover:bg-[#F2EDD9] border-b border-[#E6DFC8]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F16B6B] border-2 border-[#171717] inline-block shrink-0 shadow-[1px_1px_0px_#171717]"></span>
            <span className="truncate">Possession Changed</span>
          </div>
          <div className="flex items-center gap-2 font-mono-nums shrink-0">
            <span className="text-[#64748B] text-[11px] font-medium">({changed})</span>
            <span>{changedPct.toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-1.5 hover:bg-[#F2EDD9] border-b border-[#E6DFC8]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#3B82F6] border-2 border-[#171717] inline-block shrink-0 shadow-[1px_1px_0px_#171717]"></span>
            <span className="truncate">Period Ended</span>
          </div>
          <div className="flex items-center gap-2 font-mono-nums shrink-0">
            <span className="text-[#64748B] text-[11px] font-medium">({periodEnded})</span>
            <span>{periodEndedPct.toFixed(1)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-1.5 hover:bg-[#F2EDD9]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#94A3B8] border-2 border-[#171717] inline-block shrink-0 shadow-[1px_1px_0px_#171717]"></span>
            <span className="truncate">Insufficient Events</span>
          </div>
          <div className="flex items-center gap-2 font-mono-nums shrink-0">
            <span className="text-[#64748B] text-[11px] font-medium">({insufficient})</span>
            <span>{insufficientPct.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
