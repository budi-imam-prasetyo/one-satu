# Project K1

Backend menggunakan:

- Java 26
- Spring Boot 4
- Maven

Frontend menggunakan:

- Bun 1.3.13
- React
- Vite

Database menggunakan:

- Supabase (PostgreSQL + PostgREST)

---

# Requirement

## Wajib Install

### Windows 10 / 11

Install:

- Git
- Docker Desktop
- VSCode / IntelliJ IDEA

### CachyOS / Linux

Install:

- git
- docker
- docker compose
- VSCode / IntelliJ IDEA

---

# Installasi

## Windows 10 / 11

### Install Git

Download:

- https://git-scm.com/downloads

Cek versi:

```bash
git --version
```

---

### Install Docker Desktop

Download:

- https://www.docker.com/products/docker-desktop/

Cek versi:

```bash
docker --version
docker compose version
```

Pastikan Docker Desktop sedang berjalan.

---

## CachyOS / Linux

### Install Git

```bash
sudo pacman -S git
```

Cek versi:

```bash
git --version
```

---

### Install Docker

```bash
sudo pacman -S docker docker-compose
```

Aktifkan Docker:

```bash
sudo systemctl enable --now docker
```

Tambahkan user ke group docker:

```bash
sudo usermod -aG docker $USER
```

Logout lalu login kembali.

Cek Docker:

```bash
docker --version
docker compose version
```

Tes Docker:

```bash
docker run hello-world
```

---

# Git Config

Cek konfigurasi:

```bash
git config --global user.name
git config --global user.email
```

Jika kosong:

```bash
git config --global user.name "Nama Kamu"
git config --global user.email "email@example.com"
```

Cek semua config:

```bash
git config --list
```

---

# Clone Project

```bash
git clone https://github.com/budi-imam-prasetyo/one-satu.git
```

Masuk folder project:

```bash
cd one-satu
```

---

# Struktur Project

```text
K1/
├── backend/
├── frontend/
├── compose.yaml
└── README.md
```

---

# Services

Project ini terdiri dari beberapa service:

| Service | Container | Port | Keterangan |
|---|---|---|---|
| `backend` | `tago-backend` | `8080` | Spring Boot API |
| `frontend-dev` | `tago-frontend-dev` | `5173` | React + Vite (dev, Bun) |
| `frontend-prod` | `tago-frontend-prod` | `80` | React (production, Nginx) |
| `supabase-db` | `tago-supabase-db` | `5432` | PostgreSQL |
| `supabase-api` | `tago-supabase-api` | `8000` | PostgREST API |
| `supabase-studio` | `tago-supabase-studio` | `3000` | Supabase Studio |

Frontend menggunakan **profiles**:
- `dev` → jalankan `frontend-dev`
- `prod` → jalankan `frontend-prod`

---

# Environment Variables

Buat file `.env` di root project sebelum menjalankan:

```env
VITE_SUPABASE_URL=http://localhost:8000
VITE_SUPABASE_ANON_KEY=your_anon_key_here
POSTGRES_PASSWORD=postgres
JWT_SECRET=your_jwt_secret_here
SUPABASE_ANON_KEY=your_anon_key_here
```

---

# Menjalankan Project

## Mode Development (Recommended)

Menjalankan semua service termasuk frontend dev:

```bash
docker compose --profile dev up --build
```

Background mode:

```bash
docker compose --profile dev up --build -d
```

## Mode Production

```bash
docker compose --profile prod up --build
```

---

# Akses

Backend:

```text
http://localhost:8080
```

Frontend Dev:

```text
http://localhost:5173
```

Frontend Prod:

```text
http://localhost:80
```

Supabase API (PostgREST):

```text
http://localhost:8000
```

Supabase Studio:

```text
http://localhost:3000
```

PostgreSQL:

```text
Host     : localhost
Port     : 5432
Database : postgres
Username : postgres
Password : postgres (atau sesuai .env)
```

---

# Menjalankan Supabase Stack Saja

