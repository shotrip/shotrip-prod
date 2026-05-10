import { UserProfileProps } from "./userProfile";

export interface UserMenuProps {
  profile: UserProfileProps | null;
  onProfileUpdate: (updated: UserProfileProps) => void;
}