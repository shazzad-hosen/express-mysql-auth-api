# 🚀 Production-Grade Auth API (Express + MySQL + Redis)

A secure, scalable authentication system built with **Node.js**, featuring JWT-based auth, rotating refresh tokens, email verification, OTP flows, and Redis-backed rate limiting.

🔗 **Live API:** https://express-mysql-auth-api.onrender.com <br>
📘 **API Docs (Swagger):** https://express-mysql-auth-api.onrender.com/api-docs

---

## ✨ Features

* 🔐 JWT Authentication (Access + Refresh Tokens)
* 🔄 Refresh Token Rotation + Reuse Detection
* 📧 Email Verification (OTP-based)
* 🔑 Forgot / Reset Password (OTP-based)
* 🚫 Login blocked until email is verified
* ⚡ Redis Rate Limiting (Upstash)
* 🧠 Secure Token Hashing (no raw token storage)
* 🛡️ Protected Routes + Role-based Access
* 📄 Swagger API Documentation
* 🌐 Fully deployed (Render + Railway + Upstash)

---

## 🧱 Tech Stack

* **Backend:** Node.js, Express
* **Database:** MySQL (Railway)
* **Cache / Rate Limit:** Upstash Redis
* **Auth:** JWT
* **Docs:** Swagger
* **Deployment:** Render

---

## 📂 Project Structure

```bash
src/
├── config/         # DB, Redis, Mail, Env
├── controllers/    # Route handlers
├── services/       # Business logic
├── repositories/   # DB queries
├── middlewares/    # Auth, Rate limit, Error
├── routes/         # API routes
├── utils/          # Helpers (tokens, hashing, etc.)
└── server.js       # Entry point

```
---

## 🔐 Auth Flow (High Level)

```text
User Register → Email OTP → Verify → Login → Access + Refresh Token
                         ↓
                 Token Rotation + Reuse Detection
```

---

## 📦 API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/verify-email`
* `POST /api/auth/login`
* `POST /api/auth/refresh`
* `POST /api/auth/logout`

### Password

* `POST /api/auth/forgot-password`
* `POST /api/auth/reset-password`

---

## ⚙️ Environment Variables

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost 
DB_USER=root 
DB_PASSWORD=your_password 
DB_NAME=auth_db

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

OTP_EXPIRY=10m

EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password

REDIS_URL=
REDIS_TOKEN=
```

---

## 🧪 Run Locally

```bash
$ git clone https://github.com/shazzad-hosen/express-mysql-auth-api.git

$ cd express-mysql-auth-api

$ npm install

$ npm run dev
```

---

## 🧠 Security Highlights

* Refresh tokens are **hashed before storage**
* **Token reuse detection** invalidates sessions
* **Rate limiting** prevents brute-force attacks
* Email verification required before login
* Password reset uses **short-lived OTPs**
* HTTP-only cookies for refresh tokens

---

## 🌍 Deployment Architecture

```text
Client
  ↓
Render (Express API)
  ↓
Railway (MySQL)
  ↓
Upstash (Redis)
```

---

## 📌 Future Improvements

* Role-based access control (RBAC)
* 2FA (Authenticator apps)
* Docker support

---

## 🤝 Contributing

PRs are welcome. Feel free to fork and improve.

---

## ⭐ Show Your Support

If you find this useful, give it a ⭐ on GitHub.

---

## 👨‍💻 Author

Built by: **Shazzad Hosen Zisan**

---

## 📜 License

MIT License
