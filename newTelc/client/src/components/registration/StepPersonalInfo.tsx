import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { trpc } from "@/lib/trpc";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface StepPersonalInfoProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
}

export default function StepPersonalInfo({ data, onDataChange, onNext }: StepPersonalInfoProps) {
  const t = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpStep, setOtpStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const sendOtpMutation = trpc.otp.send.useMutation();
  const verifyOtpMutation = trpc.otp.verify.useMutation();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.firstName.trim()) newErrors.firstName = t("step1.errors.firstNameRequired");
    if (!data.lastName.trim()) newErrors.lastName = t("step1.errors.lastNameRequired");
    if (!data.phoneNumber.trim()) newErrors.phoneNumber = t("step1.errors.phoneRequired");
    if (!data.email.trim()) newErrors.email = t("step1.errors.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = t("step1.errors.emailInvalid");
    if (!data.passportNumber.trim()) newErrors.passportNumber = t("step1.errors.passportRequired");
    if (!data.agreeTerms) newErrors.agreeTerms = t("step1.errors.termsRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setErrors({ email: t("step1.errors.emailInvalid") });
      return;
    }

    setSendingOtp(true);
    try {
      await sendOtpMutation.mutateAsync({ email: data.email });
      setOtpStep("otp");
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setErrors({ otp: t("step1.errors.otpRequired") });
      return;
    }

    setVerifyingOtp(true);
    try {
      await verifyOtpMutation.mutateAsync({ email: data.email, otp });
      onDataChange({ emailVerified: true });
      toast.success("Email verified successfully");
      setOtpStep("form");
    } catch (error) {
      setErrors({ otp: t("step1.errors.otpInvalid") });
      toast.error("Invalid OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("step1.title")}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name */}
        <div className="form-group">
          <label className="form-label">{t("step1.firstName")}</label>
          <input
            type="text"
            className="form-input"
            placeholder={t("step1.firstName")}
            value={data.firstName}
            onChange={(e) => onDataChange({ firstName: e.target.value })}
          />
          {errors.firstName && <p className="form-error">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label className="form-label">{t("step1.lastName")}</label>
          <input
            type="text"
            className="form-input"
            placeholder={t("step1.lastName")}
            value={data.lastName}
            onChange={(e) => onDataChange({ lastName: e.target.value })}
          />
          {errors.lastName && <p className="form-error">{errors.lastName}</p>}
        </div>

        {/* Phone Number */}
        <div className="form-group">
          <label className="form-label">{t("step1.phoneNumber")}</label>
          <input
            type="tel"
            className="form-input"
            placeholder="+998 (XX) XXX-XX-XX"
            value={data.phoneNumber}
            onChange={(e) => onDataChange({ phoneNumber: e.target.value })}
          />
          {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label">{t("step1.email")}</label>
          <div className="flex gap-2">
            <input
              type="email"
              className="form-input flex-1"
              placeholder="example@email.com"
              value={data.email}
              onChange={(e) => onDataChange({ email: e.target.value })}
              disabled={data.emailVerified}
            />
            {!data.emailVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp || !data.email}
                className="btn-secondary px-4 py-2 flex items-center gap-2"
              >
                {sendingOtp ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                {t("step1.sendOtp")}
              </button>
            )}
            {data.emailVerified && (
              <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                ✓ {t("common.success")}
              </div>
            )}
          </div>
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>

        {/* OTP Verification */}
        {otpStep === "otp" && !data.emailVerified && (
          <div className="form-group bg-blue-50 p-4 rounded-lg border border-blue-200">
            <label className="form-label text-blue-900">{t("step1.enterOtp")}</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="form-input flex-1"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                maxLength={6}
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifyingOtp || !otp}
                className="btn-primary px-4 py-2 flex items-center gap-2"
              >
                {verifyingOtp ? <Loader2 size={18} className="animate-spin" /> : "✓"}
                {t("step1.verifyOtp")}
              </button>
            </div>
            {errors.otp && <p className="form-error">{errors.otp}</p>}
          </div>
        )}

        {/* Passport Number */}
        <div className="form-group">
          <label className="form-label">{t("step1.passportNumber")}</label>
          <input
            type="text"
            className="form-input"
            placeholder="AA1234567"
            value={data.passportNumber}
            onChange={(e) => onDataChange({ passportNumber: e.target.value })}
          />
          {errors.passportNumber && <p className="form-error">{errors.passportNumber}</p>}
        </div>

        {/* Terms and Conditions */}
        <div className="form-group">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.agreeTerms || false}
              onChange={(e) => onDataChange({ agreeTerms: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
            />
            <span className="text-sm text-gray-700">{t("step1.agreeTerms")}</span>
          </label>
          {errors.agreeTerms && <p className="form-error">{errors.agreeTerms}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!data.emailVerified}
          className="btn-primary w-full mt-8"
        >
          {t("step1.next")} →
        </button>
      </form>
    </div>
  );
}
