import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  tag?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  tag,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-3 border-b-2 border-[#171717]">
      <div>
        <div className="flex items-center gap-2 mb-1">
          {tag && (
            <span className="bg-[#FFE500] text-[#171717] border border-[#171717] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest shadow-[1px_1px_0px_#171717]">
              {tag}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#171717]">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
