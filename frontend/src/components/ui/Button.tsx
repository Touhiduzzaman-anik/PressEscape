import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  ...props
}) => {
  let baseStyles = 'inline-flex items-center justify-center font-bold border-2 border-[#171717] transition-all cursor-pointer select-none';
  
  let sizeStyles = 'px-4 py-2 text-sm';
  if (size === 'sm') sizeStyles = 'px-2.5 py-1 text-xs';
  if (size === 'lg') sizeStyles = 'px-5 py-2.5 text-base';

  let variantStyles = 'bg-[#FFFDF3] text-[#171717] shadow-[3px_3px_0px_#171717] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#171717] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#171717]';
  
  if (variant === 'accent') {
    variantStyles = 'bg-[#FFE500] text-[#171717] shadow-[3px_3px_0px_#171717] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#171717] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#171717]';
  } else if (variant === 'danger') {
    variantStyles = 'bg-[#F16B6B] text-white shadow-[3px_3px_0px_#171717] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#171717] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#171717]';
  } else if (variant === 'secondary') {
    variantStyles = 'bg-[#F2EDD9] text-[#171717] shadow-[2px_2px_0px_#171717] hover:bg-[#E6DFC8] active:translate-x-0.5 active:translate-y-0.5';
  } else if (variant === 'ghost') {
    variantStyles = 'border-transparent shadow-none hover:bg-[#F2EDD9] hover:border-[#171717]';
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${props.disabled ? 'opacity-50 cursor-not-allowed transform-none shadow-none' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
