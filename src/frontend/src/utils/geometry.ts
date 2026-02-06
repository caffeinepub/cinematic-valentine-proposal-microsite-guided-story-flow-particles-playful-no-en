interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface Size {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

/**
 * Check if two rectangles overlap with a given margin
 */
function rectsOverlap(rect1: Rect, rect2: Rect, margin: number = 0): boolean {
  return !(
    rect1.right + margin < rect2.left ||
    rect1.left - margin > rect2.right ||
    rect1.bottom + margin < rect2.top ||
    rect1.top - margin > rect2.bottom
  );
}

/**
 * Convert position to rect
 */
function positionToRect(pos: Position, size: Size, containerRect: Rect): Rect {
  const absoluteLeft = containerRect.left + pos.x;
  const absoluteTop = containerRect.top + pos.y;
  
  return {
    left: absoluteLeft,
    top: absoluteTop,
    right: absoluteLeft + size.width,
    bottom: absoluteTop + size.height,
    width: size.width,
    height: size.height,
  };
}

/**
 * Find a safe position that doesn't overlap with any avoid elements
 */
export function findSafePosition(
  containerRect: Rect,
  buttonSize: Size,
  avoidElements: DOMRect[],
  safeDistance: number = 60
): Position {
  const padding = 20;
  const maxX = containerRect.width - buttonSize.width - padding;
  const maxY = containerRect.height - buttonSize.height - padding;
  
  // Try to find a valid position with full safe distance
  const maxAttempts = 50;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidateX = Math.random() * maxX + padding;
    const candidateY = Math.random() * maxY + padding;
    const candidatePos = { x: candidateX, y: candidateY };
    const candidateRect = positionToRect(candidatePos, buttonSize, containerRect);
    
    let isValid = true;
    for (const avoidRect of avoidElements) {
      if (rectsOverlap(candidateRect, avoidRect, safeDistance)) {
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      return candidatePos;
    }
  }
  
  // If no position found with full safe distance, try with reduced distance
  const reducedDistance = Math.max(30, safeDistance / 2);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidateX = Math.random() * maxX + padding;
    const candidateY = Math.random() * maxY + padding;
    const candidatePos = { x: candidateX, y: candidateY };
    const candidateRect = positionToRect(candidatePos, buttonSize, containerRect);
    
    let isValid = true;
    for (const avoidRect of avoidElements) {
      if (rectsOverlap(candidateRect, avoidRect, reducedDistance)) {
        isValid = false;
        break;
      }
    }
    
    if (isValid) {
      return candidatePos;
    }
  }
  
  // Fallback: return a deterministic safe position (top-right corner area)
  return {
    x: Math.min(maxX * 0.7, maxX - padding),
    y: Math.max(padding, maxY * 0.2),
  };
}
