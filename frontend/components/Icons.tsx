/*
 * Small inline SVG icons used across the app.
 * Colors come from `currentColor` unless a fill is baked in.
 */

type IconProps = {
  size?: number;
  className?: string;
};

export function FlameIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12.6 1.8c.4 3-1.3 4.6-2.9 6.4C8 10 6.4 11.9 6.4 15a5.6 5.6 0 0 0 11.2 0c0-2.6-1.2-4.4-2.3-5.8-.2 1.4-.9 2.5-2 3 .6-3.6-.2-7.8-.7-10.4Z"
        fill="#ff9600"
      />
      <path
        d="M12.3 12.2c-.1 1.6-1.9 2.4-1.9 4.3a2.1 2.1 0 0 0 4.2 0c0-1.4-1.1-2.3-2.3-4.3Z"
        fill="#ffc800"
      />
    </svg>
  );
}

export function GemIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 3h12l4 6-10 12L2 9l4-6Z" fill="#1cb0f6" />
      <path d="M2 9h20L12 21 2 9Z" fill="#1899d6" />
      <path d="M8 9l4-6 4 6H8Z" fill="#84d8ff" />
    </svg>
  );
}

export function HeartIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 21s-8.5-5.1-8.5-11.2A4.8 4.8 0 0 1 12 6.7a4.8 4.8 0 0 1 8.5 3.1C20.5 15.9 12 21 12 21Z"
        fill="#ff4b4b"
      />
      <ellipse cx="7.6" cy="9.4" rx="1.6" ry="1.1" fill="#fff" opacity=".55" transform="rotate(-35 7.6 9.4)" />
    </svg>
  );
}

export function BoltIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M13.5 2 4.5 13.5H11L9.5 22l10-12.5H13L13.5 2Z" fill="#ffc800" />
    </svg>
  );
}

export function StarIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2.8l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17l-5.6 3 1.1-6.2L3 9.4l6.2-.9L12 2.8Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LockIcon({ size = 28, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="4.5" y="10" width="15" height="11" rx="3" fill="currentColor" />
      <path
        d="M8 10V7.5a4 4 0 0 1 8 0V10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloseIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M5 5l14 14M19 5L5 19"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function XMarkIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M7 7l10 10M17 7L7 17"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SpeakerIcon({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z" fill="currentColor" />
      <path
        d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TrophyIcon({ size = 64, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M14 12h-6c0 10 4.5 16 12 17" fill="none" stroke="#e5b400" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 12h6c0 10-4.5 16-12 17" fill="none" stroke="#e5b400" strokeWidth="4" strokeLinecap="round" />
      <path d="M16 8h32v12c0 10-7 18-16 18S16 30 16 20V8Z" fill="#ffc800" />
      <path d="M22 12h6v14c-3.5-1.5-6-5-6-9v-5Z" fill="#fff" opacity=".35" />
      <rect x="28" y="37" width="8" height="10" fill="#e5b400" />
      <rect x="19" y="46" width="26" height="9" rx="3" fill="#ffc800" />
      <rect x="19" y="52" width="26" height="3" rx="1.5" fill="#e5b400" />
    </svg>
  );
}

export function HomeIcon({ size = 28, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" className={className} aria-hidden="true">
      <path d="M4 13.2 14 4.5l10 8.7V23a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 23v-9.8Z" fill="#ff9600" />
      <path d="M2.5 13.5 14 3.5l11.5 10" fill="none" stroke="#cc3c3c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="11" y="16" width="6" height="8.5" rx="1.2" fill="#fff" />
    </svg>
  );
}

export function BookIcon({ size = 28, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" className={className} aria-hidden="true">
      <path d="M3 6.5c3.5-1.5 7-1.5 10.5.5v17c-3.5-2-7-2-10.5-.5V6.5Z" fill="#1cb0f6" />
      <path d="M25 6.5c-3.5-1.5-7-1.5-10.5.5v17c3.5-2 7-2 10.5-.5V6.5Z" fill="#1899d6" />
    </svg>
  );
}

export function ShopIcon({ size = 28, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" className={className} aria-hidden="true">
      <path d="M5 10h18l-1.4 13a1.8 1.8 0 0 1-1.8 1.5H8.2a1.8 1.8 0 0 1-1.8-1.5L5 10Z" fill="#ce82ff" />
      <path d="M10 12V8.5a4 4 0 0 1 8 0V12" fill="none" stroke="#a568cc" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon({ size = 28, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" className={className} aria-hidden="true">
      <circle cx="14" cy="10" r="5.5" fill="#ff86d0" />
      <path d="M4.5 24.5a9.5 9.5 0 0 1 19 0H4.5Z" fill="#cc6ba6" />
    </svg>
  );
}

export function TargetIcon({ size = 28, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" className={className} aria-hidden="true">
      <circle cx="14" cy="14" r="11" fill="#ff4b4b" />
      <circle cx="14" cy="14" r="7.5" fill="#fff" />
      <circle cx="14" cy="14" r="4" fill="#ff4b4b" />
    </svg>
  );
}
