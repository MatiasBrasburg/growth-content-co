import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrendCard } from "@/components/trends/TrendCard";
import { TrendAnalysisView } from "@/components/trends/TrendAnalysisView";
import { RecordMode } from "@/components/trends/RecordMode";
import { fetchTrends, analyzeTrendWithGemini, type TrendVideo, type TrendAnalysis } from "@/lib/api";
import { useOnboardingStore } from "@/store/onboarding-store";

export default function Trends() {
  const [trends, setTrends] = useState<TrendVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"all" | "tiktok" | "instagram">("all");

  // Analysis state
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<TrendVideo | null>(null);

  // Record mode
  const [recordMode, setRecordMode] = useState(false);

  const brandContext = useOnboardingStore((s) => s.brandContext);

  useEffect(() => {
    fetchTrends().then((t) => { setTrends(t); setLoading(false); });
  }, []);

  const filtered = trends.filter((t) => {
    if (platformFilter !== "all" && t.platform !== platformFilter) return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase()) && !t.hashtags.some((h) => h.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const handleReplicate = async (trend: TrendVideo) => {
    setSelectedTrend(trend);
    setAnalyzing(true);
    const result = await analyzeTrendWithGemini(trend.id, trend.videoUrl, brandContext?.industry || "General");
    setAnalysis(result);
    setAnalyzing(false);
  };

  const handleRecord = async (trend: TrendVideo) => {
    if (!analysis || analysis.trendId !== trend.id) {
      setSelectedTrend(trend);
      setAnalyzing(true);
      const result = await analyzeTrendWithGemini(trend.id, trend.videoUrl, brandContext?.industry || "General");
      setAnalysis(result);
      setAnalyzing(false);
    }
    setRecordMode(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">🔥 Galería de Trends</h1>
        <p className="text-muted-foreground mt-1">Videos virales de TikTok e Instagram vía Apify</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descripción o hashtag..."
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "tiktok", "instagram"] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={platformFilter === p ? "default" : "outline"}
              onClick={() => setPlatformFilter(p)}
              className={platformFilter === p
                ? "bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
              }
            >
              {p === "all" ? "Todos" : p === "tiktok" ? "TikTok" : "Instagram"}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-3 text-muted-foreground">Cargando trends desde Apify...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((trend, i) => (
            <TrendCard
              key={trend.id}
              trend={trend}
              onReplicate={handleReplicate}
              onRecord={handleRecord}
              index={i}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No se encontraron trends con ese filtro</p>
            </div>
          )}
        </div>
      )}

      {/* Analyzing overlay */}
      <AnimatePresence>
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
              <p className="text-lg font-display font-bold text-foreground">Gemini está analizando el video...</p>
              <p className="text-sm text-muted-foreground">Desarmando tomas, textos, tono y estructura</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis view */}
      <AnimatePresence>
        {analysis && !analyzing && !recordMode && (
          <TrendAnalysisView
            analysis={analysis}
            onClose={() => setAnalysis(null)}
            onStartRecording={() => setRecordMode(true)}
          />
        )}
      </AnimatePresence>

      {/* Record mode */}
      {recordMode && analysis && (
        <RecordMode
          analysis={analysis}
          onClose={() => { setRecordMode(false); setAnalysis(null); }}
        />
      )}
    </div>
  );
}
