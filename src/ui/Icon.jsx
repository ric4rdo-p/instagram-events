import Svg, { Circle, Path, Rect } from "react-native-svg";

const paths = {
  home: <Path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />,
  search: (
    <>
      <Circle cx="11" cy="11" r="7" />
      <Path d="m20 20-4-4" />
    </>
  ),
  compass: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="m15.5 8.5-2 5-5 2 2-5Z" />
    </>
  ),
  reels: (
    <>
      <Rect x="3" y="3" width="18" height="18" rx="5" />
      <Path d="m7 3 4 5M14 3l4 5M3 8h18" />
      <Path d="m10 12 5 3-5 3Z" />
    </>
  ),
  message: (
    <>
      <Path d="m22 2-7 20-4-9-9-4Z" />
      <Path d="m22 2-11 11" />
    </>
  ),
  comment: <Path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" />,
  edits: (
    <>
      <Circle cx="6" cy="6" r="3" />
      <Circle cx="6" cy="18" r="3" />
      <Path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" />
    </>
  ),
  story: (
    <>
      <Circle cx="12" cy="12" r="9" strokeDasharray="3 2.6" />
      <Path d="M12 8v8M8 12h8" />
    </>
  ),
  highlights: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 16.5s-4-2.4-4-5.1a2.1 2.1 0 0 1 4-1 2.1 2.1 0 0 1 4 1c0 2.7-4 5.1-4 5.1Z" />
    </>
  ),
  live: (
    <>
      <Circle cx="12" cy="12" r="2" />
      <Path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5" />
    </>
  ),
  fundraiser: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M15 9.5c-.4-1-1.6-1.6-3-1.6-1.7 0-3 .9-3 2.1 0 2.8 6 1.4 6 4.1 0 1.2-1.3 2.1-3 2.1-1.4 0-2.6-.6-3-1.6M12 6.5v1.4M12 16.1v1.4" />
    </>
  ),
  heart: <Path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
  plus: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 8v8M8 12h8" />
    </>
  ),
  calendar: (
    <>
      <Rect x="3" y="5" width="18" height="16" rx="3" />
      <Path d="M16 3v4M8 3v4M3 10h18" />
      <Path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </>
  ),
  profile: (
    <>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  back: <Path d="m15 18-6-6 6-6" />,
  more: (
    <>
      <Circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <Circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <Circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  bookmark: <Path d="M6 3h12v18l-6-4-6 4Z" />,
  share: (
    <>
      <Path d="m22 2-7 20-4-9-9-4Z" />
      <Path d="m22 2-11 11" />
    </>
  ),
  location: (
    <>
      <Path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <Circle cx="12" cy="10" r="2.5" />
    </>
  ),
  chevron: <Path d="m9 18 6-6-6-6" />,
  sparkles: <Path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2ZM18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8ZM5 14l.7 1.8 1.8.7-1.8.7L5 19l-.7-1.8-1.8-.7 1.8-.7Z" />,
  clock: (
    <>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7v5l3 2" />
    </>
  ),
  users: (
    <>
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
    </>
  ),
  check: <Path d="m5 12 4 4L19 6" />,
  close: <Path d="m6 6 12 12M18 6 6 18" />,
  image: (
    <>
      <Rect x="3" y="3" width="18" height="18" rx="3" />
      <Circle cx="8.5" cy="8.5" r="1.5" />
      <Path d="m21 15-5-5L5 21" />
    </>
  ),
  ticket: (
    <>
      <Path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v8a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2Z" />
      <Path d="M13 6v12" />
    </>
  ),
  grid: (
    <>
      <Rect x="3" y="3" width="18" height="18" rx="2" />
      <Path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </>
  ),
  repost: (
    <>
      <Path d="m17 2 4 4-4 4" />
      <Path d="M3 11V9a3 3 0 0 1 3-3h15" />
      <Path d="m7 22-4-4 4-4" />
      <Path d="M21 13v2a3 3 0 0 1-3 3H3" />
    </>
  ),
  tag: (
    <>
      <Path d="M4 4h16v13h-6l-2 3-2-3H4Z" />
      <Circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  menu: <Path d="M4 7h16M4 12h16M4 17h16" />,
  play: <Path d="M8 5v14l11-7Z" fill="currentColor" />,
  arrowUp: <Path d="M12 19V5M5 12l7-7 7 7" />,
  car: (
    <>
      <Path d="M4 16.5V12l2.1-5a2 2 0 0 1 1.8-1.2h8.2a2 2 0 0 1 1.8 1.2L20 12v4.5Z" />
      <Path d="M4 12h16M6 16.5V19M18 16.5V19" />
      <Circle cx="7.6" cy="14.3" r=".9" fill="currentColor" stroke="none" />
      <Circle cx="16.4" cy="14.3" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  chevronDown: <Path d="m6 9 6 6 6-6" />,
  star: <Path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z" />,
  link: (
    <>
      <Path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <Path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
    </>
  ),
  pause: <Path d="M8 5v14M16 5v14" />,
  eye: (
    <>
      <Path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <Circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <Path d="M10.6 5.1A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-2.6 3.5M6.2 6.3C3.6 8 2 12 2 12s3.6 7 10 7c1.7 0 3.2-.5 4.5-1.2" />
      <Path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
    </>
  ),
  lock: (
    <>
      <Rect x="4" y="11" width="16" height="10" rx="2" />
      <Path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  film: (
    <>
      <Rect x="3" y="3" width="18" height="18" rx="3" />
      <Path d="M7 3v18M17 3v18M3 8h4M17 8h4M3 16h4M17 16h4" />
    </>
  ),
  megaphone: (
    <>
      <Path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6l-5 4H4a1 1 0 0 0-1 1Z" />
      <Path d="M15 9a3 3 0 0 1 0 6M18 6a7 7 0 0 1 0 12" />
    </>
  ),
};

export default function Icon({ name, filled = false, size = 24, bold = false, color = "#111" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      color={color}
      fill={filled ? color : "none"}
      stroke={color}
      strokeWidth={bold ? 2.7 : 1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </Svg>
  );
}
