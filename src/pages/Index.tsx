import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  id: number;
  url: string;
  title: string;
}

const Index = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: 1,
      url: "https://cdn.poehali.dev/projects/0f47e069-ef9e-4d86-be95-8d460956e300/files/66ec1048-a94a-4cff-b88b-ff4f95832f22.jpg",
      title: "Горный закат"
    },
    {
      id: 2,
      url: "https://cdn.poehali.dev/projects/0f47e069-ef9e-4d86-be95-8d460956e300/files/679bb280-eb77-426b-a905-0de063e0946e.jpg",
      title: "Абстракция"
    },
    {
      id: 3,
      url: "https://cdn.poehali.dev/projects/0f47e069-ef9e-4d86-be95-8d460956e300/files/a4447602-3b45-418f-a979-60750f4ffd5c.jpg",
      title: "Архитектура"
    },
    {
      id: 4,
      url: "https://cdn.poehali.dev/projects/0f47e069-ef9e-4d86-be95-8d460956e300/files/66ec1048-a94a-4cff-b88b-ff4f95832f22.jpg",
      title: "Природа"
    },
    {
      id: 5,
      url: "https://cdn.poehali.dev/projects/0f47e069-ef9e-4d86-be95-8d460956e300/files/679bb280-eb77-426b-a905-0de063e0946e.jpg",
      title: "Геометрия"
    },
    {
      id: 6,
      url: "https://cdn.poehali.dev/projects/0f47e069-ef9e-4d86-be95-8d460956e300/files/a4447602-3b45-418f-a979-60750f4ffd5c.jpg",
      title: "Город"
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPhotos: Photo[] = [];
    let filesProcessed = 0;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Ошибка",
          description: `Файл ${file.name} не является изображением`,
          variant: "destructive"
        });
        filesProcessed++;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const newPhoto: Photo = {
          id: Date.now() + filesProcessed,
          url,
          title: file.name.replace(/\.[^/.]+$/, "")
        };
        newPhotos.push(newPhoto);
        filesProcessed++;

        if (filesProcessed === files.length) {
          setPhotos(prev => [...newPhotos, ...prev]);
          toast({
            title: "Успешно!",
            description: `Загружено фото: ${newPhotos.length}`
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-in">
              Фотогалерея
            </h1>
            <div className="flex gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <button 
                onClick={handleUploadClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-white hover:opacity-90 transition-all hover-scale font-medium"
              >
                <Icon name="Upload" size={20} />
                <span className="hidden sm:inline">Загрузить</span>
              </button>
              <button className="p-2 rounded-lg bg-card hover:bg-card/80 transition-all hover-scale">
                <Icon name="Settings" size={24} className="text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 gradient-primary rounded-full"></div>
            <h2 className="text-3xl font-bold text-foreground">Альбомы</h2>
          </div>
          <p className="text-muted-foreground">Коллекция моих лучших фотографий • {photos.length} фото</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-xl bg-card border border-border cursor-pointer hover-scale animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-2">{photo.title}</h3>
                    <div className="flex items-center gap-2 text-white/80">
                      <Icon name="Eye" size={16} />
                      <span className="text-sm">Открыть</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black/95 border-border">
          {selectedPhoto && (
            <div className="relative animate-scale-in">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all hover-scale"
              >
                <Icon name="X" size={24} className="text-white" />
              </button>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-auto max-h-[85vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/50 to-transparent">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedPhoto.title}</h2>
                <div className="flex items-center gap-4 text-white/60">
                  <div className="flex items-center gap-2">
                    <Icon name="Calendar" size={16} />
                    <span className="text-sm">Сегодня</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Image" size={16} />
                    <span className="text-sm">Фото #{selectedPhoto.id}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;