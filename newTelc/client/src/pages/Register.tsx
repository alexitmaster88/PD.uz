import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import StepPersonalInfo from "@/components/registration/StepPersonalInfo";
import StepExamSelection from "@/components/registration/StepExamSelection";
import StepPayment from "@/components/registration/StepPayment";
import SuccessScreen from "@/components/registration/SuccessScreen";

export default function Register() {
  const [, setLocation] = useLocation();
  const t = useTranslation();
  const { language } = useLanguage();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    passportNumber: "",
    region: "",
    level: "",
    examId: null as number | null,
    paymentMethod: "",
  });

  const [registrationId, setRegistrationId] = useState<number | null>(null);
  const [paymentVerified, setPaymentVerified] = useState(false);

  const totalSteps = 4; // Step 1: Personal Info, Step 2: Exam Selection, Step 3: Payment, Step 4: Success

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormDataChange = (data: any) => {
    setFormData({ ...formData, ...data });
  };

  const handleRegistrationComplete = (regId: number) => {
    setRegistrationId(regId);
    handleNextStep();
  };

  const handlePaymentComplete = () => {
    setPaymentVerified(true);
    handleNextStep();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-accent hover:text-orange-600 font-semibold"
          >
            <ChevronLeft size={20} />
            {t("common.close")}
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {language === "uz" && "Imtihonga ro'yxatdan o'tish"}
            {language === "en" && "Exam Registration"}
            {language === "de" && "Prüfungsanmeldung"}
          </h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 py-6 px-4">
        <div className="container mx-auto">
          <div className="step-indicator">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`step-dot ${
                    step === currentStep ? "active" : step < currentStep ? "completed" : ""
                  }`}
                >
                  {step < currentStep ? <Check size={20} /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`step-line ${step < currentStep ? "active" : ""}`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            {t("registration.progressBar", {
              current: currentStep,
              total: totalSteps,
            })}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {currentStep === 1 && (
          <StepPersonalInfo
            data={formData}
            onDataChange={handleFormDataChange}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 2 && (
          <StepExamSelection
            data={formData}
            onDataChange={handleFormDataChange}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            onRegistrationComplete={handleRegistrationComplete}
          />
        )}

        {currentStep === 3 && registrationId && (
          <StepPayment
            registrationId={registrationId}
            amount={formData.level}
            onPaymentComplete={handlePaymentComplete}
            onPrevious={handlePreviousStep}
          />
        )}

        {currentStep === 4 && registrationId && (
          <SuccessScreen
            registrationId={registrationId}
            formData={formData}
          />
        )}
      </div>
    </div>
  );
}
