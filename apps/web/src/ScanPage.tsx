import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import { Camera, X, AlertTriangle, ScanLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { workflowService } from './services/workflowService';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function extractWorkflowId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (UUID_RE.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const segments = url.pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    if (last && UUID_RE.test(decodeURIComponent(last))) {
      return decodeURIComponent(last);
    }
  } catch {
    // not a URL, fall through
  }

  return null;
}

type Status = 'idle' | 'starting' | 'scanning' | 'resolving' | 'error' | 'not-found';

export default function ScanPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const cooldownRef = useRef(false);

  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stopScanner = useCallback(() => {
    scannerRef.current?.stop();
    scannerRef.current?.destroy();
    scannerRef.current = null;
  }, []);

  const handleScan = useCallback(
    async (raw: string) => {
      if (cooldownRef.current) return;
      const id = extractWorkflowId(raw);
      if (!id) {
        setErrorMessage('That QR code does not look like a Steps workflow.');
        return;
      }

      cooldownRef.current = true;
      stopScanner();
      setStatus('resolving');
      setErrorMessage(null);

      try {
        const exists = await workflowService.getWorkflowById(id);
        if (!exists) {
          setStatus('not-found');
          return;
        }
        navigate(`/process/${id}`);
      } catch {
        setStatus('not-found');
      } finally {
        cooldownRef.current = false;
      }
    },
    [navigate, stopScanner],
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setStatus('starting');
    setErrorMessage(null);

    const scanner = new QrScanner(
      video,
      (result) => handleScan(result.data),
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
      },
    );
    scannerRef.current = scanner;

    scanner
      .start()
      .then(() => {
        setStatus('scanning');
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Unable to access the camera.';
        setErrorMessage(message);
        setStatus('error');
      });

    return () => {
      stopScanner();
    };
  }, [handleScan, stopScanner]);

  const handleClose = () => {
    stopScanner();
    navigate('/');
  };

  const handleRetry = () => {
    setErrorMessage(null);
    setStatus('idle');
    navigate(0);
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col font-sans text-white">
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <div
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
        aria-hidden
      >
        <div className="relative w-72 h-72">
          <div className="absolute inset-0 rounded-3xl ring-2 ring-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]" />
          <ScanLine className="absolute -top-1 left-1/2 -translate-x-1/2 h-8 w-8 text-white drop-shadow" />
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Camera className="h-4 w-4" />
          Scan a workflow QR
        </div>
        <button
          onClick={handleClose}
          className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur p-2 transition-colors"
          aria-label="Close scanner"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <AnimatePresence mode="wait">
          {status === 'starting' && (
            <motion.p
              key="starting"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center text-sm text-white/70"
            >
              Requesting camera access...
            </motion.p>
          )}

          {status === 'scanning' && (
            <motion.p
              key="scanning"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center text-sm text-white/70"
            >
              Point your camera at a Steps workflow QR code.
            </motion.p>
          )}

          {status === 'resolving' && (
            <motion.p
              key="resolving"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-center text-sm text-white/70"
            >
              Opening workflow...
            </motion.p>
          )}

          {(status === 'error' || status === 'not-found') && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="flex items-center gap-2 text-amber-300">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm font-medium">
                  {status === 'not-found'
                    ? 'No workflow found for that QR code.'
                    : errorMessage ?? 'Camera unavailable.'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  Try again
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
