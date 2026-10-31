import React, { useState } from 'react';
import { TeamMatchupSummary } from '../../types/analytics';
import { TeamCrest } from '../ui/TeamCrest';

interface TeamComparisonWidgetProps {
  matchups: TeamMatchupSummary[];
  className?: string;
  onNavigateToFullComparison?: () => void;
}

export const TeamComparisonWidget: React.FC<TeamComparisonWidgetProps> = ({
  matchups,
  className = '',
  onNavigateToFullComparison,
}) => {
  // Default to 2023 final matchup: Man City vs Inter Milan
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);

  // Group pairs of teams by authentic StatsBomb match IDs
  const pairs = [
    {
      label: 'Tottenham vs Liverpool (2018/19 · ID: 22912)',
      teamA: matchups.find((m) => m.matchId === '22912' && m.teamName.includes('Tottenham')) || matchups[8],
      teamB: matchups.find((m) => m.matchId === '22912' && m.teamName.includes('Liverpool')) || matchups[9],
    },
    {
      label: 'Real Madrid vs Liverpool (2017/18 · ID: 18245)',
      teamA: matchups.find((m) => m.matchId === '18245' && m.teamName.includes('Real')) || matchups[6],
      teamB: matchups.find((m) => m.matchId === '18245' && m.teamName.includes('Liverpool')) || matchups[7],
    },
    {
      label: 'Juventus vs Real Madrid (2016/17 · ID: 18244)',
      teamA: matchups.find((m) => m.matchId === '18244' && m.teamName.includes('Juventus')) || matchups[4],
      teamB: matchups.find((m) => m.matchId === '18244' && m.teamName.includes('Real')) || matchups[5],
    },
    {
      label: 'Real Madrid vs Atlético Madrid (2015/16 · ID: 18243)',
      teamA: matchups.find((m) => m.matchId === '18243' && m.teamName.includes('Real')) || matchups[2],
      teamB: matchups.find((m) => m.matchId === '18243' && m.teamName.includes('Atlético')) || matchups[3],
    },
    {
      label: 'Juventus vs Barcelona (2014/15 · ID: 18242)',
      teamA: matchups.find((m) => m.matchId === '18242' && m.teamName.includes('Juventus')) || matchups[0],
      teamB: matchups.find((m) => m.matchId === '18242' && m.teamName.includes('Barcelona')) || matchups[1],
    },
  ];

  const currentPair = pairs[selectedPairIndex] || pairs[0];
  const tA = currentPair.teamA;
  const tB = currentPair.teamB;

  const maxPressures = Math.max(tA?.totalPressureEventsFaced || 140, tB?.totalPressureEventsFaced || 140, 150);

  // Circular gauge calculations
  const renderCircleGauge = (pct: number, color: string) => {
    const r = 22;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
      <svg viewBox="0 0 54 54" className="w-14 h-14 -rotate-90">
        <circle cx="27" cy="27" r={r} fill="transparent" stroke="#F2EDD9" strokeWidth="6" />
        <circle
          cx="27"
          cy="27"
          r={r}
          fill="transparent"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
        <circle cx="27" cy="27" r={r - 3} fill="transparent" stroke="#171717" strokeWidth="1.2" />
        <circle cx="27" cy="27" r={r + 3} fill="transparent" stroke="#171717" strokeWidth="1.2" />
      </svg>
    );
  };

  return (
    <div className={`p-1 space-y-4 ${className}`}>
      {/* Top Selector Strip */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-[#171717] pb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
            Matchup Comparison:
          </span>
        </div>
        <select
          value={selectedPairIndex}
          onChange={(e) => setSelectedPairIndex(Number(e.target.value))}
          className="px-2 py-1 bg-[#FFFDF3] border-2 border-[#171717] text-xs font-bold font-mono-nums shadow-[2px_2px_0px_#171717] cursor-pointer focus:outline-none"
        >
          {pairs.map((p, idx) => (
            <option key={p.label} value={idx}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Team Logos, Names & Circular Retention Rates */}
      <div className="grid grid-cols-2 gap-4">
        {/* Team A (Left - Yellow Theme) */}
        <div className="flex items-center justify-between p-2.5 bg-[#FFFDF3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
          <div className="flex items-center gap-2">
            <TeamCrest teamName={tA.teamName} size="md" />
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-[#171717] block leading-tight">
                {tA.teamName}
              </span>
              <span className="text-[10px] text-[#64748B] font-bold uppercase">
                Retention Rate
              </span>
              <span className="font-mono-nums font-extrabold text-sm sm:text-base text-[#171717] block">
                {tA.retentionRate.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="shrink-0">{renderCircleGauge(tA.retentionRate, '#FFE500')}</div>
        </div>

        {/* Team B (Right - Sky Blue Theme) */}
        <div className="flex items-center justify-between p-2.5 bg-[#FFFDF3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
          <div className="flex items-center gap-2">
            <TeamCrest teamName={tB.teamName} size="md" />
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-[#171717] block leading-tight">
                {tB.teamName}
              </span>
              <span className="text-[10px] text-[#64748B] font-bold uppercase">
                Retention Rate
              </span>
              <span className="font-mono-nums font-extrabold text-sm sm:text-base text-[#171717] block">
                {tB.retentionRate.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="shrink-0">{renderCircleGauge(tB.retentionRate, '#3B82F6')}</div>
        </div>
      </div>

      {/* Comparative Horizontal Bar Rows */}
      <div className="space-y-2 pt-1 font-mono-nums text-xs font-bold text-[#171717]">
        {/* Metric 1: Total Pressure Events */}
        <div>
          <div className="text-center text-[11px] font-bold text-[#64748B] mb-0.5">
            Total Pressure Events
          </div>
          <div className="grid grid-cols-[36px_1fr_1fr_36px] items-center gap-2">
            <span className="text-right font-extrabold">{tA.totalPressureEventsFaced}</span>
            <div className="flex justify-end h-5 bg-[#F2EDD9] border border-[#171717] rounded-none overflow-hidden p-0.5">
              <div
                className="h-full bg-[#FFE500] border border-[#171717]"
                style={{ width: `${(tA.totalPressureEventsFaced / maxPressures) * 100}%` }}
              />
            </div>
            <div className="flex justify-start h-5 bg-[#F2EDD9] border border-[#171717] rounded-none overflow-hidden p-0.5">
              <div
                className="h-full bg-[#3B82F6] border border-[#171717]"
                style={{ width: `${(tB.totalPressureEventsFaced / maxPressures) * 100}%` }}
              />
            </div>
            <span className="text-left font-extrabold">{tB.totalPressureEventsFaced}</span>
          </div>
        </div>

        {/* Metric 2: Retained (10 events) */}
        <div>
          <div className="text-center text-[11px] font-bold text-[#64748B] mb-0.5">
            Retained (10 events)
          </div>
          <div className="grid grid-cols-[36px_1fr_1fr_36px] items-center gap-2">
            <span className="text-right font-extrabold">{tA.retained10Event}</span>
            <div className="flex justify-end h-5 bg-[#F2EDD9] border border-[#171717] rounded-none overflow-hidden p-0.5">
              <div
                className="h-full bg-[#FFE500] border border-[#171717]"
                style={{ width: `${(tA.retained10Event / maxPressures) * 100}%` }}
              />
            </div>
            <div className="flex justify-start h-5 bg-[#F2EDD9] border border-[#171717] rounded-none overflow-hidden p-0.5">
              <div
                className="h-full bg-[#3B82F6] border border-[#171717]"
                style={{ width: `${(tB.retained10Event / maxPressures) * 100}%` }}
              />
            </div>
            <span className="text-left font-extrabold">{tB.retained10Event}</span>
          </div>
        </div>

        {/* Metric 3: Possession Changed */}
        <div>
          <div className="text-center text-[11px] font-bold text-[#64748B] mb-0.5">
            Possession Changed
          </div>
          <div className="grid grid-cols-[36px_1fr_1fr_36px] items-center gap-2">
            <span className="text-right font-extrabold">{tA.possessionChanged}</span>
            <div className="flex justify-end h-5 bg-[#F2EDD9] border border-[#171717] rounded-none overflow-hidden p-0.5">
              <div
                className="h-full bg-[#FFE500] border border-[#171717]"
                style={{ width: `${(tA.possessionChanged / maxPressures) * 100}%` }}
              />
            </div>
            <div className="flex justify-start h-5 bg-[#F2EDD9] border border-[#171717] rounded-none overflow-hidden p-0.5">
              <div
                className="h-full bg-[#3B82F6] border border-[#171717]"
                style={{ width: `${(tB.possessionChanged / maxPressures) * 100}%` }}
              />
            </div>
            <span className="text-left font-extrabold">{tB.possessionChanged}</span>
          </div>
        </div>

        {/* Metric 4: Period Ended */}
        <div>
          <div className="text-center text-[11px] font-bold text-[#64748B] mb-0.5">
            Period Ended
          </div>
          <div className="grid grid-cols-[36px_1fr_1fr_36px] items-center gap-2">
            <span className="text-right font-extrabold">{tA.periodEnded}</span>
            <div className="flex justify-end h-5 bg-[#F2EDD9] border border-[#171717] rounded-none overflow-hidden p-0.5">
              <div
                className="h-full bg-[#FFE500] border border-[#171717]"
                style={{ width: `${(tA.periodEnded / 30) * 100}%` }}
              />
            </div>
            <div className="flex justify-start h-5 bg-[#F2EDD9] border border-[#171717] rounded-none overflow-hidden p-0.5">
              <div
                className="h-full bg-[#3B82F6] border border-[#171717]"
                style={{ width: `${(tB.periodEnded / 30) * 100}%` }}
              />
            </div>
            <span className="text-left font-extrabold">{tB.periodEnded}</span>
          </div>
        </div>

        {/* Metric 5: Insufficient Events */}
        <div>
          <div className="text-center text-[11px] font-bold text-[#64748B] mb-0.5">
            Insufficient Events
          </div>
          <div className="grid grid-cols-[36px_1fr_1fr_36px] items-center gap-2">
            <span className="text-right font-extrabold">{tA.insufficientEvents}</span>
            <div className="flex justify-end h-5 bg-[#F2EDD9] border border-[#171717] rounded-none overflow-hidden p-0.5">
              <div
                className="h-full bg-[#FFE500] border border-[#171717]"
                style={{ width: `${(tA.insufficientEvents / 30) * 100}%` }}
              />
            </div>
            <div className="flex justify-start h-5 bg-[#F2EDD9] border border-[#171717] rounded-none overflow-hidden p-0.5">
              <div
                className="h-full bg-[#3B82F6] border border-[#171717]"
                style={{ width: `${(tB.insufficientEvents / 30) * 100}%` }}
              />
            </div>
            <span className="text-left font-extrabold">{tB.insufficientEvents}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
