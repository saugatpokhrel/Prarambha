"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CheckCircle2, XCircle, Clock, User, Search } from "lucide-react";
import { toast } from "sonner";
import { fetchAllCandidates, updateCandidateStatus } from "@/app/actions/admin";

type FilterType = "all" | "pending" | "approved" | "rejected";

interface Candidate {
  id: string;
  full_name: string;
  email: string;
  category: "mr" | "miss";
  phone: string;
  department: string;
  bio: string | null;
  image_url: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filter, setFilter] = useState<FilterType>("pending");
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Always fetch all candidates so stats are always accurate
  const fetchCandidates = useCallback(async () => {
    try {
      const data = await fetchAllCandidates("all");
      setCandidates(data);
    } catch (error) {
      toast.error("Failed to fetch candidates");
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const loadCandidates = async () => {
      setLoading(true);
      await fetchCandidates();
      setLoading(false);
    };
    loadCandidates();
  }, [fetchCandidates]);

  async function updateStatus(
    candidateId: string,
    newStatus: "approved" | "rejected",
  ) {
    setUpdatingId(candidateId);
    try {
      const result = await updateCandidateStatus(candidateId, newStatus);

      if (!result.success) {
        throw new Error(result.error || "Failed to update status");
      }

      toast.success(`Candidate ${newStatus}!`);
      setSelectedCandidate(null);
      await fetchCandidates();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  }

  // Apply filter and search client-side
  const filteredCandidates = candidates.filter(
    (candidate) =>
      (filter === "all" || candidate.status === filter) &&
      (candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const stats = {
    pending: candidates.filter((c) => c.status === "pending").length,
    approved: candidates.filter((c) => c.status === "approved").length,
    rejected: candidates.filter((c) => c.status === "rejected").length,
    total: candidates.length,
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total",
            value: stats.total,
            color: "from-blue-500 to-blue-600",
            icon: User,
          },
          {
            label: "Pending",
            value: stats.pending,
            color: "from-yellow-500 to-yellow-600",
            icon: Clock,
          },
          {
            label: "Approved",
            value: stats.approved,
            color: "from-green-500 to-green-600",
            icon: CheckCircle2,
          },
          {
            label: "Rejected",
            value: stats.rejected,
            color: "from-red-500 to-red-600",
            icon: XCircle,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} p-6 rounded-lg text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className="w-10 h-10 opacity-50" />
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "approved", "rejected"] as FilterType[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === status
                    ? "bg-rose-600 text-white"
                    : "bg-gray-200 dark:bg-neutral-800 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-700"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-rose-900 border-t-rose-400 rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No candidates found
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="border-b border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {candidate.full_name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          candidate.category === "mr"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300"
                        }`}
                      >
                        {candidate.category === "mr" ? "Mr" : "Miss"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {candidate.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          candidate.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                            : candidate.status === "approved"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                        }`}
                      >
                        {candidate.status.charAt(0).toUpperCase() +
                          candidate.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="text-rose-600 dark:text-rose-400 hover:underline font-semibold transition"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCandidate && (
        <div
          onClick={() => setSelectedCandidate(null)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-orange-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Candidate Details
              </h2>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-white hover:opacity-80 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {selectedCandidate.image_url && (
                <div className="flex justify-center">
                  <Image
                    src={selectedCandidate.image_url}
                    alt={selectedCandidate.full_name}
                    width={160}
                    height={160}
                    className="rounded-lg object-cover border-4 border-rose-200 dark:border-rose-900/30"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Full Name
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {selectedCandidate.full_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Category
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {selectedCandidate.category === "mr"
                      ? "Mr. Fresher"
                      : "Miss Fresher"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {selectedCandidate.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {selectedCandidate.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Department
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {selectedCandidate.department}
                  </p>
                </div>
              </div>

              {selectedCandidate.bio && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Bio
                  </p>
                  <p className="text-gray-900 dark:text-gray-300 mt-2">
                    {selectedCandidate.bio}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-neutral-700">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Current Status
                </p>
                <div
                  className={`inline-block px-4 py-2 rounded-lg font-semibold text-lg ${
                    selectedCandidate.status === "pending"
                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                      : selectedCandidate.status === "approved"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                  }`}
                >
                  {selectedCandidate.status.charAt(0).toUpperCase() +
                    selectedCandidate.status.slice(1)}
                </div>
              </div>

              {selectedCandidate.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
                  <button
                    onClick={() =>
                      updateStatus(selectedCandidate.id, "approved")
                    }
                    disabled={updatingId === selectedCandidate.id}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    {updatingId === selectedCandidate.id
                      ? "Approving..."
                      : "Approve"}
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(selectedCandidate.id, "rejected")
                    }
                    disabled={updatingId === selectedCandidate.id}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    {updatingId === selectedCandidate.id
                      ? "Rejecting..."
                      : "Reject"}
                  </button>
                </div>
              )}

              {selectedCandidate.status !== "pending" && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                  <p className="text-blue-900 dark:text-blue-300 text-sm">
                    This candidate has been {selectedCandidate.status}. Status
                    cannot be changed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
