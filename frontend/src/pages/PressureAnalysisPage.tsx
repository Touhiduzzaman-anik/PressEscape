import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { MetricCard } from '../components/ui/MetricCard';
import { Badge } from '../components/ui/Badge';
import { OutcomeDistributionChart } from '../components/charts/OutcomeDistributionChart';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { PossessionOutcome } from '../types/analytics';
import { Activity, Search, Filter, ShieldCheck } from 'lucide-react';

export const PressureAnalysisPage: React.FC = () => {
  const { allEvents, matchups, matches, stats, getFilteredEvents } = useAnalyticsData();
  const [outcomeFilter, setOutcomeFilter] = useState<PossessionOutcome | 'ALL'>('ALL');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<'rate' | 'faced' | 'retained' | 'changed'>('rate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const filteredEvents = getFilteredEvents({
    outcome: outcomeFilter,
    pitchZone: zoneFilter,
    search,
  });

  const sortedMatchups = [...matchups].sort((a, b) => {
    let diff = 0;
    if (sortField === 'rate') diff = a.retentionRate - b.retentionRate;
    else if (sortField === 'faced') diff = a.totalPressureEventsFaced - b.totalPressureEventsFaced;
    else if (sortField === 'retained') diff = a.retained10Event - b.retained10Event;
    else if (sortField === 'changed') diff = a.possessionChanged - b.possessionChanged;
    return sortDirection === 'desc' ? -diff : diff;
  });

  const handleSort = (field: 'rate' | 'faced' | 'retained' | 'changed') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards across the 4 strict categories */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          label="Total Pressures"
          value={stats.totalPressures.toLocaleString()}
          denominatorInfo="100% Validated"
          badge="1,206"
          badgeColor="accent"
        />
        <MetricCard
          label="10-Event Retained"
          value={stats.totalRetained}
          denominatorInfo={`${((stats.totalRetained / stats.totalPressures) * 100).toFixed(1)}% of total`}
          badge="SUCCESS"
          badgeColor="success"
        />
        <MetricCard
          label="Possession Changed"
          value={stats.totalChanged}
          denominatorInfo={`${((stats.totalChanged / stats.totalPressures) * 100).toFixed(1)}% of total`}
          badge="TURNOVER"
          badgeColor="alert"
        />
        <MetricCard
          label="Period Ended"
          value={stats.totalPeriodEnded}
          denominatorInfo="Halftime / Fulltime"
          badge="EXCLUDED"
          badgeColor="muted"
        />
        <MetricCard
          label="Insufficient Events"
          value={stats.totalInsufficient}
          denominatorInfo="Stoppage / Cards"
          badge="EXCLUDED"
          badgeColor="muted"
        />
      </div>

      {/* Outcome Distribution & Team Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Outcome Donut Chart */}
        <div className="lg:col-span-5">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="font-extrabold text-sm text-[#171717]">
                  Mutually Exclusive Outcome Split
                </span>
                <span className="text-[11px] font-mono-nums font-bold text-[#64748B]">
                  1,206 Events
                </span>
              </div>
            }
          >
            <OutcomeDistributionChart stats={stats} />
          </Card>
        </div>

        {/* Team-Wise Pressure & Retention Performance Matrix */}
        <div className="lg:col-span-7">
          <Card
            header={
              <div className="flex items-center justify-between w-full">
                <span className="font-extrabold text-sm text-[#171717]">
                  Team-Wise Pressure Retention Rankings
                </span>
                <span className="text-[11px] font-mono-nums font-bold text-[#64748B]">
                  10 Matchup Perspectives
                </span>
              </div>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-[#171717] border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#171717] bg-[#F2EDD9] text-[#64748B] text-[10px] uppercase font-extrabold select-none">
                    <th className="py-2 px-2.5">Team</th>
                    <th className="py-2 px-2.5">Season</th>
                    <th
                      className="py-2 px-2.5 text-right cursor-pointer hover:text-[#171717]"
                      onClick={() => handleSort('faced')}
                    >
                      Faced {sortField === 'faced' ? (sortDirection === 'desc' ? '▼' : '▲') : ''}
                    </th>
                    <th
                      className="py-2 px-2.5 text-right cursor-pointer hover:text-[#171717]"
                      onClick={() => handleSort('retained')}
                    >
                      Retained {sortField === 'retained' ? (sortDirection === 'desc' ? '▼' : '▲') : ''}
                    </th>
                    <th
                      className="py-2 px-2.5 text-right cursor-pointer hover:text-[#171717]"
                      onClick={() => handleSort('changed')}
                    >
                      Lost {sortField === 'changed' ? (sortDirection === 'desc' ? '▼' : '▲') : ''}
                    </th>
                    <th className="py-2 px-2.5 text-right">Eligible</th>
                    <th
                      className="py-2 px-2.5 text-right cursor-pointer hover:text-[#171717]"
                      onClick={() => handleSort('rate')}
                    >
                      Retention % {sortField === 'rate' ? (sortDirection === 'desc' ? '▼' : '▲') : ''}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DFC8]">
                  {sortedMatchups.map((m) => (
                    <tr key={`${m.teamName}-${m.matchId}`} className="hover:bg-[#FFFBEA]">
                      <td className="py-2 px-2.5">{m.teamName}</td>
                      <td className="py-2 px-2.5 font-mono-nums text-[11px] text-[#64748B]">{m.season}</td>
                      <td className="py-2 px-2.5 text-right font-mono-nums">{m.totalPressureEventsFaced}</td>
                      <td className="py-2 px-2.5 text-right font-mono-nums text-[#36B879]">{m.retained10Event}</td>
                      <td className="py-2 px-2.5 text-right font-mono-nums text-[#F16B6B]">{m.possessionChanged}</td>
                      <td className="py-2 px-2.5 text-right font-mono-nums text-[#64748B]">{m.eligibleObservations}</td>
                      <td className="py-2 px-2.5 text-right">
                        <span className="font-mono-nums font-black px-1.5 py-0.5 bg-[#FFE500] border border-[#171717]">
                          {m.retentionRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Filterable Detailed Pressure Event Table */}
      <Card
        header={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-[#171717]">
                Comprehensive Opponent Pressure Registry
              </span>
              <span className="font-mono-nums text-xs text-[#64748B]">
                ({filteredEvents.length} events displayed)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value as PossessionOutcome | 'ALL')}
                className="px-2 py-1 bg-[#FFFDF3] border-2 border-[#171717] text-xs font-bold"
              >
                <option value="ALL">All Outcomes</option>
                <option value="10-Event Possession Retention">10-Event Retained</option>
                <option value="Possession Changed">Possession Changed</option>
                <option value="Period Ended">Period Ended</option>
                <option value="Insufficient Events">Insufficient Events</option>
              </select>

              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="px-2 py-1 bg-[#FFFDF3] border-2 border-[#171717] text-xs font-bold"
              >
                <option value="ALL">All Zones</option>
                <option value="Defensive Third">Defensive Third (x &lt; 40)</option>
                <option value="Middle Third">Middle Third (40 ≤ x &lt; 80)</option>
                <option value="Attacking Third">Attacking Third (x ≥ 80)</option>
              </select>

              <input
                type="text"
                placeholder="Search player / team..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-2 py-1 text-xs border-2 border-[#171717] bg-[#FFFBEA] focus:outline-none"
              />
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs font-bold text-[#171717] border-collapse">
            <thead className="sticky top-0 bg-[#F2EDD9] z-10 border-b-2 border-[#171717] text-[#64748B] text-[10px] uppercase font-extrabold">
              <tr>
                <th className="py-2 px-3">Event ID</th>
                <th className="py-2 px-3">Match</th>
                <th className="py-2 px-3">Minute</th>
                <th className="py-2 px-3">Pressing Team</th>
                <th className="py-2 px-3">Attacking Team</th>
                <th className="py-2 px-3">Location (X, Y)</th>
                <th className="py-2 px-3">Zone</th>
                <th className="py-2 px-3">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFC8]">
              {filteredEvents.slice(0, 150).map((e) => (
                <tr key={e.id} className="hover:bg-[#FFFBEA]">
                  <td className="py-2 px-3 font-mono-nums text-[11px]">{e.id}</td>
                  <td className="py-2 px-3 text-[#64748B] truncate max-w-[140px]">{e.matchName}</td>
                  <td className="py-2 px-3 font-mono-nums">{e.minute}'{String(e.second).padStart(2, '0')}"</td>
                  <td className="py-2 px-3">{e.pressingTeam}</td>
                  <td className="py-2 px-3">{e.attackingTeam}</td>
                  <td className="py-2 px-3 font-mono-nums text-[11px]">({e.location.x}, {e.location.y})</td>
                  <td className="py-2 px-3 text-[#64748B] text-[11px]">{e.pitchZone}</td>
                  <td className="py-2 px-3"><Badge outcome={e.outcome}>{e.outcome}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
