export interface Status {
  id: number;
  type: 'photo' | 'video';
  url: string;
  timestamp: Date;
  postType?: 'timeCapsule' | 'feature' | 'reel';
  caption?: string;
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