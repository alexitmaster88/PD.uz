import { useState, useMemo } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Calendar, Clock } from "lucide-react";

interface StepExamSelectionProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onRegistrationComplete: (regId: number) => void;
}

const REGIONS = [
  { code: "tashkent", label: "regions.tashkent" },
  { code: "samarkand", label: "regions.samarkand" },
  { code: "fergana", label: "regions.fergana" },
  { code: "kashkadarya", label: "regions.kashkadarya" },
  { code: "bukhara", label: "regions.bukhara" },
  { code: "urgench", label: "regions.urgench" },
];

const LEVELS = [
  { id: 1, name: "A2/B1" },
  { id: 2, name: "B1" },
  { id: 3, name: "B2" },
  { id: 4, name: "C1" },
];

export default function StepExamSelection({
  data,
  onDataChange,
  onNext,
  onPrevious,
  onRegistrationComplete,
}: StepExamSelectionProps) {
  const t = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: exams } = trpc.exams.getByRegionAndLevel.useQuery(
    {
      region: data.region,
      levelId: data.level ? parseInt(data.level) : 0,
    },
    { enabled: !!data.region && !!data.level }
  );

  const createRegistrationMutation = trpc.registrations.create.useMutation();

  // Get available dates from exams
  const availableDates = useMemo(() => {
    if (!exams) return [];
    const dates = new Set<string>();
    exams.forEach((exam) => {
      const date = new Date(exam.examDate);
      dates.add(date.toISOString().split("T")[0]);
    });
    return Array.from(dates).sort();
  }, [exams]);

  // Get available times for selected date
  const availableTimes = useMemo(() => {
    if (!exams || !selectedDate) return [];
    const times = new Set<string>();
    exams.forEach((exam) => {
      const date = new Date(exam.examDate);
      const examDate = date.toISOString().split("T")[0];
      if (examDate === selectedDate) {
        times.add(exam.startTime);
      }
    });
    return Array.from(times).sort();
  }, [exams, selectedDate]);

  // Get selected exam
  const selectedExam = useMemo(() => {
    if (!exams || !selectedDate || !selectedTime) return null;
    return exams.find((exam) => {
      const date = new Date(exam.examDate);
      const examDate = date.toISOString().split("T")[0];
      return examDate === selectedDate && exam.startTime === selectedTime;
    });
  }, [exams, selectedDate, selectedTime]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.region) newErrors.region = t("step2.selectRegion");
    if (!data.level) newErrors.level = t("step2.selectLevel");
    if (!selectedDate) newErrors.date = t("step2.selectDate");
    if (!selectedTime) newErrors.time = t("step2.selectTime");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedExam) return;

    setIsSubmitting(true);
    try {
      const result = await createRegistrationMutation.mutateAsync({
        examId: selectedExam.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        passportNumber: data.passportNumber,
      });

      onDataChange({
        examId: selectedExam.id,
        selectedDate,
        selectedTime,
      });
      const registrationId = result ? (result as any).insertId || 1 : 1;
      onRegistrationComplete(registrationId);
      toast.success("Registration created successfully");
    } catch (error) {
      toast.error("Failed to create registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("step2.title")}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Region Selection */}
        <div className="form-group">
          <label className="form-label">{t("step2.region")}</label>
          <select
            className="form-input"
            value={data.region}
            onChange={(e) => {
              onDataChange({ region: e.target.value, level: "", selectedDate: "", selectedTime: "" });
              setSelectedDate("");
              setSelectedTime("");
            }}
          >
            <option value="">{t("step2.selectRegion")}</option>
            {REGIONS.map((region) => (
              <option key={region.code} value={region.code}>
                {t(`step2.${region.label}`)}
              </option>
            ))}
          </select>
          {errors.region && <p className="form-error">{errors.region}</p>}
        </div>

        {/* Level Selection */}
        <div className="form-group">
          <label className="form-label">{t("step2.level")}</label>
          <select
            className="form-input"
            value={data.level}
            onChange={(e) => {
              onDataChange({ level: e.target.value, selectedDate: "", selectedTime: "" });
              setSelectedDate("");
              setSelectedTime("");
            }}
            disabled={!data.region}
          >
            <option value="">{t("step2.selectLevel")}</option>
            {LEVELS.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>
          {errors.level && <p className="form-error">{errors.level}</p>}
        </div>

        {/* Date Selection */}
        {data.region && data.level && (
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <Calendar size={18} />
              {t("step2.date")}
            </label>
            <select
              className="form-input"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime("");
              }}
            >
              <option value="">{t("step2.selectDate")}</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
            </select>
            {errors.date && <p className="form-error">{errors.date}</p>}
            {availableDates.length === 0 && data.region && data.level && (
              <p className="form-error">{t("step2.noExamsAvailable")}</p>
            )}
          </div>
        )}

        {/* Time Selection */}
        {selectedDate && (
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <Clock size={18} />
              {t("step2.time")}
            </label>
            <select
              className="form-input"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <option value="">{t("step2.selectTime")}</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.time && <p className="form-error">{errors.time}</p>}
          </div>
        )}

        {/* Summary */}
        {selectedExam && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                <strong>Region:</strong> {t(`step2.regions.${data.region}`)}
              </p>
              <p>
                <strong>Level:</strong> {data.level}
              </p>
              <p>
                <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {selectedTime}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={onPrevious}
            className="btn-secondary flex-1"
          >
            ← {t("step2.previous")}
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedExam}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
            {t("step2.next")} →
          </button>
        </div>
      </form>
    </div>
  );
}
