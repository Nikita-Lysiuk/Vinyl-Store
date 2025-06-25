# 🎵 Vinyl Store — Backend for a Vinyl Record Shop

RESTful backend application for managing a vinyl store.  
Built with **NestJS**, it provides robust APIs for authentication, vinyl management, orders, reviews, file storage, and payments.

---

## 🧰 Stack Overview

- **Framework:** NestJS (TypeScript)  
- **DB:** PostgreSQL + Prisma  
- **Cache:** Redis  
- **Auth:** JWT, Google OAuth  
- **File Storage:** AWS S3  
- **Payments:** Stripe  

---

## ✨ Key Features

- 🔐 **Authentication** — JWT-based login/registration + OAuth with Google  
- 📀 **Vinyls** — Full CRUD, search, filtering  
- 🧑 **Profiles** — View and update user info  
- 🛍️ **Orders** — Place and track vinyl purchases  
- ⭐ **Reviews** — Leave feedback on vinyl records  
- ☁️ **AWS S3** — Upload and serve album covers  
- 💸 **Stripe Integration** — Secure payments  
- 📦 **Redis** — Used for caching and session-related logic  
- 📄 **Logging** — Built-in logger with custom log service  
- 📢 **Telegram Bot** — Sends admin notifications to a channel (optional)

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/Nikita-Lysiuk/Vinyl-Store.git
cd Vinyl-Store
npm install
# Add .env file with DB, AWS, Stripe, Google OAuth etc.
npm run start:dev
