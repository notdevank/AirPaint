import { useState, useCallback, useRef } from 'react';

export type GestureType = 'none' | 'pinch' | 'point' | 'open' | 'closed' | 'swipe-left' | 'swipe-right' | 'click';

export interface GestureState {
  type: GestureType;
  x: number;
  y: number;
  pinchDistance: number;
  isClicking: boolean;
}

const PINCH_THRESHOLD = 0.08; 
const CLICK_THRESHOLD = 0.04;
const SWIPE_DISTANCE_MIN = 0.25; 
const SWIPE_MAX_TIME = 600; 

export const useHandGestures = () => {
  const [gesture, setGesture] = useState<GestureState>({ 
    type: 'none', 
    x: 0, 
    y: 0, 
    pinchDistance: 1,
    isClicking: false
  });
  
  const swipeStart = useRef<{ x: number; time: number } | null>(null);
  const swipeCooldown = useRef<boolean>(false);
  const clickLock = useRef<boolean>(false);

  const processResults = useCallback((results: any) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      swipeStart.current = null;
      setGesture((prev) => ({ ...prev, type: 'none', isClicking: false }));
      return;
    }

    const landmarks = results.multiHandLandmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    
    const x = indexTip.x;
    const y = indexTip.y;

    const isInSafetyZone = x > 0.05 && x < 0.95 && y > 0.05 && y < 0.95;

    const dist = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) + 
      Math.pow(thumbTip.y - indexTip.y, 2)
    );

    const isIndexUp = indexTip.y < landmarks[6].y;
    const isMiddleUp = middleTip.y < landmarks[10].y;
    const isRingUp = ringTip.y < landmarks[14].y;
    const isPinkyUp = pinkyTip.y < landmarks[18].y;

    let type: GestureType = 'none';
    let isClicking = false;

    if (dist < PINCH_THRESHOLD) {
      type = 'pinch';
      if (dist < CLICK_THRESHOLD && !clickLock.current && isInSafetyZone) {
        isClicking = true;
        clickLock.current = true;
        setTimeout(() => { clickLock.current = false; }, 500);
      }
    } 
    else if (!swipeCooldown.current && isInSafetyZone) {
        const now = Date.now();
        if (!swipeStart.current) {
            swipeStart.current = { x: indexTip.x, time: now };
        } else {
            const deltaX = indexTip.x - swipeStart.current.x;
            const deltaTime = now - swipeStart.current.time;

            if (deltaTime < SWIPE_MAX_TIME) {
                if (deltaX > SWIPE_DISTANCE_MIN) {
                    type = 'swipe-right';
                    triggerSwipeCooldown();
                } else if (deltaX < -SWIPE_DISTANCE_MIN) {
                    type = 'swipe-left';
                    triggerSwipeCooldown();
                }
            } else {
                swipeStart.current = { x: indexTip.x, time: now };
            }
        }
    }
    
    if (type === 'none') {
        if (isIndexUp && !isMiddleUp && !isRingUp) {
            type = 'point';
        } else if (isIndexUp && isMiddleUp && isRingUp && isPinkyUp) {
            type = 'open';
        } else if (!isIndexUp && !isMiddleUp && !isRingUp && !isPinkyUp) {
            type = 'closed';
        }
    }

    setGesture({ 
      type: isClicking ? 'click' : type, 
      x: 1 - x, 
      y, 
      pinchDistance: dist,
      isClicking
    });
  }, []);

  const triggerSwipeCooldown = () => {
    swipeCooldown.current = true;
    swipeStart.current = null;
    setTimeout(() => {
      swipeCooldown.current = false;
    }, 1200);
  };

  return { gesture, processResults };
};
