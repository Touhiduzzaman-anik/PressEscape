import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { MetricCard } from '../components/ui/MetricCard';
import { Badge } from '../components/ui/Badge';
import { TeamCrest } from '../components/ui/TeamCrest';
import { TacticalPitch } from '../components/pitch/TacticalPitch';
import { SequenceViewer } from '../components/charts/SequenceViewer';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { PressureEvent, PossessionOutcome } from '../types/analytics';
import { Trophy, Clock, Search, Filter, ShieldCheck, Compass } from 'lucide-react';

interface MatchExplorerPageProps {
  initialMatchId?: string;
}

export const MatchExplorerPage: React.FC<MatchExplorerPageProps> = ({
  initialMatchId = '18242',
}) => {
  const { matches, allEvents, getFilteredEvents } = useAnalyticsData();
  const [selectedMatchId, setSelectedMatchId] = useState<string>(initialMatchId);
  const [selectedEvent, setSelectedEvent] = useState<PressureEvent | null>(null);
  const [timelineMinute, setTimelineMinute] = useState<number>(0); // 0 means all minutes
  const [outcomeFilter, setOutcomeFilter] = useState<PossessionOutcome | 'ALL'>('ALL');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const currentMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];

  // Match events
  const matchEvents = getFilteredEvents({
    matchId: currentMatch.id,
    outcome: outcomeFilter,
    attackingTeam: teamFilter === 'ALL' ? undefined : teamFilter,
    search: searchQuery,
  }).filter((e) => timelineMinute === 0 || Math.abs(e.minute - timelineMinute) <= 5);

  const activeEvent = selectedEvent || matchEvents[0] || null;

  return (
    <div className="space-y-6">
      {/* Match Selector Strip */}
      <div className="brutal-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFDF3]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFE500] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-[#171717]" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">
              UEFA Champions League Final Selector
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-lg font-extrabold text-[#171717]">
                {currentMatch.name}
              </h2>
              <span className="font-mono-nums font-bold text-xs bg-[#F2EDD9] border border-[#171717] px-2 py-0.5">
                {currentMatch.season}
              </span>
            </div>
          </div>
        </div>

        {/* Dropdown to switch matches */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#64748B] hidden sm:inline">Select Final:</span>
          <select
            value={selectedMatchId}
            onChange={(e) => {
              setSelectedMatchId(e.target.value);
              setSelectedEvent(null);
              setTimelineMinute(0);
            }}
            className="px-3 py-2 bg-[#FFFBEA] border-2 border-[#171717] text-xs font-bold font-mono-nums shadow-[2px_2px_0px_#171717] cursor-pointer focus:outline-none"
          >
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.season} — {m.name} ({m.score})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Match Context Banner */}
      <div className="brutal-card p-4 bg-[#FFFBEA] border-2 border-[#171717] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TeamCrest teamName={currentMatch.homeTeam} size="md" />
            <span className="font-extrabold text-sm text-[#171717]">{currentMatch.homeTeam}</span>
          </div>
          <span className="font-mono-nums font-black text-xl px-3 py-1 bg-[#FFFDF3] border-2 border-[#171717] shadow-[2px_2px_0px_#171717]">
            {currentMatch.score}
          </span>
          <div className="flex items-center gap-2">
            <TeamCrest teamName={currentMatch.awayTeam} size="md" />
            <span className="font-extrabold text-sm text-[#171717]">{currentMatch.awayTeam}</span>
          </div>
        </div>

        <div className="text-xs text-[#64748B] space-y-0.5">
          <div><strong className="text-[#171717]">Date:</strong> {currentMatch.date}</div>
          <div><strong className="text-[#171717]">Venue:</strong> {currentMatch.venue}</div>
          <div><strong className="text-[#171717]">StatsBomb Match ID:</strong> <code className="font-mono-nums text-[#171717]">{currentMatch.id}</code></div>
        </div>
      </div>

      {/* Match KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Match Pressures"
          value={currentMatch.totalPressures}
          denominatorInfo="Total opponent pressures"
          badge="AUDITED"
        />
        <MetricCard
          label="Retention Rate"
          value={`${currentMatch.overallRetentionRate.toFixed(1)}%`}
          denominatorInfo={`${currentMatch.retainedCount} / ${currentMatch.retainedCount + currentMatch.changedCount} eligible`}
          badgeColor="success"
          badge="10-EVENT"
        />
        <MetricCard
          label="Possession Changed"
          value={currentMatch.changedCount}
          denominatorInfo="Turnovers under pressure"
          badgeColor="alert"
          badge="TURNOVERS"
        />
        <MetricCard
          label="Incomplete / Halftime"
          value={currentMatch.periodEndedCount + currentMatch.insufficientCount}
          denominatorInfo="Excluded from denominator"
          badgeColor="muted"
          badge="INTERRUPTED"
        />
      </div>

      {/* Chronological Match Minute Scrubber */}
      <div className="brutal-card p-4 bg-[#FFFDF3] space-y-3">
        <div className="flex items-center justify-between border-b-2 border-[#171717] pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#171717]" />
            <span className="font-extrabold text-xs uppercase tracking-wider text-[#171717]">
              Chronological Pressure Timeline Scrubber
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimelineMinute(0)}
              className={`px-2.5 py-1 text-xs font-bold border border-[#171717] ${
                timelineMinute === 0 ? 'bg-[#FFE500]' : 'bg-[#FFFBEA]'
              }`}
            >
              Full Match (0' - 90'+)
            </button>
            <span className="font-mono-nums font-bold text-xs bg-[#FFE500] px-2 py-0.5 border border-[#171717]">
              {timelineMinute === 0 ? 'All Minutes' : `Minute ${timelineMinute}' (±5m)`}
            </span>
          </div>
        </div>

        <div className="px-2">
          <input
            type="range"
            min={0}
            max={90}
            step={5}
            value={timelineMinute}
            onChange={(e) => setTimelineMinute(Number(e.target.value))}
            className="w-full h-3 bg-[#F2EDD9] border-2 border-[#171717] appearance-none cursor-pointer accent-[#FFE500]"
          />
          <div className="flex justify-between text-[10px] font-mono-nums font-bold text-[#64748B] mt-1">
            <span>0' Kickoff</span>
            <span>15'</span>
            <span>30'</span>
            <span>45' Halftime</span>
            <span>60'</span>
            <span>75'</span>
            <span>90'+ Fulltime</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Tactical Pitch & 10-Event Sequence Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Tactical Pitch for this Match */}
        <div className="lg:col-span-6">
          <TacticalPitch
            events={matchEvents}
            selectedEvent={activeEvent}
            onSelectEvent={(evt) => setSelectedEvent(evt)}
            defaultMode="dual"
          />
        </div>

        {/* 10-Event Sequence Inspector */}
        <div className="lg:col-span-6">
          <SequenceViewer event={activeEvent} />
        </div>
      </div>

      {/* Filterable Match Event Log */}
      <Card
        header={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-[#FFE500] border border-[#171717] flex items-center justify-center font-bold text-xs">
                ≡
              </span>
              <span className="font-extrabold text-sm text-[#171717]">
                Detailed Match Event Log
              </span>
              <span className="font-mono-nums text-xs text-[#64748B]">
                ({matchEvents.length} events matching filter)
              </span>
            </div>

            {/* Filter controls */}
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
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="px-2 py-1 bg-[#FFFDF3] border-2 border-[#171717] text-xs font-bold"
              >
                <option value="ALL">Both Teams</option>
                <option value={currentMatch.homeTeam}>{currentMatch.homeTeam}</option>
                <option value={currentMatch.awayTeam}>{currentMatch.awayTeam}</option>
              </select>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search player or event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-2.5 py-1 text-xs border-2 border-[#171717] bg-[#FFFBEA] focus:outline-none"
                />
              </div>
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs font-bold text-[#171717] border-collapse">
            <thead className="sticky top-0 bg-[#F2EDD9] z-10 border-b-2 border-[#171717] text-[#64748B] text-[10px] uppercase font-extrabold">
              <tr>
                <th className="py-2 px-3">Event ID</th>
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">Pressing Team / Player</th>
                <th className="py-2 px-3">Attacking Team / Target</th>
                <th className="py-2 px-3">Pitch Zone</th>
                <th className="py-2 px-3">Outcome</th>
                <th className="py-2 px-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFC8]">
              {matchEvents.map((evt) => {
                const isSelected = activeEvent?.id === evt.id;
                return (
                  <tr
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#FFE500]/30 font-extrabold' : 'hover:bg-[#FFFBEA]'
                    }`}
                  >
                    <td className="py-2 px-3 font-mono-nums text-[11px]">{evt.id}</td>
                    <td className="py-2 px-3 font-mono-nums">
                      {evt.minute}'{String(evt.second).padStart(2, '0')}"
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[#171717]">{evt.pressingPlayer}</span>
                      <span className="text-[#64748B] text-[10px] block">({evt.pressingTeam})</span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[#171717]">{evt.targetedPlayer}</span>
                      <span className="text-[#64748B] text-[10px] block">({evt.attackingTeam})</span>
                    </td>
                    <td className="py-2 px-3 text-[#64748B] text-[11px]">
                      {evt.pitchZone} · {evt.pitchCorridor}
                    </td>
                    <td className="py-2 px-3">
                      <Badge outcome={evt.outcome}>{evt.outcome}</Badge>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(evt);
                        }}
                        className="px-2 py-0.5 text-[10px] bg-[#FFE500] border border-[#171717] shadow-[1px_1px_0px_#171717]"
                      >
                        Inspect
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
  );
};
