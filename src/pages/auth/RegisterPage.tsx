import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BubbleField } from './components/BubbleField/BubbleField';
import { Ceremony } from './components/Ceremony/Ceremony';
import { ContinuePrompt } from './components/Ceremony/ContinuePrompt';
import { EntranceVideo } from './components/EntranceVideo';
import { Flash } from './components/Flash';
import { RegisterForm } from './components/RegisterForm/RegisterForm';
import { SkipButton } from './components/SkipButton';
import { TitleBlock } from './components/TitleBlock';
import { VelvetDoor } from './components/VelvetDoor/VelvetDoor';
import { CLIP_FIRST_FRAME_COLOR, ENTRANCE_VIDEO_SOURCE } from './config/entranceVideo';
import { useEntranceLayerStyles } from './hooks/useEntranceLayerStyles';
import { useEntranceSequence } from './hooks/useEntranceSequence';
import { usePlayerRegistration } from './hooks/usePlayerRegistration';
import { usePreloadedEntrancePlayer } from './hooks/usePreloadedEntrancePlayer';
import { useReplayEntrance } from './hooks/useReplayEntrance';

export function RegisterPage() {
  const insets = useSafeAreaInsets();
  const player = usePreloadedEntrancePlayer(ENTRANCE_VIDEO_SOURCE);
  const { register, enterHome } = usePlayerRegistration();
  const seq = useEntranceSequence(player, { onBegin: register, onComplete: enterHome });
  const { anim, phase } = seq;
  const replay = useReplayEntrance(seq.begin);
  const atGate = phase === 'gate';

  const layer = useEntranceLayerStyles(anim);

  return (
    <View className="flex-1 overflow-hidden">
      {(atGate || phase === 'opening') && (
        <Animated.View pointerEvents={atGate ? 'box-none' : 'none'} style={[StyleSheet.absoluteFill, layer.bubbles]}>
          <BubbleField />
        </Animated.View>
      )}

      <VelvetDoor anim={anim} />

      <Animated.View pointerEvents="none" style={[styles.videoLayer, layer.videoLayer]}>
        {ENTRANCE_VIDEO_SOURCE != null && (
          <EntranceVideo player={player} onFirstFrameRender={seq.onFirstFrameRender} />
        )}
      </Animated.View>

      <Flash opacity={anim.flashOpacity} />

      {!replay && (
        <Animated.View pointerEvents="none" style={[styles.top, { top: insets.top + 34 }, layer.form]}>
          <TitleBlock />
        </Animated.View>
      )}

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, layer.ceremony]}>
        {seq.name.length > 0 && <Ceremony name={seq.name} anim={anim} />}
      </Animated.View>

      {!replay && (
        <Animated.View
          pointerEvents={atGate ? 'auto' : 'none'}
          style={[styles.bottom, { paddingBottom: insets.bottom + 28 }, layer.form]}
        >
          <RegisterForm onSubmit={seq.begin} />
        </Animated.View>
      )}

      <ContinuePrompt
        active={seq.canAdvance}
        visible={seq.awaitingTap}
        onPress={seq.advance}
        bottom={insets.bottom + 32}
      />

      <SkipButton visible={seq.showSkip} onPress={seq.skip} bottom={insets.bottom + 18} />
    </View>
  );
}

const styles = StyleSheet.create({
  videoLayer: { ...StyleSheet.absoluteFill, backgroundColor: CLIP_FIRST_FRAME_COLOR },
  top: { position: 'absolute', left: 0, right: 0 },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0 },
});
