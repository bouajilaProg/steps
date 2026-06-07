import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Menu, X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomableImage, SwipeableScreen } from './ZoomableImage';
import { workflowService, type Step, type Workflow } from './services/workflowService';

const NO_BREAK_SPACE = '\u00A0';

export interface ProcessViewerProps {
  workflow?: Workflow | null;
  steps?: Step[];
  onClose?: () => void;
}

export default function ProcessViewer({ workflow: workflowProp, steps: stepsProp, onClose }: ProcessViewerProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [fetchedWorkflow, setFetchedWorkflow] = useState<Workflow | null>(null);
  const [fetchedSteps, setFetchedSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(workflowProp == null);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const hasExternalData = workflowProp != null && stepsProp != null;
  const workflow = hasExternalData ? workflowProp : fetchedWorkflow;
  const steps = hasExternalData ? stepsProp : fetchedSteps;

  useEffect(() => {
    if (hasExternalData) return;
    if (!id) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    Promise.all([
      workflowService.getWorkflowById(id),
      workflowService.getSteps(id),
    ])
      .then(([wf, st]) => {
        if (cancelled) return;
        setFetchedWorkflow(wf);
        setFetchedSteps(
          st
            .slice()
            .sort((a, b) => a.stepOrder - b.stepOrder),
        );
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load process');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, hasExternalData]);

  useEffect(() => {
    if (!onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBack = useCallback(() => {
    if (onClose) {
      onClose();
      return;
    }
    navigate('/');
  }, [onClose, navigate]);

  const nextImage = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => Math.min(prev + 1, steps.length));
  }, [steps.length]);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => Math.max(prev - 1, -1));
  }, []);

  const jumpTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsMenuOpen(false);
  };

  const isCompletedScreen = currentIndex === steps.length;
  const isIntroScreen = currentIndex === -1;

  if (loading) {
    return (
      <div className="relative w-full h-[100dvh] bg-black flex items-center justify-center font-sans text-white/40 text-sm">
        Loading...
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="relative w-full h-[100dvh] bg-black flex flex-col items-center justify-center font-sans text-white p-6 text-center">
        <p className="text-white/60 mb-6">{error ?? 'Process not found'}</p>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 transition-colors"
        >
          Back to Workflows
        </button>
      </div>
    );
  }

  // Circular Progress Logic
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const numSteps = steps.length;
  const gap = 4;
  const segmentLength = numSteps > 0 ? (circumference / numSteps) - gap : 0;

  const slideVariants = {
    enter: (dir: 1 | -1) => ({
      x: dir > 0 ? 48 : -48,
      opacity: 0,
      scale: 0.995,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: 1 | -1) => ({
      x: dir > 0 ? -48 : 48,
      opacity: 0,
      scale: 0.995,
    }),
  };

  const currentStep = !isIntroScreen && !isCompletedScreen ? steps[currentIndex] : null;
  const currentImageSrc = currentStep ? (currentStep.imageUrl ?? currentStep.imagePath) : '';
  const currentStepTitle = currentStep?.text?.trim() ? currentStep.text : NO_BREAK_SPACE;
  const workflowTitle = workflow.name?.trim() ? workflow.name : NO_BREAK_SPACE;

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col font-sans">
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />

      {/* Close Button (only when an onClose is provided) */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[70] flex items-center justify-center w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 hover:bg-black/70 transition-colors text-white shadow-lg"
          aria-label="Close preview"
        >
          <X size={20} />
        </button>
      )}

      {/* Main Image Stage */}
      <div className="flex-1 relative w-full h-full flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {isCompletedScreen ? (
              <SwipeableScreen
                onSwipeLeft={nextImage}
                onSwipeRight={prevImage}
                hasNext={false}
                hasPrev={true}
              >
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#111111] p-6 text-center z-50">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={40} className="text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">Process Complete</h2>
                  <p className="text-white/60 mb-10 max-w-sm">You have successfully completed all steps in this workflow.</p>

                  <div className="flex flex-col w-full max-w-xs gap-3">
                    <button
                      onClick={handleBack}
                      className="w-full py-4 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 transition-colors"
                    >
                      Back to Workflows
                    </button>
                  </div>
                </div>
              </SwipeableScreen>
            ) : isIntroScreen ? (
              <SwipeableScreen
                onSwipeLeft={nextImage}
                onSwipeRight={prevImage}
                hasNext={true}
                hasPrev={false}
              >
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#111111] p-6 text-center z-50">
                  <h2 className="text-3xl font-bold text-white mb-3">{workflowTitle}</h2>
                  <p className="text-white/60 mb-10 max-w-sm">Return to the workflow list or begin this process.</p>

                  <div className="flex flex-col w-full max-w-xs gap-3">
                    <button
                      onClick={handleBack}
                      className="w-full py-4 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 transition-colors"
                    >
                      Back to Workflows
                    </button>
                  </div>
                </div>
              </SwipeableScreen>
            ) : (
              <ZoomableImage
                src={currentImageSrc}
                alt={currentStepTitle}
                onSwipeLeft={nextImage}
                onSwipeRight={prevImage}
                hasNext={currentIndex < steps.length}
                hasPrev={currentIndex > -1}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Desktop Navigation Overlays */}
        {!isCompletedScreen && !isIntroScreen && (
          <div className="hidden md:flex absolute inset-0 z-10 pointer-events-none">
            <div
              className="w-1/3 h-full pointer-events-auto cursor-pointer flex items-center justify-start p-4 hover:bg-black/10 transition-colors opacity-0 hover:opacity-100"
              onClick={prevImage}
            >
              {currentIndex > -1 && <ChevronLeft className="text-white drop-shadow-md" size={48} />}
            </div>
            <div className="w-1/3 h-full" />
            <div
              className="w-1/3 h-full pointer-events-auto cursor-pointer flex items-center justify-end p-4 hover:bg-black/10 transition-colors opacity-0 hover:opacity-100"
              onClick={nextImage}
            >
              {currentIndex < steps.length && <ChevronRight className="text-white drop-shadow-md" size={48} />}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-40 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

      {/* Bottom Nav Area (Title + Menu) */}
      <div className="absolute bottom-6 left-6 right-6 z-[60] flex items-center justify-between pointer-events-none">
        <div className="flex-1 pr-4">
          {!isCompletedScreen && !isIntroScreen && (
            <h2 className="text-3xl font-bold text-white drop-shadow-md leading-tight">{currentStepTitle}</h2>
          )}
        </div>

        {/* Combined Menu Button & Progress Indicator */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="shrink-0 flex items-center justify-center p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/20 hover:bg-black/70 transition-colors text-white shadow-lg pointer-events-auto"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 48 48">
              {steps.map((_, i) => {
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
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </div>
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
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center p-4 rounded-xl text-center transition-colors border border-white/20 bg-white/10 text-white hover:bg-white/20 mb-2 cursor-pointer relative z-50 pointer-events-auto"
                >
                  <span className="text-base font-semibold">Return to Workflows</span>
                </button>

                {steps.map((step, idx) => {
                  const title = step.text?.trim() ? step.text : NO_BREAK_SPACE;
                  return (
                    <button
                      key={step.id}
                      onClick={() => jumpTo(idx)}
                      className={`flex items-center justify-between p-4 rounded-xl text-left transition-colors border border-white/10 ${idx === currentIndex ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'
                        }`}
                    >
                      <div>
                        <span className={`text-xs font-bold block mb-1 ${idx === currentIndex ? 'text-black/60' : 'text-white/40'}`}>STEP {idx + 1}</span>
                        <span className="text-lg font-medium">{title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
