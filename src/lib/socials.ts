export type SocialPlatform = "instagram" | "x" | "tiktok" | "youtube" | "spotify" | "appleMusic";

// Single source of truth for the artist's social links. `null` means the
// handle/URL hasn't been confirmed yet -- the icon still renders, but as an
// inert placeholder rather than a link, so we never guess and misdirect fans.
export const SOCIAL_LINKS: Record<SocialPlatform, string | null> = {
  instagram: null,
  x: "https://x.com/KennyBlazexx",
  tiktok: null,
  youtube: null,
  spotify: null,
  appleMusic: null,
};
