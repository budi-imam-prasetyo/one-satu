# Project K1

Backend menggunakan:

- Java 26
- Spring Boot 4
- Maven
- MySQL
- Docker Compose

---

# Requirement

## Wajib Install

### Windows 10 / 11

Install:

- Git
- Docker Desktop
- IntelliJ IDEA (opsional)

### CachyOS / Linux

Install:

- git
- docker
- docker compose
- IntelliJ IDEA (opsional)

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
git clone <url-repository>
```

Masuk folder project:

```bash
cd K1
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

MySQL:

```text
Host     : localhost
Port     : 3306
Database : pbo_db
Username : root
Password : password
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
```

### Windows

```powershell
netstat -ano | findstr :8080
netstat -ano | findstr :3306
```

---

## Container Tidak Mau Start

Cek logs:

```bash
docker compose logs -f
```

---

# File Penting

```text
compose.yaml
backend/Dockerfile
backend/pom.xml
backend/src/main/resources/application.yaml
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

---
