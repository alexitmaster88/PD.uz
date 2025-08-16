"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

declare global {
  interface Window {
    YT?: {
      Player: new (elt: HTMLElement | string, opts: any) => any;
      PlayerState: { PLAYING: number; PAUSED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// --- Singleton loader so the API is added once and survives locale/route changes ---
let ytReadyPromise: Promise<void> | null = null;
function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytReadyPromise) return ytReadyPromise;

  ytReadyPromise = new Promise<void>((resolve) => {
    // Add the script once
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }

    // Chain global callback (YouTube expects this exact global)
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };

    // If YT loaded before our handler attached
    if (window.YT && window.YT.Player) {
      resolve();
    }
  });

  return ytReadyPromise;
}

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  autoplay?: boolean;
}

const YouTubePlayer = ({ videoId, title, autoplay = false }: YouTubePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useLanguage();

  // Mount once: create YT player instance and keep it stable across language switches
  useEffect(() => {
    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled || !containerRef.current || playerRef.current) return;

      playerRef.current = new window.YT!.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 1,
          rel: 1,
          showinfo: 1,
          mute: 0,
          modestbranding: 0,
          fs: 1,
          cc_load_policy: 1,
          iv_load_policy: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            // Sync UI state with real player
            try {
              setIsMuted(!!playerRef.current?.isMuted?.());
              const state = playerRef.current?.getPlayerState?.();
              setIsPlaying(state === window.YT!.PlayerState.PLAYING);
            } catch {}
          },
          onStateChange: (event: any) => {
            setIsPlaying(event.data === window.YT!.PlayerState.PLAYING);
            try {
              setIsMuted(!!playerRef.current?.isMuted?.());
            } catch {}
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
    };
    // Intentionally empty deps to avoid tearing down on language/route changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If only the videoId prop changes, cue the new video without recreating the player
  useEffect(() => {
    if (playerRef.current && videoId) {
      try {
        if (typeof playerRef.current.cueVideoById === "function") {
          playerRef.current.cueVideoById(videoId);
        }
      } catch {}
    }
  }, [videoId]);

  const togglePlay = (e?: MouseEvent) => {
    e?.stopPropagation();
    const p = playerRef.current;
    if (!p) return;
    try {
      if (isPlaying) p.pauseVideo();
      else p.playVideo();
      setIsPlaying(!isPlaying);
    } catch {}
  };

  const toggleMute = (e?: MouseEvent) => {
    e?.stopPropagation();
    const p = playerRef.current;
    if (!p) return;
    try {
      if (isMuted) p.unMute();
      else p.mute();
      setIsMuted(!isMuted);
    } catch {}
  };

  const handleVideoAreaClick = () => {
    togglePlay();
  };

  return (
    <Card className="overflow-hidden shadow-xl rounded-xl border-0 transition-all hover:shadow-2xl w-full max-w-4xl mx-auto bg-background/60 backdrop-blur-md">
      {/* Click-to-play/pause only on bare area */}
      <div className="relative" onClick={handleVideoAreaClick} style={{ cursor: "pointer" }}>
        {/* The actual container div that YT will replace with an iframe */}
        <div ref={containerRef} className="aspect-video w-full flex items-center justify-center" />

        {/* Controls overlay — must be interactive, so DO NOT use pointer-events-none */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
          <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm bg-black/20">
            <div className="flex items-center justify-between">
              <div className="text-white font-medium text-lg truncate">{title || t("video")}</div>
              <div className="flex gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/30 transition-colors rounded-full"
                  onClick={(e) => toggleMute(e)}
                  aria-label={isMuted ? t("unmute") : t("mute")}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/30 transition-colors rounded-full"
                  onClick={(e) => togglePlay(e)}
                  aria-label={isPlaying ? t("pause") : t("play")}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-5 bg-gradient-to-r from-primary/5 to-secondary/10">
        <h3 className="font-medium text-xl">{title || t("video")}</h3>
      </CardContent>
    </Card>
  );
};

export default YouTubePlayer;
