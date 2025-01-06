export interface TimeCapsule {
  id: number;
  username: string;
  type: 'photo' | 'video';
  url: string;
  timestamp: string;
  postType: 'timeCapsule' | 'feature' | 'reel';
}

const STORAGE_KEY = 'timeCapsules';

export const addTimeCapsule = (capsule: TimeCapsule) => {
  const existingCapsules = getTimeCapsules();
  const updatedCapsules = [capsule, ...existingCapsules];
  
  // Store in localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCapsules));
  
  // Dispatch event with the new capsule
  const event = new CustomEvent('newTimeCapsule', { 
    detail: capsule
  });
  window.dispatchEvent(event);
  console.log('Time capsule added and event dispatched:', capsule);
};

export const getTimeCapsules = (): TimeCapsule[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};