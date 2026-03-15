import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Upload, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadAssetToPython, type AssetUploadResult } from "@/lib/api";

export function VoiceRecorder() {
  const [mode, setMode] = useState<"idle" | "recording" | "uploading" | "done">("idle");
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState<AssetUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setMode("uploading");
        try {
          const res = await uploadAssetToPython(blob, "voice");
          setResult(res);
          setMode("done");
        } catch {
          setError("Error al subir el audio");
          setMode("idle");
        }
      };

      recorder.start();
      setMode("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= 59) {
            stopRecording();
            return 60;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setError("No se pudo acceder al micrófono. Verificá los permisos del navegador.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMode("uploading");
    setError(null);
    try {
      const res = await uploadAssetToPython(file, "voice");
      setResult(res);
      setMode("done");
    } catch {
      setError("Error al subir el archivo");
      setMode("idle");
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="glow-card rounded-xl p-6 gradient-border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-foreground">🎙️ Clonación de Voz</h3>
          <p className="text-xs text-muted-foreground mt-1">Grabá 1 minuto de audio o subí un archivo .mp3/.wav</p>
        </div>
        {result && (
          <span className="flex items-center gap-1 text-xs text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" /> Procesando
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {mode === "idle" && (
        <div className="flex gap-3">
          <Button onClick={startRecording} className="flex-1 bg-primary text-primary-foreground hover:opacity-90">
            <Mic className="mr-2 h-4 w-4" /> Grabar audio
          </Button>
          <label>
            <Button variant="outline" className="cursor-pointer border-border text-foreground hover:bg-secondary" asChild>
              <span><Upload className="mr-2 h-4 w-4" /> Subir archivo</span>
            </Button>
            <input type="file" accept=".mp3,.wav,.webm,.m4a" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      )}

      {mode === "recording" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
              <span className="font-mono text-lg text-foreground">{formatTime(seconds)}</span>
              <span className="text-xs text-muted-foreground">/ 1:00</span>
            </div>
            <Button onClick={stopRecording} size="sm" variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
              <Square className="mr-1 h-3 w-3" /> Detener
            </Button>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              style={{ width: `${(seconds / 60) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {mode === "uploading" && (
        <div className="flex items-center gap-3 py-2">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Enviando al servidor de procesamiento...</span>
        </div>
      )}

      {mode === "done" && result && (
        <div className="bg-secondary rounded-lg p-3 space-y-1">
          <p className="text-sm text-foreground">✅ Audio enviado correctamente</p>
          <p className="text-xs text-muted-foreground">ID: {result.assetId}</p>
          <p className="text-xs text-muted-foreground">Archivo: {result.fileName}</p>
          <Button onClick={() => { setMode("idle"); setResult(null); }} variant="ghost" size="sm" className="mt-2 text-primary">
            Grabar otra vez
          </Button>
        </div>
      )}
    </div>
  );
}
