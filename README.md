# Cohortis (VITalWatch Base) 🧬

An advanced, offline-first Clinical Trial Management System (CTMS) designed to seamlessly match patients with complex oncological protocols. Built for speed, privacy, and precision.

![Cohortis UI Preview](https://github.com/CalebEJ-3510/VITalWatch-base/assets/placeholder) <!-- Replace with actual screenshot later -->

## 🌟 Features

*   **Intelligent Patient Matching:** Instantly scores and ranks patients against strict protocol criteria (Biomarkers, ECOG status, Prior therapies, etc.).
*   **Privacy First:** Pure Client-Side Single Page Application (SPA). Patient data never leaves the browser. State is persisted locally.
*   **Dual-View Interface:**
    *   **Patient Portal:** Streamlined onboarding and pre-screening.
    *   **Sponsor Console:** Ranked recruitment pipeline with de-identified analytics.
*   **Lightning Fast:** Built on Vite 8 and React, delivering sub-second interactions.
*   **Responsive & Accessible:** Designed with Tailwind CSS and Radix UI primitives for a flawless experience across all devices.

## 🛠️ Technology Stack

*   **Framework:** React 19 + TypeScript
*   **Build Tool:** Vite 8 (Rolldown)
*   **Routing:** TanStack Router (Hash-based for static hosting compatibility)
*   **Styling:** Tailwind CSS v4 + `tw-animate-css`
*   **Components:** Radix UI (`lucide-react` for icons)
*   **State Management:** React Hooks + Local Storage (Zod validation)

## 🚀 Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Navigate to `http://localhost:5173` to view the app.

## 🌐 Deployment (GitHub Pages)

This project is configured to deploy automatically to GitHub Pages via GitHub Actions.

1. Push to the `main` branch.
2. Go to **Settings > Pages** in your GitHub repository.
3. Ensure the source is set to GitHub Actions (or the `gh-pages` branch if using the legacy deploy action).

*Note: Because this is a static host, the app uses Hash Routing (`/#/sponsor`) to ensure URLs work without a dedicated backend server.*

## 👥 The Team

Crafted with ❤️ by:

*   **Caleb EJ**
*   **Ishan**
*   **Roxy**
*   **Rakshitha**
*   **Kavin**
*   **Sreeja**

---
*Developed for VITalWatch*
