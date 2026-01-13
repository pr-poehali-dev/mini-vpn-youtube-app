import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface VideoPlayerProps {
  videoId: string;
  onClose?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const VideoPlayer = ({ videoId, onClose }: VideoPlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);

  useEffect(() => {
    const loadPlayer = () => {
      if (window.YT && window.YT.Player && playerRef.current) {
        ytPlayerRef.current = new window.YT.Player(playerRef.current, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              event.target.playVideo();
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      window.onYouTubeIframeAPIReady = loadPlayer;
    }

    return () => {
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy();
      }
    };
  }, [videoId]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
      <Card className="glass-effect w-full max-w-4xl overflow-hidden">
        <div className="relative">
          <div 
            ref={playerRef} 
            className="aspect-video w-full"
            style={{ minHeight: '300px' }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors touch-manipulation"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>
      </Card>
    </div>
  );
};

export default VideoPlayer;
