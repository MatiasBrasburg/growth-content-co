import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BrandCardProps {
  label: string;
  value: string | string[];
  icon: React.ReactNode;
  onSave: (val: string | string[]) => void;
}

export function BrandCard({ label, value, icon, onSave }: BrandCardProps) {
  const [editing, setEditing] = useState(false);
  const isArray = Array.isArray(value);
  const [draft, setDraft] = useState(isArray ? value.join(", ") : value);

  const handleSave = () => {
    onSave(isArray ? draft.split(",").map((s) => s.trim()).filter(Boolean) : draft);
    setEditing(false);
  };

  return (
    <div className="glow-card rounded-xl p-4 space-y-2 gradient-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon}
          {label}
        </div>
        <button
          onClick={() => (editing ? handleSave() : setEditing(true))}
          className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          {editing ? <Check className="h-4 w-4 text-primary" /> : <Pencil className="h-4 w-4" />}
        </button>
      </div>
      {editing ? (
        isArray ? (
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="bg-secondary border-border text-sm"
            rows={2}
          />
        ) : (
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="bg-secondary border-border text-sm"
          />
        )
      ) : (
        <p className="text-foreground text-sm leading-relaxed">
          {isArray ? (value as string[]).join(" · ") : (value as string)}
        </p>
      )}
    </div>
  );
}
