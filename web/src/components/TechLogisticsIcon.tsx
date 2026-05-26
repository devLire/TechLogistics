export const TechLogisticsIcon = () => {
  return (
    <svg
      height="50"
      viewBox="0 0 120 120"
      width="200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        <linearGradient id="g2" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      <polygon
        fill="none"
        opacity="0.18"
        points="60,5 105,30 105,90 60,115 15,90 15,30"
        stroke="#047857"
        strokeWidth="2"
      />

      <circle cx="35" cy="45" fill="url(#g1)" r="5" />
      <circle cx="75" cy="30" fill="url(#g1)" r="5" />
      <circle cx="85" cy="75" fill="url(#g1)" r="5" />
      <circle cx="45" cy="90" fill="url(#g1)" r="5" />

      <path
        d="M35 45 L75 30 L85 75 L45 90 Z"
        fill="none"
        stroke="url(#g1)"
        strokeWidth="2.5"
      />

      <path
        d="M20 70 C40 40, 70 110, 100 60"
        fill="none"
        stroke="url(#g2)"
        strokeLinecap="round"
        strokeWidth="4"
      />

      <polygon fill="#10B981" points="100,60 92,58 96,68" />

      <circle cx="60" cy="60" fill="#34D399" r="6" />
    </svg>
  );
};
