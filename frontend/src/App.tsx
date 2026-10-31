/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { PageId } from './components/layout/Sidebar';
import { OverviewPage } from './pages/OverviewPage';
import { MatchExplorerPage } from './pages/MatchExplorerPage';
import { TeamComparisonPage } from './pages/TeamComparisonPage';
import { PressureAnalysisPage } from './pages/PressureAnalysisPage';
import { TacticalPitchPage } from './pages/TacticalPitchPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { CsvModal } from './components/ui/CsvModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('overview');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [activeMatchId, setActiveMatchId] = useState<string>('18242');
  const [csvModalOpen, setCsvModalOpen] = useState(false);

  const handleNavigateToMatch = (matchId: string) => {
    setActiveMatchId(matchId);
    setCurrentPage('match-explorer');
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'overview':
        return (
          <OverviewPage
            onNavigateToMatch={handleNavigateToMatch}
            onNavigateToPage={(p) => setCurrentPage(p)}
            selectedSeason={
              selectedYear === 'ALL'
                ? 'ALL'
                : `${parseInt(selectedYear, 10) - 1}/${selectedYear.slice(-2)}`
            }
          />
        );
      case 'match-explorer':
        return <MatchExplorerPage initialMatchId={activeMatchId} />;
      case 'team-comparison':
        return <TeamComparisonPage />;
      case 'pressure-analysis':
        return <PressureAnalysisPage />;
      case 'tactical-pitch':
        return <TacticalPitchPage />;
      case 'methodology':
        return <MethodologyPage onOpenCsvModal={() => setCsvModalOpen(true)} />;
      default:
        return (
          <OverviewPage
            onNavigateToMatch={handleNavigateToMatch}
            onNavigateToPage={(p) => setCurrentPage(p)}
            selectedSeason="ALL"
          />
        );
    }
  };

  return (
    <AppLayout
      currentPage={currentPage}
      onSelectPage={(p) => setCurrentPage(p)}
      selectedYear={selectedYear}
      onSelectYear={(yr) => setSelectedYear(yr)}
    >
      {renderActivePage()}
      <CsvModal isOpen={csvModalOpen} onClose={() => setCsvModalOpen(false)} />
    </AppLayout>
  );
}
