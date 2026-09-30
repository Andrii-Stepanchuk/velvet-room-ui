import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { VideoView, type VideoPlayer } from 'expo-video';

export const EntranceVideo = memo(function EntranceVideo({
  player,
  onFirstFrameRender,
}: {
  player: VideoPlayer;
  onFirstFrameRender: () => void;
}) {
  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      nativeControls={false}
      allowsPictureInPicture={false}
      // SurfaceView ignores parent opacity on Android; TextureView fades with its layer.
      surfaceType="textureView"
      useExoShutter={false}
      onFirstFrameRender={onFirstFrameRender}
    />
  );
});
