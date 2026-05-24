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
      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-gradient-to-b from-black/60 to-transparent text-white pointer-events-none">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-gray-300 font-semibold">{MOCK_PROCESS.title}</span>
          <span className="text-sm font-medium">{currentIndex + 1} of {images.length}</span>
        </div>
      </header>

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

      {/* Caption Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 pb-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center">
        <div className="w-full text-left mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">{images[currentIndex].title}</h2>
          <p className="text-white/80 text-sm">{images[currentIndex].description}</p>
        </div>
        
        {/* Progress Bar */}
        <div className="flex gap-1 w-full h-1 mb-6">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`flex-1 rounded-full transition-colors duration-300 ${idx <= currentIndex ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>

        {/* Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors text-white text-sm font-medium z-30"
          aria-label="Open menu"
        >
          <Menu size={18} />
          <span>All Steps</span>
        </button>
      </div>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h3 className="text-xl font-medium text-white">Select Step</h3>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col gap-4">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => jumpTo(idx)}
                    className={`flex items-center justify-between p-4 rounded-xl text-left transition-colors border border-white/10 ${
                      idx === currentIndex ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-bold block mb-1 ${idx === currentIndex ? 'text-black/60' : 'text-white/50'}`}>STEP {img.order}</span>
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