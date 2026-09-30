"use client"

import React, { useState, useEffect } from "react"
import { AVATAR_OPTIONS, getAvatarById, AvatarGlyph, type AvatarOption } from "@/lib/avatars"
import { IconCheck, IconX } from "../ui/icons"

interface AvatarModalProps {
  isOpen: boolean
  onClose: () => void
  currentAvatar?: string
  userName: string
  onAvatarUpdated: (newAvatarId: string) => void
}

type CategoryTab = "all" | "persona" | "gradient"

export default function AvatarModal({
  isOpen,
  onClose,
  currentAvatar = "",
  userName,
  onAvatarUpdated,
}: AvatarModalProps) {
  const [selectedId, setSelectedId] = useState(currentAvatar)
  const [activeTab, setActiveTab] = useState<CategoryTab>("all")
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    setSelectedId(currentAvatar || "")
  }, [currentAvatar])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredAvatars = AVATAR_OPTIONS.filter((av) => {
    if (activeTab === "all") return true
    return av.category === activeTab
  })

  const previewAvatar = getAvatarById(selectedId)
  const initial = userName ? userName.charAt(0).toUpperCase() : "U"

  const handleSelectAndSave = async (av: AvatarOption) => {
    setSelectedId(av.id)
    setSaving(true)
    setErrorMsg("")
    setSavedSuccess(false)

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: av.id }),
      })

      const data = await res.json()
      if (data.success) {
        setSavedSuccess(true)
        onAvatarUpdated(av.id)
        setTimeout(() => {
          setSavedSuccess(false)
        }, 2500)
      } else {
        setErrorMsg(data.error || "Failed to update avatar")
      }
    } catch {
      setErrorMsg("Network error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0f1318] border border-white/10 shadow-2xl shadow-black/80 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="text-base font-display font-bold text-cream">
              Choose Profile Avatar
            </h3>
            <p className="text-xs text-muted-custom mt-0.5">
              Personalize your identity across the SixBytes portal
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-custom hover:text-cream hover:bg-white/[0.06] transition-colors"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="px-6 py-4 bg-gradient-to-r from-orange-500/[0.06] via-transparent to-amber-500/[0.06] border-b border-white/[0.06] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-14 h-14 rounded-2xl ${previewAvatar.borderColor} border-2 flex items-center justify-center font-bold ${previewAvatar.textColor} text-2xl shadow-xl transition-all duration-300`}
              style={{ background: previewAvatar.gradient }}
            >
              <AvatarGlyph iconName={previewAvatar.iconName} initial={initial} size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-cream">{previewAvatar.label}</p>
                {savedSuccess && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full animate-in fade-in">
                    <IconCheck size={11} /> Saved
                  </span>
                )}
                {saving && (
                  <span className="text-[10px] font-medium text-orange-400 animate-pulse">
                    Saving...
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-custom mt-0.5">
                {previewAvatar.category === "persona" ? "Academic Persona Emblem" : "Color Monogram"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-xs font-semibold text-cream transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Category Tabs */}
        <div className="px-6 pt-4 pb-2 flex gap-1.5 border-b border-white/[0.06]">
          {[
            { key: "all" as CategoryTab, label: `All (${AVATAR_OPTIONS.length})` },
            { key: "persona" as CategoryTab, label: "Badges & Personas" },
            { key: "gradient" as CategoryTab, label: "Gradients" },
          ].map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                    : "text-muted-custom hover:text-cream hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Avatar Grid */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {filteredAvatars.map((av) => {
              const isSelected = selectedId === av.id
              return (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => handleSelectAndSave(av)}
                  title={av.label}
                  className={`group relative aspect-square rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 shadow-md ${
                    isSelected
                      ? `${av.borderColor} ring-2 ring-orange-500/60 ring-offset-2 ring-offset-[#0f1318] scale-105 shadow-orange-500/20 shadow-lg`
                      : "border-transparent hover:border-white/20"
                  }`}
                  style={{ background: av.gradient }}
                >
                  <span
                    className={`flex items-center justify-center font-bold transition-transform group-hover:scale-110 ${av.textColor}`}
                  >
                    <AvatarGlyph iconName={av.iconName} initial={initial} size={20} />
                  </span>

                  {/* Active Checkmark Badge */}
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md">
                      <IconCheck size={12} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <p className="text-[11px] text-muted-custom/70 text-center pt-2">
            Click any avatar to instantly set and save it to your profile.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-white/[0.01] flex items-center justify-between">
          <span className="text-[11px] text-muted-custom">
            Tip: Avatars reflect on your dashboard, study materials & forum notes.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  )
}
