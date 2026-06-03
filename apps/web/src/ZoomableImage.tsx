import { useGesture } from '@use-gesture/react';
import { motion, useMotionValue, animate } from 'framer-motion';

export function ZoomableImage({
  src,
  alt,
  onSwipeLeft,
  onSwipeRight,
  hasNext,
  hasPrev
}: {
  src: string;
  alt: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const bind = useGesture({
    onDrag: ({ offset: [dx, dy], movement: [mx], last, active }) => {
      if (scale.get() > 1) {
        x.set(dx);
        y.set(dy);
      } else {
        if (active) {
          x.set(mx);
        }
        if (last) {
          if (mx < -50 && hasNext) {
            onSwipeLeft();
          } else if (mx > 50 && hasPrev) {
            onSwipeRight();
          } else {
            animate(x, 0, { type: 'spring', bounce: 0.5 });
          }
        }
      }
    },
    onPinch: ({ offset: [d], last }) => {
      const newScale = Math.max(1, d);
      scale.set(newScale);
      if (newScale === 1 || last) {
        if (newScale <= 1) {
          animate(x, 0);
          animate(y, 0);
        }
      }
    }
  }, {
    drag: {
      from: () => [x.get(), y.get()],
      filterTaps: true,
    },
    pinch: {
      scaleBounds: { min: 1, max: 4 },
      modifierKey: null
    }
  });

  const handleDoubleClick = () => {
    if (scale.get() > 1) {
      animate(scale, 1);
      animate(x, 0);
      animate(y, 0);
    } else {
      animate(scale, 2);
    }
  };

  return (
    <motion.img
      src={src}
      alt={alt}
      style={{ x, y, scale, touchAction: 'none' }}
      className="absolute w-full h-full object-cover pointer-events-auto cursor-grab active:cursor-grabbing"
      onDoubleClick={handleDoubleClick}
      {...(bind() as any)}
      draggable={false}
    />
  );
}

export function SwipeableScreen({
  onSwipeLeft,
  onSwipeRight,
  hasNext,
  hasPrev,
  children
}: {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  children: React.ReactNode;
}) {
  const x = useMotionValue(0);
  const startX = { current: 0 };
  const dragging = { current: false };

  const handleStart = (clientX: number) => {
    startX.current = clientX;
    dragging.current = false;
  };

  const handleMove = (clientX: number) => {
    const dx = clientX - startX.current;
    if (Math.abs(dx) > 5) dragging.current = true;
    if (dragging.current) x.set(dx);
  };

  const handleEnd = () => {
    const dx = x.get();
    if (dx < -50 && hasNext) {
      onSwipeLeft();
    } else if (dx > 50 && hasPrev) {
      onSwipeRight();
    } else {
      animate(x, 0, { type: 'spring', bounce: 0.5 });
    }
    dragging.current = false;
  };

  return (
    <motion.div
      style={{ x }}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => {
        handleStart(e.clientX);
        const onMouseMove = (ev: MouseEvent) => handleMove(ev.clientX);
        const onMouseUp = () => {
          handleEnd();
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      }}
    >
      {children}
    </motion.div>
  );
}

