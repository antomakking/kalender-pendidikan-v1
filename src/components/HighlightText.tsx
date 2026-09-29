import React from 'react';

interface HighlightTextProps {
  text: string;
  query?: string;
  highlightClassName?: string;
  className?: string;
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  query,
  highlightClassName = 'bg-amber-300 text-slate-950 font-bold px-0.5 rounded-xs shadow-2xs not-italic',
  className = '',
}) => {
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const trimmed = query.trim();
  // Escape regex special chars: \ ^ $ * + ? . ( ) | { } [ ]
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const isMatch = part.toLowerCase() === trimmed.toLowerCase();
        if (isMatch) {
          return (
            <mark key={i} className={highlightClassName}>
              {part}
            </mark>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};
