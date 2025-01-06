export interface TimeCapsule {
  id: number;
  username: string;
  type: 'photo' | 'video';
  url: string;
  timestamp: string;
  postType: 'timeCapsule' | 'feature' | 'reel';
}

export const addTimeCapsule = (capsule: TimeCapsule) => {
  const existingCapsules = getTimeCapsules();
  const updatedCapsules = [capsule, ...existingCapsules];
  localStorage.setItem('socialTimeCapsules', JSON.stringify(updatedCapsules));
  
  // Dispatch event with the new capsule
  const event = new CustomEvent('newTimeCapsule', { 
    detail: capsule
  });
  window.dispatchEvent(event);
  console.log('Time capsule added and event dispatched:', capsule);
};

export const getTimeCapsules = (): TimeCapsule[] => {
  const stored = localStorage.getItem('socialTimeCapsules');
  return stored ? JSON.parse(stored) : [];
};