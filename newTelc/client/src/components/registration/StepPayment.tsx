import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, QrCode, Check } from "lucide-react";

interface StepPaymentProps {
  registrationId: number;
  amount: string;
  onPaymentComplete: () => void;
  onPrevious: () => void;
}

export default function StepPayment({
  registrationId,
  amount,
  onPaymentComplete,
  onPrevious,
}: StepPaymentProps) {
  const t = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<"click" | "payme" | "other" | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);

  const createPaymentMutation = trpc.payments.create.useMutation();
  const verifyPaymentMutation = trpc.payments.verify.useMutation();

  const handleSelectPaymentMethod = (method: "click" | "payme" | "other") => {
    setSelectedMethod(method);
  };

  const handleVerifyPayment = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsVerifying(true);
    try {
      // Create payment record
      const paymentResult = await createPaymentMutation.mutateAsync({
        registrationId,
        amount,
        paymentMethod: selectedMethod,
      });

      // Simulate payment verification (in real app, this would check with payment provider)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Verify payment
      const paymentId = paymentResult ? (paymentResult as any).insertId || 1 : 1;
      await verifyPaymentMutation.mutateAsync({
        paymentId,
      });

      setPaymentVerified(true);
      toast.success("Payment verified successfully!");

      // Wait a moment before proceeding
      setTimeout(() => {
        onPaymentComplete();
      }, 1500);
    } catch (error) {
      toast.error("Payment verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const paymentMethods = [
    {
      id: "click",
      name: t("step3.click"),
      icon: "💳",
      color: "bg-blue-50 border-blue-200 hover:border-blue-400",
      qrPlaceholder: "Click QR Code",
    },
    {
      id: "payme",
      name: t("step3.payme"),
      icon: "📱",
      color: "bg-purple-50 border-purple-200 hover:border-purple-400",
      qrPlaceholder: "Payme QR Code",
    },
    {
      id: "other",
      name: t("step3.other"),
      icon: "🏦",
      color: "bg-green-50 border-green-200 hover:border-green-400",
      qrPlaceholder: "Bank Transfer QR Code",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("step3.title")}</h2>

      {/* Amount Display */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
        <p className="text-gray-600 text-sm mb-2">{t("step3.amount")}</p>
        <p className="text-4xl font-bold text-accent">
          {amount} {t("examLevels.som")}
        </p>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("step3.selectPaymentMethod")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelectPaymentMethod(method.id as any)}
              className={`qr-code-container border-2 ${method.color} ${
                selectedMethod === method.id ? "border-accent bg-orange-50" : "border-gray-200"
              }`}
            >
              <div className="text-4xl mb-2">{method.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-2">{method.name}</h4>
              <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center mx-auto mb-4">
                <QrCode size={48} className="text-gray-400" />
              </div>
              <p className="text-xs text-gray-600">{method.qrPlaceholder}</p>
              {selectedMethod === method.id && (
                <div className="mt-2 text-accent font-semibold">✓ {t("common.selected")}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Instructions */}
      {selectedMethod && !paymentVerified && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-blue-900 mb-3">
            {selectedMethod === "click" && "Click Payment Instructions"}
            {selectedMethod === "payme" && "Payme Payment Instructions"}
            {selectedMethod === "other" && "Bank Transfer Instructions"}
          </h4>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Scan the QR code with your mobile device</li>
            <li>Enter the amount: {amount} {t("examLevels.som")}</li>
            <li>Complete the payment</li>
            <li>Click "Verify Payment" below to confirm</li>
          </ol>
        </div>
      )}

      {/* Verification Status */}
      {paymentVerified && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-center gap-3">
          <Check size={24} className="text-green-600" />
          <div>
            <h4 className="font-semibold text-green-900">Payment Verified</h4>
            <p className="text-sm text-green-800">Your payment has been successfully processed.</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isVerifying || paymentVerified}
          className="btn-secondary flex-1"
        >
          ← {t("step3.previous")}
        </button>
        {!paymentVerified ? (
          <button
            type="button"
            onClick={handleVerifyPayment}
            disabled={!selectedMethod || isVerifying}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {isVerifying && <Loader2 size={18} className="animate-spin" />}
            {t("step3.verifyPayment")}
          </button>
        ) : (
          <button
            type="button"
            onClick={onPaymentComplete}
            className="btn-primary flex-1"
          >
            {t("step3.submit")} →
          </button>
        )}
      </div>
    </div>
  );
}
