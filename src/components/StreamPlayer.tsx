import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Stream {
  id: number;
  title: string;
  streamer: string;
  points: number;
  viewers: number;
  started_at: string;
  phone_id: string;
}

interface StreamPlayerProps {
  stream: Stream;
  onClose?: () => void;
}

const StreamPlayer = ({ stream, onClose }: StreamPlayerProps) => {
  const [viewers, setViewers] = useState(stream.viewers);

  useEffect(() => {
    // Имитация подключения к трансляции
    const joinStream = async () => {
      try {
        const response = await fetch(
          'https://functions.poehali.dev/afbc8166-0afe-42eb-a838-7db81f2c0229?action=join',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stream_id: stream.id })
          }
        );
        
        const data = await response.json();
        if (response.ok) {
          setViewers(data.viewers_count);
        }
      } catch (error) {
        console.error('Failed to join stream:', error);
      }
    };

    joinStream();
  }, [stream.id]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-fade-in">
      <Card className="glass-effect w-full max-w-4xl overflow-hidden">
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-red-500/20 to-purple-500/20 flex flex-col items-center justify-center text-white">
            <div className="text-8xl mb-4">📱</div>
            <Badge variant="destructive" className="mb-2 animate-pulse">
              <Icon name="Radio" size={14} className="mr-2" />
              ПРЯМОЙ ЭФИР
            </Badge>
            <p className="text-sm text-white/70 mt-4">
              Трансляция с телефона стримера
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors z-10"
            aria-label="Закрыть"
          >
            ✕
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-black/50 backdrop-blur">
                <Icon name="Users" size={14} className="mr-1" />
                {viewers}
              </Badge>
              <div className="text-white">
                <p className="font-semibold text-sm">{stream.streamer}</p>
                <p className="text-xs text-white/70">⭐ {stream.points} баллов</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-background/95 backdrop-blur">
          <h3 className="text-xl font-semibold mb-2">{stream.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Стример получает баллы за каждую минуту эфира и за каждого зрителя
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} className="text-primary" />
              <span>Начало: {new Date(stream.started_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Award" size={16} className="text-primary" />
              <span>+1 балл за минуту</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Users" size={16} className="text-primary" />
              <span>+5 баллов за зрителя</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StreamPlayer;
