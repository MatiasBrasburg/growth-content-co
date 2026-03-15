import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export function AnalyzingStep() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-glow p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="relative inline-flex">
          <div className="h-20 w-20 rounded-full border-2 border-primary/30 animate-pulse-glow" />
          <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-foreground">
            Analizando tu negocio...
          </h2>
          <p className="text-muted-foreground">
            Extrayendo productos, audiencia y tono de marca con IA
          </p>
        </div>
      </motion.div>
    </div>
  );
}
