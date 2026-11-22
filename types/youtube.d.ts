// Minimal typings for the YouTube IFrame Player API (https://www.youtube.com/iframe_api),
// covering what components/youtube-player.tsx uses.

interface YTPlayer {
  playVideo(): void
  pauseVideo(): void
  mute(): void
  unMute(): void
  isMuted(): boolean
  getPlayerState(): number
  cueVideoById(videoId: string): void
  destroy(): void
}

interface YTPlayerOptions {
  videoId?: string
  playerVars?: Record<string, number | string>
  events?: {
    onReady?: (event: { target: YTPlayer }) => void
    onStateChange?: (event: { target: YTPlayer; data: number }) => void
  }
}

interface YT {
  Player: new (elt: HTMLElement | string, opts: YTPlayerOptions) => YTPlayer
  PlayerState: {
    UNSTARTED: number
    ENDED: number
    PLAYING: number
    PAUSED: number
    BUFFERING: number
    CUED: number
  }
}

interface Window {
  YT: YT
  onYouTubeIframeAPIReady: () => void
}
