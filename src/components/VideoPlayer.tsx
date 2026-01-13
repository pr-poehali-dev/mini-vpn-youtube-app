import { Card } from '@/components/ui/card';

interface VideoPlayerProps {
  videoId: string;
  onClose?: () => void;
}

const VideoPlayer = ({ videoId, onClose }: VideoPlayerProps) => {
  const vkEmbedUrl = `https://vk.com/video_ext.php?oid=${videoId.split('_')[0]}&id=${videoId.split('_')[1]}&hd=2`;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
      <Card className="glass-effect w-full max-w-4xl overflow-hidden">
        <div className="relative">
          <iframe
            src={vkEmbedUrl}
            className="aspect-video w-full"
            style={{ minHeight: '300px' }}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            frameBorder="0"
            allowFullScreen
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors touch-manipulation z-10"
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
