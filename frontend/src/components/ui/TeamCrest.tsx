import React from 'react';

interface TeamCrestProps {
  teamName: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const TeamCrest: React.FC<TeamCrestProps> = ({ teamName, size = 'sm', className = '' }) => {
  const sizeMap = {
    xs: 'w-4 h-4 text-[9px]',
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const getTeamVisual = (name: string) => {
    const n = name.toLowerCase();

    if (n.includes('barcelona') || n.includes('barca')) {
      return {
        bg: '#A50044',
        border: '#004D98',
        svg: (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path d="M12 2L4 5v7c0 5 8 10 8 10s8-5 8-10V5l-8-3z" fill="#EDBB00" stroke="#171717" strokeWidth="1.2" />
            <path d="M4 8h16v4c0 4-4 8-8 10C8 20 4 16 4 12V8z" fill="#A50044" />
            <path d="M8 8v13c1.2.6 2.6 1 4 1s2.8-.4 4-1V8H8z" fill="#004D98" />
            <circle cx="12" cy="14" r="3" fill="#EDBB00" stroke="#171717" strokeWidth="1" />
          </svg>
        ),
      };
    }

    if (n.includes('juventus') || n.includes('juve')) {
      return {
        bg: '#FFFFFF',
        border: '#171717',
        svg: (
          <svg viewBox="0 0 24 24" className="w-full h-full bg-white">
            <rect x="0" y="0" width="24" height="24" fill="#FFFFFF" />
            <rect x="2" y="2" width="20" height="20" rx="3" fill="#FFFFFF" stroke="#171717" strokeWidth="1.5" />
            <path d="M8 6v9a3 3 0 003 3h1V6H8z" fill="#171717" />
            <path d="M14 6v6a2 2 0 002 2h1V6h-3z" fill="#171717" />
          </svg>
        ),
      };
    }

    if (n.includes('atlético') || n.includes('atletico')) {
      return {
        bg: '#CB3524',
        border: '#273B69',
        svg: (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path d="M12 2L4 6v8c0 5 8 8 8 8s8-3 8-8V6l-8-4z" fill="#CB3524" stroke="#171717" strokeWidth="1.5" />
            <rect x="7" y="10" width="3" height="10" fill="#FFFFFF" />
            <rect x="14" y="10" width="3" height="10" fill="#FFFFFF" />
            <path d="M4 6l8-4 8 4v4H4V6z" fill="#273B69" />
            <circle cx="9" cy="8" r="1.5" fill="#FFFFFF" />
          </svg>
        ),
      };
    }

    if (n.includes('real madrid')) {
      return {
        bg: '#FFFFFF',
        border: '#FEBE10',
        svg: (
          <svg viewBox="0 0 24 24" className="w-full h-full bg-white">
            <circle cx="12" cy="13" r="8" fill="#FFFFFF" stroke="#FEBE10" strokeWidth="2" />
            <path d="M8 7l2-3 2 2 2-2 2 3H8z" fill="#FEBE10" stroke="#171717" strokeWidth="1" />
            <line x1="8" y1="17" x2="16" y2="9" stroke="#00529F" strokeWidth="2" />
          </svg>
        ),
      };
    }

    if (n.includes('liverpool')) {
      return {
        bg: '#C8102E',
        border: '#00B2A9',
        svg: (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path d="M12 2L4 6v8c0 5 8 8 8 8s8-3 8-8V6l-8-4z" fill="#C8102E" stroke="#171717" strokeWidth="1.5" />
            <path d="M12 6c-2 2-2 5 0 8 2-3 2-6 0-8z" fill="#00B2A9" />
            <circle cx="12" cy="7" r="1" fill="#FFFFFF" />
          </svg>
        ),
      };
    }

    if (n.includes('tottenham') || n.includes('spurs')) {
      return {
        bg: '#132257',
        border: '#FFFFFF',
        svg: (
          <svg viewBox="0 0 24 24" className="w-full h-full bg-white">
            <circle cx="12" cy="12" r="10" fill="#FFFFFF" stroke="#132257" strokeWidth="2" />
            <circle cx="12" cy="16" r="4.5" fill="#132257" />
            <path d="M12 4c-1 2 0 4 0 6h2c0-2 1-4 0-6l-2 0z" fill="#132257" />
          </svg>
        ),
      };
    }

    // Fallback crest
    return {
      bg: '#FFE500',
      border: '#171717',
      svg: (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <circle cx="12" cy="12" r="10" fill="#FFE500" stroke="#171717" strokeWidth="2" />
          <text x="12" y="15" textAnchor="middle" fill="#171717" fontSize="8" fontWeight="bold">
            {name.slice(0, 2).toUpperCase()}
          </text>
        </svg>
      ),
    };
  };

  const visual = getTeamVisual(teamName);

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 border-2 border-[#171717] rounded-full overflow-hidden shadow-[1px_1px_0px_#171717] ${sizeMap[size]} ${className}`}
      title={teamName}
    >
      {visual.svg}
    </div>
  );
};
