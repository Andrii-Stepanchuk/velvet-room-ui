import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { VideoPlayer } from 'expo-video';
import {
  Easing,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { CAMERA_EASING, CEREMONY_MS, DEAL_EASING, DOOR_EASING, SEAL_EASING, TIMING_MS } from '../config/entranceTiming';
import { ENTRANCE_VIDEO_FROZEN_TAIL_S, ENTRANCE_VIDEO_SOURCE } from '../config/entranceVideo';

export type EntrancePhase =
  'gate' | 'opening' | 'flash' | 'clip' | 'outro' | 'contract' | 'arcana' | 'leaving' | 'done';

export interface EntranceAnim {
  doorProgress: SharedValue<number>;
  cameraScale: SharedValue<number>;
  glowOpacity: SharedValue<number>;
  doorOpacity: SharedValue<number>;
  formOpacity: SharedValue<number>;
  formTranslate: SharedValue<number>;
  flashOpacity: SharedValue<number>;
  videoOpacity: SharedValue<number>;
  ceremonyOpacity: SharedValue<number>;
  contractIn: SharedValue<number>;
  writeProgress: SharedValue<number>;
  sealProgress: SharedValue<number>;
  contractLift: SharedValue<number>;
  cardProgress: SharedValue<number>;
  ceremonyExit: SharedValue<number>;
}

export interface EntranceSequence {
  phase: EntrancePhase;
  name: string;
  showSkip: boolean;
  awaitingTap: boolean;
  canAdvance: boolean;
  begin: (name: string) => void;
  skip: () => void;
  advance: () => void;
  onFirstFrameRender: () => void;
  anim: EntranceAnim;
}

export interface EntranceCallbacks {
  onBegin: (name: string) => void;
  onComplete: () => void;
}

const CLIP_ENABLED = ENTRANCE_VIDEO_SOURCE != null;
const CLIP_PHASES: readonly EntrancePhase[] = ['opening', 'flash', 'clip'];
const CEREMONY_PHASES: readonly EntrancePhase[] = ['contract', 'arcana'];

function writeDuration(name: string): number {
  const { writePerLetter, writeMin, writeMax } = CEREMONY_MS;
  return Math.min(Math.max(name.length * writePerLetter, writeMin), writeMax);
}

export function useEntranceSequence(player: VideoPlayer, { onBegin, onComplete }: EntranceCallbacks): EntranceSequence {
  const [phase, setPhase] = useState<EntrancePhase>('gate');
  const [name, setName] = useState('');
  const [awaitingTap, setAwaitingTap] = useState(false);
  const reducedMotion = useReducedMotion();

  const phaseRef = useRef<EntrancePhase>('gate');
  const enterPhase = useCallback((p: EntrancePhase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);
  const nameRef = useRef('');
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
  const ceremonyOpacity = useSharedValue(0);
  const contractIn = useSharedValue(0);
  const writeProgress = useSharedValue(0);
  const sealProgress = useSharedValue(0);
  const contractLift = useSharedValue(0);
  const cardProgress = useSharedValue(0);
  const ceremonyExit = useSharedValue(0);
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
      ceremonyOpacity,
      contractIn,
      writeProgress,
      sealProgress,
      contractLift,
      cardProgress,
      ceremonyExit,
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
      ceremonyOpacity,
      contractIn,
      writeProgress,
      sealProgress,
      contractLift,
      cardProgress,
      ceremonyExit,
    ],
  );

  const finish = useCallback(() => {
    clearTimers();
    enterPhase('done');
    onComplete();
  }, [clearTimers, enterPhase, onComplete]);

  const awaitTap = useCallback(
    (ms: number) => {
      after(ms, () => setAwaitingTap(true));
    },
    [after],
  );

  const settleContract = useCallback(() => {
    clearTimers();
    flashOpacity.value = withTiming(0, { duration: CEREMONY_MS.settle });
    contractIn.value = withTiming(1, { duration: CEREMONY_MS.settle });
    writeProgress.value = withTiming(1, { duration: CEREMONY_MS.settle });
    sealProgress.value = withTiming(1, { duration: CEREMONY_MS.settle, easing: SEAL_EASING });
    awaitTap(CEREMONY_MS.settle);
  }, [awaitTap, clearTimers, contractIn, flashOpacity, sealProgress, writeProgress]);

  const settleArcana = useCallback(() => {
    clearTimers();
    contractLift.value = withTiming(1, { duration: CEREMONY_MS.settle });
    cardProgress.value = withTiming(1, { duration: CEREMONY_MS.settle });
    awaitTap(CEREMONY_MS.settle);
  }, [awaitTap, cardProgress, clearTimers, contractLift]);

  const dealArcana = useCallback(() => {
    clearTimers();
    setAwaitingTap(false);
    enterPhase('arcana');
    if (reducedMotion) {
      contractLift.value = 1;
      cardProgress.value = 1;
      awaitTap(CEREMONY_MS.promptDelay);
      return;
    }
    contractLift.value = withTiming(1, { duration: CEREMONY_MS.deal, easing: DEAL_EASING });
    cardProgress.value = withTiming(1, { duration: CEREMONY_MS.deal, easing: DEAL_EASING });
    awaitTap(CEREMONY_MS.deal + CEREMONY_MS.promptDelay);
  }, [awaitTap, cardProgress, clearTimers, contractLift, enterPhase, reducedMotion]);

  const leave = useCallback(() => {
    clearTimers();
    setAwaitingTap(false);
    enterPhase('leaving');
    if (reducedMotion) {
      finish();
      return;
    }
    ceremonyExit.value = withTiming(1, { duration: CEREMONY_MS.exit, easing: Easing.in(Easing.cubic) });
    after(CEREMONY_MS.exit, finish);
  }, [after, ceremonyExit, clearTimers, enterPhase, finish, reducedMotion]);

  const advance = useCallback(() => {
    const p = phaseRef.current;
    if (p === 'contract') {
      if (awaitingTap) dealArcana();
      else settleContract();
    } else if (p === 'arcana') {
      if (awaitingTap) leave();
      else settleArcana();
    }
  }, [awaitingTap, dealArcana, leave, settleArcana, settleContract]);

  const beginCeremony = useCallback(() => {
    clearTimers();
    player.pause();
    enterPhase('contract');
    const { plateIn, writeLead, seal, promptDelay } = CEREMONY_MS;
    const write = writeDuration(nameRef.current);
    flashOpacity.value = withTiming(0, { duration: TIMING_MS.ceremonyFlashOut });
    ceremonyOpacity.value = 1;
    contractIn.value = withTiming(1, { duration: plateIn, easing: Easing.out(Easing.cubic) });
    writeProgress.value = withDelay(writeLead, withTiming(1, { duration: write, easing: Easing.linear }));
    sealProgress.value = withDelay(writeLead + write, withTiming(1, { duration: seal, easing: SEAL_EASING }));
    awaitTap(writeLead + write + seal + promptDelay);
  }, [
    awaitTap,
    ceremonyOpacity,
    clearTimers,
    contractIn,
    enterPhase,
    flashOpacity,
    player,
    sealProgress,
    writeProgress,
  ]);

  const startOutro = useCallback(
    (duration: number) => {
      if (!CLIP_PHASES.includes(phaseRef.current)) return;
      clearTimers();
      enterPhase('outro');
      flashOpacity.value = withTiming(1, { duration }, (finished) => {
        if (!finished) return;
        videoOpacity.value = 0;
        doorOpacity.value = 0;
        scheduleOnRN(beginCeremony);
      });
    },
    [beginCeremony, clearTimers, doorOpacity, enterPhase, flashOpacity, videoOpacity],
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
      onBegin(trimmed);
      nameRef.current = trimmed;
      setName(trimmed);
      formOpacity.value = withTiming(0, { duration: TIMING_MS.formFade });
      formTranslate.value = withTiming(26, { duration: TIMING_MS.formFade });

      if (reducedMotion) {
        enterPhase('contract');
        contractIn.value = 1;
        writeProgress.value = 1;
        sealProgress.value = 1;
        doorOpacity.value = withTiming(0, { duration: TIMING_MS.formFade });
        ceremonyOpacity.value = withTiming(1, { duration: CEREMONY_MS.reducedFade });
        awaitTap(CEREMONY_MS.reducedFade);
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
      after,
      cameraScale,
      cardProgress,
      ceremonyOpacity,
      contractIn,
      contractLift,
      doorOpacity,
      doorProgress,
      finish,
      flashOpacity,
      formOpacity,
      formTranslate,
      glowOpacity,
      onBegin,
      onFlashPeak,
      reducedMotion,
      enterPhase,
      sealProgress,
      videoOpacity,
      writeProgress,
    ],
  );

  const skip = useCallback(() => startOutro(TIMING_MS.skipFlashIn), [startOutro]);

  useEffect(() => clearTimers, [clearTimers]);

  const showSkip = CLIP_PHASES.includes(phase);
  const canAdvance = CEREMONY_PHASES.includes(phase);

  return { phase, name, showSkip, awaitingTap, canAdvance, begin, skip, advance, onFirstFrameRender, anim };
}
