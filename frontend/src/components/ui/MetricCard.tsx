import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  badge?: string;
  badgeColor?: 'accent' | 'success' | 'alert' | 'muted';
  icon?: LucideIcon;
  trend?: string;
  denominatorInfo?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  sublabel,
  badge,
  badgeColor = 'accent',
  icon: Icon,
  trend,
  denominatorInfo,
}) => {
  let badgeStyles = 'bg-[#FFE500] text-[#171717]';
  if (badgeColor === 'success') badgeStyles = 'bg-[#36B879]/20 text-[#171717] border-[#36B879]';
  if (badgeColor === 'alert') badgeStyles = 'bg-[#F16B6B]/20 text-[#171717] border-[#F16B6B]';
  if (badgeColor === 'muted') badgeStyles = 'bg-[#E2E8F0] text-[#475569] border-[#94A3B8]';

  return (
    <div className="brutal-card p-5 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-none border-2 border-[#171717] bg-[#FFE500] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#171717]">
            <Icon className="w-4 h-4 text-[#171717]" />
          </div>
        )}
      </div>

      <div className="my-1">
        <div className="text-3xl font-extrabold tracking-tight font-mono-nums text-[#171717]">
          {value}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#E6DFC8] flex items-center justify-between text-xs">
        {sublabel && <span className="text-[#64748B]">{sublabel}</span>}
        {denominatorInfo && (
          <span className="font-mono-nums text-[11px] text-[#64748B] font-medium">
            {denominatorInfo}
          </span>
        )}
        {badge && (
          <span className={`px-2 py-0.5 text-[11px] font-bold border ${badgeStyles}`}>
            {badge}
          </span>
        )}
        {trend && (
          <span className="font-mono-nums font-bold text-[#171717] text-[11px]">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
