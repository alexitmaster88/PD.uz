import { useLocation } from "wouter";
import { useTranslation } from "@/hooks/useTranslation";
import { CheckCircle, Download, Home } from "lucide-react";

interface SuccessScreenProps {
  registrationId: number;
  formData: any;
}

export default function SuccessScreen({ registrationId, formData }: SuccessScreenProps) {
  const [, setLocation] = useLocation();
  const t = useTranslation();

  const handleDownloadTicket = () => {
    // TODO: Implement PDF ticket download
    alert("Ticket download feature coming soon");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("success.title")}</h2>
        <p className="text-gray-600">Registration ID: #{registrationId}</p>
      </div>

      {/* Confirmation Details */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("success.confirmationDetails")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">{t("success.name")}</p>
            <p className="text-lg font-semibold text-gray-900">
              {formData.firstName} {formData.lastName}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{t("success.region")}</p>
            <p className="text-lg font-semibold text-gray-900">{formData.region}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{t("success.date")}</p>
            <p className="text-lg font-semibold text-gray-900">
              {formData.selectedDate ? new Date(formData.selectedDate).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{t("success.time")}</p>
            <p className="text-lg font-semibold text-gray-900">{formData.selectedTime || "N/A"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-600 mb-1">{t("success.level")}</p>
            <p className="text-lg font-semibold text-gray-900">{formData.level}</p>
          </div>
        </div>
      </div>

      {/* Important Reminders */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("success.reminders")}</h3>
        <div className="space-y-3">
          <div className="reminder-box">
            <p className="reminder-text">⏰ {t("success.reminder1")}</p>
          </div>
          <div className="reminder-box">
            <p className="reminder-text">🛂 {t("success.reminder2")}</p>
          </div>
          <div className="reminder-box">
            <p className="reminder-text">⚠️ {t("success.reminder3")}</p>
          </div>
        </div>
      </div>

      {/* Email Confirmation Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
        <p className="text-green-900 text-sm">
          ✓ A confirmation email has been sent to <strong>{formData.email}</strong> with your registration details and ticket.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleDownloadTicket}
          className="btn-secondary flex-1 flex items-center justify-center gap-2"
        >
          <Download size={18} />
          {t("success.downloadTicket")}
        </button>
        <button
          onClick={() => setLocation("/")}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <Home size={18} />
          {t("success.backHome")}
        </button>
      </div>
    </div>
  );
}
