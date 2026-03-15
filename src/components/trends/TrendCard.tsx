import { motion } from "framer-motion";
import { Heart, Eye, Clock, Play, Sparkles, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrendVideo } from "@/lib/api";

interface TrendCardProps {
  trend: TrendVideo;
  onReplicate: (trend: TrendVideo) => void;
  onRecord: (trend: TrendVideo) => void;
  index: number;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function TrendCard({ trend, onReplicate, onRecord, index }: TrendCardProps) {
  const colors = ["from-primary/20 to-accent/20", "from-accent/20 to-primary/20", "from-primary/30 to-secondary", "from-accent/30 to-secondary"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="glow-card rounded-xl overflow-hidden gradient-border group"
    >
      {/* Thumbnail placeholder */}
      <div className={`aspect-[9/16] bg-gradient-to-br ${colors[index % colors.length]} relative flex items-center justify-center`}>
        <Play className="h-12 w-12 text-foreground/30" />
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/80 text-[10px] font-medium text-foreground">
          <Clock className="h-3 w-3" /> {trend.duration}s
        </div>
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-background/80 text-[10px] font-medium text-foreground uppercase">
          {trend.platform === "tiktok" ? "TT" : "IG"}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <p className="text-xs text-muted-foreground font-medium">{trend.author}</p>
        <p className="text-sm text-foreground leading-snug line-clamp-2">{trend.description}</p>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {formatCount(trend.likes)}</span>
          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {formatCount(trend.views)}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {trend.hashtags.slice(0, 3).map((h) => (
            <span key={h} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-primary">{h}</span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            onClick={() => onReplicate(trend)}
            size="sm"
            className="flex-1 text-xs bg-primary text-primary-foreground hover:opacity-90"
          >
            <Sparkles className="mr-1 h-3 w-3" /> Replicar
          </Button>
          <Button
            onClick={() => onRecord(trend)}
            size="sm"
            variant="outline"
            className="flex-1 text-xs border-border text-foreground hover:bg-secondary"
          >
            <Video className="mr-1 h-3 w-3" /> Grabar
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
