import { useState, useEffect } from 'react';
import { dataService, CsvStatus } from '../services/dataService';
import { MatchMeta, TeamMatchupSummary, AuditRecord, PressureEvent } from '../types/analytics';

export function useAnalyticsData() {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Attempt automatic sync from public/data CSVs on load
    dataService.autoLoadPublicData();

    const unsubscribe = dataService.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  const matches: MatchMeta[] = dataService.getMatches();
  const matchups: TeamMatchupSummary[] = dataService.getMatchups();
  const auditRecords: AuditRecord[] = dataService.getAuditRecords();
  const allEvents: PressureEvent[] = dataService.getAllEvents();
  const stats = dataService.calculateStats(allEvents);
  const uniqueTeams = dataService.getUniqueTeams();
  const csvStatus: CsvStatus = dataService.getCsvStatus();

  return {
    matches,
    matchups,
    auditRecords,
    allEvents,
    stats,
    uniqueTeams,
    csvStatus,
    getFilteredEvents: dataService.getFilteredEvents.bind(dataService),
    calculateStats: dataService.calculateStats.bind(dataService),
    getMatchById: dataService.getMatchById.bind(dataService),
    importPressureCsv: dataService.importPressureCsv.bind(dataService),
    importTeamSummaryCsv: dataService.importTeamSummaryCsv.bind(dataService),
    importAuditReportCsv: dataService.importAuditReportCsv.bind(dataService),
    exportEventsToCsv: dataService.exportEventsToCsv.bind(dataService),
    exportTeamSummaryToCsv: dataService.exportTeamSummaryToCsv.bind(dataService),
    exportAuditReportToCsv: dataService.exportAuditReportToCsv.bind(dataService),
    resetToDefault: dataService.resetToDefault.bind(dataService),
  };
}
