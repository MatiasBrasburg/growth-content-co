import { motion } from "framer-motion";
import { X, Clock, MessageSquare, Volume2, Lightbulb, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrendAnalysis } from "@/lib/api";

interface TrendAnalysisViewProps {
  analysis: TrendAnalysis;
  onClose: () => void;
  onStartRecording: () => void;
}

export function TrendAnalysisView({ analysis, onClose, onStartRecording }: TrendAnalysisViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto glow-card rounded-2xl gradient-border"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">🎬 Análisis del Director de Arte</h2>
              <p className="text-sm text-muted-foreground">Gemini desarmó el video en {analysis.shots.length} tomas</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Shot timeline */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Estructura de tomas
            </h3>
            <div className="space-y-2">
              {analysis.shots.map((shot) => (
                <div key={shot.shotNumber} className="bg-secondary rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">
                      Toma {shot.shotNumber} — {shot.duration}s
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                      {shot.emotion}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{shot.description}</p>
                  <p className="text-xs text-muted-foreground italic">Texto: "{shot.textOnScreen}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hook texts */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" /> Ganchos de texto
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.hookTexts.map((hook, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  "{hook}"
                </span>
              ))}
            </div>
          </div>

          {/* Transcript */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-primary" /> Transcripción y tono
            </h3>
            <div className="bg-secondary rounded-lg p-3 space-y-2">
              <p className="text-sm text-foreground leading-relaxed">"{analysis.transcript}"</p>
              <p className="text-xs text-accent font-medium">Tono: {analysis.voiceTone}</p>
            </div>
          </div>

          {/* Adaptation */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" /> Sugerencia de adaptación
            </h3>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-sm text-foreground leading-relaxed">{analysis.adaptationSuggestion}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button onClick={onStartRecording} className="flex-1 bg-primary text-primary-foreground hover:opacity-90">
              🎥 Grabar yo mismo (Teleprompter)
            </Button>
            <Button onClick={onClose} variant="outline" className="border-border text-foreground hover:bg-secondary">
              <Copy className="mr-2 h-4 w-4" /> Guardar plantilla
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
