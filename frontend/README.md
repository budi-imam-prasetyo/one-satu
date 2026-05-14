# TaGo - Aplikasi Tabungan Berbasis Target

Aplikasi web tabungan berbasis target dengan fitur manajemen keuangan pribadi, reminder, dan tracking progress.

## 🎯 Fitur Utama

- ✅ **Landing Page** - Halaman utama informatif
- 👤 **Mode Guest** - Gunakan tanpa login (data tersimpan di localStorage)
- 🔐 **OAuth2 Login** - Login dengan Google
- 📊 **Dashboard** - Kelola target tabungan Anda
- 🎯 **Target Tabungan** - Buat dan pantau target dengan progress bar
- 💰 **Riwayat Transaksi** - Catat pemasukan dan pengeluaran
- ⏰ **Pengingat Otomatis** - Jadwal harian/mingguan/bulanan
- 🔔 **Notifikasi** - Sistem notifikasi terintegrasi
- 📱 **Responsive Design** - Optimal di desktop dan mobile

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Routing**: React Router v7
- **State Management**: React Context API
- **Backend**: REST API (handled by backend team)
- **Deployment**: Docker + Nginx

## 📦 Project Structure

```
tago/
├── src/
│   ├── app/
│   │   ├── components/        # Reusable components
│   │   ├── config/            # App configuration (BASE_URL, etc.)
│   │   ├── contexts/          # React contexts (ThemeContext)
│   │   ├── data/              # Dummy data for development
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Layout components
│   │   ├── pages/             # Page components
│   │   │   └── Auth/          # Login, Register, Guest pages
│   │   ├── services/          # API service layer
│   │   │   ├── authService.ts
│   │   │   └── targetService.ts
│   │   ├── store/             # Global state (AppProvider)
│   │   ├── types/             # TypeScript type definitions
│   │   │   ├── auth.ts
│   │   │   ├── target.ts
│   │   │   └── common.ts
│   │   ├── utils/             # Utility functions
│   │   ├── App.tsx            # Main app component
│   │   └── router.tsx         # Route definitions
│   └── styles/
│       ├── theme.css          # Theme tokens
│       └── fonts.css          # Font imports
├── docker-compose.yml         # Docker setup
├── docker-compose.dev.yml     # Simplified dev setup
├── Dockerfile                 # Multi-stage build
└── Makefile                   # Helper commands
```

## 🚀 Quick Start

### Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment variables
cp .env.example .env

# 3. Start dev server
pnpm dev
```

### Using Docker

```bash
# Copy environment variables
cp .env.example .env

# Start development
make dev
# atau
docker-compose --profile dev up -d

# Access the app
open http://localhost:5173
```

## 🐳 Docker Commands

```bash
make help         # Show all commands
make dev          # Start dev environment
make dev-simple   # Start simplified dev
make prod         # Start production
make build        # Build production image
make stop         # Stop all containers
make clean        # Remove containers and volumes
make logs         # View all logs
make logs-app     # View app logs
```

## ⚙️ Configuration

### Environment Variables

```env
# Application
NODE_ENV=development
SITE_URL=http://localhost:5173

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/v1

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Connecting to Backend API

API calls are configured in `src/app/config/index.ts`. To connect to the real backend:

1. Set `VITE_API_BASE_URL` in `.env` to the backend URL
2. In each service file (`authService.ts`, `targetService.ts`), uncomment the real API call blocks and remove the dummy bypass

## 🧪 Development

```bash
# Install dependencies
pnpm install

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## 🏗️ Build & Deployment

```bash
# Build production image
make build

# Run production
make prod

# Deploy to Cloud
docker tag tago:latest your-registry/tago:latest
docker push your-registry/tago:latest
```

## 📖 Documentation

- [Docker Setup Guide](README.Docker.md)

## 📄 License

This project is licensed under the MIT License.

---

**Note**: Aplikasi ini masih dalam tahap development. Untuk production deployment, pastikan:
- Gunakan HTTPS
- Set strong passwords
- Enable firewall
- Monitor logs
