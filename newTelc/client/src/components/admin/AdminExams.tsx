import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";

const REGIONS = [
  { code: "tashkent", label: "Tashkent" },
  { code: "samarkand", label: "Samarkand" },
  { code: "fergana", label: "Fergana" },
  { code: "kashkadarya", label: "Kashkadarya" },
  { code: "bukhara", label: "Bukhara" },
  { code: "urgench", label: "Urgench" },
];

const LEVELS = [
  { id: 1, name: "A2/B1" },
  { id: 2, name: "B1" },
  { id: 3, name: "B2" },
  { id: 4, name: "C1" },
];

export default function AdminExams() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    levelId: "1",
    region: "tashkent",
    address: "",
    examDate: "",
    startTime: "09:00",
    endTime: "11:00",
    capacity: "30",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: exams, isLoading, refetch } = trpc.exams.list.useQuery();
  const createExamMutation = trpc.exams.create.useMutation();
  const deleteExamMutation = trpc.exams.delete.useMutation();

  const handleDelete = async (examId: number) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    
    try {
      await deleteExamMutation.mutateAsync({ examId });
      toast.success("Exam deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete exam");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createExamMutation.mutateAsync({
        levelId: parseInt(formData.levelId),
        region: formData.region,
        address: formData.address,
        examDate: new Date(formData.examDate),
        startTime: formData.startTime,
        endTime: formData.endTime,
        capacity: parseInt(formData.capacity),
      });

      toast.success("Exam created successfully");
      setShowForm(false);
      setFormData({
        levelId: "1",
        region: "tashkent",
        address: "",
        examDate: "",
        startTime: "09:00",
        endTime: "11:00",
        capacity: "30",
      });
      refetch();
    } catch (error) {
      toast.error("Failed to create exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Manage Exams</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Exam
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Exam</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Level</label>
              <select
                className="form-input"
                value={formData.levelId}
                onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
              >
                {LEVELS.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Region</label>
              <select
                className="form-input"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              >
                {REGIONS.map((region) => (
                  <option key={region.code} value={region.code}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="Exam location address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Exam Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">Capacity</label>
              <input
                type="number"
                className="form-input"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                min="1"
              />
            </div>

            <div>
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="form-input"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="form-input"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                Create Exam
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-600">Loading exams...</div>
        ) : exams && exams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Level</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Region</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Capacity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {exams.map((exam: any) => (
                  <tr key={exam.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">Level {exam.levelId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">{exam.region}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(exam.examDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {exam.startTime} - {exam.endTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{exam.capacity}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-600">
            No exams yet. Create your first exam to get started.
          </div>
        )}
      </div>
    </div>
  );
}
