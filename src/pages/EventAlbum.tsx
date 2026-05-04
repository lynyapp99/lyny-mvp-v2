import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Camera, Download, Grid3x3, List, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";

interface Photo {
  id: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  pending?: boolean;
}

const EventAlbum = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Mock photos (viriam da API)
  const [photos] = useState<Photo[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop",
      uploadedBy: "Maria",
      uploadedAt: "2025-08-20T15:30:00",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop",
      uploadedBy: "João",
      uploadedAt: "2025-08-20T16:15:00",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      uploadedBy: "Ana",
      uploadedAt: "2025-08-20T17:00:00",
      pending: true,
    },
  ]);

  const [pendingPhotos] = useState<Photo[]>(
    photos.filter(p => p.pending)
  );

  const handleUpload = () => {
    toast({
      title: "Selecionando fotos...",
      description: "Escolha as melhores lembranças para adicionar",
    });
    // Aqui viria a lógica de upload real
  };

  const handleApprove = (photoId: string) => {
    toast({
      title: "Foto aprovada! ✨",
      description: "A foto foi adicionada ao álbum",
    });
  };

  const handleReject = (photoId: string) => {
    toast({
      title: "Foto removida",
      description: "A foto não será exibida no álbum",
    });
  };

  const handleDownloadAll = () => {
    toast({
      title: "Preparando download...",
      description: "Suas fotos estarão prontas em instantes",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-xl"
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Álbum</h1>
                <p className="text-xs text-muted-foreground">
                  {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'timeline' : 'grid')}
                className="rounded-xl"
              >
                {viewMode === 'grid' ? <List size={20} /> : <Grid3x3 size={20} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownloadAll}
                className="rounded-xl"
              >
                <Download size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Upload Button */}
        <Button 
          onClick={handleUpload}
          className="w-full lyny-button-primary h-14"
        >
          <Camera size={20} className="mr-2" />
          Adicionar Fotos
        </Button>

        {/* Pending Approval Section */}
        {pendingPhotos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Aguardando Aprovação</h3>
              <span className="text-sm text-muted-foreground">
                {pendingPhotos.length} {pendingPhotos.length === 1 ? 'foto' : 'fotos'}
              </span>
            </div>
            
            <div className="space-y-3">
              {pendingPhotos.map((photo) => (
                <div 
                  key={photo.id}
                  className="lyny-card p-3 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={photo.url}
                      alt="Pending"
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">
                        Enviado por {photo.uploadedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(photo.uploadedAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        onClick={() => handleApprove(photo.id)}
                        className="rounded-xl h-9 w-9 bg-primary hover:bg-primary/90"
                      >
                        <Check size={16} />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleReject(photo.id)}
                        className="rounded-xl h-9 w-9"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos Grid/Timeline */}
        <div>
          <h3 className="font-semibold text-foreground mb-4">
            Todas as Fotos
          </h3>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-3">
              {photos.filter(p => !p.pending).map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="aspect-square bg-muted rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src={photo.url}
                    alt={`Por ${photo.uploadedBy}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {photos.filter(p => !p.pending).map((photo) => (
                <div 
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="lyny-card overflow-hidden cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={`Por ${photo.uploadedBy}`}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground">
                      {photo.uploadedBy}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(photo.uploadedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {photos.filter(p => !p.pending).length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Ainda não há fotos
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Que tal adicionar as primeiras lembranças?
            </p>
            <Button 
              onClick={handleUpload}
              className="lyny-button-primary"
            >
              <Upload size={18} className="mr-2" />
              Adicionar Fotos
            </Button>
          </div>
        )}

        {/* Privacy Info */}
        <div className="text-center p-4 bg-muted/30 rounded-2xl">
          <p className="text-sm text-muted-foreground">
            🔒 Somente convidados podem ver e adicionar fotos neste álbum
          </p>
        </div>
      </div>

      <Navigation />

      {/* Photo Detail Modal (simplified) */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-2xl w-full">
            <img
              src={selectedPhoto.url}
              alt={`Por ${selectedPhoto.uploadedBy}`}
              className="w-full rounded-2xl"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-medium">{selectedPhoto.uploadedBy}</p>
              <p className="text-white/70 text-sm">
                {new Date(selectedPhoto.uploadedAt).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventAlbum;
