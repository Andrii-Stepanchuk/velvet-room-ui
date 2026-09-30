export const ENTRANCE_VIDEO_ENABLED: boolean = true;

export const ENTRANCE_VIDEO_SOURCE: number | null = ENTRANCE_VIDEO_ENABLED
  ? require('../../../../assets/video/velvet-room-entrance.mp4')
  : null;

// Must match the `tpad` stop_duration the asset was encoded with.
export const ENTRANCE_VIDEO_FROZEN_TAIL_S = 0.4;

export const CLIP_FIRST_FRAME_COLOR = '#8192f3';