```bash
docker compose up supabase-db supabase-api supabase-studio
```

Background mode:

```bash
docker compose up -d supabase-db supabase-api supabase-studio
```

---

# Menjalankan Backend dari IDE

## Syarat

Harus menggunakan:

```text
Java 26
```

Cek versi Java:

```bash
java --version
```

---

## Jika Java Sudah Versi 26

1. Jalankan Supabase:

```bash
docker compose up -d supabase-db supabase-api
```

2. Buka folder `backend` di IntelliJ IDEA

3. Jalankan:

```text
BackendApplication.java
```

---

## Jika Java Bukan Versi 26

Gunakan backend dari Docker:

```bash
docker compose up backend
```

---

# Menjalankan Frontend dari Lokal (Tanpa Docker)

## Syarat

Harus menginstall Bun terlebih dahulu.

### Install Bun

**Windows (PowerShell):**

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Linux / CachyOS:**

```bash
curl -fsSL https://bun.sh/install | bash
```

Cek versi:

```bash
bun --version
```

---

## Menjalankan Frontend

1. Masuk ke folder frontend:

```bash
cd frontend
```

2. Install dependency:

```bash
bun install
```

3. Jalankan development server:

```bash
bun run dev
```

Frontend berjalan di:

```text
http://localhost:5173
```

---

# Stop Project

```bash
docker compose down
```

Hapus volume database:

```bash
docker compose down -v
```

Stop termasuk profile dev:

```bash
docker compose --profile dev down
```

---

# Logs

Melihat semua logs:

```bash
docker compose logs
```

Realtime logs:

```bash
docker compose logs -f
```

Backend logs:

```bash
docker compose logs -f backend
```

Frontend logs:

```bash
docker compose logs -f frontend-dev
```

Supabase DB logs:

```bash
docker compose logs -f supabase-db
```

Supabase API logs:

```bash
docker compose logs -f supabase-api
```

---

# Rebuild Container

Jika ada perubahan dependency atau Dockerfile:

```bash
docker compose --profile dev up --build
```

Rebuild tanpa cache:

```bash
docker compose build --no-cache
```

---

# Masuk ke Container

Backend:

```bash
docker compose exec backend sh
```

Frontend Dev:

```bash
docker compose exec frontend-dev sh
```

Supabase DB:

```bash
docker compose exec supabase-db bash
```

Masuk PostgreSQL CLI:

```bash
psql -U postgres
```

---

# Git — Branch, Add, Commit, Push

## Alur Kerja Git

```
main (branch utama)
  └── feature/login       ← kamu kerja di sini
  └── feature/register
  └── fix/bug-halaman-utama
```

Setiap fitur atau perbaikan sebaiknya dikerjakan di branch sendiri, bukan langsung di `main`.

---

## 1. Cek Branch Aktif

Lihat kamu sedang di branch mana:

```bash
git branch
```

Branch aktif ditandai dengan `*`.

---

## 2. Buat Branch Baru

```bash
git checkout -b nama-branch
```

Contoh:

```bash
git checkout -b feature/login
git checkout -b feature/register
git checkout -b fix/bug-halaman-utama
```

Penamaan branch yang disarankan:

| Jenis | Format | Contoh |
|---|---|---|
| Fitur baru | `feature/nama-fitur` | `feature/login` |
| Perbaikan bug | `fix/nama-bug` | `fix/bug-login` |
| Perbaikan kecil | `chore/nama` | `chore/update-readme` |

---

## 3. Pindah Branch

Pindah ke branch yang sudah ada:

```bash
git checkout nama-branch
```

Contoh:

```bash
git checkout main
git checkout feature/login
```

---

## 4. Cek Status Perubahan

Lihat file apa saja yang berubah atau belum di-track:

```bash
git status
```

---

## 5. Tambahkan File ke Staging (Add)

Tambahkan semua file sekaligus:

```bash
git add .
```

Atau tambahkan file tertentu saja:

```bash
git add nama-file.jsx
git add backend/src/main/java/com/example/Controller.java
```

