"use client"

import React, { useState, useRef, useEffect } from "react"
import { IconChevronDown, IconCheck } from "./icons"

export interface SelectOption {
  value: string
  label: string
  badge?: string
}

interface CustomSelectProps {
  options: SelectOption[] | readonly string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
  disabled?: boolean
  prefixIcon?: React.ReactNode
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  className = "",
  disabled = false,
  prefixIcon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Normalize options array
  const formattedOptions: SelectOption[] = options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt, label: opt }
    }
    return opt
  })

  const selectedOption = formattedOptions.find((opt) => opt.value === value)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === "Escape") {
      setIsOpen(false)
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-cream/80 mb-1.5 font-sans">
          {label}
        </label>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-xl text-left text-sm transition-all duration-200 font-sans border ${
          isOpen
            ? "bg-navy-mid/95 border-orange-500/50 shadow-lg shadow-orange-500/10 ring-1 ring-orange-500/30 text-cream"
            : "bg-navy-mid/70 border-white/10 hover:border-white/20 text-cream/90 hover:bg-navy-mid/90"
        } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {prefixIcon && <span className="text-orange-400 shrink-0">{prefixIcon}</span>}
          <span className={`truncate ${!selectedOption ? "text-muted-custom/60" : "text-cream font-medium"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <IconChevronDown
          size={16}
          className={`text-muted-custom shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-orange-400" : ""
          }`}
        />
      </button>

      {/* Animated Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-60 overflow-y-auto rounded-xl bg-[#0f1318]/98 border border-white/10 p-1.5 shadow-2xl shadow-black/80 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 scrollbar-thin scrollbar-thumb-white/10">
          <div role="listbox" className="space-y-0.5">
            {formattedOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-custom text-center">No options available</div>
            ) : (
              formattedOptions.map((option) => {
                const isSelected = option.value === value
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                      isSelected
                        ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                        : "text-cream/80 hover:text-cream hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <IconCheck size={14} className="text-orange-400 shrink-0" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
