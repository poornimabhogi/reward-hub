import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MediaUploadButtonProps {
  onSelectPostType: (postType: 'timeCapsule' | 'feature' | 'reel') => void;
}

export const MediaUploadButton = ({ onSelectPostType }: MediaUploadButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Plus className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSelectPostType('timeCapsule')}>
          Today's Time Capsule
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelectPostType('feature')}>
          Feature Post
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelectPostType('reel')}>
          Reel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};