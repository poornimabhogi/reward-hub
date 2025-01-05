import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const ViewDetailsDropdown = ({ userProfile }: { userProfile: UserProfile }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <Eye className="h-4 w-4" /> View Details
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[300px]">
        <DropdownMenuItem className="flex flex-col items-start gap-1">
          <span className="font-medium text-sm">Name</span>
          <span className="text-muted-foreground">{userProfile.name}</span>
        </DropdownMenuItem>
        {userProfile.email && (
          <DropdownMenuItem className="flex flex-col items-start gap-1">
            <span className="font-medium text-sm">Email</span>
            <span className="text-muted-foreground">{userProfile.email}</span>
          </DropdownMenuItem>
        )}
        {userProfile.phone && (
          <DropdownMenuItem className="flex flex-col items-start gap-1">
            <span className="font-medium text-sm">Phone</span>
            <span className="text-muted-foreground">{userProfile.phone}</span>
          </DropdownMenuItem>
        )}
        {userProfile.address && (
          <DropdownMenuItem className="flex flex-col items-start gap-1">
            <span className="font-medium text-sm">Address</span>
            <span className="text-muted-foreground">{userProfile.address}</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};