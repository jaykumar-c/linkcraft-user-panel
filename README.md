# 🚀 LinkCraft AI - User Panel

Welcome to the **LinkCraft AI User Panel**, the visual management engine for the LinkCraft AI platform. This dashboard allows users to create, organize, customize, and analyze their premium "Link-in-Bio" pages, complete with advanced AI-assisted bio generation, custom styling, visual media assets, and deep analytics.

Built with a cutting-edge front-end stack including **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, **Zustand**, and **TanStack Query (v5)**.

---

## ✨ Key Features

- **🔐 Robust Auth Suite**: Full-featured authentication with Login, Registration, Email Verification, Password Reset, and secure multi-session tracking.
- **🔗 Dynamic Link Management**:
  - Drag-and-drop link reordering powered by `@hello-pangea/dnd`.
  - Automatic platform-detection (e.g., detecting YouTube, Twitter/X, GitHub) and categories.
  - Link scheduling (automatic start/end dates for promotional links).
  - Rich customizations: link thumbnails, icons, and visual flags.
  - Click-count tracking with soft-delete and quick restore functionality.
- **🤖 Stream-based AI Bio Generator**:
  - Real-time bio streaming using Vercel AI SDK from the NestJS backend.
  - Customizable generation parameters including tone, length, custom prompts, and links inclusion.
  - Keeps complete history of generated bios and lets you apply them to your profile with one click.
- **🎨 Premium Customization & Previews**:
  - Responsive live mobile preview reflecting styling, theme, avatars, and layout changes instantly.
  - Integrated high-performance image cropping engine (`react-easy-crop`) for custom avatars and link thumbnails.
- **📊 Interactive Analytics**: Detailed analytics dashboard visualizing profile views, link clicks, referrers, and growth metrics using `recharts` graphs.
- **⚡ Advanced Core Infrastructure**:
  - Centralized Axios client featuring robust request/response interceptors, automatic JWT refreshing, and secure session management.
  - Optimized React Query hooks for client state synchrony, featuring optimistic UI updates for toggle actions and list reorders.

---

## 🛠️ Technology Stack & Libraries

* **Core Framework**: React 19 (SPA) & Vite 5
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4.0 & Radix UI primitives (shadcn style)
* **Animation**: Framer Motion
* **State Management**: Zustand
* **Async & Data Fetching**: TanStack React Query v5 & Axios
* **Form Validation**: React Hook Form & Zod
* **Data Visualization**: Recharts & Lucide React
* **Media & Utility**: React Easy Crop, DOMPurify, Date-fns/Moment

---

## 📂 Project Architecture

The codebase follows a strictly modular, **domain-driven feature architecture** that separates UI layouts, global configurations, and specialized feature routes:

```text
src/
├── app/                  # App-wide contexts, providers (QueryClient, theme setup)
├── components/           # Generic reusable components and shell layouts
│   ├── ai/               # AI bio generator UI overlay
│   ├── common/           # Custom error boundaries and network handlers
│   ├── layouts/          # Persistent shells (DashboardLayout, Sidebar, Navbar)
│   └── ui/               # Core Radix + Tailwind base elements (Buttons, Inputs, etc.)
├── constants/            # Application static constants (API endpoints, errors)
├── features/             # Feature-specific page route modules
│   ├── ai-bio/           # AI Bio generation interface page
│   ├── analytics/        # Performance reports and graphs
│   ├── auth/             # Complete login, register, reset, & verify pages
│   ├── dashboard/        # Dashboard overview and main stats grid
│   ├── links/            # Interactive drag-and-drop link building list
│   ├── preview/          # Custom live/external mock preview page
│   ├── profile/          # Theme, color, avatar, and metadata setup
│   └── settings/         # Security configs, session tracking, delete account
├── hooks/                # Specialized domain-specific custom React hooks
├── lib/                  # Library setups (Axios client, security, storage)
├── routes/               # Navigation, Guarded Routes (Protected vs Guest)
├── schemas/              # Zod schema validation sets matching API payloads
├── services/             # Clean API layer separating raw calls from component logic
├── store/                # Zustand global state (Auth and client UI themes)
└── types/                # Strict TypeScript declaration interfaces
```

---

## ⚙️ Setup and Installation

### 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- **LinkCraft AI Backend** (running on your local machine or a deployed endpoint)

### 2. Environment Variables
Create a `.env` file in the root of this folder (or copy from `.env.example`):

```env
VITE_API_URL=http://localhost:3000
```
Change the URL to point to your NestJS server endpoint (e.g., `http://localhost:3000` or production API).

### 3. Installation
Install all dependencies using npm:
```bash
npm install
```

### 4. Running Locally
Run the Vite development server:
```bash
npm run dev
```
By default, the server runs at [http://localhost:5173](http://localhost:5173).

### 5. Build & Production
Compile TypeScript and bundle code into `dist/` for production deployment:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 💡 Code & Development Guidelines

1. **Keep Pages Modular**: Put page-specific sub-components within their respective domain folders in `src/features/` rather than adding them to the global components directory.
2. **Utilize Custom Hooks**: Avoid writing raw `useQuery`, `useMutation`, or fetching operations directly inside pages. Put them inside `src/hooks/` to promote modularity and enable clean caching strategies.
3. **Decouple API Calls**: Create corresponding methods in `src/services/` using the Axios instance and import those methods inside your custom hooks or schemas.
4. **Enforce Type Safety**: Keep forms strongly typed by mapping validation schemas (`src/schemas/`) with TypeScript models (`src/types/`) using `zodResolver`.
