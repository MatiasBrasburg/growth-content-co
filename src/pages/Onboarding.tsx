import { useOnboardingStore } from "@/store/onboarding-store";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { AnalyzingStep } from "@/components/onboarding/AnalyzingStep";
import { ReviewStep } from "@/components/onboarding/ReviewStep";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Onboarding() {
  const { step } = useOnboardingStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === "complete") {
      navigate("/dashboard");
    }
  }, [step, navigate]);

  if (step === "welcome") return <WelcomeStep />;
  if (step === "analyzing") return <AnalyzingStep />;
  return <ReviewStep />;
}
