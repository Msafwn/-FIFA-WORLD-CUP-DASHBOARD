# 🏆 FIFA World Cup Live Dashboard

<div align="center">

![React](https://img.shields.io/badge/React-19.2.7-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A fast, responsive, and aesthetically crafted **FIFA World Cup Tournament Dashboard** built with modern React 19, Vite 8, and Tailwind CSS v4. Features live tournament match fixtures, dynamic 48-nation group standings, player squads directory, top goalscorers leaderboard, and an instant 0ms latency pre-cached architecture.

[Live Demo](#-live-demo) • [Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Vercel Deployment](#-deployment-to-vercel)

---

</div>

## ✨ Key Features

### ⚡ 0ms Fast Load Architecture & Resilient API
- **Zero Latency Paint:** Ships with pre-bundled static tournament data (`initialData.json`) for instant, zero-delay rendering without layout shift.
- **Smart Client-Side Caching:** Utilizes `localStorage` (30-minute TTL) with intelligent background revalidation to prevent API rate-limiting (`429 Too Many Requests`).
- **Dynamic Standings Generator:** Automatically calculates real-time group stage standings (Points, W/D/L, Goal Difference, Rank) directly from 104 tournament match results.

### 🛡️ World Cup Teams Directory
- **48 Qualified Nations:** Browse all participating national teams with official crests, TLAs, and federations.
- **Group Filter & Search:** Real-time search by country name or filter by groups (Group A through Group L).
- **Row-Based Pagination:** Structured in a clean **2 rows (8 teams per page)** view with smooth pagination controls.

### ⚽ Tournament Fixtures & Match Tracker
- **104 Tournament Matches:** Full calendar covering Group Stage, Knockouts, Quarter-finals, Semi-finals, and Finals.
- **Status Filtering:** Instant toggle between `ALL`, `FINISHED`, `LIVE`, and `UPCOMING` matches.
- **Paginated Grid:** Structured in a **3 rows (9 matches per page)** layout.

### 🏃 Players & Squads Explorer
- **Squad Search:** Search through 400+ national team players.
- **Position & Nation Filters:** Filter by position (*Goalkeepers, Defenders, Midfielders, Attackers/Forwards*) and national team.
- **3-Row Pagination:** Displays **12 players per page (3 rows)** for effortless browsing.
- **Top Scorers Leaderboard:** Highlights leading goalscorers with detailed match statistics and rankings.

### 🌟 Spotlight Favorite Nation
- **Portugal Showcase:** Dedicated team card spotlighting team form, key superstars (e.g. Cristiano Ronaldo, Bruno Fernandes), goals scored, and tournament ranking.

---

## 🛠️ Tech Stack

- **Frontend Core:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Data Provider:** [Football-Data.org API v4](https://www.football-data.org/)
- **Deployment & Proxy:** [Vercel](https://vercel.com/) with serverless proxy rewrites

---

## 📁 Project Structure

```text
FIFA-football-Dashborad/
├── public/                  # Static assets & icons
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/              # Logos and graphics
│   ├── components/          # Reusable UI components
│   │   ├── FavoriteTeamCard.jsx  # Highlighted champion spotlight
│   │   ├── HeroSection.jsx       # Tournament stats & countdown
│   │   ├── MatchCard.jsx         # Live match fixture cards
│   │   ├── Navbar.jsx            # Sticky blurred navigation header
│   │   ├── Pagination.jsx        # Numbered & ellipsis pagination
│   │   ├── PlayerCard.jsx        # Top scorer ranking card
│   │   ├── SquadPlayerCard.jsx   # Squad member card with position tags
│   │   ├── StandingTable.jsx     # Live group standings table
│   │   └── TeamCard.jsx          # National team identity card
│   ├── data/
│   │   └── initialData.json      # Instant tournament snapshot bundle
│   ├── App.jsx              # Main Dashboard logic & state
│   ├── App.css              # Custom styling & animations
│   ├── index.css            # Tailwind CSS imports
│   └── main.jsx             # React root entry
├── vercel.json              # Vercel proxy rewrite & SPA routing
├── vite.config.js           # Vite configuration & dev proxy
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Msafwn/-FIFA-WORLD-CUP-DASHBOARD.git
   cd -FIFA-WORLD-CUP-DASHBOARD
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deployment to Vercel

This repository includes a pre-configured [`vercel.json`](./vercel.json) file with proxy rewrites to seamlessly route `/api-football/*` requests to `https://api.football-data.org` and handle client-side routing.

### Deploying via Vercel CLI:
```bash
npm i -g vercel
vercel
```

### Deploying via GitHub:
1. Push this repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"New Project"**.
3. Import your repository: `Msafwn/-FIFA-WORLD-CUP-DASHBOARD`.
4. Leave framework preset as **Vite** and click **Deploy**.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Crafted with passion for football enthusiasts worldwide ⚽</sub>
</div>
