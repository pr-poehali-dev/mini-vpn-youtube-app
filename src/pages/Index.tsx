import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [vpnConnected, setVpnConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [trafficUsed, setTrafficUsed] = useState(3.2);
  const [trafficLimit] = useState(10);

  const mockVideos = [
    { id: 1, title: 'Building Modern Web Apps', channel: 'Dev Academy', duration: '15:30', views: '1.2M', thumbnail: '🎨' },
    { id: 2, title: 'Advanced React Patterns', channel: 'Code Masters', duration: '22:15', views: '890K', thumbnail: '⚛️' },
    { id: 3, title: 'VPN Security Explained', channel: 'Tech Security', duration: '18:45', views: '2.1M', thumbnail: '🔒' },
    { id: 4, title: 'Design Systems 2024', channel: 'UI/UX Hub', duration: '25:10', views: '650K', thumbnail: '🎯' },
  ];

  const mockHistory = [
    { id: 1, title: 'JavaScript Tips & Tricks', time: '2 hours ago', thumbnail: '💡' },
    { id: 2, title: 'CSS Animations Tutorial', time: '5 hours ago', thumbnail: '🎬' },
    { id: 3, title: 'Backend Architecture', time: 'Yesterday', thumbnail: '🏗️' },
  ];

  const vpnServers = [
    { id: 1, name: 'Netherlands', ping: 12, load: 45 },
    { id: 2, name: 'Germany', ping: 18, load: 62 },
    { id: 3, name: 'USA East', ping: 89, load: 38 },
    { id: 4, name: 'Singapore', ping: 156, load: 71 },
  ];

  const trafficPercentage = (trafficUsed / trafficLimit) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold gradient-text">VPN Tube</h1>
            <div className="flex items-center gap-4">
              <Badge variant={vpnConnected ? "default" : "destructive"} className="text-sm px-4 py-2 animate-pulse-glow">
                <Icon name={vpnConnected ? "Shield" : "ShieldOff"} size={16} className="mr-2" />
                {vpnConnected ? 'Защищено' : 'Не защищено'}
              </Badge>
              <Button variant="ghost" size="icon" className="hover-glow">
                <Icon name="Settings" size={20} />
              </Button>
            </div>
          </div>

          <Card className="glass-effect p-6 hover-glow">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Shield" size={24} className={vpnConnected ? 'text-green-500' : 'text-destructive'} />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">VPN Статус</p>
                    <p className="font-semibold">{vpnConnected ? 'Подключено к Netherlands' : 'Отключено'}</p>
                  </div>
                  <Switch checked={vpnConnected} onCheckedChange={setVpnConnected} />
                </div>
                {vpnConnected && (
                  <div className="grid grid-cols-3 gap-4 mt-4 animate-scale-in">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Скорость</p>
                      <p className="text-lg font-semibold text-accent">45 Mbps</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Пинг</p>
                      <p className="text-lg font-semibold text-secondary">12 ms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Загрузка</p>
                      <p className="text-lg font-semibold text-primary">45%</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full md:w-64 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Трафик</span>
                  <span className="font-semibold">{trafficUsed} / {trafficLimit} GB</span>
                </div>
                <Progress value={trafficPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">Осталось {(trafficLimit - trafficUsed).toFixed(1)} GB</p>
              </div>
            </div>
          </Card>
        </header>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="glass-effect w-full justify-start overflow-x-auto">
            <TabsTrigger value="home" className="gap-2">
              <Icon name="Home" size={16} />
              Главная
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-2">
              <Icon name="Search" size={16} />
              Поиск
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Icon name="Bookmark" size={16} />
              Сохранённое
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Icon name="History" size={16} />
              История
            </TabsTrigger>
            <TabsTrigger value="servers" className="gap-2">
              <Icon name="Server" size={16} />
              Серверы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold mb-4">Рекомендуемые видео</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockVideos.map((video) => (
                  <Card key={video.id} className="glass-effect overflow-hidden hover-glow cursor-pointer group">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                      {video.thumbnail}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{video.channel}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{video.views} просмотров</span>
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
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск видео на YouTube..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 glass-effect"
                />
              </div>
              <Card className="glass-effect p-8 text-center">
                <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Начните поиск</h3>
                <p className="text-muted-foreground">Введите запрос для поиска видео на YouTube</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="saved" className="animate-fade-in">
            <Card className="glass-effect p-8 text-center">
              <Icon name="Bookmark" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Нет сохранённых видео</h3>
              <p className="text-muted-foreground">Сохраняйте понравившиеся видео для быстрого доступа</p>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">История просмотров</h2>
                <Button variant="ghost" size="sm">
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Очистить
                </Button>
              </div>
              <div className="space-y-3">
                {mockHistory.map((video) => (
                  <Card key={video.id} className="glass-effect p-4 hover-glow cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-32 aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                        {video.thumbnail}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">{video.time}</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Icon name="MoreVertical" size={20} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="servers" className="animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold mb-4">VPN Серверы</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vpnServers.map((server) => (
                  <Card key={server.id} className="glass-effect p-4 hover-glow cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Icon name="Server" size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{server.name}</h3>
                          <p className="text-xs text-muted-foreground">{server.ping} ms</p>
                        </div>
                      </div>
                      <Button size="sm">
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
    </div>
  );
};

export default Index;
