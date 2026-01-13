import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoPlayer from '@/components/VideoPlayer';

const Index = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const mockVideos = [
    { id: '1', title: 'Как приготовить борщ', channel: 'Кулинарный канал', duration: 900, views: 120000, thumbnail: '🍲', vkId: '-12345_67890' },
    { id: '2', title: 'Путешествие по России', channel: 'Travel Vlog', duration: 1200, views: 89000, thumbnail: '🏔️', vkId: '-12345_67891' },
    { id: '3', title: 'Обзор нового смартфона', channel: 'Tech Review', duration: 780, views: 210000, thumbnail: '📱', vkId: '-12345_67892' },
    { id: '4', title: 'Уроки фотографии', channel: 'Photo School', duration: 1500, views: 65000, thumbnail: '📷', vkId: '-12345_67893' },
  ];

  const mockHistory = [
    { id: '1', title: 'Вечерний стрим', time: '2 часа назад', thumbnail: '💡', vkId: '-12345_67894' },
    { id: '2', title: 'Музыкальный клип', time: '5 часов назад', thumbnail: '🎬', vkId: '-12345_67895' },
    { id: '3', title: 'Интервью с блогером', time: 'Вчера', thumbnail: '🏗️', vkId: '-12345_67896' },
  ];



  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
    return views.toString();
  };

  const handleVideoClick = (vkId: string) => {
    setSelectedVideo(vkId);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError('');

    try {
      const response = await fetch(
        `https://functions.poehali.dev/9ef639c7-ab7e-4e6a-969b-70fa95d3fec4?q=${encodeURIComponent(searchQuery)}&count=20`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setSearchResults(data.videos || []);
    } catch (error: any) {
      setSearchError(error.message || 'Ошибка поиска');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim() && activeTab === 'search') {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 touch-manipulation">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <header className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">VK Видео</h1>
            <Button variant="ghost" size="icon" className="hover-glow h-8 w-8 sm:h-10 sm:w-10">
              <Icon name="Settings" size={18} />
            </Button>
          </div>
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
          </TabsList>

          <TabsContent value="home" className="space-y-4 sm:space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Рекомендуемые видео</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {mockVideos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="glass-effect overflow-hidden hover-glow cursor-pointer group active:scale-95 transition-transform"
                    onClick={() => handleVideoClick(video.vkId)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl sm:text-6xl group-hover:scale-105 transition-transform">
                      {video.thumbnail}
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold mb-1 line-clamp-2 text-sm sm:text-base">{video.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{video.channel}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatViews(video.views)}</span>
                        <span>{formatDuration(video.duration)}</span>
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
                  placeholder="Поиск видео ВКонтакте..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 sm:h-12 glass-effect text-sm sm:text-base"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon name="Loader2" size={18} className="animate-spin text-primary" />
                  </div>
                )}
              </div>

              {searchError && (
                <Card className="glass-effect p-4 border-destructive">
                  <p className="text-sm text-destructive">{searchError}</p>
                </Card>
              )}

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {searchResults.map((video) => (
                    <Card 
                      key={video.id} 
                      className="glass-effect overflow-hidden hover-glow cursor-pointer group active:scale-95 transition-transform"
                      onClick={() => handleVideoClick(video.id)}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        {video.thumbnail ? (
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-4xl">
                            🎬
                          </div>
                        )}
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold mb-1 line-clamp-2 text-sm sm:text-base">{video.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{video.channel}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : !isSearching && searchQuery.trim() === '' ? (
                <Card className="glass-effect p-6 sm:p-8 text-center">
                  <Icon name="Search" size={40} className="mx-auto mb-4 text-muted-foreground sm:w-12 sm:h-12" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Начните поиск</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Введите запрос для поиска видео ВКонтакте</p>
                </Card>
              ) : null}
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
                    onClick={() => handleVideoClick(video.vkId)}
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