// components/registration/RegistrationManager.tsx
"use client";

import React, { useState } from "react";
import { Candidate } from "@/types/index";
import { deleteCandidate } from "@/app/actions/registration";
import { RegistrationForm } from "./RegistrationForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Edit2, CheckCircle, Clock, XCircle } from "lucide-react";

interface RegistrationManagerProps {
  initialData: Candidate | null;
}

export function RegistrationManager({ initialData }: RegistrationManagerProps) {
  const [candidate, setCandidate] = useState<Candidate | null>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCandidate = async () => {
    if (!candidate) return;
    setIsDeleting(true);
    try {
      const result = await deleteCandidate(candidate.id);
      if (result.success) {
        toast.success("Registration deleted successfully");
        setCandidate(null);
        setShowDeleteConfirm(false);
      } else {
        toast.error(result.error || "Failed to delete registration");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateSuccess = (updatedCandidate: Candidate) => {
    setCandidate(updatedCandidate);
    setIsEditing(false);
  };

  const handleRegistrationSuccess = (newCandidate: Candidate) => {
    setCandidate(newCandidate);
  };

  // ── Edit form view ────────────────────────────────────────────────────────
  if (candidate && isEditing) {
    return (
      <RegistrationForm
        existingData={candidate}
        onSuccess={handleUpdateSuccess}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // ── Existing registration card view ──────────────────────────────────────
  if (candidate) {
    const isPending = candidate.status === "pending";
    const isApproved = candidate.status === "approved";
    const isRejected = candidate.status === "rejected";

    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit2 className="w-5 h-5" />
              Your Registration
            </h3>
          </div>

          <div className="p-6 space-y-4">
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Name
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {candidate.full_name}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Category
                </p>
                <p className="text-lg font-semibold text-rose-600 dark:text-rose-400">
                  {candidate.category === "mr" ? "Mr. Fresher" : "Miss Fresher"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Phone
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {candidate.phone}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Faculty
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {candidate.department}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Status
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {isPending && (
                    <>
                      <Clock className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                        Pending Review
                      </span>
                    </>
                  )}
                  {isApproved && (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        Approved
                      </span>
                    </>
                  )}
                  {isRejected && (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="font-semibold text-red-600 dark:text-red-400">
                        Rejected
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {candidate.bio && (
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  About
                </p>
                <p className="text-neutral-700 dark:text-neutral-300">
                  {candidate.bio}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex gap-3">
              {isApproved && (
                <p className="text-sm text-green-700 dark:text-green-400 w-full text-center py-2 font-medium">
                  Your registration is approved — you are an official candidate!
                </p>
              )}

              {isPending && (
                <>
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}

              {isRejected && (
                <>
                  <Button
                    className="flex-1 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white flex items-center justify-center gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit &amp; Resubmit
                  </Button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-sm w-full border border-neutral-200 dark:border-neutral-800"
            >
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                Delete Registration?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete your registration? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <button
                  onClick={handleDeleteCandidate}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── New registration form ─────────────────────────────────────────────────
  return (
    <RegistrationForm
      existingData={null}
      onSuccess={handleRegistrationSuccess}
    />
  );
}
