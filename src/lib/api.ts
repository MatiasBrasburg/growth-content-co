/**
 * Capa de abstracción para llamadas a APIs externas.
 * Preparada para conectar con Edge Functions de Supabase
 * y con el servidor local de video (Python/C#).
 */

// ===== BRAND CONTEXT (Onboarding) =====
export interface BrandContext {
  businessName: string;
  industry: string;
  products: string[];
  targetAudience: string;
  brandTone: string;
  colors: string[];
  uniqueValue: string;
}

export async function analyzeBusiness(input: string): Promise<BrandContext> {
  await new Promise((r) => setTimeout(r, 2500));
  const isUrl = input.startsWith("http");
  const name = isUrl ? new URL(input).hostname.replace("www.", "").split(".")[0] : input;
  return {
    businessName: name.charAt(0).toUpperCase() + name.slice(1),
    industry: "Moda y Lifestyle",
    products: ["Ropa casual", "Accesorios", "Calzado deportivo"],
    targetAudience: "Jóvenes 18-35 años, urbanos, interesados en tendencias",
    brandTone: "Cercano, enérgico y aspiracional",
    colors: ["#00C9DB", "#FF6B9D", "#1A1F36"],
    uniqueValue: "Moda accesible con diseño premium inspirado en tendencias globales",
  };
}

export async function chatRefine(message: string, context: BrandContext): Promise<string> {
  await new Promise((r) => setTimeout(r, 1200));
  if (message.toLowerCase().includes("tono")) return "Entendido, he actualizado el tono de tu marca. ¿Hay algo más que quieras ajustar?";
  if (message.toLowerCase().includes("producto")) return "He actualizado la lista de productos. ¿Los colores y el público objetivo están bien?";
  return `Perfecto, tomé nota de eso para ${context.businessName}. ¿Quieres ajustar algo más o confirmamos el perfil?`;
}

// ===== VIDEO SERVER =====
export async function callVideoServer(endpoint: string, payload: Record<string, unknown>) {
  const baseUrl = import.meta.env.VITE_LOCAL_PYTHON_SERVER_URL || "http://localhost:8000";
  console.log(`[VideoServer] POST ${baseUrl}/${endpoint}`, payload);
  return { status: "queued", message: "El servidor de video procesará esta solicitud" };
}

// ===== ASSET UPLOAD (Voice/Face → Python Server) =====
export interface AssetUploadResult {
  assetId: string;
  type: "voice" | "face" | "product";
  status: "processing" | "ready";
  fileName: string;
}

export async function uploadAssetToPython(
  file: File | Blob,
  type: "voice" | "face" | "product"
): Promise<AssetUploadResult> {
  // TODO: Real implementation → POST to LOCAL_PYTHON_SERVER_URL/api/upload-assets
  await new Promise((r) => setTimeout(r, 2000));
  return {
    assetId: `asset_${type}_${Date.now()}`,
    type,
    status: "processing",
    fileName: file instanceof File ? file.name : `recording_${Date.now()}.webm`,
  };
}

// ===== TRENDS (Apify) =====
export interface TrendVideo {
  id: string;
  platform: "tiktok" | "instagram";
  thumbnailUrl: string;
  videoUrl: string;
  author: string;
  description: string;
  likes: number;
  views: number;
  duration: number;
  hashtags: string[];
}

