# SixBytes Backend Architecture — Design Specification

**Version:** 2.0.0  
**Date:** 2026-08-28  
**Status:** Approved  
**Spec Source:** Approved in conversation cb9503e4-dabc-4bc1-9c8d-418822ff0fc9

---

## 1. System Overview

A 3-role backend (Admin, Faculty, Student) with public SEO resource articles, JWT cookie-based auth, Google Drive–backed file storage, and full SEO analytics suite.

## 2. Roles

- **Admin** (2 super-admins, seeded): Onboard users, manage all content, create SEO resources
- **Faculty**: Assignments, materials, notices for assigned classes; view own students
- **Student**: View profile, assignments, materials, notices for own class; change password

## 3. Data Models

### 3.1 User (unified — replaces Student model)
Fields: name, email, phone, password (bcrypt), role (admin/faculty/student), class, stream, subjects[], assignedClasses[], mustChangePassword, isActive, timestamps

### 3.2 Assignment
Fields: title, description, targetClass, subject, dueDate, fileUrl (Google Drive), fileName, createdBy (ref User), createdAt

### 3.3 Material (upgraded)
Fields: title, description, fileUrl (Google Drive), fileName, class, subject, category (enum), createdBy (ref User), createdAt

### 3.4 Notice
Fields: title, content, targetClass, priority (normal/urgent/exam_alert), pinned, createdBy (ref User), createdAt, expiresAt

### 3.5 Resource (public SEO articles)
Fields: slug (unique), title, metaDescription, subject, targetClass, chapter, content (HTML rich text), keywords[], published, viewCount, createdBy (ref User), timestamps

## 4. File Storage

All files on Google Drive. MongoDB stores only the link + metadata. Zero storage cost.
- Embed URL: `https://drive.google.com/file/d/{FILE_ID}/preview`
- Download URL: `https://drive.google.com/uc?export=download&id={FILE_ID}`
- Files must be set to "Anyone with the link can view"

## 5. Auth

- JWT in httpOnly cookie (not localStorage)
- Single `/login` page, role auto-detected from DB
- Auto-generated password: `SixBytes@<last-4-digits-of-phone>`
- `mustChangePassword` flag forces change on first login
- 2 super-admin accounts seeded via script

## 6. Subjects

Mathematics, Physics, Chemistry, Biology, English, Hindi, Social Science (SST), GAT/Defence, Computer Science

## 7. Classes

9, 10, 11 (PCM/PCB), 12 (PCM/PCB), NDA/Defence

## 8. SEO Suite

GA4, Search Console, JSON-LD structured data, dynamic sitemap, social sharing meta, cookie consent banner, canonical URLs