Cek ulang status setelah add:

```bash
git status
```

File yang siap di-commit akan berwarna hijau.

---

## 6. Buat Commit

```bash
git commit -m "pesan commit kamu"
```

Contoh pesan commit yang baik:

```bash
git commit -m "feat: tambah endpoint login"
git commit -m "fix: perbaiki bug pada halaman register"
git commit -m "chore: update dependency di pom.xml"
```

---

## 7. Push ke GitHub

Push ke branch saat ini:

```bash
git push
```

Jika pertama kali push di branch baru:

```bash
git push -u origin nama-branch
```

Contoh:

```bash
git push -u origin feature/login
git push -u origin fix/bug-halaman-utama
```

Setelah itu, buka GitHub dan buat **Pull Request** ke branch `main`.

---

## Pull Perubahan dari GitHub

Sebelum mulai kerja, selalu ambil perubahan terbaru:

```bash
git checkout main
git pull
git checkout nama-branch-kamu
```

---

## Ringkasan Command Git

```bash
# Buat branch baru dan langsung pindah
git checkout -b feature/nama-fitur

# Pindah ke branch lain
git checkout nama-branch

# Cek status
git status

# Tambahkan semua perubahan
git add .

# Commit
git commit -m "feat: pesan commit"

# Push pertama kali (branch baru)
git push -u origin nama-branch

# Push selanjutnya
git push
```

---

# Error Umum

## Permission Denied Docker (Linux)

Jika muncul:

```text
permission denied while trying to connect to the Docker daemon socket
```

Jalankan:

```bash
sudo usermod -aG docker $USER
```

Logout lalu login kembali.

---

## Port Sudah Digunakan

Cek proses:

### Linux

```bash
sudo lsof -i :8080
sudo lsof -i :5173
sudo lsof -i :8000
sudo lsof -i :3000
sudo lsof -i :5432
```

### Windows

```powershell
netstat -ano | findstr :8080
netstat -ano | findstr :5173
netstat -ano | findstr :8000
netstat -ano | findstr :3000
netstat -ano | findstr :5432
```

---

## Container Tidak Mau Start

Cek logs:

```bash
docker compose logs -f
```

---

## Frontend Tidak Bisa Akses Backend

Pastikan backend sudah berjalan di port `8080` dan frontend sudah dikonfigurasi dengan base URL yang benar.

Cek apakah backend jalan:

```bash
curl http://localhost:8080
```

---

## Bun Module Not Found

Hapus `node_modules` lalu install ulang:

```bash
cd frontend
rm -rf node_modules
bun install
```

Atau via Docker, hapus volume lalu rebuild:

```bash
docker compose down -v
docker compose --profile dev up --build
```

---

## Git: rejected (fetch first)

Artinya ada perubahan di GitHub yang belum kamu pull. Jalankan:

```bash
git pull
```

Lalu push ulang:

```bash
git push
```

---

## Git: Authentication Failed

Pastikan kamu sudah login ke GitHub. Gunakan Personal Access Token (PAT) sebagai password jika diminta.

Generate PAT di: https://github.com/settings/tokens

---

# File Penting

```text
compose.yaml
.env
backend/Dockerfile
backend/pom.xml
backend/src/main/resources/application.yaml
frontend/package.json
frontend/vite.config.js
frontend/Dockerfile
frontend/supabase/migrations/
```

---

# Git Ignore

File/folder berikut tidak perlu di-commit:

```gitignore
backend/target/
node_modules/
dist/
.idea/
.vscode/
backend/.env
```

---

# Command Cepat

## Build + Run (Dev)

```bash
docker compose --profile dev up --build
```

## Build + Run (Prod)

```bash
docker compose --profile prod up --build
```

## Stop

```bash
docker compose down
```

## Restart

```bash
docker compose restart
```

## Hapus Semua Container + Volume

```bash
docker compose down -v
```

## Push ke GitHub

```bash
git add .
git commit -m "pesan commit"
git push
```
