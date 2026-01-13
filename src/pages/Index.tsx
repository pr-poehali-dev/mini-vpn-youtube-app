import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoPlayer from '@/components/VideoPlayer';

const Index = () => {
  const [vpnConnected, setVpnConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [trafficUsed, setTrafficUsed] = useState(3.2);
  const [trafficLimit] = useState(10);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  const mockVideos = [
    { id: 1, title: 'Building Modern Web Apps', channel: 'Dev Academy', duration: '15:30', views: '1.2M', thumbnail: '🎨', youtubeId: 'dQw4w9WgXcQ' },
    { id: 2, title: 'Advanced React Patterns', channel: 'Code Masters', duration: '22:15', views: '890K', thumbnail: '⚛️', youtubeId: 'dQw4w9WgXcQ' },
    { id: 3, title: 'VPN Security Explained', channel: 'Tech Security', duration: '18:45', views: '2.1M', thumbnail: '🔒', youtubeId: 'dQw4w9WgXcQ' },
    { id: 4, title: 'Design Systems 2024', channel: 'UI/UX Hub', duration: '25:10', views: '650K', thumbnail: '🎯', youtubeId: 'dQw4w9WgXcQ' },
  ];

  const mockHistory = [
    { id: 1, title: 'JavaScript Tips & Tricks', time: '2 hours ago', thumbnail: '💡', youtubeId: 'dQw4w9WgXcQ' },
    { id: 2, title: 'CSS Animations Tutorial', time: '5 hours ago', thumbnail: '🎬', youtubeId: 'dQw4w9WgXcQ' },
    { id: 3, title: 'Backend Architecture', time: 'Yesterday', thumbnail: '🏗️', youtubeId: 'dQw4w9WgXcQ' },
  ];

  const vpnServers = [
    { id: 1, name: 'Netherlands', ping: 12, load: 45 },
    { id: 2, name: 'Germany', ping: 18, load: 62 },
    { id: 3, name: 'USA East', ping: 89, load: 38 },
    { id: 4, name: 'Singapore', ping: 156, load: 71 },
  ];

  const trafficPercentage = (trafficUsed / trafficLimit) * 100;

  const handleVideoClick = (youtubeId: string) => {
    setSelectedVideo(youtubeId);
    setTrafficUsed(prev => Math.min(prev + 0.15, trafficLimit));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 touch-manipulation">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <header className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">VPN Tube</h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <Badge variant={vpnConnected ? "default" : "destructive"} className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 animate-pulse-glow">
                <Icon name={vpnConnected ? "Shield" : "ShieldOff"} size={14} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{vpnConnected ? 'Защищено' : 'Не защищено'}</span>
                <span className="sm:hidden">{vpnConnected ? 'ON' : 'OFF'}</span>
              </Badge>
              <Button variant="ghost" size="icon" className="hover-glow h-8 w-8 sm:h-10 sm:w-10">
                <Icon name="Settings" size={18} />
              </Button>
            </div>
          </div>

          <Card className="glass-effect p-4 sm:p-6 hover-glow">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Shield" size={20} className={vpnConnected ? 'text-green-500' : 'text-destructive'} />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">VPN Статус</p>
                    <p className="text-sm sm:text-base font-semibold">{vpnConnected ? 'Подключено к Netherlands' : 'Отключено'}</p>
                  </div>
                  <Switch checked={vpnConnected} onCheckedChange={setVpnConnected} />
                </div>
                {vpnConnected && (
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 animate-scale-in">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Скорость</p>
                      <p className="text-sm sm:text-lg font-semibold text-accent">45 Mbps</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Пинг</p>
                      <p className="text-sm sm:text-lg font-semibold text-secondary">12 ms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Загрузка</p>
                      <p className="text-sm sm:text-lg font-semibold text-primary">45%</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full md:w-64 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Трафик</span>
                  <span className="font-semibold">{trafficUsed.toFixed(1)} / {trafficLimit} GB</span>
                </div>
                <Progress value={trafficPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">Осталось {(trafficLimit - trafficUsed).toFixed(1)} GB</p>
              </div>
            </div>
          </Card>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="glass-effect w-full justify-start overflow-x-auto flex-nowrap">
            <TabsTrigger value="home" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Icon name="Home" size={14} />
              <span className="hidden sm:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Icon name="Search" size={14} />
              <span className="hidden sm:inline">Поиск</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Icon name="Bookmark" size={14} />
              <span className="hidden sm:inline">Сохранённое</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Icon name="History" size={14} />
              <span className="hidden sm:inline">История</span>
            </TabsTrigger>
            <TabsTrigger value="servers" className="gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
              <Icon name="Server" size={14} />
              <span className="hidden sm:inline">Серверы</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-4 sm:space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Рекомендуемые видео</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {mockVideos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="glass-effect overflow-hidden hover-glow cursor-pointer group active:scale-95 transition-transform"
                    onClick={() => handleVideoClick(video.youtubeId)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl sm:text-6xl group-hover:scale-105 transition-transform">
                      {video.thumbnail}
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold mb-1 line-clamp-2 text-sm sm:text-base">{video.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{video.channel}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{video.views}</span>
                        <span>{video.duration}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search" className="animate-fade-in">
            <div className="space-y-4">
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск видео на YouTube..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 sm:h-12 glass-effect text-sm sm:text-base"
                />
              </div>
              <Card className="glass-effect p-6 sm:p-8 text-center">
                <Icon name="Search" size={40} className="mx-auto mb-4 text-muted-foreground sm:w-12 sm:h-12" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Начните поиск</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Введите запрос для поиска видео на YouTube</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="animate-fade-in">
            <Card className="glass-effect p-6 sm:p-8 text-center">
              <Icon name="Bookmark" size={40} className="mx-auto mb-4 text-muted-foreground sm:w-12 sm:h-12" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Нет сохранённых видео</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Сохраняйте понравившиеся видео для быстрого доступа</p>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">История просмотров</h2>
                <Button variant="ghost" size="sm" className="h-8 sm:h-9 text-xs sm:text-sm">
                  <Icon name="Trash2" size={14} className="mr-1 sm:mr-2" />
                  Очистить
                </Button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {mockHistory.map((video) => (
                  <Card 
                    key={video.id} 
                    className="glass-effect p-3 sm:p-4 hover-glow cursor-pointer group active:scale-98 transition-transform"
                    onClick={() => handleVideoClick(video.youtubeId)}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-24 sm:w-32 aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center text-3xl sm:text-4xl group-hover:scale-105 transition-transform flex-shrink-0">
                        {video.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 text-sm sm:text-base truncate">{video.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{video.time}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                        <Icon name="MoreVertical" size={18} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="servers" className="animate-fade-in">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">VPN Серверы</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {vpnServers.map((server) => (
                  <Card key={server.id} className="glass-effect p-3 sm:p-4 hover-glow cursor-pointer active:scale-98 transition-transform">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                          <Icon name="Server" size={16} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">{server.name}</h3>
                          <p className="text-xs text-muted-foreground">{server.ping} ms</p>
                        </div>
                      </div>
                      <Button size="sm" className="h-8 text-xs sm:h-9 sm:text-sm">
                        Подключить
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Загрузка сервера</span>
                        <span>{server.load}%</span>
                      </div>
                      <Progress value={server.load} className="h-1" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedVideo && (
        <VideoPlayer 
          videoId={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
        />
      )}
    </div>
  );
};

export default Index;
