import { useGesture } from '@use-gesture/react';
import { motion, useMotionValue, animate } from 'framer-motion';

export function ZoomableImage({ 
  src, 
  alt, 
  onSwipeLeft, 
  onSwipeRight 
}: { 
  src: string; 
  alt: string; 
  onSwipeLeft: () => void; 
  onSwipeRight: () => void; 
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
          if (mx < -50) {
            onSwipeLeft();
          } else if (mx > 50) {
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
      className="absolute w-full h-full object-contain md:object-cover pointer-events-auto cursor-grab active:cursor-grabbing"
      onDoubleClick={handleDoubleClick}
      {...(bind() as any)}
      draggable={false}
    />
  );
}
