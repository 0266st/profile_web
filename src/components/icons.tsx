type IconProps = { className?: string; size?: number };

export function GitHubIcon({ className, size = 16 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}

// The bird. It's Twitter.
export function TwitterIcon({ className, size = 16 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        fill="currentColor"
        d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z"
      />
    </svg>
  );
}

export function YouTubeIcon({ className, size = 16 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        fill="currentColor"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      />
    </svg>
  );
}

// Generic shopping bag (BOOTH has no official single-colour mark to reuse).
export function ShopIcon({ className, size = 16 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M8.5 9V6.5a3.5 3.5 0 0 1 7 0V9" />
      <path fill="currentColor" d="M5.9 7h12.2a1 1 0 0 1 1 .92l1 12A1 1 0 0 1 19.1 21H4.9a1 1 0 0 1-1-1.08l1-12A1 1 0 0 1 5.9 7Z" />
    </svg>
  );
}

export function FormIcon({ className, size = 16 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9.4l-4.8 3.6A1 1 0 0 1 3 20.8V18.9A2 2 0 0 1 2 17V5a2 2 0 0 1 2-2Zm3 5a1 1 0 0 0 0 2h10a1 1 0 1 0 0-2H7Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H7Z"
      />
    </svg>
  );
}

export function MailIcon({ className, size = 16 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 4h16a2 2 0 0 1 2 2v.35l-10 6.25L2 6.35V6a2 2 0 0 1 2-2Zm-2 4.71V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.71l-9.47 5.92a1 1 0 0 1-1.06 0L2 8.71Z"
      />
    </svg>
  );
}
