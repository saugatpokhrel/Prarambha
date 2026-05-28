// components/registration/RegistrationForm.tsx
"use client";

import React, { useState } from "react";
import { Candidate, CandidateFormData } from "@/types/index";
import { registerCandidate, updateCandidate } from "@/app/actions/registration";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  Phone,
  GraduationCap,
  FileText,
  ArrowRight,
  Loader2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { MrAvatar, MissAvatar } from "@/components/ui/CategoryAvatar";

interface RegistrationFormProps {
  existingData?: Candidate | null;
  onSuccess?: (candidate: Candidate) => void;
  onCancel?: () => void;
}

const FACULTIES = ["BCT", "BEI"] as const;

function validatePhone(phone: string): string | null {
  const val = phone.trim();
  if (!val) return "Phone number is required.";
  if (!/^\d+$/.test(val)) return "Enter valid number";
  if (val.length !== 10) return "Enter valid number";
  if (!val.startsWith("9")) return "Enter valid number";
  return null;
}

export function RegistrationForm({
  existingData,
  onSuccess,
  onCancel,
}: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState<CandidateFormData>({
    full_name: existingData?.full_name || "",
    category: existingData?.category || "mr",
    phone: existingData?.phone || "",
    department: existingData?.department || "BCT",
    bio: existingData?.bio || "",
  });

  const isEditing = !!existingData;
  const isApproved = existingData?.status === "approved";
  const isRejected = existingData?.status === "rejected";

  const PreviewAvatar = formData.category === "mr" ? MrAvatar : MissAvatar;

  if (isApproved) {
    return (
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">✨</div>
        <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-2">
          Registration Approved!
        </h3>
        <p className="text-green-700 dark:text-green-400">
          Congratulations! Your application has been approved. You are now an
          official candidate.
        </p>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "phone") setPhoneError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneBlur = () => {
    setPhoneError(validatePhone(formData.phone));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }

    setIsLoading(true);
    try {
      const result = existingData
        ? await updateCandidate(existingData.id, formData)
        : await registerCandidate(formData);

      if (result.success && result.data) {
        toast.success(
          isRejected
            ? "Registration resubmitted for review!"
            : isEditing
              ? "Registration updated successfully!"
              : "Registration submitted! Pending admin approval.",
        );
        onSuccess?.(result.data);
      } else {
        toast.error(result.error || "An error occurred");
      }
    } catch (error) {
      toast.error("Failed to submit registration");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitLabel = isRejected
    ? "Resubmit for Review"
    : isEditing
      ? "Update Registration"
      : "Submit Registration";

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-lg"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {isRejected
                ? "Edit & Resubmit Registration"
                : isEditing
                  ? "Update Your Registration"
                  : "Mr/Miss Fresher Registration"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isRejected
                ? "Correct the details below and resubmit for review."
                : isEditing
                  ? "Update your candidate information below."
                  : "Fill out the form to register for Mr/Miss Fresher 2082."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
          >
            {showPreview ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Preview
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-rose-500" />
                Full Name *
              </div>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              Category *
            </label>
            <div className="flex gap-4">
              {(["mr", "miss"] as const).map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={formData.category === cat}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-rose-500"
                  />
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                    {cat === "mr" ? "Mr. Fresher" : "Miss Fresher"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500" />
                Phone Number *
              </div>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handlePhoneBlur}
              placeholder="98xxxxxxxx"
              required
              maxLength={10}
              className={`w-full px-4 py-3 rounded-lg border bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all ${
                phoneError
                  ? "border-red-500 dark:border-red-500"
                  : "border-neutral-200 dark:border-neutral-700"
              }`}
            />
            {phoneError ? (
              <p className="text-xs text-red-500 mt-1">{phoneError}</p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter valid number
              </p>
            )}
          </div>

          {/* Faculty */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-rose-500" />
                Faculty *
              </div>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            >
              {FACULTIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-500" />
                Bio / About Yourself
              </div>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself (optional)"
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.bio?.length ?? 0}/500 characters
            </p>
          </div>
        </div>

        {/* Status badge when editing */}
        {existingData && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <span className="font-semibold">Current Status: </span>
              <span className="uppercase font-semibold text-rose-600 dark:text-rose-400">
                {existingData.status}
              </span>
              {isRejected && (
                <span className="ml-2 text-blue-700 dark:text-blue-400">
                  — submitting will reset to <strong>Pending</strong> for
                  review.
                </span>
              )}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                {submitLabel}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          * Required fields
        </p>
      </form>

      {/* ── Candidate Card Preview ───────────────────────────────────────── */}
      {showPreview && (
        <div className="max-w-2xl mx-auto mt-6">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-lg">
            <div className="px-5 py-3 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex items-center gap-2">
              <Eye className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Card Preview — how voters will see you
              </span>
            </div>

            <div className="p-5">
              <div className="max-w-xs mx-auto rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 p-4 shadow-md">
                {/* Photo area */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                  <PreviewAvatar className="w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Category badge */}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      formData.category === "mr"
                        ? "bg-blue-500/90 text-white"
                        : "bg-pink-500/90 text-white"
                    }`}
                  >
                    {formData.category === "mr"
                      ? "Mr. Fresher"
                      : "Miss Fresher"}
                  </span>
                </div>

                {/* Info */}
                <div className="mt-4 space-y-1.5">
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white leading-tight">
                    {formData.full_name || (
                      <span className="text-gray-400 italic font-normal text-base">
                        Your name here
                      </span>
                    )}
                  </h3>

                  {formData.department && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-full">
                      <GraduationCap className="w-3 h-3" />
                      {formData.department}
                    </span>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                    {formData.bio || (
                      <span className="italic">Your bio will appear here…</span>
                    )}
                  </p>
                </div>

                {/* Vote button placeholder */}
                <div className="mt-4 w-full py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold text-center opacity-50 cursor-not-allowed select-none">
                  Vote
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
