export default function DashboardSettings() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-display font-bold text-foreground">⚙️ Configuración</h1>
      <p className="text-muted-foreground">Conexión de cuentas de redes sociales y carga de voz/caras para clonación — próximamente.</p>
      <div className="space-y-4 max-w-xl">
        {["Instagram", "TikTok", "Tiendanube", "Voz personalizada", "Rostros para avatar"].map((item) => (
          <div key={item} className="glow-card rounded-xl p-4 gradient-border flex items-center justify-between">
            <span className="text-foreground font-medium">{item}</span>
            <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">No conectado</span>
          </div>
        ))}
      </div>
    </div>
  );
}
