import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle2, Loader2, ImagePlus, User, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadAssetToPython, type AssetUploadResult } from "@/lib/api";

interface FaceUploaderProps {
  type: "face" | "product";
  title: string;
  description: string;
  minFiles: number;
  maxFiles: number;
}

interface UploadedFile {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
  result?: AssetUploadResult;
}

export function FaceUploader({ type, title, description, minFiles, maxFiles }: FaceUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleAdd = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const remaining = maxFiles - files.length;
    const toAdd = selected.slice(0, remaining).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending" as const,
    }));
    setFiles((f) => [...f, ...toAdd]);
    e.target.value = "";
  }, [files.length, maxFiles]);

  const removeFile = (idx: number) => {
    setFiles((f) => {
      URL.revokeObjectURL(f[idx].preview);
      return f.filter((_, i) => i !== idx);
    });
  };

  const uploadAll = async () => {
    setUploading(true);
    const updated = [...files];
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status !== "pending") continue;
      updated[i] = { ...updated[i], status: "uploading" };
      setFiles([...updated]);
      try {
        const res = await uploadAssetToPython(updated[i].file, type);
        updated[i] = { ...updated[i], status: "done", result: res };
      } catch {
        updated[i] = { ...updated[i], status: "error" };
      }
      setFiles([...updated]);
    }
    setUploading(false);
  };

  const allDone = files.length >= minFiles && files.every((f) => f.status === "done");
  const canUpload = files.filter((f) => f.status === "pending").length > 0 && files.length >= minFiles;

  return (
    <div className="glow-card rounded-xl p-6 gradient-border space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            {type === "face" ? <User className="h-5 w-5" /> : <Package className="h-5 w-5" />}
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        {allDone && (
          <span className="flex items-center gap-1 text-xs text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" /> Listo
          </span>
        )}
      </div>

      {/* Preview grid */}
      <div className="grid grid-cols-5 gap-3">
        <AnimatePresence>
          {files.map((f, i) => (
            <motion.div
              key={f.preview}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-lg overflow-hidden bg-secondary"
            >
              <img src={f.preview} alt="" className="w-full h-full object-cover" />
              {f.status === "uploading" && (
                <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                </div>
              )}
              {f.status === "done" && (
                <div className="absolute top-1 right-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
              )}
              {f.status === "pending" && (
                <button
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-background/80 flex items-center justify-center hover:bg-destructive/80 transition-colors"
                >
                  <X className="h-3 w-3 text-foreground" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {files.length < maxFiles && (
          <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground mt-1">
              {files.length}/{maxFiles}
            </span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleAdd} />
          </label>
        )}
      </div>

      {files.length > 0 && files.length < minFiles && (
        <p className="text-xs text-accent">Necesitás al menos {minFiles} {type === "face" ? "fotos" : "imágenes"}</p>
      )}

      {canUpload && (
        <Button
          onClick={uploadAll}
          disabled={uploading}
          className="w-full bg-primary text-primary-foreground hover:opacity-90"
        >
          {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          Enviar al servidor de procesamiento
        </Button>
      )}
    </div>
  );
}
