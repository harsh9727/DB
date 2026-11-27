export interface PuzzlePieceData {
  id: number; // 0..8
  correctRow: number; // 0..2
  correctCol: number; // 0..2
  correctIndex: number; // 0..8
  currentSlotIndex: number | null; // 0..8 if on board, null if in tray
  isPlacedCorrectly: boolean;
  bgPositionX: string;
  bgPositionY: string;
}

export interface PuzzleBoardSlot {
  index: number; // 0..8
  row: number; // 0..2
  col: number; // 0..2
  placedPieceId: number | null;
}

export type PuzzleGameStatus = 'intro' | 'playing' | 'completed';

export interface PuzzleConfig {
  photoUrl: string;
  backgroundUrl: string;
  audioCompleteUrl: string;
  gridSize: number;
}
