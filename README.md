# Project K1

Backend menggunakan:

- Java 26
- Spring Boot 4
- Maven
- MySQL
- Docker Compose

Frontend menggunakan:

- Bun 1.3.13
- Svelte

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

# Menjalankan Project

## Menjalankan Full Project (Recommended)

Dari root project:

```bash
docker compose up --build
```

Jika background mode:

```bash
docker compose up --build -d
```

---

# Akses

Backend:

```text
http://localhost:8080
```

Frontend:

```text
http://localhost:5173
```

MySQL:

```text
Host     : localhost
Port     : 3306
Database : pbo_db
Username : root
Password : password
```

phpMyAdmin:

```text
http://localhost:8081
```

---

# Menjalankan Database Saja

Jika ingin menjalankan MySQL saja:

```bash
docker compose up db
```

Background mode:

```bash
docker compose up -d db
```

Stop database:

```bash
docker compose stop db
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

1. Jalankan database:

```bash
docker compose up -d db
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

atau:

```bash
docker compose up --build
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

## Menjalankan Frontend via Docker

Jika tidak ingin install Bun secara lokal:

```bash
docker compose up frontend
```

Frontend tetap dapat diakses di:

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
docker compose logs -f frontend
```

Database logs:

```bash
docker compose logs -f db
```

---

# Rebuild Container

Jika ada perubahan dependency atau Dockerfile:

```bash
docker compose up --build
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

Frontend:

```bash
docker compose exec frontend sh
```

MySQL:

```bash
docker compose exec db bash
```

Masuk MySQL CLI:

```bash
mysql -u root -p
```

Password:

```text
password
```

---

# Push ke GitHub

## Alur Lengkap: Add → Commit → Push

### 1. Cek Status Perubahan

Lihat file apa saja yang berubah atau belum di-track:

```bash
git status
```

---

### 2. Tambahkan File ke Staging (Add)

Tambahkan semua file sekaligus:

```bash
git add .
```

Atau tambahkan file tertentu saja:

```bash
git add nama-file.java
git add backend/src/main/java/com/example/Controller.java
```

Cek ulang status setelah add:

```bash
git status
```

File yang siap di-commit akan berwarna hijau.

---

### 3. Buat Commit

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

### 4. Push ke GitHub

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
git push -u origin main
git push -u origin feature/login
```

---

## Cek Branch Aktif

```bash
git branch
```

Pindah branch:

```bash
git checkout nama-branch
```

Buat branch baru dan langsung pindah:

```bash
git checkout -b nama-branch-baru
```

---

## Pull Perubahan dari GitHub

Sebelum mulai kerja, selalu ambil perubahan terbaru:

```bash
git pull
```

---

## Ringkasan Command Git

```bash
# Cek status
git status

# Tambahkan semua perubahan
git add .

# Commit
git commit -m "pesan commit"

# Push
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
sudo lsof -i :3306
sudo lsof -i :5173
sudo lsof -i :8081
```

### Windows

```powershell
netstat -ano | findstr :8080
netstat -ano | findstr :3306
netstat -ano | findstr :5173
netstat -ano | findstr :8081
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
docker compose up --build
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
backend/Dockerfile
backend/pom.xml
backend/src/main/resources/application.yaml
frontend/package.json
frontend/vite.config.js
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
.env
```

---

# Command Cepat

## Build + Run

```bash
docker compose up --build
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