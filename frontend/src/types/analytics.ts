/**
 * PressEscape Analytics Type Definitions
 * Adheres strictly to StatsBomb coordinates (0-120 x 0-80) and 10-event possession window methodology.
 */

export type PossessionOutcome =
  | '10-Event Possession Retention'
  | 'Possession Changed'
  | 'Period Ended'
  | 'Insufficient Events';

export interface PressureSequenceEvent {
  eventIndex: number; // 1 to 10
  minute: number;
  second: number;
  team: string;
  player: string;
  actionType: 'Pass' | 'Carry' | 'Duel' | 'Clearance' | 'Interception' | 'Dispossessed' | 'Ball Recovery' | 'Foul Won' | 'Shot';
  x: number;
  y: number;
  endX?: number;
  endY?: number;
  outcomeSuccess: boolean;
}

export interface PressureEvent {
  id: string;
  matchId: string;
  matchName: string;
  season: string;
  date: string;
  minute: number;
  second: number;
  period: 1 | 2 | 3 | 4; // 1st half, 2nd half, extra times
  pressingTeam: string;
  attackingTeam: string;
  pressingPlayer: string;
  targetedPlayer: string;
  // StatsBomb coordinates: X (0-120), Y (0-80)
  location: {
    x: number;
    y: number;
  };
  pitchZone: 'Defensive Third' | 'Middle Third' | 'Attacking Third';
  pitchCorridor: 'Left Wing' | 'Left Half-Space' | 'Center' | 'Right Half-Space' | 'Right Wing';
  outcome: PossessionOutcome;
  sequenceEventsCount: number;
  sequence?: PressureSequenceEvent[];
}

export interface TeamMatchupSummary {
  teamName: string;
  matchId: string;
  opponent: string;
  season: string;
  totalPressureEventsFaced: number;
  retained10Event: number;
  possessionChanged: number;
  periodEnded: number;
  insufficientEvents: number;
  eligibleObservations: number; // retained10Event + possessionChanged
  retentionRate: number; // (retained10Event / eligibleObservations) * 100
  avgPressureIntensityPerMin: number;
}

export interface MatchMeta {
  id: string;
  name: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  season: string;
  venue: string;
  score: string;
  totalPressures: number;
  retainedCount: number;
  changedCount: number;
  periodEndedCount: number;
  insufficientCount: number;
  overallRetentionRate: number;
}

export interface AuditRecord {
  metric: string;
  status: 'VALIDATED' | 'VERIFIED' | 'PASS' | 'NOTE';
  observedValue: string | number;
  expectedRange: string;
  methodologyNotes: string;
}

export interface DatasetStats {
  totalPressures: number;
  validMatchups: number;
  matchesAnalyzed: number;
  totalRetained: number;
  totalChanged: number;
  totalPeriodEnded: number;
  totalInsufficient: number;
  overallRetentionRate: number;
}
