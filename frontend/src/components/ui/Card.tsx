import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'sm' | 'lg' | 'interactive' | 'accent';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  header,
  footer,
  ...props
}) => {
  let variantClass = 'brutal-card';
  if (variant === 'sm') variantClass = 'brutal-card-sm';
  if (variant === 'lg') variantClass = 'brutal-card-lg';
  if (variant === 'interactive') variantClass = 'brutal-card brutal-card-interactive cursor-pointer';
  if (variant === 'accent') variantClass = 'brutal-card border-[#171717] bg-[#FFFBEA]';

  return (
    <div className={`${variantClass} flex flex-col ${className}`} {...props}>
      {header && (
        <div className="px-5 py-3.5 border-b-2 border-[#171717] bg-[#F2EDD9] flex items-center justify-between">
          {header}
        </div>
      )}
      <div className="p-5 flex-1">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t-2 border-[#171717] bg-[#F8F5E9] text-xs text-[#64748B]">
          {footer}
        </div>
      )}
    </div>
  );
};
