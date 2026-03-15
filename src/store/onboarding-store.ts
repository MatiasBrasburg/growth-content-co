import { create } from "zustand";
import type { BrandContext } from "@/lib/api";

interface OnboardingState {
  step: "welcome" | "analyzing" | "review" | "complete";
  brandContext: BrandContext | null;
  setStep: (step: OnboardingState["step"]) => void;
  setBrandContext: (ctx: BrandContext) => void;
  updateBrandField: <K extends keyof BrandContext>(key: K, value: BrandContext[K]) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: "welcome",
  brandContext: null,
  setStep: (step) => set({ step }),
  setBrandContext: (brandContext) => set({ brandContext }),
  updateBrandField: (key, value) =>
    set((s) => ({
      brandContext: s.brandContext ? { ...s.brandContext, [key]: value } : null,
    })),
}));
