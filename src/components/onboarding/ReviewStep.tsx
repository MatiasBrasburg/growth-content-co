import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Store, Users, Megaphone, Palette, Star, Package, Send, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandCard } from "./BrandCard";
import { useOnboardingStore } from "@/store/onboarding-store";
import { chatRefine } from "@/lib/api";
import type { BrandContext } from "@/lib/api";

interface ChatMsg {
  role: "ai" | "user";
  text: string;
}

export function ReviewStep() {
  const { brandContext, updateBrandField, setStep } = useOnboardingStore();
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "ai",
      text: `¡Listo! Esto es lo que encontré sobre **${brandContext?.businessName}**. Revisá las tarjetas y editá lo que no esté bien, o escribime para ajustar cualquier cosa.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!brandContext) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setLoading(true);
    const reply = await chatRefine(userMsg, brandContext);
    setMessages((m) => [...m, { role: "ai", text: reply }]);
    setLoading(false);
  };

  const cards: { label: string; key: keyof BrandContext; icon: React.ReactNode }[] = [
    { label: "Negocio", key: "businessName", icon: <Store className="h-4 w-4" /> },
    { label: "Industria", key: "industry", icon: <Star className="h-4 w-4" /> },
    { label: "Productos", key: "products", icon: <Package className="h-4 w-4" /> },
    { label: "Audiencia", key: "targetAudience", icon: <Users className="h-4 w-4" /> },
    { label: "Tono de marca", key: "brandTone", icon: <Megaphone className="h-4 w-4" /> },
    { label: "Propuesta de valor", key: "uniqueValue", icon: <Palette className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen flex bg-glow">
      {/* Cards panel */}
      <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto space-y-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground">Perfil de marca</h2>
          <p className="text-muted-foreground text-sm">Editá cualquier campo haciendo clic en el lápiz</p>
        </motion.div>
        {cards.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <BrandCard
              label={c.label}
              value={brandContext[c.key]}
              icon={c.icon}
              onSave={(val) => updateBrandField(c.key, val as never)}
            />
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <Button
            onClick={() => setStep("complete")}
            className="w-full h-12 mt-4 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Confirmar y continuar
          </Button>
        </motion.div>
      </div>

      {/* Chat panel */}
      <div className="hidden md:flex w-1/2 flex-col border-l border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold text-foreground">Chat de refinamiento</h3>
          <p className="text-xs text-muted-foreground">Pedime ajustes en lenguaje natural</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "ai"
                  ? "bg-secondary text-secondary-foreground"
                  : "ml-auto bg-primary text-primary-foreground"
              }`}
            >
              {m.text}
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-1 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-glow"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 border-t border-border flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ej: Cambiá el tono a más formal..."
            className="bg-secondary border-border"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            size="icon"
            className="shrink-0 bg-primary text-primary-foreground hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
