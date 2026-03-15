import { BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-display font-bold text-foreground">📊 Analíticas</h1>
      <p className="text-muted-foreground">Integración con Instagram, TikTok y Tiendanube — próximamente en Parte 2.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Alcance", "Engagement", "Conversiones"].map((label) => (
          <div key={label} className="glow-card rounded-xl p-6 gradient-border space-y-2">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-display font-bold text-foreground">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
