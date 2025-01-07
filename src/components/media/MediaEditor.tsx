import React, { useRef, useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WaveSurfer from "wavesurfer.js";
import { 
  Sun, 
  Contrast, 
  Crop, 
  RotateCcw, 
  Check,
  RefreshCw,
  Sticker,
  AtSign,
  AudioLines,
  StickyNote,
  Brush,
  Palette
} from "lucide-react";

interface MediaEditorProps {
  file: File;
  onSave: (editedFile: File) => void;
  onCancel: () => void;
}

interface Sticker {
  id: string;
  x: number;
  y: number;
  content: string;
}

interface TextNote {
  id: string;
  x: number;
  y: number;
  text: string;
}

export const MediaEditor = ({ file, onSave, onCancel }: MediaEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [notes, setNotes] = useState<TextNote[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [backgroundAudio, setBackgroundAudio] = useState<File | null>(null);
  const [audioVolume, setAudioVolume] = useState(50);
  const [mentionedUsers] = useState(["@user1", "@user2", "@user3"]); // Mock data

  useEffect(() => {
    const setupMedia = async () => {
      const isVideoFile = file.type.startsWith('video/');
      setIsVideo(isVideoFile);

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        if (isVideoFile && videoRef.current) {
          videoRef.current.src = URL.createObjectURL(file);
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current && canvasRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
              applyEffects();
            }
          };
        } else {
          const img = new Image();
          img.onload = () => {
            if (canvasRef.current) {
              canvasRef.current.width = img.width;
              canvasRef.current.height = img.height;
              ctx.drawImage(img, 0, 0);
              applyEffects();
            }
          };
          img.src = URL.createObjectURL(file);
        }
      }

      // Initialize WaveSurfer for audio visualization
      if (isVideo) {
        wavesurferRef.current = WaveSurfer.create({
          container: '#waveform',
          waveColor: '#4F46E5',
          progressColor: '#818CF8',
          cursorColor: '#C7D2FE',
          barWidth: 2,
          barRadius: 3,
          cursorWidth: 1,
          height: 50,
          barGap: 3,
        });
      }
    };

    setupMedia();

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, [file]);

  const applyEffects = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.save();
    ctx.translate(canvasRef.current.width / 2, canvasRef.current.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvasRef.current.width / 2, -canvasRef.current.height / 2);

    if (isVideo && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0);
    } else {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current && ctx) {
          ctx.drawImage(img, 0, 0);
          
          // Apply filters
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
          if (selectedFilter === 'grayscale') {
            ctx.filter += ' grayscale(100%)';
          } else if (selectedFilter === 'sepia') {
            ctx.filter += ' sepia(100%)';
          }
          
          ctx.drawImage(canvasRef.current, 0, 0);

          // Draw stickers and notes
          stickers.forEach(sticker => {
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.fillText(sticker.content, sticker.x, sticker.y);
          });

          notes.forEach(note => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(note.x, note.y, 150, 30);
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.fillText(note.text, note.x + 5, note.y + 20);
          });
        }
      };
      img.src = URL.createObjectURL(file);
    }

    ctx.restore();
  };

  const handleAddSticker = () => {
    const newSticker: Sticker = {
      id: Date.now().toString(),
      x: Math.random() * (canvasRef.current?.width || 300),
      y: Math.random() * (canvasRef.current?.height || 300),
      content: '😊' // Default sticker
    };
    setStickers([...stickers, newSticker]);
    applyEffects();
  };

  const handleAddNote = () => {
    const newNote: TextNote = {
      id: Date.now().toString(),
      x: Math.random() * (canvasRef.current?.width || 300),
      y: Math.random() * (canvasRef.current?.height || 300),
      text: 'Double click to edit'
    };
    setNotes([...notes, newNote]);
    applyEffects();
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBackgroundAudio(file);
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(file);
        audioRef.current.volume = audioVolume / 100;
      }
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-contain"
        />
        {isVideo && (
          <video
            ref={videoRef}
            className="hidden"
            loop
            muted
            playsInline
          />
        )}
      </div>

      <Tabs defaultValue="adjust" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="adjust">Adjust</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="stickers">Stickers</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
        </TabsList>

        <TabsContent value="adjust" className="space-y-4">
          <div className="flex items-center gap-4">
            <Sun className="h-4 w-4" />
            <Slider
              value={[brightness]}
              onValueChange={(value) => {
                setBrightness(value[0]);
                applyEffects();
              }}
              min={0}
              max={200}
              step={1}
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-4">
            <Contrast className="h-4 w-4" />
            <Slider
              value={[contrast]}
              onValueChange={(value) => {
                setContrast(value[0]);
                applyEffects();
              }}
              min={0}
              max={200}
              step={1}
              className="flex-1"
            />
          </div>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFilter('none');
                applyEffects();
              }}
            >
              <Palette className="h-4 w-4 mr-2" /> Normal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFilter('grayscale');
                applyEffects();
              }}
            >
              <Brush className="h-4 w-4 mr-2" /> Grayscale
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFilter('sepia');
                applyEffects();
              }}
            >
              <Brush className="h-4 w-4 mr-2" /> Sepia
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="stickers" className="space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddSticker}>
              <Sticker className="h-4 w-4 mr-2" /> Add Sticker
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddNote}>
              <StickyNote className="h-4 w-4 mr-2" /> Add Note
            </Button>
          </div>
          <div className="flex gap-2">
            {mentionedUsers.map(user => (
              <Button
                key={user}
                variant="outline"
                size="sm"
                onClick={() => {
                  const newNote: TextNote = {
                    id: Date.now().toString(),
                    x: Math.random() * (canvasRef.current?.width || 300),
                    y: Math.random() * (canvasRef.current?.height || 300),
                    text: user
                  };
                  setNotes([...notes, newNote]);
                  applyEffects();
                }}
              >
                <AtSign className="h-4 w-4 mr-2" /> {user}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audio" className="space-y-4">
          <div className="flex flex-col gap-4">
            <Input
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="w-full"
            />
            {backgroundAudio && (
              <>
                <div id="waveform" className="w-full" />
                <div className="flex items-center gap-4">
                  <AudioLines className="h-4 w-4" />
                  <Slider
                    value={[audioVolume]}
                    onValueChange={(value) => {
                      setAudioVolume(value[0]);
                      if (audioRef.current) {
                        audioRef.current.volume = value[0] / 100;
                      }
                    }}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                </div>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setRotation((prev) => (prev + 90) % 360)}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setBrightness(100);
            setContrast(100);
            setRotation(0);
            setSelectedFilter('none');
            setStickers([]);
            setNotes([]);
            setBackgroundAudio(null);
            applyEffects();
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <audio ref={audioRef} className="hidden" />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => {
          if (!canvasRef.current) return;
          canvasRef.current.toBlob((blob) => {
            if (blob) {
              const editedFile = new File([blob], file.name, { type: file.type });
              onSave(editedFile);
            }
          }, file.type);
        }}>
          <Check className="mr-2 h-4 w-4" /> Save
        </Button>
      </div>
    </div>
  );
};