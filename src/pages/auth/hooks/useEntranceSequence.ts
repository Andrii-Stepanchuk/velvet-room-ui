import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { VideoPlayer } from 'expo-video';
import {
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { CAMERA_EASING, DOOR_EASING, TIMING_MS } from '../config/entranceTiming';
import { ENTRANCE_VIDEO_FROZEN_TAIL_S, ENTRANCE_VIDEO_SOURCE } from '../config/entranceVideo';

export type EntrancePhase = 'gate' | 'opening' | 'flash' | 'clip' | 'outro' | 'done';

export interface EntranceAnim {
  doorProgress: SharedValue<number>;
  cameraScale: SharedValue<number>;
  glowOpacity: SharedValue<number>;
  doorOpacity: SharedValue<number>;
  formOpacity: SharedValue<number>;
  formTranslate: SharedValue<number>;
  flashOpacity: SharedValue<number>;
  videoOpacity: SharedValue<number>;
  welcomeOpacity: SharedValue<number>;
}

export interface EntranceSequence {
  phase: EntrancePhase;
  name: string;
  showSkip: boolean;
  begin: (name: string) => void;
  skip: () => void;
  onFirstFrameRender: () => void;
  anim: EntranceAnim;
}

const CLIP_ENABLED = ENTRANCE_VIDEO_SOURCE != null;

export function useEntranceSequence(player: VideoPlayer): EntranceSequence {
  const [phase, setPhase] = useState<EntrancePhase>('gate');
  const [name, setName] = useState('');
  const reducedMotion = useReducedMotion();

  const phaseRef = useRef<EntrancePhase>('gate');
  const enterPhase = useCallback((p: EntrancePhase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);
  const firstFrameRenderedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const clipFailedRef = useRef(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const doorProgress = useSharedValue(0);
  const cameraScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const doorOpacity = useSharedValue(1);
  const formOpacity = useSharedValue(1);
  const formTranslate = useSharedValue(0);
  const flashOpacity = useSharedValue(0);
  const videoOpacity = useSharedValue(0);
  const welcomeOpacity = useSharedValue(0);
  const anim = useMemo<EntranceAnim>(
    () => ({
      doorProgress,
      cameraScale,
      glowOpacity,
      doorOpacity,
      formOpacity,
      formTranslate,
      flashOpacity,
      videoOpacity,
      welcomeOpacity,
    }),
    [
      doorProgress,
      cameraScale,
      glowOpacity,
      doorOpacity,
      formOpacity,
      formTranslate,
      flashOpacity,
      videoOpacity,
      welcomeOpacity,
    ],
  );

  const revealWelcome = useCallback(() => {
    clearTimers();
    player.pause();
    enterPhase('done');
    flashOpacity.value = withTiming(0, { duration: TIMING_MS.welcomeFade });
    welcomeOpacity.value = withTiming(1, { duration: TIMING_MS.welcomeFade });
  }, [clearTimers, flashOpacity, player, enterPhase, welcomeOpacity]);

  const startOutro = useCallback(
    (duration: number) => {
      const p = phaseRef.current;
      if (p === 'gate' || p === 'outro' || p === 'done') return;
      clearTimers();
      enterPhase('outro');
      flashOpacity.value = withTiming(1, { duration }, (finished) => {
        if (!finished) return;
        videoOpacity.value = 0;
        doorOpacity.value = 0;
        scheduleOnRN(revealWelcome);
      });
    },
    [clearTimers, doorOpacity, flashOpacity, revealWelcome, enterPhase, videoOpacity],
  );

  const revealClipOnceVisible = useCallback(() => {
    const clipVisible = isPlayingRef.current && firstFrameRenderedRef.current;
    if (phaseRef.current !== 'flash' || !clipVisible) return;
    enterPhase('clip');
    flashOpacity.value = withDelay(TIMING_MS.flashPeakHold, withTiming(0, { duration: TIMING_MS.flashOut }));
  }, [flashOpacity, enterPhase]);

  const onFlashPeak = useCallback(() => {
    if (phaseRef.current !== 'opening') return;
    enterPhase('flash');
    if (!CLIP_ENABLED || clipFailedRef.current) {
      after(TIMING_MS.noClipHold, () => startOutro(TIMING_MS.outroFlashIn));
      return;
    }
    player.play();
    after(TIMING_MS.clipStartTimeout, () => {
      if (phaseRef.current === 'flash') startOutro(TIMING_MS.outroFlashIn);
    });
    after(TIMING_MS.clipMaxRuntime, () => startOutro(TIMING_MS.outroFlashIn));
  }, [after, player, enterPhase, startOutro]);

  const onFirstFrameRender = useCallback(() => {
    firstFrameRenderedRef.current = true;
    revealClipOnceVisible();
  }, [revealClipOnceVisible]);

  useEffect(() => {
    const subs = [
      player.addListener('playingChange', ({ isPlaying }) => {
        isPlayingRef.current = isPlaying;
        if (isPlaying) revealClipOnceVisible();
      }),
      player.addListener('timeUpdate', ({ currentTime }) => {
        if (phaseRef.current !== 'clip' || !(player.duration > 0)) return;
        const outroAt = player.duration - ENTRANCE_VIDEO_FROZEN_TAIL_S - TIMING_MS.outroLeadBeforeClipEnd / 1000;
        if (currentTime >= outroAt) startOutro(TIMING_MS.outroFlashIn);
      }),
      player.addListener('playToEnd', () => startOutro(TIMING_MS.outroFlashIn)),
      player.addListener('statusChange', ({ status }) => {
        if (status !== 'error') return;
        clipFailedRef.current = true;
        startOutro(TIMING_MS.outroFlashIn);
      }),
    ];
    return () => subs.forEach((s) => s.remove());
  }, [player, revealClipOnceVisible, startOutro]);

  const begin = useCallback(
    (playerName: string) => {
      const trimmed = playerName.trim();
      if (phaseRef.current !== 'gate' || trimmed.length === 0) return;
      setName(trimmed);
      formOpacity.value = withTiming(0, { duration: TIMING_MS.formFade });
      formTranslate.value = withTiming(26, { duration: TIMING_MS.formFade });

      if (reducedMotion) {
        enterPhase('done');
        doorOpacity.value = withTiming(0, { duration: TIMING_MS.formFade });
        welcomeOpacity.value = withTiming(1, { duration: TIMING_MS.welcomeFade });
        return;
      }

      enterPhase('opening');
      doorProgress.value = withTiming(1, { duration: TIMING_MS.doorOpen, easing: DOOR_EASING });
      cameraScale.value = withTiming(7, { duration: TIMING_MS.camera, easing: CAMERA_EASING });
      glowOpacity.value = withTiming(1, { duration: TIMING_MS.glow });
      flashOpacity.value = withDelay(
        TIMING_MS.doorOpen,
        withTiming(1, { duration: TIMING_MS.flashIn }, (finished) => {
          if (!finished) return;
          videoOpacity.value = 1;
          doorOpacity.value = 0;
          scheduleOnRN(onFlashPeak);
        }),
      );
    },
    [
      cameraScale,
      doorOpacity,
      doorProgress,
      flashOpacity,
      formOpacity,
      formTranslate,
      glowOpacity,
      onFlashPeak,
      reducedMotion,
      enterPhase,
      videoOpacity,
      welcomeOpacity,
    ],
  );

  const skip = useCallback(() => startOutro(TIMING_MS.skipFlashIn), [startOutro]);

  useEffect(() => clearTimers, [clearTimers]);

  const showSkip = phase === 'opening' || phase === 'flash' || phase === 'clip';

  return { phase, name, showSkip, begin, skip, onFirstFrameRender, anim };
}
