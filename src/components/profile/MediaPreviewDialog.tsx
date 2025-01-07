import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MediaPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFile: File | null;
  onConfirm: () => void;
}

export const MediaPreviewDialog = ({
  isOpen,
  onOpenChange,
  selectedFile,
  onConfirm,
}: MediaPreviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Preview Post</span>
            <Button onClick={onConfirm} size="sm">
              Post
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {selectedFile && (
            <div className="w-full max-h-[70vh] relative overflow-hidden rounded-lg">
              {selectedFile.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={URL.createObjectURL(selectedFile)}
                  className="w-full h-full object-contain"
                  controls
                />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};