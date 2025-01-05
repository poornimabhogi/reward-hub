export interface Status {
  id: number;
  type: 'photo' | 'video';
  url: string;
  timestamp: Date;
  isTimeCapsule?: boolean;
}

export interface FollowedUser {
  username: string;
  isFollowing: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  coins: number;
}