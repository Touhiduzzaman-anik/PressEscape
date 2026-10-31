import React, { useState, useMemo } from 'react';
import { PressureEvent, PossessionOutcome } from '../../types/analytics';
import { Badge } from '../ui/Badge';
import { Layers, Eye, Compass, Info, ChevronRight } from 'lucide-react';

interface TacticalPitchProps {
  events: PressureEvent[];
  selectedEvent?: PressureEvent | null;
  onSelectEvent?: (event: PressureEvent) => void;
  className?: string;
  defaultMode?: 'dual' | 'points' | 'zones';
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  className = '',
  defaultMode = 'dual',
}) => {
  const [viewMode, setViewMode] = useState<'dual' | 'points' | 'zones'>(defaultMode);
  const [pitchTheme, setPitchTheme] = useState<'tactical-dark' | 'retro-cream'>('retro-cream');
  const [hoveredEvent, setHoveredEvent] = useState<PressureEvent | null>(null);
  const [hoveredZone, setHoveredZone] = useState<{ name: string; count: number; retainedPct: number } | null>(null);

  // Compute 3x5 zonal distribution grid across StatsBomb 120x80 pitch
  const zoneStats = useMemo(() => {
    // 3 longitudinal sections (x): Defensive (0-40), Middle (40-80), Attacking (80-120)
    // 5 lateral channels (y): Left Wing (0-18), Left Half-Space (18-34), Center (34-46), Right Half-Space (46-62), Right Wing (62-80)
    const zones: Array<{
      id: string;
      name: string;
      x: number;
      y: number;
      width: number;
      height: number;
      events: PressureEvent[];
      count: number;
      retainedCount: number;
      changedCount: number;
      retentionPct: number;
    }> = [];

    const xSlices = [
      { name: 'Defensive Third', x: 0, width: 40 },
      { name: 'Middle Third', x: 40, width: 40 },
      { name: 'Attacking Third', x: 80, width: 40 },
    ];

    const ySlices = [
      { name: 'Left Wing', y: 0, height: 18 },
      { name: 'Left Half-Space', y: 18, height: 16 },
      { name: 'Center Channel', y: 34, height: 12 },
      { name: 'Right Half-Space', y: 46, height: 16 },
      { name: 'Right Wing', y: 62, height: 18 },
    ];

    xSlices.forEach((xSlice) => {
      ySlices.forEach((ySlice) => {
        const zoneEvents = events.filter(
          (e) =>
            e.location.x >= xSlice.x &&
            e.location.x < xSlice.x + xSlice.width &&
            e.location.y >= ySlice.y &&
            e.location.y < ySlice.y + ySlice.height
        );

        const retained = zoneEvents.filter((e) => e.outcome === '10-Event Possession Retention').length;
        const changed = zoneEvents.filter((e) => e.outcome === 'Possession Changed').length;
        const eligible = retained + changed;
        const retentionPct = eligible > 0 ? (retained / eligible) * 100 : 0;

        zones.push({
          id: `${xSlice.name}-${ySlice.name}`,
          name: `${xSlice.name} · ${ySlice.name}`,
          x: xSlice.x,
          y: ySlice.y,
          width: xSlice.width,
          height: ySlice.height,
          events: zoneEvents,
          count: zoneEvents.length,
          retainedCount: retained,
          changedCount: changed,
          retentionPct,
        });
      });
    });

    const maxCount = Math.max(...zones.map((z) => z.count), 1);
    return { zones, maxCount };
  }, [events]);

  const activeEvent = selectedEvent || hoveredEvent;

  // Outcome color mappings adhering to design tokens
  const getOutcomeColor = (outcome: PossessionOutcome) => {
    switch (outcome) {
      case '10-Event Possession Retention':
        return '#36B879'; // Success green
      case 'Possession Changed':
        return '#F16B6B'; // Alert coral red
      case 'Period Ended':
        return '#64748B'; // Muted slate
      case 'Insufficient Events':
        return '#94A3B8'; // Secondary muted
      default:
        return '#FFE500';
    }
  };

  return (
    <div className={`brutal-card p-4 flex flex-col gap-3 ${className}`}>
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-[#171717]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#171717]" />
            Pitch Visualization (120 × 80)
          </span>
          <span className="font-mono-nums text-[11px] font-bold px-2 py-0.5 bg-[#FFFBEA] border border-[#171717]">
            {events.length} Events Plotted
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Selector */}
          <div className="flex border-2 border-[#171717] bg-[#FFFDF3] shadow-[2px_2px_0px_#171717]">
            <button
              onClick={() => setViewMode('dual')}
              className={`px-2.5 py-1 text-[11px] font-bold cursor-pointer transition-colors ${
                viewMode === 'dual' ? 'bg-[#FFE500] text-[#171717]' : 'hover:bg-[#F2EDD9]'
              }`}
            >
              Dual Mode
            </button>
            <button
              onClick={() => setViewMode('points')}
              className={`px-2.5 py-1 text-[11px] font-bold border-l-2 border-[#171717] cursor-pointer transition-colors ${
                viewMode === 'points' ? 'bg-[#FFE500] text-[#171717]' : 'hover:bg-[#F2EDD9]'
              }`}
            >
              Event Scatter
            </button>
            <button
              onClick={() => setViewMode('zones')}
              className={`px-2.5 py-1 text-[11px] font-bold border-l-2 border-[#171717] cursor-pointer transition-colors ${
                viewMode === 'zones' ? 'bg-[#FFE500] text-[#171717]' : 'hover:bg-[#F2EDD9]'
              }`}
            >
              Pressure Zones
            </button>
          </div>

          {/* Pitch Theme Toggle */}
          <button
            onClick={() => setPitchTheme(pitchTheme === 'retro-cream' ? 'tactical-dark' : 'retro-cream')}
            className="px-2.5 py-1 text-[11px] font-bold border-2 border-[#171717] bg-[#FFFDF3] shadow-[2px_2px_0px_#171717] hover:bg-[#F2EDD9] cursor-pointer"
          >
            {pitchTheme === 'retro-cream' ? 'Chalkboard Green' : 'Retro Parchment'}
          </button>
        </div>
      </div>

      {/* SVG Football Pitch Canvas */}
      <div className="relative w-full overflow-hidden border-2 border-[#171717] shadow-[3px_3px_0px_#171717] bg-[#FFFDF3]">
        <svg
          viewBox="-4 -4 128 88"
          className="w-full h-auto block select-none"
          style={{
            backgroundColor: pitchTheme === 'retro-cream' ? '#F7F2DE' : '#1C3A27',
          }}
        >
          {/* Defs for gradients & patterns */}
          <defs>
            <pattern id="pitch-grass-stripes" width="12" height="80" patternUnits="userSpaceOnUse">
              <rect
                x="0"
                y="0"
                width="6"
                height="80"
                fill={pitchTheme === 'retro-cream' ? '#F2ECD4' : '#183322'}
              />
              <rect
                x="6"
                y="0"
                width="6"
                height="80"
                fill={pitchTheme === 'retro-cream' ? '#F7F2DE' : '#1C3A27'}
              />
            </pattern>
          </defs>

          {/* Grass Background */}
          <rect x="-4" y="-4" width="128" height="88" fill="url(#pitch-grass-stripes)" />

          {/* Zonal Heatmap Shading */}
          {(viewMode === 'zones' || viewMode === 'dual') && (
            <g className="zones-layer opacity-80">
              {zoneStats.zones.map((zone) => {
                const intensity = zone.count / zoneStats.maxCount;
                // Heat color from faint to deep amber-yellow
                const fillColor =
                  pitchTheme === 'retro-cream'
                    ? `rgba(255, 229, 0, ${Math.min(0.75, Math.max(0.08, intensity * 0.8))})`
                    : `rgba(255, 229, 0, ${Math.min(0.65, Math.max(0.12, intensity * 0.7))})`;

                return (
                  <g key={zone.id}>
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.width}
                      height={zone.height}
                      fill={fillColor}
                      stroke={pitchTheme === 'retro-cream' ? '#171717' : '#E6DFC8'}
                      strokeWidth="0.4"
                      strokeDasharray="1,1"
                      className="cursor-pointer transition-opacity hover:opacity-100"
                      onMouseEnter={() =>
                        setHoveredZone({
                          name: zone.name,
                          count: zone.count,
                          retainedPct: zone.retentionPct,
                        })
                      }
                      onMouseLeave={() => setHoveredZone(null)}
                    />
                    {zone.count > 0 && (
                      <text
                        x={zone.x + zone.width / 2}
                        y={zone.y + zone.height / 2 + 1}
                        textAnchor="middle"
                        fontSize="3"
                        fontFamily="IBM Plex Mono"
                        fontWeight="bold"
                        fill={pitchTheme === 'retro-cream' ? '#171717' : '#FFFFFF'}
                        className="pointer-events-none select-none opacity-80"
                      >
                        {zone.count} ({zone.retentionPct.toFixed(0)}%)
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Pitch Lines (StatsBomb dimensions: 120 x 80) */}
          <g
            stroke={pitchTheme === 'retro-cream' ? '#171717' : '#E6DFC8'}
            strokeWidth="0.8"
            fill="none"
          >
            {/* Pitch boundary */}
            <rect x="0" y="0" width="120" height="80" strokeWidth="1.2" />

            {/* Halfway line */}
            <line x1="60" y1="0" x2="60" y2="80" strokeWidth="1" />

            {/* Center circle (radius 9.15m) */}
            <circle cx="60" cy="40" r="9.15" />
            <circle
              cx="60"
              cy="40"
              r="0.8"
              fill={pitchTheme === 'retro-cream' ? '#171717' : '#E6DFC8'}
            />

            {/* Left Penalty Box (18m deep x 44m wide, centered between y=18 and y=62) */}
            <rect x="0" y="18" width="18" height="44" />
            {/* Left 6-Yard Box (6m deep x 20m wide, centered between y=30 and y=50) */}
            <rect x="0" y="30" width="6" height="20" />
            {/* Left Penalty Spot (12m from goal line) */}
            <circle
              cx="12"
              cy="40"
              r="0.8"
              fill={pitchTheme === 'retro-cream' ? '#171717' : '#E6DFC8'}
            />
            {/* Left Penalty Arc */}
            <path d="M 18,33 A 9.15,9.15 0 0,1 18,47" />

            {/* Right Penalty Box */}
            <rect x="102" y="18" width="18" height="44" />
            {/* Right 6-Yard Box */}
            <rect x="114" y="30" width="6" height="20" />
            {/* Right Penalty Spot */}
            <circle
              cx="108"
              cy="40"
              r="0.8"
              fill={pitchTheme === 'retro-cream' ? '#171717' : '#E6DFC8'}
            />
            {/* Right Penalty Arc */}
            <path d="M 102,33 A 9.15,9.15 0 0,0 102,47" />

            {/* Corner Arcs */}
            <path d="M 0,2 A 2,2 0 0,0 2,0" />
            <path d="M 0,78 A 2,2 0 0,1 2,80" />
            <path d="M 120,2 A 2,2 0 0,1 118,0" />
            <path d="M 120,78 A 2,2 0 0,0 118,80" />

            {/* Physical Goals (exterior) */}
            <rect
              x="-2.5"
              y="36"
              width="2.5"
              height="8"
              strokeWidth="0.8"
              fill={pitchTheme === 'retro-cream' ? '#E6DFC8' : '#14271B'}
            />
            <rect
              x="120"
              y="36"
              width="2.5"
              height="8"
              strokeWidth="0.8"
              fill={pitchTheme === 'retro-cream' ? '#E6DFC8' : '#14271B'}
            />
          </g>

          {/* Directional attacking arrows on sideline */}
          <g
            fill={pitchTheme === 'retro-cream' ? '#64748B' : '#94A3B8'}
            fontSize="2.5"
            fontFamily="Plus Jakarta Sans"
            fontWeight="bold"
            className="select-none"
          >
            <text x="3" y="-1.5">◀ ATTACKING DIRECTION ▶</text>
            <text x="105" y="-1.5" textAnchor="end">GOAL (120, 40)</text>
          </g>

          {/* Discrete Pressure Event Points */}
          {(viewMode === 'points' || viewMode === 'dual') && (
            <g className="points-layer">
              {events.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                const isHovered = hoveredEvent?.id === evt.id;
                const pointColor = getOutcomeColor(evt.outcome);

                return (
                  <g
                    key={evt.id}
                    className="cursor-pointer transition-transform"
                    onClick={() => onSelectEvent && onSelectEvent(evt)}
                    onMouseEnter={() => setHoveredEvent(evt)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    {/* Pulsing ring if selected or hovered */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={evt.location.x}
                        cy={evt.location.y}
                        r="3.5"
                        fill="none"
                        stroke="#171717"
                        strokeWidth="1.2"
                      />
                    )}
                    <circle
                      cx={evt.location.x}
                      cy={evt.location.y}
                      r={isSelected ? 2.5 : isHovered ? 2.2 : 1.4}
                      fill={pointColor}
                      stroke="#171717"
                      strokeWidth="0.6"
                    />
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Hovered Zone Floating Pill */}
        {hoveredZone && (
          <div className="absolute top-2 left-2 px-3 py-1 bg-[#171717] text-white border-2 border-[#FFE500] text-xs font-mono-nums font-bold shadow-[2px_2px_0px_#171717] pointer-events-none">
            {hoveredZone.name}: {hoveredZone.count} pressures · {hoveredZone.retainedPct.toFixed(1)}% retained
          </div>
        )}
      </div>

      {/* Legend & Details Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Outcome Color Legend */}
        <div className="p-3 bg-[#F2EDD9] border-2 border-[#171717]">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] block mb-2">
            Outcome Categorization (StatsBomb 10-Event Window)
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#171717]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#36B879] border border-[#171717] inline-block"></span>
              <span>10-Event Retained</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#F16B6B] border border-[#171717] inline-block"></span>
              <span>Possession Changed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#64748B] border border-[#171717] inline-block"></span>
              <span>Period Ended</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#94A3B8] border border-[#171717] inline-block"></span>
              <span>Insufficient Events</span>
            </div>
          </div>
        </div>

        {/* Active Selected Event Details */}
        <div className="p-3 bg-[#FFFDF3] border-2 border-[#171717] flex flex-col justify-between">
          {activeEvent ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono-nums font-bold text-xs text-[#171717]">
                  {activeEvent.id} · {activeEvent.minute}'{String(activeEvent.second).padStart(2, '0')}"
                </span>
                <Badge outcome={activeEvent.outcome}>{activeEvent.outcome}</Badge>
              </div>
              <div className="text-xs text-[#171717] space-y-1">
                <div>
                  <span className="font-bold text-[#64748B]">Match: </span>
                  <span className="font-semibold">{activeEvent.matchName} ({activeEvent.season})</span>
                </div>
                <div>
                  <span className="font-bold text-[#64748B]">Presser: </span>
                  <span className="font-semibold">{activeEvent.pressingPlayer} ({activeEvent.pressingTeam})</span>
                  <span className="font-bold text-[#64748B]"> ➔ Target: </span>
                  <span className="font-semibold">{activeEvent.targetedPlayer} ({activeEvent.attackingTeam})</span>
                </div>
                <div className="flex items-center gap-3 font-mono-nums text-[11px] text-[#64748B]">
                  <span>Coord: ({activeEvent.location.x}, {activeEvent.location.y})</span>
                  <span>Zone: {activeEvent.pitchZone}</span>
                  <span>Corridor: {activeEvent.pitchCorridor}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-[#64748B] font-medium py-3">
              <Info className="w-4 h-4 mr-2" />
              Hover or click any pressure event point on the pitch to inspect micro-details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
