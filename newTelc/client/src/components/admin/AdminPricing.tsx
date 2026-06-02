import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Edit2, Save, X, Loader2 } from "lucide-react";

export default function AdminPricing() {
  const { data: levels, isLoading } = trpc.examLevels.list.useQuery();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [prices, setPrices] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updatePriceMutation = trpc.examLevels.update.useMutation();

  useEffect(() => {
    if (levels) {
      const priceMap: Record<number, string> = {};
      levels.forEach((level) => {
        priceMap[level.id] = typeof level.price === "string" ? level.price : String(level.price);
      });
      setPrices(priceMap);
    }
  }, [levels]);

  const handleSavePrice = async (levelId: number) => {
    setIsSubmitting(true);
    try {
      await updatePriceMutation.mutateAsync({
        levelId,
        price: prices[levelId],
      });
      toast.success("Price updated successfully");
      setEditingId(null);
    } catch (error) {
      toast.error("Failed to update price");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <Loader2 className="animate-spin mx-auto mb-4" />
        Loading pricing data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Manage Pricing</h2>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Level</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Current Price (UZS)</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {levels?.map((level) => (
              <tr key={level.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{level.level}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {editingId === level.id ? (
                    <input
                      type="number"
                      className="form-input w-full max-w-xs"
                      value={prices[level.id]}
                      onChange={(e) =>
                        setPrices({ ...prices, [level.id]: e.target.value })
                      }
                    />
                  ) : (
                    `${prices[level.id]} UZS`
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {editingId === level.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSavePrice(level.id)}
                        disabled={isSubmitting}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
                      >
                        {isSubmitting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-700"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingId(level.id)}
                      className="flex items-center gap-1 text-accent hover:text-orange-600 font-medium"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
