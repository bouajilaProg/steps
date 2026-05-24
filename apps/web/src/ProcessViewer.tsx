import { useState, useCallback } from 'react';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for the current sprint
const MOCK_PROCESS = {
  id: 'proc_123',
  title: 'Morning Routine',
  version: '1.0.0',
  images: [
    { id: 'img_1', order: 1, title: 'Drink Water', description: 'Start your day right by hydrating your body. A full glass helps wake up your system.', uri: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=800' },
    { id: 'img_2', order: 2, title: 'Stretch', description: 'Take 5 minutes to gently stretch your muscles, improving blood flow and flexibility.', uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800' },
    { id: 'img_3', order: 3, title: 'Meditate', description: 'Find a quiet spot. Sit still and focus on your breath to clear your mind.', uri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800' },
    { id: 'img_4', order: 4, title: 'Journal', description: 'Write down 3 things you are grateful for, or outline your main goal for today.', uri: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800' },
    { id: 'img_5', order: 5, title: 'Coffee', description: 'Enjoy your morning coffee or tea mindfully before diving into work.', uri: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800' },
  ]
};

export default function ProcessViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const images = MOCK_PROCESS.images;

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const jumpTo = (index: number) => {
    setCurrentIndex(index);
    setIsMenuOpen(false);
  };

  // Circular Progress Logic
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const numSteps = images.length;
  const gap = 4;
  const segmentLength = (circumference / numSteps) - gap;

  // Drag handlers for framer-motion swipe
  const handleDragEnd = (_e: any, { offset }: any) => {
    const swipeThreshold = 50;
    if (offset.x < -swipeThreshold) {
      nextImage();
    } else if (offset.x > swipeThreshold) {
      prevImage();
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col font-sans">
      {/* Top Text Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 pt-12 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none">
        <h2 className="text-3xl font-semibold text-white mb-2 drop-shadow-md">{images[currentIndex].title}</h2>
        <p className="text-white/90 text-sm max-w-md drop-shadow-md">{images[currentIndex].description}</p>
      </div>

      {/* Main Image Stage */}
      <div className="flex-1 relative w-full h-full flex items-center justify-center">
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex].uri}
            alt={images[currentIndex].title}
            className="absolute w-full h-full object-contain md:object-cover pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Swipe overlay area */}
        <motion.div
          className="absolute inset-0 z-10 touch-pan-y"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        />

        {/* Desktop Navigation Overlays */}
        <div className="hidden md:flex absolute inset-0 z-10 pointer-events-none">
          <div 
            className="w-1/3 h-full pointer-events-auto cursor-pointer flex items-center justify-start p-4 hover:bg-black/10 transition-colors opacity-0 hover:opacity-100"
            onClick={prevImage}
          >
            {currentIndex > 0 && <ChevronLeft className="text-white drop-shadow-md" size={48} />}
          </div>
          <div className="w-1/3 h-full" />
          <div 
            className="w-1/3 h-full pointer-events-auto cursor-pointer flex items-center justify-end p-4 hover:bg-black/10 transition-colors opacity-0 hover:opacity-100"
            onClick={nextImage}
          >
            {currentIndex < images.length - 1 && <ChevronRight className="text-white drop-shadow-md" size={48} />}
          </div>
        </div>
      </div>

      {/* Bottom Gradient for Contrast */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />

      {/* Combined Menu Button & Progress Indicator */}
      <div className="absolute bottom-6 left-6 z-[60]">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 pr-5 pl-2 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 hover:bg-black/70 transition-colors text-white text-sm font-medium shadow-lg"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 48 48">
              {images.map((_, i) => {
                const isCompleted = i <= currentIndex;
                const rotation = i * (360 / numSteps);
                return (
                  <circle
                    key={i}
                    cx="24"
                    cy="24"
                    r={radius}
                    fill="transparent"
                    stroke={isCompleted ? "white" : "rgba(255,255,255,0.25)"}
                    strokeWidth="4"
                    strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                    style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
                  />
                );
              })}
            </svg>
            {isMenuOpen ? <X size={14} /> : <Menu size={14} />}
          </div>
          <span>{isMenuOpen ? "Close" : "All Steps"}</span>
        </button>
      </div>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col pt-16 pb-24"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="px-6 pb-4">
              <h3 className="font-medium text-white/40 uppercase tracking-widest text-xs">All Steps</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="flex flex-col gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => jumpTo(idx)}
                    className={`flex items-center justify-between p-4 rounded-xl text-left transition-colors border border-white/10 ${
                      idx === currentIndex ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-bold block mb-1 ${idx === currentIndex ? 'text-black/60' : 'text-white/40'}`}>STEP {img.order}</span>
                      <span className="text-lg font-medium">{img.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}