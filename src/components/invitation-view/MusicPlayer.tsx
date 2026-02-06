// components/invitation-view/MusicPlayer.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { loadYouTubeAPI, YouTubePlayer, YouTubePlayerState } from '@/lib/youtube';

interface MusicTrack {
  id: string;
  youtubeId: string;
  title: string;
  artist?: string;
  thumbnail?: string;
  isDefault: boolean;
  autoplay: boolean;
  loop: boolean;
  startTime?: number;
}

interface MusicPlayerProps {
  tracks: MusicTrack[];
  autoStart?: boolean;
}

export default function MusicPlayer({ tracks, autoStart = true }: MusicPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(70);
  const [showPlayer, setShowPlayer] = useState(false);
  
  const playerRef = useRef<YouTubePlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentTrack = tracks[currentTrackIndex];
  
  // Load YouTube API
  useEffect(() => {
    let mounted = true;
    
    loadYouTubeAPI().then(() => {
      if (mounted) {
        setIsReady(true);
      }
    });
    
    return () => {
      mounted = false;
    };
  }, []);
  
  // Initialize player ketika API ready
  useEffect(() => {
    if (!isReady || !currentTrack || playerRef.current) return;
    
    const initPlayer = () => {
      const YT = (window as any).YT;
      
      playerRef.current = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: currentTrack.youtubeId,
        playerVars: {
          autoplay: autoStart && currentTrack.autoplay ? 1 : 0,
          loop: currentTrack.loop ? 1 : 0,
          playlist: currentTrack.loop ? currentTrack.youtubeId : undefined,
          start: currentTrack.startTime || 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume);
            
            if (autoStart && currentTrack.autoplay) {
              // Attempt autoplay (may be blocked by browser)
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            const state = event.data;
            
            if (state === YouTubePlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (state === YouTubePlayerState.PAUSED || state === YouTubePlayerState.ENDED) {
              setIsPlaying(false);
            }
            
            // Auto-play next track if ended and not looping
            if (state === YouTubePlayerState.ENDED && !currentTrack.loop) {
              handleNextTrack();
            }
          },
          onError: (event: any) => {
            console.error('YouTube player error:', event.data);
            // Try next track on error
            handleNextTrack();
          },
        },
      });
    };
    
    // Small delay to ensure DOM is ready
    setTimeout(initPlayer, 100);
    
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isReady, currentTrack?.youtubeId]);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (!playerRef.current) return;
    
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };
  
  // Change volume
  const handleVolumeChange = (newVolume: number) => {
    if (!playerRef.current) return;
    
    setVolume(newVolume);
    playerRef.current.setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Next track
  const handleNextTrack = () => {
    if (tracks.length <= 1) return;
    
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    
    // Destroy current player and reinitialize with new track
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
      setIsReady(false);
      
      // Reinitialize
      setTimeout(() => setIsReady(true), 100);
    }
  };
  
  // Previous track
  const handlePrevTrack = () => {
    if (tracks.length <= 1) return;
    
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    
    // Destroy current player and reinitialize with new track
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
      setIsReady(false);
      
      // Reinitialize
      setTimeout(() => setIsReady(true), 100);
    }
  };
  
  if (!currentTrack) return null;
  
  return (
    <>
      {/* Hidden YouTube Player */}
      <div id="youtube-player" className="hidden" />
      
      {/* Floating Music Player */}
      <div className="fixed bottom-6 right-6 z-50">
        {!showPlayer ? (
          // Compact Button
          <button
            onClick={() => setShowPlayer(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Open music player"
          >
            <Music className="w-6 h-6" />
          </button>
        ) : (
          // Full Player
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 w-80 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-sm">Background Music</h3>
              </div>
              <button
                onClick={() => setShowPlayer(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Minimize player"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Track Info */}
            <div className="mb-4">
              {currentTrack.thumbnail && (
                <img
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              )}
              <h4 className="font-medium text-sm truncate">{currentTrack.title}</h4>
              {currentTrack.artist && (
                <p className="text-xs text-gray-500 truncate">{currentTrack.artist}</p>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-3">
              {tracks.length > 1 && (
                <button
                  onClick={handlePrevTrack}
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  aria-label="Previous track"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                  </svg>
                </button>
              )}
              
              <button
                onClick={togglePlay}
                className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </button>
              
              {tracks.length > 1 && (
                <button
                  onClick={handleNextTrack}
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  aria-label="Next track"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-gray-600 hover:text-purple-600 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                aria-label="Volume"
              />
              
              <span className="text-xs text-gray-500 w-8 text-right">
                {volume}%
              </span>
            </div>
            
            {/* Track List (jika ada multiple tracks) */}
            {tracks.length > 1 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 mb-2">Playlist ({tracks.length} songs)</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {tracks.map((track, index) => (
                    <button
                      key={track.id}
                      onClick={() => setCurrentTrackIndex(index)}
                      className={`w-full text-left p-2 rounded-lg text-xs transition-colors ${
                        index === currentTrackIndex
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="truncate font-medium">{track.title}</div>
                      {track.artist && (
                        <div className="truncate text-gray-500">{track.artist}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
