import React from 'react';
import { PossessionOutcome } from '../../types/analytics';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'alert' | 'muted' | 'outline';
  outcome?: PossessionOutcome;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  outcome,
  className = '',
}) => {
  let styleClasses = 'bg-[#F2EDD9] text-[#171717] border-[#171717]';

  if (outcome) {
    switch (outcome) {
      case '10-Event Possession Retention':
        styleClasses = 'bg-[#36B879] text-white border-[#171717]';
        break;
      case 'Possession Changed':
        styleClasses = 'bg-[#F16B6B] text-white border-[#171717]';
        break;
      case 'Period Ended':
        styleClasses = 'bg-[#64748B] text-white border-[#171717]';
        break;
      case 'Insufficient Events':
        styleClasses = 'bg-[#94A3B8] text-[#171717] border-[#171717]';
        break;
    }
  } else if (variant) {
    switch (variant) {
      case 'accent':
        styleClasses = 'bg-[#FFE500] text-[#171717] border-[#171717]';
        break;
      case 'success':
        styleClasses = 'bg-[#36B879] text-white border-[#171717]';
        break;
      case 'alert':
        styleClasses = 'bg-[#F16B6B] text-white border-[#171717]';
        break;
      case 'muted':
        styleClasses = 'bg-[#E2E8F0] text-[#475569] border-[#171717]';
        break;
      case 'outline':
        styleClasses = 'bg-transparent text-[#171717] border-[#171717]';
        break;
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-bold tracking-tight border-2 shadow-[2px_2px_0px_#171717] ${styleClasses} ${className}`}
    >
      {children}
    </span>
  );
};
