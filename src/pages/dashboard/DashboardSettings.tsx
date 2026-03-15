import { VoiceRecorder } from "@/components/settings/VoiceRecorder";
import { FaceUploader } from "@/components/settings/FaceUploader";
import { motion } from "framer-motion";

export default function DashboardSettings() {
  return (
    <div className="p-8 space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">⚙️ Configuración</h1>
        <p className="text-muted-foreground mt-1">Cargá tus activos de marca para la clonación de voz y avatar</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <VoiceRecorder />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <FaceUploader
          type="face"
          title="👤 Clonación de Rostro"
          description="Subí de 3 a 5 fotos frontales claras de tu rostro (buena iluminación, sin filtros)"
          minFiles={3}
          maxFiles={5}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <FaceUploader
          type="product"
          title="📦 Fotos de Productos"
          description="Subí fotos de tus productos principales para usarlos en videos"
          minFiles={1}
          maxFiles={5}
        />
      </motion.div>

      {/* Connection statuses */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-3">
        <h2 className="text-lg font-display font-semibold text-foreground">Cuentas conectadas</h2>
        {["Instagram", "TikTok", "Tiendanube"].map((item) => (
          <div key={item} className="glow-card rounded-xl p-4 gradient-border flex items-center justify-between">
            <span className="text-foreground font-medium">{item}</span>
            <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">No conectado</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