export async function fetchTrends(): Promise<TrendVideo[]> {
  // TODO: Real implementation → Apify API with APIFY_API_TOKEN
  await new Promise((r) => setTimeout(r, 1500));
  const mockTrends: TrendVideo[] = [
    { id: "t1", platform: "tiktok", thumbnailUrl: "", videoUrl: "", author: "@fashionista_pro", description: "Transformación de outfit en 3 segundos 🔥", likes: 245000, views: 1800000, duration: 15, hashtags: ["#outfit", "#fashion", "#viral"] },
    { id: "t2", platform: "instagram", thumbnailUrl: "", videoUrl: "", author: "@style.guru", description: "POV: Tu amiga te pide consejo de moda", likes: 189000, views: 920000, duration: 22, hashtags: ["#pov", "#moda", "#reels"] },
    { id: "t3", platform: "tiktok", thumbnailUrl: "", videoUrl: "", author: "@streetwear_daily", description: "3 formas de combinar zapatillas blancas", likes: 567000, views: 3200000, duration: 30, hashtags: ["#sneakers", "#tips", "#streetwear"] },
    { id: "t4", platform: "instagram", thumbnailUrl: "", videoUrl: "", author: "@minimal.closet", description: "Cápsula de verano con 10 prendas", likes: 98000, views: 450000, duration: 45, hashtags: ["#capsulewardrobe", "#summer", "#minimal"] },
    { id: "t5", platform: "tiktok", thumbnailUrl: "", videoUrl: "", author: "@trendsetter.mx", description: "Haul de temporada: lo que SÍ vale la pena", likes: 312000, views: 2100000, duration: 60, hashtags: ["#haul", "#shopping", "#tendencia"] },
    { id: "t6", platform: "tiktok", thumbnailUrl: "", videoUrl: "", author: "@lookbook.ar", description: "Elegí tu look para la semana ✨", likes: 156000, views: 780000, duration: 18, hashtags: ["#lookbook", "#ootd", "#elegante"] },
    { id: "t7", platform: "instagram", thumbnailUrl: "", videoUrl: "", author: "@diy.fashion", description: "Customizá tu remera vieja en 2 minutos", likes: 423000, views: 2800000, duration: 35, hashtags: ["#diy", "#upcycle", "#creative"] },
    { id: "t8", platform: "tiktok", thumbnailUrl: "", videoUrl: "", author: "@shopaddict", description: "Lo mejor de la semana en ofertas online", likes: 87000, views: 390000, duration: 25, hashtags: ["#ofertas", "#online", "#deals"] },
  ];
  return mockTrends;
}

// ===== TREND ANALYSIS (Gemini) =====
export interface VideoShot {
  shotNumber: number;
  startTime: number;
  endTime: number;
  duration: number;
  description: string;
  textOnScreen: string;
  emotion: string;
}

export interface TrendAnalysis {
  trendId: string;
  totalDuration: number;
  shots: VideoShot[];
  transcript: string;
  voiceTone: string;
  hookTexts: string[];
  adaptationSuggestion: string;
}

export async function analyzeTrendWithGemini(
  trendId: string,
  videoUrl: string,
  userIndustry: string
): Promise<TrendAnalysis> {
  // TODO: Real → Edge Function → Gemini Multimodal API
  // Prompt: "Analiza este video viral de TikTok/Reels. Devuelve un JSON estricto con:
  // duración de cada toma, textos en pantalla (ganchos), transcripción del audio,
  // tono/emoción de la voz, y sugerencia de cómo un negocio del rubro [RUBRO_DEL_USUARIO]
  // podría adaptar este guion."
  await new Promise((r) => setTimeout(r, 3500));

  return {
    trendId,
    totalDuration: 22,
    shots: [
      { shotNumber: 1, startTime: 0, endTime: 3, duration: 3, description: "Gancho inicial — primer plano al rostro con expresión de sorpresa", textOnScreen: "¿Sabías que...?", emotion: "sorpresa/intriga" },
      { shotNumber: 2, startTime: 3, endTime: 8, duration: 5, description: "Presentación del problema — plano medio hablando a cámara", textOnScreen: "El 80% comete este error", emotion: "autoridad/confianza" },
      { shotNumber: 3, startTime: 8, endTime: 15, duration: 7, description: "Demostración del producto/solución — B-roll con transiciones rápidas", textOnScreen: "La solución es más simple de lo que crees", emotion: "entusiasmo" },
      { shotNumber: 4, startTime: 15, endTime: 20, duration: 5, description: "Resultado — antes/después o reacción positiva", textOnScreen: "Resultado final ✨", emotion: "satisfacción" },
      { shotNumber: 5, startTime: 20, endTime: 22, duration: 2, description: "CTA — llamada a la acción directa", textOnScreen: "Seguime para más tips", emotion: "cercanía/urgencia" },
    ],
    transcript: "¿Sabías que el 80% de las personas comete este error al elegir su outfit? La clave está en los colores complementarios. Mirá cómo cambia todo con solo un ajuste... ¡Increíble el resultado! Seguime para más tips como este.",
    voiceTone: "Enérgico y cercano, con pausas estratégicas para generar intriga. Velocidad media-alta.",
    hookTexts: ["¿Sabías que...?", "El 80% comete este error", "La solución es más simple de lo que crees", "Resultado final ✨"],
    adaptationSuggestion: `Para un negocio de ${userIndustry}: Reemplazá el gancho genérico con un dato específico de tu industria. En la toma 3, mostrá tu producto real con transiciones similares. El CTA debe dirigir a tu tienda online o WhatsApp. Mantené la misma estructura de 5 tomas y tiempos para replicar el ritmo viral.`,
  };
}
