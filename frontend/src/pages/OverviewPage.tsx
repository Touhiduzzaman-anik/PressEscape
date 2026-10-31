import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { MetricCard } from '../components/ui/MetricCard';
import { TacticalPitch } from '../components/pitch/TacticalPitch';
import { TeamComparisonWidget } from '../components/charts/TeamComparisonWidget';
import { OutcomeDistributionChart } from '../components/charts/OutcomeDistributionChart';
import { TeamCrest } from '../components/ui/TeamCrest';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { Zap, Users, TrendingUp, Trophy, Eye, Info } from 'lucide-react';
import { PageId } from '../components/layout/Sidebar';

interface OverviewPageProps {
  onNavigateToMatch: (matchId: string) => void;
  onNavigateToPage: (page: PageId) => void;
  selectedSeason: string;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateToMatch,
  onNavigateToPage,
  selectedSeason,
}) => {
  const { allEvents, matches, matchups, stats, getFilteredEvents } = useAnalyticsData();
  const [pitchTeamFilter, setPitchTeamFilter] = useState('ALL');

  // Filter events by season and pitch team filter if specified
  const filteredEvents = getFilteredEvents({
    matchId: selectedSeason === 'ALL' ? undefined : matches.find((m) => m.season === selectedSeason)?.id,
    attackingTeam: pitchTeamFilter === 'ALL' ? undefined : pitchTeamFilter,
  });

  const uniqueAttackingTeams = Array.from(new Set(allEvents.map((e) => e.attackingTeam))).sort();

  return (
    <div className="space-y-6">
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Pressure Events"
          value={stats.totalPressures.toLocaleString()}
          icon={Zap}
          denominatorInfo="1,206 opponent (excl. 94 same-team)"
          badge="100% AUDITED"
          badgeColor="accent"
        />
        <MetricCard
          label="Team Matchups"
          value={stats.validMatchups}
          icon={Users}
          denominatorInfo="5 finals × 2 perspectives"
          badge="VALIDATED"
          badgeColor="alert"
        />
        <MetricCard
          label="Overall Retention"
          value={`${stats.overallRetentionRate.toFixed(2)}%`}
          icon={TrendingUp}
          denominatorInfo={`${stats.totalRetained} / ${stats.totalRetained + stats.totalChanged} eligible`}
          badge="10-EVENT WINDOW"
          badgeColor="success"
        />
        <MetricCard
          label="Matches Analyzed"
          value={stats.matchesAnalyzed}
          icon={Trophy}
          denominatorInfo="UEFA Champions League Finals"
          badge="2014/15 - 2018/19"
          badgeColor="accent"
        />
      </div>

      {/* Main Analytics Row: Pressure Map (Left) & Team Comparison (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Pressure Map Widget */}
        <div className="lg:col-span-7">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#FFE500] border border-[#171717] flex items-center justify-center font-bold text-xs">
                    ⚲
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-sm text-[#171717]">
                        Pressure Map
                      </span>
                      <Info className="w-3.5 h-3.5 text-[#64748B]" />
                    </div>
                    <span className="text-[11px] text-[#64748B]">
                      Where teams face pressure ({pitchTeamFilter === 'ALL' ? 'All Matches' : pitchTeamFilter})
                    </span>
                  </div>
                </div>

                {/* Team Filter Dropdown */}
                <select
                  value={pitchTeamFilter}
                  onChange={(e) => setPitchTeamFilter(e.target.value)}
                  className="px-2 py-1 text-xs font-bold bg-[#FFFDF3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] cursor-pointer focus:outline-none"
                >
                  <option value="ALL">All Teams</option>
                  {uniqueAttackingTeams.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            <TacticalPitch events={filteredEvents.slice(0, 300)} defaultMode="dual" />
          </Card>
        </div>

        {/* Right: Team Comparison Widget */}
        <div className="lg:col-span-5">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#FFE500] border border-[#171717] flex items-center justify-center font-bold text-xs">
                    ⇄
                  </div>
                  <span className="font-extrabold text-sm text-[#171717]">
                    Team Comparison
                  </span>
                </div>
                <button
                  onClick={() => onNavigateToPage('team-comparison')}
                  className="text-[11px] font-bold text-[#171717] underline hover:text-[#64748B]"
                >
                  Full Comparison ➔
                </button>
              </div>
            }
          >
            <TeamComparisonWidget
              matchups={matchups}
              onNavigateToFullComparison={() => onNavigateToPage('team-comparison')}
            />
          </Card>
        </div>
      </div>

      {/* Bottom Row: Match Overview Table (Left) & Outcome Distribution (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Match Overview Table */}
        <div className="lg:col-span-7">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#FFE500] border border-[#171717] flex items-center justify-center font-bold text-xs">
                    ▤
                  </div>
                  <span className="font-extrabold text-sm text-[#171717]">
                    Match Overview
                  </span>
                </div>
                <span className="text-[11px] font-mono-nums font-bold text-[#64748B]">
                  5 Final Matches
                </span>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-[#171717] border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#171717] bg-[#F2EDD9] text-[#64748B] text-[10px] uppercase tracking-wider font-extrabold">
                    <th className="py-2.5 px-3">Year</th>
                    <th className="py-2.5 px-3">Pressing Team</th>
                    <th className="py-2.5 px-3">Attacking Team</th>
                    <th className="py-2.5 px-3 text-right">Pressure Events</th>
                    <th className="py-2.5 px-3 text-right">Retention %</th>
                    <th className="py-2.5 px-3 text-center">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DFC8]">
                  {matches.map((m) => {
                    const year = m.date.slice(0, 4);
                    const isHighRetention = m.overallRetentionRate >= 60;

                    return (
                      <tr
                        key={m.id}
                        className="hover:bg-[#FFFBEA] transition-colors cursor-pointer"
                        onClick={() => onNavigateToMatch(m.id)}
                      >
                        <td className="py-2.5 px-3 font-mono-nums font-bold">
                          {year}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <TeamCrest teamName={m.homeTeam} size="xs" />
                            <span>{m.homeTeam}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <TeamCrest teamName={m.awayTeam} size="xs" />
                            <span>{m.awayTeam}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono-nums font-extrabold">
                          {m.totalPressures}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={`inline-block px-2 py-0.5 border font-mono-nums font-extrabold ${
                              isHighRetention
                                ? 'bg-[#36B879]/20 border-[#36B879] text-[#171717]'
                                : 'bg-[#FFE500]/40 border-[#FFE500] text-[#171717]'
                            }`}
                          >
                            {m.overallRetentionRate.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToMatch(m.id);
                            }}
                            className="p-1 hover:bg-[#FFE500] border border-[#171717] rounded-none shadow-[1px_1px_0px_#171717]"
                            title="Inspect Match"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#171717]" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right: Outcome Distribution */}
        <div className="lg:col-span-5">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#FFE500] border border-[#171717] flex items-center justify-center font-bold text-xs">
                    ◑
                  </div>
                  <span className="font-extrabold text-sm text-[#171717]">
                    Outcome Distribution
                  </span>
                </div>
                <span className="text-[11px] font-mono-nums font-bold text-[#64748B]">
                  10-Event Sequences
                </span>
              </div>
            }
          >
            <OutcomeDistributionChart stats={stats} />
          </Card>
        </div>
      </div>
    </div>
  );
};
