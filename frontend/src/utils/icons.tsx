export const Search = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const People = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const Home = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const Notification = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const Sun = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

export const Play = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const Pause = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

export const SkipNext = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 4 15 12 5 20 5 4" />
    <line x1="19" y1="5" x2="19" y2="19" />
  </svg>
);

export const SkipPrevious = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="19 20 9 12 19 4 19 20" />
    <line x1="5" y1="19" x2="5" y2="5" />
  </svg>
);

export const VolumeUp = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

export const Playlist = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const Shuffle = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

export const Repeat = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

export const Heart = ({ width = 24, height = 24, className = "", filled = false }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const MoreVert = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

// Previous icons remain the same...

export const Telegram = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.5 2L2 11l8.5 3.5L13 21l3.5-4.5L21.5 2z" />
    <path d="M10.5 14.5L17 8" />
  </svg>
);

// Additional Useful Icons

export const Profile = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const Settings = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const Share = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export const Edit = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const Calendar = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const Download = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const Upload = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const Message = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export const LogOut = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const Login = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

export const Clock = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const Camera = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const Location = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const Filter = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export const Cart = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);


export const Music = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const Mic = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export const Close = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const Plus = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const Minus = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const MusicNote = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    className={`transition-all duration-200 hover:scale-110 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 17H5a2 2 0 0 0-2 2 2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4" />
    <path d="M19 17h-4a2 2 0 0 0-2 2 2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4" />
    <path d="M9 17V5l10-2v14" />
  </svg>
);

