import React, { useState, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WaveSurfer from "wavesurfer.js";
import { 
  Sun, 
  Contrast, 
  RotateCcw, 
  Check,
  RefreshCw,
  Sticker,
  AtSign,
  AudioLines,
  StickyNote
} from "lucide-react";
import { ImageEditor } from "./editors/ImageEditor";
import { VideoEditor } from "./editors/VideoEditor";
import { FilterControls } from "./controls/FilterControls";

interface MediaEditorProps {
  file: File;
  onSave: (editedFile: File) => void;
  onCancel: () => void;
}

export const MediaEditor = ({ file, onSave, onCancel }: MediaEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [stickers, setStickers] = useState<Array<{ id: string; x: number; y: number; content: string }>>([]);
  const [notes, setNotes] = useState<Array<{ id: string; x: number; y: number; text: string }>>([]);
  const [backgroundAudio, setBackgroundAudio] = useState<File | null>(null);
  const [audioVolume, setAudioVolume] = useState(50);
  const [mentionedUsers] = useState(["@user1", "@user2", "@user3"]); // Mock data

  const isVideo = file.type.startsWith('video/');

  const handleAddSticker = () => {
    const newSticker = {
      id: Date.now().toString(),
      x: Math.random() * (canvasRef.current?.width || 300),
      y: Math.random() * (canvasRef.current?.height || 300),
      content: '😊'
    };
    setStickers([...stickers, newSticker]);
  };

  const handleAddNote = () => {
    const newNote = {
      id: Date.now().toString(),
      x: Math.random() * (canvasRef.current?.width || 300),
      y: Math.random() * (canvasRef.current?.height || 300),
      text: 'Double click to edit'
    };
    setNotes([...notes, newNote]);
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

  const handleSave = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const editedFile = new File([blob], file.name, { type: file.type });
        onSave(editedFile);
      }
    }, file.type);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        {isVideo ? (
          <VideoEditor
            file={file}
            brightness={brightness}
            contrast={contrast}
            rotation={rotation}
            selectedFilter={selectedFilter}
            audioVolume={audioVolume}
          />
        ) : (
          <ImageEditor
            file={file}
            brightness={brightness}
            contrast={contrast}
            rotation={rotation}
            selectedFilter={selectedFilter}
            stickers={stickers}
            notes={notes}
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
              onValueChange={(value) => setBrightness(value[0])}
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
              onValueChange={(value) => setContrast(value[0])}
              min={0}
              max={200}
              step={1}
              className="flex-1"
            />
          </div>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4">
          <FilterControls
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
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
                  const newNote = {
                    id: Date.now().toString(),
                    x: Math.random() * (canvasRef.current?.width || 300),
                    y: Math.random() * (canvasRef.current?.height || 300),
                    text: user
                  };
                  setNotes([...notes, newNote]);
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
        <Button onClick={handleSave}>
          <Check className="mr-2 h-4 w-4" /> Save
        </Button>
      </div>
    </div>
  );
};