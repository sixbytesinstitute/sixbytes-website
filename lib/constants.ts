/**
 * Shared constants used by both server models and client UI.
 * This file does NOT import mongoose so it can be safely used in "use client" components.
 */

export const CLASSES = ["9", "10", "11", "12", "NDA"] as const;
export const STREAMS = ["PCM", "PCB", "General", "Defence", "N/A"] as const;
export const ROLES = ["admin", "faculty", "student"] as const;

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "Social Science",
  "GAT",
  "Computer Science",
] as const;

export const MATERIAL_CATEGORIES = [
  "Class Notes",
  "Formula Sheet",
  "PYQ Question Bank",
  "Mock Test Paper",
  "Syllabus Guide",
  "Reference",
] as const;
