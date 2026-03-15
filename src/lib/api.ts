/**
 * Capa de abstracción para llamadas a APIs externas.
 * Preparada para conectar con Edge Functions de Supabase
 * y con el servidor local de video (Python/C#).
 */

// Simulación de llamada a Pomelli/Gemini para extraer contexto de marca
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
  // TODO: Reemplazar con llamada real a Edge Function → Pomelli/Gemini
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

// Simulación de respuesta del chatbot de refinamiento
export async function chatRefine(message: string, context: BrandContext): Promise<string> {
  // TODO: Reemplazar con llamada real a Gemini
  await new Promise((r) => setTimeout(r, 1200));

  if (message.toLowerCase().includes("tono")) {
    return "Entendido, he actualizado el tono de tu marca. ¿Hay algo más que quieras ajustar?";
  }
  if (message.toLowerCase().includes("producto")) {
    return "He actualizado la lista de productos. ¿Los colores y el público objetivo están bien?";
  }
  return `Perfecto, tomé nota de eso para ${context.businessName}. ¿Quieres ajustar algo más o confirmamos el perfil?`;
}

// Placeholder para llamadas al servidor local de video
export async function callVideoServer(endpoint: string, payload: Record<string, unknown>) {
  const baseUrl = import.meta.env.VITE_LOCAL_PYTHON_SERVER_URL || "http://localhost:8000";
  // TODO: Implementar llamada real en Parte 2
  console.log(`[VideoServer] POST ${baseUrl}/${endpoint}`, payload);
  return { status: "queued", message: "El servidor de video procesará esta solicitud" };
}
