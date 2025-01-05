import { Button } from "@/components/ui/button";

interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface EditProfileFormProps {
  editableProfile: UserProfile;
  setEditableProfile: (profile: UserProfile) => void;
  onSave: () => void;
}

export const EditProfileForm = ({
  editableProfile,
  setEditableProfile,
  onSave,
}: EditProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <input
          type="text"
          value={editableProfile.name}
          onChange={(e) =>
            setEditableProfile({ ...editableProfile, name: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      </div>
      {editableProfile.email !== undefined && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={editableProfile.email}
            onChange={(e) =>
              setEditableProfile({ ...editableProfile, email: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      )}
      {editableProfile.phone !== undefined && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <input
            type="tel"
            value={editableProfile.phone}
            onChange={(e) =>
              setEditableProfile({ ...editableProfile, phone: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      )}
      {editableProfile.address !== undefined && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Address</label>
          <input
            type="text"
            value={editableProfile.address}
            onChange={(e) =>
              setEditableProfile({ ...editableProfile, address: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      )}
      <Button onClick={onSave} className="w-full">Save Changes</Button>
    </div>
  );
};