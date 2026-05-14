# TaGo - Docker Setup Guide

Panduan lengkap untuk menjalankan aplikasi TaGo menggunakan Docker.

## 📋 Prerequisites

- Docker Engine 20.10 atau lebih baru
- Docker Compose v2.0 atau lebih baru
- Make (opsional, untuk menggunakan Makefile commands)

## 🚀 Quick Start

### 1. Setup Environment Variables

```bash
# Copy file .env.example menjadi .env
cp .env.example .env

# Edit .env dan sesuaikan konfigurasi
nano .env
```

### 2. Jalankan Development Environment

**Menggunakan Make (Recommended):**
```bash
make dev
```

**Atau menggunakan Docker Compose langsung:**
```bash
docker-compose --profile dev up -d
```

**Simplified Development:**
```bash
make dev-simple
# atau
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Akses Aplikasi

Setelah container berjalan, akses:
- **Aplikasi**: http://localhost:5173

## 📚 Available Commands

### Development Commands

```bash
make dev          # Start development environment
make dev-simple   # Start simplified dev environment
make install      # Install npm dependencies
make logs         # View all logs
make logs-app     # View app logs only
make stop         # Stop all containers
```

### Production Commands

```bash
make build        # Build production image
make prod         # Start production environment
```

### Management Commands

```bash
make ps           # Show running containers
make restart      # Restart all services
make clean        # Remove containers and volumes
```

## 🔧 Configuration

### Environment Variables

File `.env` berisi konfigurasi penting:

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

### Port Configuration

Default ports yang digunakan:
- `5173` - Vite dev server
- `80` - Nginx (production)

Untuk mengubah port, edit file `docker-compose.yml`.

## 🏗️ Architecture

### Multi-Stage Dockerfile

Dockerfile menggunakan multi-stage build:
1. **Builder Stage**: Build aplikasi React
2. **Production Stage**: Serve dengan Nginx
3. **Development Stage**: Vite dev server dengan hot-reload

### Services

**Development Profile:**
- `app-dev`: React app dengan Vite

**Production Profile:**
- `app-prod`: React app served by Nginx

## 🔍 Troubleshooting

### Container tidak bisa start

```bash
# Cek logs untuk error
make logs

# Restart semua services
make restart

# Atau rebuild jika ada perubahan Dockerfile
docker-compose build --no-cache
```

### Port sudah digunakan

```bash
# Cek process yang menggunakan port
lsof -i :5173

# Ubah port di docker-compose.yml
# Contoh: "5174:5173" untuk map ke port 5174
```

### Hot reload tidak bekerja

Pastikan volumes sudah di-mount dengan benar:
```yaml
volumes:
  - .:/app
  - /app/node_modules
```

## 🧪 Development Workflow

### 1. Start Development

```bash
make dev
```

### 2. Install New Package

```bash
pnpm add package-name
```

### 3. View Logs

```bash
make logs
make logs-app
```

### 4. Stop Development

```bash
make stop
```

## 🚢 Production Deployment

### 1. Build Production Image

```bash
make build
```

### 2. Run Production

```bash
make prod
```

### 3. Deploy to Cloud

```bash
docker build -t tago:latest --target production .
docker tag tago:latest your-registry/tago:latest
docker push your-registry/tago:latest
```

## 📝 Notes

- **Development**: Menggunakan Vite dev server dengan hot module replacement
- **Production**: Build optimal dengan Nginx untuk serving static files
- **Networks**: Isolated network untuk semua services

## 🔐 Security Best Practices

1. **Environment Variables**: Jangan commit file `.env` ke Git
2. **HTTPS**: Gunakan reverse proxy (Nginx/Traefik) dengan SSL untuk production
3. **Firewall**: Batasi akses port dari luar

## 📖 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## 💡 Tips

1. Use `make help` untuk melihat semua available commands
2. Gunakan `docker-compose.dev.yml` untuk development yang lebih ringan
3. Monitor resource usage: `docker stats`
4. Clean unused images: `docker image prune -a`
