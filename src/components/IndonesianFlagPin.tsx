import React from 'react';

interface IndonesianFlagPinProps {
  className?: string;
  variant?: 'waving' | 'badge' | 'pole';
  title?: string;
}

/**
 * Pin Bendera Merah Putih Indonesia
 * Didesain khusus sebagai indikator visual Hari Libur Nasional resmi RI
 * dengan kontras tinggi (golden enamel rim) agar terlihat tajam dan jelas di latar belakang apapun.
 */
export const IndonesianFlagPin: React.FC<IndonesianFlagPinProps> = ({
  className = 'w-3.5 h-2.5',
  variant = 'waving',
  title = 'Libur Nasional (Merah Putih)',
}) => {
  if (variant === 'badge') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
        title={title}
        aria-label="Pin Bendera Merah Putih"
      >
        <svg
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs overflow-visible"
        >
          {/* Badge Frame with Gold Rim */}
          <rect
            x="0.75"
            y="0.75"
            width="14.5"
            height="10.5"
            rx="2.2"
            fill="#78350f"
            stroke="#fbbf24"
            strokeWidth="1.2"
          />
          {/* Merah */}
          <path
            d="M 1.5 2 C 1.5 1.7 1.7 1.5 2 1.5 L 14 1.5 C 14.3 1.5 14.5 1.7 14.5 2 L 14.5 6 L 1.5 6 Z"
            fill="#dc2626"
          />
          {/* Putih */}
          <path
            d="M 1.5 6 L 14.5 6 L 14.5 10 C 14.5 10.3 14.3 10.5 14 10.5 L 2 10.5 C 1.7 10.5 1.5 10.3 1.5 10 Z"
            fill="#ffffff"
          />
          {/* Divider */}
          <line x1="1.5" y1="6" x2="14.5" y2="6" stroke="#e2e8f0" strokeWidth="0.5" />
        </svg>
      </span>
    );
  }

  // Default: Waving Flag with Golden Pole & Enamel Rim
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      title={title}
      aria-label="Pin Bendera Merah Putih"
    >
      <svg
        viewBox="0 0 16 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs overflow-visible"
      >
        {/* Golden Flagpole */}
        <line
          x1="1.5"
          y1="0.6"
          x2="1.5"
          y2="11.4"
          stroke="#fbbf24"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Pole Gold Finial Tip */}
        <circle cx="1.5" cy="0.8" r="1.1" fill="#f59e0b" stroke="#78350f" strokeWidth="0.3" />

        {/* Flag Body with Golden Enamel Border */}
        <g transform="translate(0.5, 0)">
          {/* Outer Gold Border Frame */}
          <path
            d="M 2 1.5 C 5 0.5 7.5 2.5 10.5 1.5 C 12.5 0.8 14.5 1.5 15 1.5 L 15 9.5 C 14.5 9.5 12.5 8.8 10.5 9.5 C 7.5 10.5 5 8.5 2 9.5 Z"
            fill="#78350f"
            stroke="#fbbf24"
            strokeWidth="0.9"
            strokeLinejoin="round"
          />

          {/* Atas: MERAH INDONESIA */}
          <path
            d="M 2.2 1.8 C 5 0.8 7.5 2.8 10.5 1.8 C 12.5 1.1 14.2 1.8 14.6 1.8 L 14.6 5.5 C 14.2 5.5 12.5 4.8 10.5 5.5 C 7.5 6.5 5 4.5 2.2 5.5 Z"
            fill="#dc2626"
          />

          {/* Bawah: PUTIH INDONESIA */}
          <path
            d="M 2.2 5.5 C 5 4.5 7.5 6.5 10.5 5.5 C 12.5 4.8 14.2 5.5 14.6 5.5 L 14.6 9.2 C 14.2 9.2 12.5 8.5 10.5 9.2 C 7.5 10.2 5 8.2 2.2 9.2 Z"
            fill="#ffffff"
          />

          {/* Center Divider Highlight */}
          <path
            d="M 2.2 5.5 C 5 4.5 7.5 6.5 10.5 5.5 C 12.5 4.8 14.2 5.5 14.6 5.5"
            stroke="#e2e8f0"
            strokeWidth="0.35"
          />
        </g>
      </svg>
    </span>
  );
};
