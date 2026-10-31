import React from 'react';
import { PressureEvent, PressureSequenceEvent } from '../../types/analytics';
import { Badge } from '../ui/Badge';
import { PlayCircle, CheckCircle2, XCircle, ArrowRight, ShieldAlert } from 'lucide-react';

interface SequenceViewerProps {
  event: PressureEvent | null;
  className?: string;
}

export const SequenceViewer: React.FC<SequenceViewerProps> = ({ event, className = '' }) => {
  if (!event) {
    return (
      <div className={`brutal-card p-6 text-center text-xs text-[#64748B] font-medium ${className}`}>
        <PlayCircle className="w-8 h-8 mx-auto mb-2 text-[#94A3B8]" />
        Select a pressure event from the timeline or event log to inspect its full 10-event sequence window.
      </div>
    );
  }

  const sequence = event.sequence || [];

  return (
    <div className={`brutal-card p-5 space-y-4 ${className}`}>
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-[#171717] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono-nums font-extrabold text-sm text-[#171717]">
              {event.id}
            </span>
            <span className="text-[#64748B] font-bold text-xs">
              {event.minute}'{String(event.second).padStart(2, '0')}"
            </span>
            <Badge outcome={event.outcome}>{event.outcome}</Badge>
          </div>
          <div className="text-xs text-[#171717] font-semibold mt-1">
            <span className="text-[#64748B]">Trigger: </span>
            {event.pressingPlayer} ({event.pressingTeam}) applied pressure on {event.targetedPlayer} ({event.attackingTeam})
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-nums font-bold">
          <span className="px-2 py-1 bg-[#FFFBEA] border border-[#171717]">
            {sequence.length} / 10 Events Observed
          </span>
        </div>
      </div>

      {/* 10-Event Timeline Visual Stepper */}
      <div className="space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B] block">
          Post-Pressure Event Chain (10-Event Observation Window)
        </span>

        <div className="grid grid-cols-1 gap-2">
          {sequence.map((step: PressureSequenceEvent) => {
            const isTurnover = !step.outcomeSuccess;
            const isRetainedEnd = step.eventIndex === 10 && event.outcome === '10-Event Possession Retention';

            return (
              <div
                key={step.eventIndex}
                className={`p-2.5 border-2 border-[#171717] flex items-center justify-between transition-colors ${
                  isTurnover
                    ? 'bg-[#F16B6B]/20 border-[#F16B6B]'
                    : isRetainedEnd
                    ? 'bg-[#36B879]/20 border-[#36B879]'
                    : 'bg-[#FFFDF3]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-[#171717] bg-[#FFE500] font-mono-nums font-extrabold text-xs flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#171717]">
                    #{step.eventIndex}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#171717]">
                        {step.player}
                      </span>
                      <span className="text-[11px] text-[#64748B] font-medium">
                        ({step.team})
                      </span>
                      <span className="px-1.5 py-0.2 bg-[#F2EDD9] border border-[#171717] text-[10px] font-bold text-[#171717]">
                        {step.actionType}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono-nums text-[#64748B] mt-0.5">
                      {step.minute}'{String(step.second).padStart(2, '0')}" · ({step.x}, {step.y})
                      {step.endX && step.endY && (
                        <span> ➔ ({step.endX}, {step.endY})</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {step.outcomeSuccess ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#36B879]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Success
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#F16B6B]">
                      <XCircle className="w-3.5 h-3.5" />
                      Possession Lost
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outcome Diagnostic */}
      <div className="p-3 border-2 border-[#171717] bg-[#F2EDD9] text-xs">
        <div className="font-extrabold text-[#171717] mb-1 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#171717]" />
          Methodological Observation Note:
        </div>
        <p className="text-[#64748B] leading-relaxed">
          {event.outcome === '10-Event Possession Retention' && (
            <>
              The attacking team (<strong className="text-[#171717]">{event.attackingTeam}</strong>) successfully navigated the opponent's pressure, stringing together 10 uninterrupted events without ceding possession.
            </>
          )}
          {event.outcome === 'Possession Changed' && (
            <>
              Possession was terminated on event #{sequence.length} due to opponent turnover / forced dispossession by <strong className="text-[#171717]">{event.pressingTeam}</strong>.
            </>
          )}
          {event.outcome === 'Period Ended' && (
            <>
              The 10-event sequence was cut short by the referee's halftime or full-time whistle. In accordance with strict methodological rigor, this observation is excluded from retention denominator calculations.
            </>
          )}
          {event.outcome === 'Insufficient Events' && (
            <>
              The sequence concluded prematurely due to a dead-ball stoppage, medical check, or substitution before reaching 10 consecutive events.
            </>
          )}
        </p>
      </div>
    </div>
  );
};
