// Single source for the published GPG key: the footer and /gpg.asc both read
// from here. Paste the ASCII-armored public key and its fingerprint to go live;
// while either is null the page shows a "not published yet" note and
// /gpg.asc returns 404.
export const GPG_PUBLIC_KEY: string | null = null;
export const GPG_FINGERPRINT: string | null = null;
