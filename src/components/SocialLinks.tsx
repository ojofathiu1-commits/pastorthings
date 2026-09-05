import { SOCIAL_LINKS, type SocialPlatform } from "@/lib/socials";
import {
  InstagramIcon,
  XIcon,
  TikTokIcon,
  YouTubeIcon,
  SpotifyIcon,
  AppleMusicIcon,
} from "./SocialIcons";
import styles from "./SocialLinks.module.css";

const PLATFORMS: { key: SocialPlatform; label: string; Icon: typeof XIcon }[] = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "x", label: "X / Twitter", Icon: XIcon },
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon },
  { key: "youtube", label: "YouTube", Icon: YouTubeIcon },
  { key: "spotify", label: "Spotify", Icon: SpotifyIcon },
  { key: "appleMusic", label: "Apple Music", Icon: AppleMusicIcon },
];

export function SocialLinks({ size }: { size?: "small" }) {
  return (
    <div className={`${styles.row} ${size === "small" ? styles.small : ""}`}>
      {PLATFORMS.map(({ key, label, Icon }) => {
        const href = SOCIAL_LINKS[key];
        if (!href) {
          return (
            <span key={key} className={`${styles.circle} ${styles.pending}`} aria-label={`${label} (coming soon)`}>
              <Icon />
            </span>
          );
        }
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.circle}
            aria-label={label}
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
}
