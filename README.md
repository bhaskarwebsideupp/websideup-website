# WebsideUp — Digital Experience & Growth Agency Website

Official website for **WebsideUp**, an elite digital agency specializing in high-performance web architecture, conversion-focused design, cinematic brand storytelling, and strategic digital marketing.

---

## 🌟 Highlights & Features

- **Cinematic Visual Storytelling**: Responsive video showcases optimized for instant streaming (`+faststart`, H.264).
- **Modern Design System**: Clean typography (Instrument Serif & Plus Jakarta Sans), dark aesthetic, glassmorphic accents, and micro-interactions.
- **Full Responsive Experience**: Optimized for all devices from 320px mobile viewports up to 4K displays.
- **Self-Contained & Ultra-Fast**: Pure vanilla HTML5, CSS3, and modern JavaScript without heavy dependencies or bundle bloat.
- **Complete Suite of Pages**:
  - `index.html` — Homepage with interactive hero, marquee client stripes, featured case studies, service pillars, client reviews, and FAQ.
  - `work.html` — Comprehensive case study portfolio with interactive filters and preview modals.
  - `services.html` — Detailed service breakdowns, scope deliverables, and consultation workflows.
  - `process.html` — 4-phase methodology roadmap from discovery to deployment.
  - `about.html` — Agency philosophy, leadership, values, and client milestones.
  - `insights.html` & `article.html` — Editorial thought leadership and strategic deep-dives.
  - `case-study.html` — Dynamic deep-dive case study template.
  - `contact.html` — Multi-channel inquiry and project onboarding form.

---

## 📁 Directory Structure

```text
WEBSITE WEBSDIEUP/
├── assets/
│   ├── images/              # Hero visuals, brand imagery, and leadership photos
│   ├── logos/               # Agency brand marks and client partner logos
│   │   └── clients/         # Client partner logo assets
│   └── posters/             # High-efficiency poster fallbacks for video cards
├── videos/
│   └── compressed-final/    # Web-optimized, fast-start streaming MP4 reels
├── system.css               # Core design tokens, typography, and reset
├── home.css                 # Homepage layout and animation styles
├── style.css                # Base stylesheet
├── inner-pages.css          # Sub-page layout grids and shared components
├── site.js                  # Global navigation, theme toggle, and interactions
├── projects-data.js         # Portfolio project schema and case study data
├── server.ps1               # Lightweight local development HTTP server
└── ...                      # HTML page templates
```

---

## 🚀 Running Locally

To run the site locally on any machine:

### Option 1: PowerShell Built-in Server
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Then open your browser at `http://localhost:8080`.

### Option 2: Python HTTP Server
```bash
python -m http.server 8080
```

### Option 3: VS Code Live Server
Right-click on `index.html` and select **"Open with Live Server"**.

---

## 📦 Deployment

This repository is pre-configured and optimized for 1-click deployment on:
- **GitHub Pages**: Go to **Settings > Pages > Branch: `main` > `/ (root)`**
- **Vercel**: Import repository and deploy as a static site
- **Netlify**: Drag-and-drop or connect repository

---

## 📄 License
Copyright © WebsideUp. All rights reserved.
