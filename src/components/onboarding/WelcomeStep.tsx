import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingStore } from "@/store/onboarding-store";
import { analyzeBusiness } from "@/lib/api";

export function WelcomeStep() {
  const [input, setInput] = useState("");
  const { setStep, setBrandContext } = useOnboardingStore();

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setStep("analyzing");
    const ctx = await analyzeBusiness(input.trim());
    setBrandContext(ctx);
    setStep("review");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-glow p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg text-center space-y-8"
      >
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Fábrica de Contenido Viral
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-foreground">
            Tu contenido viral<br />
            <span className="gradient-text">empieza aquí</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Nuestra IA analizará tu negocio para crear contenido que conecte con tu audiencia.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Tu negocio o URL (ej: mitienda.com)"
              className="h-14 pl-12 pr-4 text-base bg-secondary border-border focus:ring-2 focus:ring-primary/50 rounded-xl"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="w-full h-12 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Analizar mi negocio
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
