import { UserProfileProps } from "./userProfile";

export interface ProfileUpdateModalProps {
  profile: UserProfileProps;
  onClose: () => void;
  onProfileUpdate: (updated: UserProfileProps) => void;
}