import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, Eye } from "lucide-react";

export default function AdminRegistrations() {
  const [selectedRegistration, setSelectedRegistration] = useState<any | null>(null);
  const { data: registrations, isLoading } = trpc.registrations.listAll.useQuery();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Manage Registrations</h2>

      {selectedRegistration ? (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Registration Details</h3>
            <button
              onClick={() => setSelectedRegistration(null)}
              className="text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="text-lg font-semibold text-gray-900">
                {selectedRegistration.firstName} {selectedRegistration.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-lg font-semibold text-gray-900">{selectedRegistration.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="text-lg font-semibold text-gray-900">{selectedRegistration.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Passport</p>
              <p className="text-lg font-semibold text-gray-900">{selectedRegistration.passportNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <p className="text-lg font-semibold text-gray-900">{selectedRegistration.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email Verified</p>
              <p className="text-lg font-semibold text-gray-900">
                {selectedRegistration.emailVerified ? "✓ Yes" : "✗ No"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="animate-spin mx-auto mb-4" />
              Loading registrations...
            </div>
          ) : registrations && registrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Level</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {registrations.map((reg: any) => (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{reg.firstName} {reg.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reg.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reg.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Level {reg.levelId}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reg.status === 'completed' ? 'bg-green-100 text-green-800' :
                          reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedRegistration(reg)}
                          className="flex items-center gap-1 text-accent hover:text-orange-600 font-medium"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-600">
              No registrations to display. Registrations will appear here once users complete the registration process.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
