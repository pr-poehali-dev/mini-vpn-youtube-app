import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StreamPlayer from '@/components/StreamPlayer';

interface Stream {
  id: number;
  title: string;
  streamer: string;
  points: number;
  viewers: number;
  started_at: string;
  phone_id: string;
}

interface LeaderboardEntry {
  username: string;
  points: number;
  total_stream_time: number;
  is_streaming: boolean;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('streams');
  const [streams, setStreams] = useState<Stream[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [streamTitle, setStreamTitle] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamId, setCurrentStreamId] = useState<number | null>(null);

  const API_URL = 'https://functions.poehali.dev/afbc8166-0afe-42eb-a838-7db81f2c0229';

  const loadStreams = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=list`);
      const data = await response.json();
      setStreams(data.streams || []);
    } catch (error) {
      console.error('Failed to load streams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const response = await fetch(`${API_URL}?action=leaderboard&limit=20`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  useEffect(() => {
    loadStreams();
    loadLeaderboard();
    
    const interval = setInterval(() => {
      loadStreams();
      loadLeaderboard();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const startStream = async () => {
    if (!username.trim()) {
      alert('Введите имя пользователя');
      return;
    }

    try {
      const phoneId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch(`${API_URL}?action=start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          phone_id: phoneId,
          title: streamTitle.trim() || 'Прямой эфир'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsStreaming(true);
        setCurrentStreamId(data.stream_id);
        loadStreams();
        alert(`Трансляция запущена! ID: ${data.stream_id}`);
      } else {
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Не удалось начать трансляцию');
    }
  };

  const stopStream = async () => {
    if (!currentStreamId) return;

    try {
      const response = await fetch(`${API_URL}?action=stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stream_id: currentStreamId })
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsStreaming(false);
        setCurrentStreamId(null);
        loadStreams();
        loadLeaderboard();
        alert(`Трансляция завершена! Заработано баллов: ${data.points_earned}`);
      } else {
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      alert('Не удалось завершить трансляцию');
    }
  };

  const formatDuration = (isoDate: string) => {
    const start = new Date(isoDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}ч ${minutes % 60}м`;
    return `${minutes}м`;
  };

  const formatStreamTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}ч ${minutes}м`;
    return `${minutes}м`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <header className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">📱 LiveStream</h1>
            <Badge variant="default" className="text-xs sm:text-sm px-3 py-1 animate-pulse-glow">
              <Icon name="Radio" size={14} className="mr-2" />
              {streams.length} Live
            </Badge>
          </div>

          {!isStreaming ? (
            <Card className="glass-effect p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Начать свою трансляцию</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Ваше имя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="glass-effect"
                />
                <Input
                  placeholder="Название трансляции (опционально)"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  className="glass-effect"
                />
                <Button 
                  onClick={startStream}
                  className="w-full"
                  size="lg"
                >
                  <Icon name="Video" size={18} className="mr-2" />
                  Стать стримером
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="glass-effect p-4 sm:p-6 border-2 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Вы в эфире!
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Баллы начисляются за каждую минуту стрима
                  </p>
                </div>
                <Button 
                  onClick={stopStream}
                  variant="destructive"
                >
                  <Icon name="StopCircle" size={18} className="mr-2" />
                  Завершить
                </Button>
              </div>
            </Card>
          )}
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="glass-effect w-full justify-start">
            <TabsTrigger value="streams" className="gap-2">
              <Icon name="Radio" size={14} />
              Трансляции
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2">
              <Icon name="Trophy" size={14} />
              Рейтинг
            </TabsTrigger>
          </TabsList>

          <TabsContent value="streams" className="animate-fade-in">
            {isLoading ? (
              <Card className="glass-effect p-8 text-center">
                <Icon name="Loader2" size={40} className="mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">Загрузка трансляций...</p>
              </Card>
            ) : streams.length === 0 ? (
              <Card className="glass-effect p-8 text-center">
                <Icon name="Radio" size={40} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Нет активных трансляций</h3>
                <p className="text-muted-foreground">Станьте первым стримером!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {streams.map((stream) => (
                  <Card 
                    key={stream.id}
                    className="glass-effect overflow-hidden hover-glow cursor-pointer group"
                    onClick={() => setSelectedStream(stream)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center text-6xl relative">
                      📱
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Badge variant="destructive" className="animate-pulse">
                          <Icon name="Radio" size={12} className="mr-1" />
                          LIVE
                        </Badge>
                        <Badge variant="secondary">
                          <Icon name="Users" size={12} className="mr-1" />
                          {stream.viewers}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-1">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{stream.streamer}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-primary font-semibold">⭐ {stream.points}</span>
                        <span className="text-muted-foreground">{formatDuration(stream.started_at)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leaderboard" className="animate-fade-in">
            <Card className="glass-effect p-6">
              <h2 className="text-2xl font-bold mb-4">🏆 Топ стримеров</h2>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
                  >
                    <div className="text-2xl font-bold text-muted-foreground w-8">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{entry.username}</p>
                        {entry.is_streaming && (
                          <Badge variant="destructive" className="text-xs">
                            <Icon name="Radio" size={10} className="mr-1" />
                            Live
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Время в эфире: {formatStreamTime(entry.total_stream_time)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">⭐ {entry.points}</p>
                      <p className="text-xs text-muted-foreground">баллов</p>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Пока нет стримеров
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedStream && (
        <StreamPlayer 
          stream={selectedStream}
          onClose={() => setSelectedStream(null)}
        />
      )}
    </div>
  );
};

export default Index;
