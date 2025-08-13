"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface YouTubePlayerProps {
  videoId: string
  title?: string
  autoplay?: boolean
}

const YouTubePlayer = ({ videoId, title, autoplay = false }: YouTubePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isMuted, setIsMuted] = useState(false)
  const [player, setPlayer] = useState<any>(null)
  const { t } = useLanguage()

  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player(`youtube-player-${videoId}`, {
        videoId: videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 1, // Enable YouTube controls
          rel: 1, // Allow related videos
          showinfo: 1, // Show video info
          mute: 0,
          modestbranding: 0, // Show YouTube branding
          fs: 1, // Allow fullscreen
          cc_load_policy: 1, // Show captions
          iv_load_policy: 1, // Show annotations
        },
        events: {
          onStateChange: (event: any) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
          },
        },
      })
      setPlayer(newPlayer)
    }

    return () => {
      if (player) {
        player.destroy()
      }
    }
  }, [videoId, autoplay])

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo()
      } else {
        player.playVideo()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute()
      } else {
        player.mute()
      }
      setIsMuted(!isMuted)
    }
  }

  const handleVideoClick = () => {
    togglePlay()
  }

  return (
    <Card className="overflow-hidden shadow-xl rounded-xl border-0 transition-all hover:shadow-2xl w-full max-w-[1500px] mx-auto bg-background/82">
      <div className="relative" onClick={handleVideoClick} style={{ cursor: "pointer" }}>
        <div id={`youtube-player-${videoId}`} className="aspect-video w-full"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm bg-black/20">
            <div className="flex items-center justify-between">
              <div className="text-white font-medium text-lg truncate">{title || t("video")}</div>
              <div className="flex gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/30 transition-colors rounded-full"
                  onClick={toggleMute}
                  aria-label={isMuted ? t("unmute") : t("mute")}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/30 transition-colors rounded-full"
                  onClick={togglePlay}
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
  )
}

export default YouTubePlayer
