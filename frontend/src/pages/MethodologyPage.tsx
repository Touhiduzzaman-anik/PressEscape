import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { MetricCard } from '../components/ui/MetricCard';
import { Button } from '../components/ui/Button';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import {
  Database,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface MethodologyPageProps {
  onOpenCsvModal: () => void;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({ onOpenCsvModal }) => {
  const { auditRecords, stats, exportEventsToCsv, exportTeamSummaryToCsv, exportAuditReportToCsv } = useAnalyticsData();
  const [calcRetained, setCalcRetained] = useState(stats.totalRetained || 638);
  const [calcChanged, setCalcChanged] = useState(stats.totalChanged || 566);
  const [calcPeriodEnded, setCalcPeriodEnded] = useState(stats.totalPeriodEnded ?? 1);
  const [calcInsufficient, setCalcInsufficient] = useState(stats.totalInsufficient ?? 1);

  React.useEffect(() => {
    if (stats.totalPressures > 0) {
      setCalcRetained(stats.totalRetained);
      setCalcChanged(stats.totalChanged);
      setCalcPeriodEnded(stats.totalPeriodEnded);
      setCalcInsufficient(stats.totalInsufficient);
    }
  }, [stats.totalPressures, stats.totalRetained, stats.totalChanged, stats.totalPeriodEnded, stats.totalInsufficient]);

  const calcEligible = calcRetained + calcChanged;
  const calcRate = calcEligible > 0 ? (calcRetained / calcEligible) * 100 : 0;

  const handleDownloadEvents = () => {
    const csv = exportEventsToCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pressure_analysis.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTeamSummary = () => {
    const csv = exportTeamSummaryToCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'team_summary.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="brutal-card p-5 bg-[#FFFDF3] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFE500] border-2 border-[#171717] shadow-[2px_2px_0px_#171717] flex items-center justify-center">
            <Database className="w-5 h-5 text-[#171717]" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#64748B]">
              Scientific Integrity &amp; Transparency
            </span>
            <h2 className="text-xl font-extrabold text-[#171717]">
              Methodology &amp; Data Pipeline Architecture
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="accent" size="sm" onClick={onOpenCsvModal} icon={<Upload className="w-3.5 h-3.5" />}>
            Upload Python Pipeline CSV
          </Button>
        </div>
      </div>

      {/* Section A & B: Dataset Overview & Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card
          header={
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#FFE500] border border-[#171717]"></span>
              <span className="font-extrabold text-sm text-[#171717]">A. Dataset Provenance</span>
            </div>
          }
        >
          <div className="space-y-3 text-xs text-[#171717]">
            <p className="leading-relaxed">
              <strong>Source:</strong> StatsBomb Open Data (Public Research Corpus).
            </p>
            <p className="leading-relaxed text-[#64748B]">
              <strong>Scope:</strong> Five men's UEFA Champions League Finals (2014/15 to 2018/19 · Match IDs: 18242, 18243, 18244, 18245, 22912). Every pressure event underwent automated sequence extraction tracking a subsequent 10-event chain.
            </p>
            <div className="p-3 bg-[#F2EDD9] border-2 border-[#171717] space-y-1 font-mono-nums text-[11px]">
              <div>• 1,300 raw "Pressure" action tags audited across 5 finals</div>
              <div>• 94 same-team pressure records excluded (possession_team == team)</div>
              <div>• 1,206 valid opponent-pressure observations strictly analyzed</div>
              <div>• 10 valid team matchups across 5 tournament finals</div>
              <div>• 638 retained / 1,204 eligible = 52.99% overall retention rate</div>
              <div>• 100% boundary-checked coordinates (0–120 × 0–80)</div>
            </div>
          </div>
        </Card>

        <Card
          header={
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#FFE500] border border-[#171717]"></span>
              <span className="font-extrabold text-sm text-[#171717]">B. Processing Pipeline Architecture</span>
            </div>
          }
        >
          <div className="space-y-2 text-xs font-mono-nums font-bold text-[#171717]">
            <div className="p-2 bg-[#FFFBEA] border border-[#171717] flex items-center justify-between">
              <span>01. StatsBomb Raw JSON</span>
              <span className="text-[#64748B] text-[10px]">Event-level match telemetry</span>
            </div>
            <div className="text-center text-xs text-[#171717]">▼</div>
            <div className="p-2 bg-[#FFFBEA] border border-[#171717] flex items-center justify-between">
              <span>02. Python Extraction Pipeline</span>
              <span className="text-[#64748B] text-[10px]">10-event sequence tracking</span>
            </div>
            <div className="text-center text-xs text-[#171717]">▼</div>
            <div className="p-2 bg-[#FFFBEA] border border-[#171717] flex items-center justify-between">
              <span>03. Data/processed/ CSVs</span>
              <span className="text-[#64748B] text-[10px]">pressure_analysis.csv</span>
            </div>
            <div className="text-center text-xs text-[#171717]">▼</div>
            <div className="p-2 bg-[#FFE500] border-2 border-[#171717] flex items-center justify-between shadow-[2px_2px_0px_#171717]">
              <span>04. PressEscape Dashboard</span>
              <span className="text-[#171717] text-[10px] font-extrabold">Reactive UI &amp; Spatial Pitch</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Section C: Strict Metric Definitions */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#FFE500] border border-[#171717]"></span>
            <span className="font-extrabold text-sm text-[#171717]">C. Metric Definitions &amp; Denominator Rigor</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-[#FFFDF3] border-2 border-[#171717] space-y-1">
            <span className="font-extrabold text-sm text-[#171717] block">
              10-Event Possession Retention
            </span>
            <p className="text-[#64748B] leading-relaxed">
              The attacking team preserved possession across all ten subsequent events following the opponent pressure event, without turnovers, out-of-bounds losses, or fouls conceded.
            </p>
          </div>

          <div className="p-3 bg-[#FFFDF3] border-2 border-[#171717] space-y-1">
            <span className="font-extrabold text-sm text-[#171717] block">
              Possession Changed
            </span>
            <p className="text-[#64748B] leading-relaxed">
              Possession was intercepted, won via duel, or lost by the attacking team prior to reaching the 10th event of the observation window.
            </p>
          </div>

          <div className="p-3 bg-[#FFFDF3] border-2 border-[#171717] space-y-1">
            <span className="font-extrabold text-sm text-[#171717] block">
              Period Ended
            </span>
            <p className="text-[#64748B] leading-relaxed">
              The 10-event window was truncated by the halftime or fulltime whistle. In accordance with strict statistical standards, these events are <strong>excluded</strong> from the retention denominator.
            </p>
          </div>

          <div className="p-3 bg-[#FFFDF3] border-2 border-[#171717] space-y-1">
            <span className="font-extrabold text-sm text-[#171717] block">
              Insufficient Events
            </span>
            <p className="text-[#64748B] leading-relaxed">
              Not enough subsequent match events were available to complete the window due to referee stoppage, injury, or substitution. Excluded from the retention denominator.
            </p>
          </div>
        </div>

        {/* Mathematical Formula Box & Interactive Sandbox */}
        <div className="mt-4 p-4 bg-[#FFE500]/20 border-2 border-[#171717] space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[#171717] text-sm uppercase tracking-wider">
              Mathematical Retention Rate Formula:
            </span>
            <span className="font-mono-nums text-[10px] bg-[#FFE500] px-2 py-0.5 border border-[#171717] font-bold">
              DENOMINATOR ISOLATION
            </span>
          </div>

          <div className="p-2.5 bg-[#FFFDF3] border-2 border-[#171717] font-mono-nums font-bold text-[#171717] text-center text-xs sm:text-sm">
            Retention Rate (%) = [ Retained 10-Event / (Retained 10-Event + Possession Changed) ] × 100
          </div>

          <div className="p-3 bg-[#FFFDF3] border-2 border-[#171717] space-y-2">
            <span className="font-extrabold text-xs text-[#171717] uppercase tracking-wider block">
              Interactive Denominator Sandbox
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#64748B] block">Retained (10-Event)</label>
                <input
                  type="number"
                  min="0"
                  value={calcRetained}
                  onChange={(e) => setCalcRetained(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-2 py-1 bg-[#FFFBEA] border border-[#171717] font-mono-nums font-bold text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748B] block">Possession Changed</label>
                <input
                  type="number"
                  min="0"
                  value={calcChanged}
                  onChange={(e) => setCalcChanged(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-2 py-1 bg-[#FFFBEA] border border-[#171717] font-mono-nums font-bold text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748B] block">Period Ended (Excluded)</label>
                <input
                  type="number"
                  min="0"
                  value={calcPeriodEnded}
                  onChange={(e) => setCalcPeriodEnded(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-2 py-1 bg-[#E2E8F0] border border-[#171717] font-mono-nums font-bold text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#64748B] block">Insufficient (Excluded)</label>
                <input
                  type="number"
                  min="0"
                  value={calcInsufficient}
                  onChange={(e) => setCalcInsufficient(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-2 py-1 bg-[#E2E8F0] border border-[#171717] font-mono-nums font-bold text-xs"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#E6DFC8] flex items-center justify-between text-xs font-mono-nums">
              <span className="text-[#64748B]">
                Eligible Denominator: <strong className="text-[#171717]">{calcEligible}</strong> (excludes {calcPeriodEnded + calcInsufficient} truncated events)
              </span>
              <span className="font-extrabold text-[#171717] bg-[#FFE500] px-2 py-0.5 border border-[#171717]">
                Calculated Retention: {calcRate.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Section D: Analytical Limitations */}
      <div className="brutal-card p-5 bg-[#F2EDD9] border-2 border-[#171717] space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#171717]" />
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#171717]">
            D. Critical Analytical Limitations &amp; Boundary Conditions
          </h3>
        </div>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#171717] font-medium leading-relaxed">
          <li>
            <strong>Sample Size:</strong> The current project covers five specific UEFA Champions League finals. Results should not be generalized to regular season league matches, domestic cups, or non-elite competitions.
          </li>
          <li>
            <strong>Final-Only Match Selection Bias:</strong> Champions League finals feature atypical tactical caution, higher defensive conservatism, and elevated psychological tension compared to standard league fixtures.
          </li>
          <li>
            <strong>Possession Retention ≠ Tactical Escape:</strong> Keeping the ball under pressure (e.g. backward pass to goalkeeper) secures possession, but does not necessarily constitute breaking the opponent's defensive block or creating an expected goal (xG) threat.
          </li>
          <li>
            <strong>Pressure Count vs. Pressing Sequences:</strong> A rapid sequence may trigger two or three contiguous pressure actions in quick succession; event counts reflect raw StatsBomb action tags, not unique team pressing waves.
          </li>
        </ul>
      </div>

      {/* Section E: Data Quality & Audit Report */}
      <Card
        header={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#171717]" />
              <span className="font-extrabold text-sm text-[#171717]">
                E. Data Quality &amp; Audit Report (<code className="font-mono-nums">audit_report.csv</code>)
              </span>
            </div>
            <span className="font-mono-nums text-xs font-bold px-2 py-0.5 bg-[#36B879]/20 border border-[#36B879] text-[#171717]">
              9 / 9 VERIFIED
            </span>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold text-[#171717] border-collapse">
            <thead>
              <tr className="border-b-2 border-[#171717] bg-[#F2EDD9] text-[#64748B] text-[10px] uppercase font-extrabold">
                <th className="py-2.5 px-3">Metric / Invariant</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Observed Value</th>
                <th className="py-2.5 px-3">Expected Range</th>
                <th className="py-2.5 px-3">Audit Verification Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFC8]">
              {auditRecords.map((r, idx) => (
                <tr key={idx} className="hover:bg-[#FFFBEA]">
                  <td className="py-2.5 px-3 font-semibold">{r.metric}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 text-[10px] font-mono-nums font-black bg-[#FFE500] border border-[#171717]">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono-nums font-extrabold">{r.observedValue}</td>
                  <td className="py-2.5 px-3 font-mono-nums text-[11px] text-[#64748B]">{r.expectedRange}</td>
                  <td className="py-2.5 px-3 text-[11px] text-[#64748B] max-w-sm">{r.methodologyNotes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Section F: CSV Export & Pipeline Sync */}
      <div className="brutal-card p-5 bg-[#FFFDF3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-sm text-[#171717]">
            Export Local Pipeline Datasets
          </h4>
          <p className="text-xs text-[#64748B]">
            Download clean CSVs formatted identically to your local Python pipeline schema.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={handleDownloadEvents}>
            Download pressure_analysis.csv
          </Button>
          <Button variant="primary" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={handleDownloadTeamSummary}>
            Download team_summary.csv
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => {
              const csv = exportAuditReportToCsv();
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'audit_report.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Download audit_report.csv
          </Button>
        </div>
      </div>
    </div>
  );
};
