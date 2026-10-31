import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { TacticalPitch } from '../components/pitch/TacticalPitch';
import { SequenceViewer } from '../components/charts/SequenceViewer';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { PressureEvent, PossessionOutcome } from '../types/analytics';
import { Compass, Filter, Info, ShieldAlert } from 'lucide-react';

export const TacticalPitchPage: React.FC = () => {
  const { allEvents, matches, uniqueTeams, getFilteredEvents } = useAnalyticsData();
  const [matchFilter, setMatchFilter] = useState<string>('ALL');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState<PossessionOutcome | 'ALL'>('ALL');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<PressureEvent | null>(null);

  const filteredEvents = getFilteredEvents({
    matchId: matchFilter,
    attackingTeam: teamFilter === 'ALL' ? undefined : teamFilter,
    outcome: outcomeFilter,
    pitchZone: zoneFilter,
  });

  return (
    <div className="space-y-6">
      {/* Pitch Filter Strip */}
      <div className="brutal-card p-4 bg-[#FFFDF3] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#171717]" />
          <div>
            <h2 className="text-base font-extrabold text-[#171717]">
              Tactical Coordinate Pitch (StatsBomb 120 × 80)
            </h2>
            <span className="text-[11px] text-[#64748B]">
              Standardized coordinate mapping with interactive spatial density zones
            </span>
          </div>
        </div>

        {/* Global Multi-Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={matchFilter}
            onChange={(e) => setMatchFilter(e.target.value)}
            className="px-2 py-1.5 bg-[#FFFBEA] border-2 border-[#171717] text-xs font-bold"
          >
            <option value="ALL">All 5 Finals</option>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {m.season} — {m.name}
              </option>
            ))}
          </select>

          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="px-2 py-1.5 bg-[#FFFBEA] border-2 border-[#171717] text-xs font-bold"
          >
            <option value="ALL">All Teams</option>
            {uniqueTeams.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value as PossessionOutcome | 'ALL')}
            className="px-2 py-1.5 bg-[#FFFBEA] border-2 border-[#171717] text-xs font-bold"
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
            className="px-2 py-1.5 bg-[#FFFBEA] border-2 border-[#171717] text-xs font-bold"
          >
            <option value="ALL">All Pitch Zones</option>
            <option value="Defensive Third">Defensive Third (x &lt; 40)</option>
            <option value="Middle Third">Middle Third (40 ≤ x &lt; 80)</option>
            <option value="Attacking Third">Attacking Third (x ≥ 80)</option>
          </select>

          {(matchFilter !== 'ALL' || teamFilter !== 'ALL' || outcomeFilter !== 'ALL' || zoneFilter !== 'ALL') && (
            <button
              onClick={() => {
                setMatchFilter('ALL');
                setTeamFilter('ALL');
                setOutcomeFilter('ALL');
                setZoneFilter('ALL');
                setSelectedEvent(null);
              }}
              className="px-2.5 py-1.5 text-xs font-bold bg-[#FFE500] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#FFFDF3] transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Pitch Viewport */}
      <TacticalPitch
        events={filteredEvents.slice(0, 350)}
        selectedEvent={selectedEvent}
        onSelectEvent={(evt) => setSelectedEvent(evt)}
        defaultMode="dual"
      />

      {/* Sequence Viewer for Clicked Event */}
      {selectedEvent && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#171717]">
              Selected Coordinate Sequence Detail
            </span>
          </div>
          <SequenceViewer event={selectedEvent} />
        </div>
      )}

      {/* Spatial Analysis Methodology Card */}
      <div className="brutal-card p-5 bg-[#FFFBEA] border-2 border-[#171717] space-y-2 text-xs">
        <div className="flex items-center gap-2 font-extrabold text-[#171717]">
          <ShieldAlert className="w-4 h-4" />
          <span>StatsBomb Coordinate System Verification</span>
        </div>
        <p className="text-[#64748B] leading-relaxed">
          The pitch map plots authentic event coordinates within the standardized StatsBomb coordinate space:
          <strong> X ∈ [0, 120]</strong> and <strong>Y ∈ [0, 80]</strong>. Defensive third pressures occur primarily between X: 15–40, where ball-retention under high-intensity pressing requires composure, rapid short combination play, or vertical escape outlets.
        </p>
      </div>
    </div>
  );
};
