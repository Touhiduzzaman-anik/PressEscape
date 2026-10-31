import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { useAnalyticsData } from '../../hooks/useAnalyticsData';
import { Upload, Download, RefreshCw, X, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface CsvModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CsvModal: React.FC<CsvModalProps> = ({ isOpen, onClose }) => {
  const {
    csvStatus,
    exportEventsToCsv,
    exportTeamSummaryToCsv,
    exportAuditReportToCsv,
    importPressureCsv,
    importTeamSummaryCsv,
    importAuditReportCsv,
    resetToDefault,
  } = useAnalyticsData();

  const [activeTab, setActiveTab] = useState<'pressure' | 'team_summary' | 'audit'>('pressure');
  const [pasteContent, setPasteContent] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedback({ type: 'success', message: `Exported ${filename}` });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'pressure' | 'team_summary' | 'audit') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (target === 'pressure') {
        const res = importPressureCsv(text);
        if (res.success) {
          setFeedback({ type: 'success', message: `Successfully loaded ${res.count} pressure events from ${file.name}!` });
        } else {
          setFeedback({ type: 'error', message: res.error || 'Failed to parse file.' });
        }
      } else if (target === 'team_summary') {
        const res = importTeamSummaryCsv(text);
        if (res.success) {
          setFeedback({ type: 'success', message: `Successfully loaded ${res.count} team matchups from ${file.name}!` });
        } else {
          setFeedback({ type: 'error', message: res.error || 'Failed to parse file.' });
        }
      } else {
        const res = importAuditReportCsv(text);
        if (res.success) {
          setFeedback({ type: 'success', message: `Successfully loaded ${res.count} audit records from ${file.name}!` });
        } else {
          setFeedback({ type: 'error', message: res.error || 'Failed to parse file.' });
        }
      }
      setPasteContent('');
    };
    reader.readAsText(file);
  };

  const handlePasteImport = () => {
    if (!pasteContent.trim()) {
      setFeedback({ type: 'error', message: 'Please paste CSV content before clicking import.' });
      return;
    }
    if (activeTab === 'pressure') {
      const res = importPressureCsv(pasteContent);
      if (res.success) setFeedback({ type: 'success', message: `Imported ${res.count} pressure events from text!` });
      else setFeedback({ type: 'error', message: res.error || 'Failed to parse CSV.' });
    } else if (activeTab === 'team_summary') {
      const res = importTeamSummaryCsv(pasteContent);
      if (res.success) setFeedback({ type: 'success', message: `Imported ${res.count} team matchups from text!` });
      else setFeedback({ type: 'error', message: res.error || 'Failed to parse CSV.' });
    } else {
      const res = importAuditReportCsv(pasteContent);
      if (res.success) setFeedback({ type: 'success', message: `Imported ${res.count} audit records from text!` });
      else setFeedback({ type: 'error', message: res.error || 'Failed to parse CSV.' });
    }
    setPasteContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card
          variant="lg"
          className="bg-[#FFFDF3]"
          header={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#FFE500] border border-[#171717] inline-block"></span>
                <span className="font-extrabold text-[#171717] text-sm uppercase tracking-wider">
                  Python Pipeline &amp; CSV Data Interface
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-[#FFE500] border border-[#171717] text-[#171717] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Status overview strip for all 3 pipeline files */}
            <div className="p-3 bg-[#F2EDD9] border-2 border-[#171717] space-y-1.5 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-[#171717] block">
                Pipeline Files Status (StatsBomb UCL Finals)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 bg-[#FFFDF3] border border-[#171717]">
                  <span className="text-[10px] font-bold text-[#64748B] block">pressure_analysis.csv</span>
                  <span className="font-mono-nums font-extrabold text-[#171717]">
                    {csvStatus.pressureAnalysisSource === 'IMPORTED_CSV'
                      ? 'Actual CSV Loaded'
                      : csvStatus.pressureAnalysisLoaded
                      ? 'Benchmark Loaded'
                      : 'Not loaded'}
                  </span>
                </div>
                <div className="p-2 bg-[#FFFDF3] border border-[#171717]">
                  <span className="text-[10px] font-bold text-[#64748B] block">team_summary.csv</span>
                  <span className="font-mono-nums font-extrabold text-[#171717]">
                    {csvStatus.teamSummarySource === 'IMPORTED_CSV'
                      ? 'Actual CSV Loaded'
                      : csvStatus.teamSummaryLoaded
                      ? 'Benchmark Loaded'
                      : 'Not loaded'}
                  </span>
                </div>
                <div className="p-2 bg-[#FFFDF3] border border-[#171717]">
                  <span className="text-[10px] font-bold text-[#64748B] block">audit_report.csv</span>
                  <span className="font-mono-nums font-extrabold text-[#171717]">
                    {csvStatus.auditReportSource === 'IMPORTED_CSV'
                      ? 'Actual CSV Loaded'
                      : csvStatus.auditReportLoaded
                      ? 'Benchmark Loaded'
                      : 'Not loaded'}
                  </span>
                </div>
              </div>
            </div>

            {feedback && (
              <div
                className={`p-3 border-2 border-[#171717] flex items-center gap-2 text-xs font-bold ${
                  feedback.type === 'success'
                    ? 'bg-[#36B879]/20 text-[#171717]'
                    : 'bg-[#F16B6B]/20 text-[#171717]'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#36B879] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#F16B6B] shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Ingestion Tabs */}
            <div className="flex border-b-2 border-[#171717] text-xs font-bold">
              <button
                onClick={() => {
                  setActiveTab('pressure');
                  setPasteContent('');
                }}
                className={`px-3 py-2 border-r-2 border-t-2 border-l-2 border-[#171717] -mb-[2px] transition-all ${
                  activeTab === 'pressure' ? 'bg-[#FFE500]' : 'bg-[#FFFBEA]'
                }`}
              >
                pressure_analysis.csv
              </button>
              <button
                onClick={() => {
                  setActiveTab('team_summary');
                  setPasteContent('');
                }}
                className={`px-3 py-2 border-r-2 border-t-2 border-[#171717] -mb-[2px] transition-all ${
                  activeTab === 'team_summary' ? 'bg-[#FFE500]' : 'bg-[#FFFBEA]'
                }`}
              >
                team_summary.csv
              </button>
              <button
                onClick={() => {
                  setActiveTab('audit');
                  setPasteContent('');
                }}
                className={`px-3 py-2 border-r-2 border-t-2 border-[#171717] -mb-[2px] transition-all ${
                  activeTab === 'audit' ? 'bg-[#FFE500]' : 'bg-[#FFFBEA]'
                }`}
              >
                audit_report.csv
              </button>
            </div>

            {/* Active Tab Panel */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs text-[#64748B]">
                  Target File: <strong className="text-[#171717] font-mono-nums">{activeTab === 'pressure' ? 'pressure_analysis.csv' : activeTab === 'team_summary' ? 'team_summary.csv' : 'audit_report.csv'}</strong>
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Download className="w-3.5 h-3.5" />}
                  onClick={() => {
                    if (activeTab === 'pressure') downloadFile(exportEventsToCsv(), 'pressure_analysis.csv');
                    else if (activeTab === 'team_summary') downloadFile(exportTeamSummaryToCsv(), 'team_summary.csv');
                    else downloadFile(exportAuditReportToCsv(), 'audit_report.csv');
                  }}
                >
                  Download {activeTab === 'pressure' ? 'pressure_analysis.csv' : activeTab === 'team_summary' ? 'team_summary.csv' : 'audit_report.csv'}
                </Button>
              </div>

              {/* Upload Input */}
              <div className="p-3 bg-[#FFFBEA] border-2 border-[#171717] flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs block text-[#171717]">Upload CSV File</span>
                  <span className="text-[11px] text-[#64748B]">Select file from your local Python pipeline</span>
                </div>
                <label className="brutal-button px-3 py-1.5 text-xs font-bold flex items-center gap-2 cursor-pointer bg-[#FFE500]">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Browse CSV</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload(e, activeTab)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Paste Input */}
              <div>
                <label className="block text-xs font-bold text-[#171717] uppercase tracking-wider mb-1">
                  Or Paste Raw CSV Data
                </label>
                <textarea
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder={`Paste content of ${activeTab === 'pressure' ? 'pressure_analysis.csv' : activeTab === 'team_summary' ? 'team_summary.csv' : 'audit_report.csv'} here...`}
                  className="w-full h-24 p-2 text-xs font-mono-nums bg-[#FFFBEA] border-2 border-[#171717] focus:outline-none focus:ring-2 focus:ring-[#FFE500]"
                />
                <div className="flex justify-end mt-1.5">
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={handlePasteImport}
                    disabled={!pasteContent.trim()}
                  >
                    Import Pasted CSV
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t-2 border-[#171717] pt-3 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={() => {
                  resetToDefault();
                  setFeedback({
                    type: 'success',
                    message: 'Reset data to authentic 5 UCL Men\'s Finals (18242, 18243, 18244, 18245, 22912).',
                  });
                }}
              >
                Reset to Authentic 5 UCL Finals
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
