import { useVideoPlayer, type VideoPlayer } from 'expo-video';

export function usePreloadedEntrancePlayer(source: number | null): VideoPlayer {
  return useVideoPlayer(source, (p) => {
    p.loop = false;
    p.muted = true;
    p.audioMixingMode = 'mixWithOthers';
    p.timeUpdateEventInterval = 0.05;
  });
}
