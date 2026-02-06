// lib/youtube.ts
// YouTube API Utilities untuk Audio Player

/**
 * Extract YouTube video ID dari berbagai format URL
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Jika sudah berupa ID langsung (11 karakter)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  return null;
}

/**
 * Generate YouTube embed URL untuk audio-only player
 */
export function getYouTubeEmbedUrl(videoId: string, options?: {
  autoplay?: boolean;
  loop?: boolean;
  startTime?: number;
  mute?: boolean;
}): string {
  const params = new URLSearchParams({
    enablejsapi: '1', // Enable YouTube IFrame API
    origin: typeof window !== 'undefined' ? window.location.origin : '',
    controls: '1',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
  });
  
  if (options?.autoplay) {
    params.set('autoplay', '1');
  }
  
  if (options?.loop) {
    params.set('loop', '1');
    params.set('playlist', videoId); // Required for loop
  }
  
  if (options?.startTime) {
    params.set('start', options.startTime.toString());
  }
  
  if (options?.mute) {
    params.set('mute', '1');
  }
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Generate YouTube thumbnail URL
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault',
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Validate YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

/**
 * YouTube IFrame API Types
 */
export interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getVolume(): number;
  getDuration(): number;
  getCurrentTime(): number;
  getPlayerState(): number;
  destroy(): void;
}

export enum YouTubePlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

/**
 * Load YouTube IFrame API script
 */
export function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    // Check if already loaded
    if (typeof window !== 'undefined' && (window as any).YT) {
      resolve();
      return;
    }
    
    // Load script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    
    // Setup callback
    (window as any).onYouTubeIframeAPIReady = () => {
      resolve();
    };
    
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  });
}
