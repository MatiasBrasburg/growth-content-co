export default function Trends() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-display font-bold text-foreground">🔥 Galería de Trends</h1>
      <p className="text-muted-foreground">Scraping de TikTok/IG con Apify + análisis con Gemini — próximamente en Parte 2.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glow-card rounded-xl aspect-[9/16] gradient-border flex items-center justify-center">
            <span className="text-muted-foreground text-xs">Trend #{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
