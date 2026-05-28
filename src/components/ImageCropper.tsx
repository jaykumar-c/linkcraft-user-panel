import { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { CropIcon, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    image.src = url;
  });
}

function getCroppedImg(imageSrc: string, crop: Area): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const maxSize = 512;
    const scale = Math.min(maxSize / crop.width, maxSize / crop.height, 1);
    canvas.width = Math.round(crop.width * scale);
    canvas.height = Math.round(crop.height * scale);

    ctx.drawImage(
      image,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, canvas.width, canvas.height,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas to blob failed'));
          return;
        }
        resolve(blob);
      },
      'image/jpeg',
      0.9,
    );
  });
}

interface ImageCropperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  onCropComplete: (blob: Blob) => Promise<void>;
}

export function ImageCropperDialog({ open, onOpenChange, imageSrc, onCropComplete }: ImageCropperDialogProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onCropAreaChange = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedArea) return;
    setIsSaving(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedArea);
      await onCropComplete(blob);
      onOpenChange(false);
    } catch (error) {
      console.error('Crop failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CropIcon className="h-5 w-5" />
            Crop Profile Photo
          </DialogTitle>
          <DialogDescription>
            Adjust the crop area and zoom to frame your photo
          </DialogDescription>
        </DialogHeader>

        <div className="relative w-full h-72 bg-black/5 rounded-xl overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaChange}
          />
        </div>

        <div className="flex items-center gap-3 px-1">
          <ZoomOut className="h-4 w-4 text-muted-foreground shrink-0" />
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={([v]) => setZoom(v)}
            className="flex-1"
          />
          <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Photo'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
