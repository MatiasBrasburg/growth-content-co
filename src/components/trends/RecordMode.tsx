import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Square, SkipForward, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrendAnalysis, VideoShot } from "@/lib/api";

interface RecordModeProps {
  analysis: TrendAnalysis;
  onClose: () => void;
}

type RecordState = "preview" | "countdown" | "recording" | "between" | "done";

export function RecordMode({ analysis, onClose }: RecordModeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<RecordState>("preview");
  const [currentShotIdx, setCurrentShotIdx] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [clips, setClips] = useState<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);

  const currentShot: VideoShot | undefined = analysis.shots[currentShotIdx];
  const totalShots = analysis.shots.length;

  // Start camera
  useEffect(() => {
    let mounted = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user", width: 1080, height: 1920 }, audio: true })
      .then((stream) => {
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(() => setError("No se pudo acceder a la cámara. Verificá los permisos."));
    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (state !== "countdown") return;
    if (countdown <= 0) {
      startClipRecording();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [state, countdown]);

  // Recording timer
  useEffect(() => {
    if (state !== "recording" || !currentShot) return;
    if (elapsed >= currentShot.duration) {
      stopClipRecording();
      return;
    }
    const t = setTimeout(() => setElapsed((e) => e + 1), 1000);
    return () => clearTimeout(t);
  }, [state, elapsed, currentShot]);

  const startCountdown = useCallback(() => {
    setCountdown(3);
    setState("countdown");
  }, []);

  const startClipRecording = useCallback(() => {
    if (!streamRef.current) return;
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(streamRef.current);
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setClips((c) => [...c, blob]);
    };
    mediaRecorderRef.current = recorder;
    recorder.start();
    setElapsed(0);
    setState("recording");
  }, []);

  const stopClipRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    if (currentShotIdx + 1 >= totalShots) {
      setState("done");
    } else {
      setState("between");
    }
  }, [currentShotIdx, totalShots]);

  const nextShot = useCallback(() => {
    setCurrentShotIdx((i) => i + 1);
    startCountdown();
  }, [startCountdown]);

  const skipShot = useCallback(() => {
    setClips((c) => [...c, new Blob()]); // empty placeholder
    if (currentShotIdx + 1 >= totalShots) {
      setState("done");
    } else {
      setCurrentShotIdx((i) => i + 1);
      setState("between");
    }
  }, [currentShotIdx, totalShots]);

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <p className="text-foreground">{error}</p>
          <Button onClick={onClose} variant="outline" className="border-border text-foreground">Cerrar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex">
      {/* Camera feed */}
      <div className="flex-1 relative overflow-hidden">
        <video ref={videoRef} muted playsInline className="absolute inset-0 w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />

        {/* Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top bar */}
          <div className="p-4 flex items-center justify-between pointer-events-auto">
            <button onClick={onClose} className="p-2 rounded-full bg-background/60 backdrop-blur">
              <X className="h-5 w-5 text-foreground" />
            </button>
            <span className="px-3 py-1 rounded-full bg-background/60 backdrop-blur text-xs font-medium text-foreground">
              Toma {currentShotIdx + 1} / {totalShots}
            </span>
          </div>

          {/* Countdown */}
          <AnimatePresence>
            {state === "countdown" && (
              <motion.div
                key={countdown}
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-8xl font-display font-bold text-foreground drop-shadow-lg">
                  {countdown || "🎬"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Teleprompter overlay */}
          {(state === "recording" || state === "preview" || state === "between") && currentShot && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
              {state === "recording" && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
                  <span className="font-mono text-foreground text-sm">
                    {elapsed}s / {currentShot.duration}s
                  </span>
                  <div className="flex-1 h-1 rounded-full bg-secondary ml-2">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${(elapsed / currentShot.duration) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs text-primary font-semibold uppercase tracking-wider">
                  Toma {currentShot.shotNumber} — {currentShot.duration}s — {currentShot.emotion}
                </p>
                <p className="text-lg font-display font-bold text-foreground leading-snug">
                  {currentShot.textOnScreen}
                </p>
                <p className="text-sm text-muted-foreground">{currentShot.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side controls */}
      <div className="w-72 bg-card border-l border-border p-5 flex flex-col">
        <h3 className="font-display font-bold text-foreground mb-1">🎥 Modo Grabación</h3>
        <p className="text-xs text-muted-foreground mb-6">Seguí las instrucciones de Gemini toma por toma</p>

        {/* Shot list */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {analysis.shots.map((shot, i) => (
            <div
              key={shot.shotNumber}
              className={`rounded-lg p-2.5 text-xs transition-colors ${
                i === currentShotIdx
                  ? "bg-primary/15 border border-primary/30"
                  : i < currentShotIdx
                  ? "bg-secondary/50 opacity-60"
                  : "bg-secondary"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Toma {shot.shotNumber}</span>
                <span className="text-muted-foreground">{shot.duration}s</span>
              </div>
              <p className="text-muted-foreground mt-0.5 line-clamp-1">"{shot.textOnScreen}"</p>
              {i < clips.length && (
                <span className="text-primary text-[10px] font-medium mt-1 block">
                  <CheckCircle2 className="inline h-3 w-3 mr-0.5" /> Grabada
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {state === "preview" && (
            <Button onClick={startCountdown} className="w-full bg-primary text-primary-foreground hover:opacity-90">
              <Camera className="mr-2 h-4 w-4" /> Empezar a grabar
            </Button>
          )}

          {state === "recording" && (
            <div className="flex gap-2">
              <Button onClick={stopClipRecording} className="flex-1 bg-destructive text-destructive-foreground">
                <Square className="mr-1 h-3 w-3" /> Cortar
              </Button>
              <Button onClick={skipShot} variant="outline" size="icon" className="border-border text-foreground">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          )}

          {state === "between" && (
            <div className="space-y-2">
              <p className="text-xs text-primary text-center font-medium">✅ Toma grabada</p>
              <Button onClick={nextShot} className="w-full bg-primary text-primary-foreground hover:opacity-90">
                Siguiente toma →
              </Button>
            </div>
          )}

          {state === "done" && (
            <div className="space-y-3 text-center">
              <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
              <p className="text-sm text-foreground font-medium">¡Todas las tomas grabadas!</p>
              <p className="text-xs text-muted-foreground">{clips.length} clips listos para enviar al editor</p>
              <Button onClick={onClose} className="w-full bg-primary text-primary-foreground hover:opacity-90">
                Finalizar y enviar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
