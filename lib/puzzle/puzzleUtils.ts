import { PuzzlePieceData, PuzzleBoardSlot } from './puzzleTypes';

export const GRID_SIZE = 3;
export const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

/**
 * Creates the 9 puzzle piece models with precise background percentages
 * for CSS background-size: 300% 300% clipping.
 */
export function createInitialPieces(): PuzzlePieceData[] {
  const pieces: PuzzlePieceData[] = [];

  for (let i = 0; i < TOTAL_PIECES; i++) {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;

    // In CSS background-position with 300% size:
    // col 0 = 0%, col 1 = 50%, col 2 = 100%
    // row 0 = 0%, row 1 = 50%, row 2 = 100%
    const bgX = col === 0 ? '0%' : col === 1 ? '50%' : '100%';
    const bgY = row === 0 ? '0%' : row === 1 ? '50%' : '100%';

    pieces.push({
      id: i,
      correctRow: row,
      correctCol: col,
      correctIndex: i,
      currentSlotIndex: null,
      isPlacedCorrectly: false,
      bgPositionX: bgX,
      bgPositionY: bgY,
    });
  }

  return pieces;
}

/**
 * Creates 9 empty board slots (0 through 8).
 */
export function createInitialBoardSlots(): PuzzleBoardSlot[] {
  const slots: PuzzleBoardSlot[] = [];
  for (let i = 0; i < TOTAL_PIECES; i++) {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;
    slots.push({
      index: i,
      row,
      col,
      placedPieceId: null,
    });
  }
  return slots;
}

/**
 * Shuffles tray piece IDs using Fisher-Yates, ensuring it is never in fully solved order.
 */
export function shufflePieceIds(ids: number[]): number[] {
  const copy = [...ids];
  let isSolved = true;
  let attempts = 0;

  while (isSolved && attempts < 10) {
    attempts++;
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }

    // Check if randomly still in solved order
    let matchCount = 0;
    for (let i = 0; i < copy.length; i++) {
      if (copy[i] === i) matchCount++;
    }
    // If fewer than 3 pieces accidentally match, it's a great challenge
    if (matchCount < 3) {
      isSolved = false;
    }
  }

  return copy;
}
