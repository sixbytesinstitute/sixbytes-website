<div align="center">
  <img src="public/logo.png" alt="SixBytes Educational Institute Logo" width="120" />
  <h1>SixBytes Educational Institute</h1>
  <p><strong>Premier CBSE/ICSE & Defence Academy Coaching • Shyampur & Premnagar, Dehradun</strong></p>

  <p>
    <a href="https://sixbytes.in"><img src="https://img.shields.io/badge/Website-sixbytes.in-F97316?style=flat-square" alt="Website" /></a>
    <img src="https://img.shields.io/badge/Next.js-16.2.1-black?style=flat-square&logo=next.js" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb" alt="MongoDB" />
  </p>
</div>

---

## 📖 About SixBytes

**SixBytes Educational Institute**, founded and led by **Jaspal Singh Chauhan**, is a premier coaching institute located in **Shyampur & Premnagar, Dehradun**. SixBytes specializes in rigorous conceptual coaching for **CBSE & ICSE Classes 9–12 (Science & Mathematics)**, alongside specialized entrance training for the **National Defence Academy (NDA)**, **RIMC**, **Rashtriya Military Schools (RMS)**, and **Sainik Schools**.

### 🌟 Key Highlights
- **Strict Micro Batches**: Capped at 15 students per batch for direct, 1-on-1 mentor guidance.
- **Top Academic Track Record**: Consistent 94%+ board examination toppers and 100% pass rates.
- **Synchronized Pedagogy**: Dual-track preparation for school board exams and national competitive entrances.
- **Campus Address**: Opp. Lane No. 3, Sai Vihar, Shyampur, Premnagar, Dehradun, Uttarakhand 248007.
- **Helpline**: `+91 75368 39760` • **WhatsApp**: [wa.me/917536839760](https://wa.me/917536839760)

---

## 🚀 Website & Platform Architecture

This repository contains the complete full-stack web application, including the high-conversion marketing platform, student resource portal, and admin management suite.

### 🏛️ Core Pages & Routes
| Route | Type | Description |
|---|---|---|
| [`/`](app/page.tsx) | Marketing | Homepage featuring Hero with animated canvas particles, Academic Wings, Hall of Fame Toppers, Founder Spotlight, Testimonials, and Local SEO section. |
| [`/about`](app/about/page.tsx) | Marketing | Institute Story, Founder Message (Jaspal Singh Chauhan), 6 Pillars of SixBytes, and Growth Timeline. |
| [`/courses`](app/courses/page.tsx) | Marketing | Foundation Wing (9–10), Senior Science (11–12 PCM/PCB), Defence Academy (NDA/RIMC), Comparison Matrix, and FAQs. |
| [`/results`](app/results/page.tsx) | Marketing | Academic Hall of Fame, Star Toppers gallery, Scorecards, and Teaching Methodology. |
| [`/contact`](app/contact/page.tsx) | Marketing | Campus Address, Interactive Google Map embed, Daily Batch Schedules, and Direct WhatsApp Booking. |
| [`/student-login`](app/student-login/page.tsx) | Portal | Secure Student Authentication in Obsidian Dark theme with interactive password reveal. |
| [`/dashboard`](app/dashboard/page.jsx) | Portal | Student Study Materials Repository with class filtering and document downloads. |
| [`/admin`](app/admin/page.jsx) / [`/admin/upload`](app/admin/upload/page.jsx) | Admin | Administrative portal for student management and Cloudinary study material uploads. |

---

## 🎨 Design System

- **Palette**: Deep Obsidian (`#0a0c0e`, `#0f1318`), Frosted Navy (`#11161d`), Warm Amber/Orange (`#F97316`), and Soft Cream (`#f5f5f7`).
- **Aesthetic**: Premium dark-mode glassmorphism with subtle 1px borders (`border-white/[0.08]`), zero neon bleeds, and ambient canvas particle fields.
- **Typography**: Display typography paired with clean sans-serif body copy and serif accent italics.
- **Scrolling Consistency**: Single-window viewport stretching (`min-h-screen` and `min-h-[calc(100vh-70px)]` with vertical flexbox centering) for clean presentation.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16.2.1](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphic Utilities
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: `bcryptjs` password hashing + Token sessions
- **File Storage & CDN**: [Cloudinary](https://cloudinary.com/)
- **SEO & Indexing**: Dynamic Sitemap ([`next-sitemap`](https://github.com/iamvishnusankar/next-sitemap)), Robots.txt, and Schema.org JSON-LD (LocalBusiness, EducationalOrganization).

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/sixbytesinstitute/sixbytes-website.git
cd sixbytes-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sixbytes?retryWrites=true&w=majority

# Cloudinary Storage Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Secret Key
ADMIN_SECRET_KEY=your_admin_secret
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📚 Project Documentation

Complete architectural decision records and implementation specifications are maintained inside the [`/docs`](docs/) directory:
- [`docs/PRD.md`](docs/PRD.md) — Product Requirements Document & Feature Specs.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System Architecture, Data Flows, and Security Protocols.
- [`docs/DESIGN.md`](docs/DESIGN.md) — Design Tokens, Typography, Glassmorphism, and Component Guidelines.
- [`docs/CONTEXT.md`](docs/CONTEXT.md) — Current Project State & Operational Context.
- [`docs/PORTAL_SPEC.md`](docs/PORTAL_SPEC.md) — Student Resource Portal Architecture & ER Specifications.
- [`docs/PORTAL_PLAN.md`](docs/PORTAL_PLAN.md) — Step-by-Step Implementation Roadmap.

---

## 📄 License & Ownership

© 2018–2026 **SixBytes Educational Institute**. All rights reserved.  
Founded & Mentored by **Jaspal Singh Chauhan** • Shyampur & Premnagar, Dehradun.
