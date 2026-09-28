# 🔐 Assignment 7: Authentication System

A comprehensive, production-grade **Authentication System** built using **React**, **Vite**, and **React Router**. This repository specifically fulfills all requirements outlined in **Assignment 7: Authentication System** (integrated with task management capabilities).

---

## 🎯 Assignment 7 Features Implemented

### 1. 🔑 Core Authentication Capabilities
- **Login**:
  - Full login workflow on `/login` with real-time feedback and credentials evaluation.
  - 1-Click Demo Login options for instant testing:
    - 👑 **Admin** (`admin` / `Admin@Pass2026!`)
    - 👩‍💻 **Developer** (`sarah_dev` / `Sarah#Dev2026`)
- **Logout**:
  - Global logout action in header navigation.
  - Wipes session data, invalidates JWT tokens, and redirects safely to `/login`.
- **Protected Dashboard**:
  - The root Dashboard route (`/`) is guarded by `<ProtectedRoute>`.
  - Unauthenticated users cannot view the dashboard and are automatically redirected to `/login` with their target path preserved.
- **Remember User**:
  - Interactive "Remember User" checkbox.
  - **Checked**: Persists simulated JWT token and user profile in `localStorage` across browser restarts and auto-populates username on future visits.
  - **Unchecked**: Strictly stores session in `sessionStorage` (clears when browser tab/window closes).
- **JWT Token Simulation**:
  - RFC 7519 compliant simulated 3-part token: `[Base64Url(Header)].[Base64Url(Payload)].[Base64Url(Signature)]`.
  - **Header**: `{ "alg": "HS256", "typ": "JWT" }`
  - **Payload**: `{ "sub": username, "name": name, "role": role, "iat": timestamp, "exp": expiry, "rememberUser": bool }`
  - **Signature**: Simulated HMAC cryptographic hash.
  - **Live JWT Inspector Modal**: Click the **🔑 JWT** button in the header or dashboard to view color-coded token parts, decode claims, and inspect expiration timestamps.

---

### 2. ✅ Validation Requirements
- **Username Required**: Real-time validation displaying inline error (`⚠️ Username is required`) if empty on blur or submission.
- **Password Required**: Real-time validation displaying inline error (`⚠️ Password is required`) if empty.
- **Display Password Strength**:
  - Live animated 4-level meter (Weak 🔴, Fair 🟠, Good 🟡, Strong 🟢).
  - Dynamic checklist checking:
    - 8+ characters
    - Uppercase letter (`A-Z`)
    - Lowercase letter (`a-z`)
    - Number (`0-9`)
    - Special symbol (`!@#$%^&*`)

---

## 🛠️ Local Setup & Running

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build
```

---

## 🐙 How to Upload Assignment 7 to GitHub

### Via GitHub Desktop:
1. Open **GitHub Desktop**.
2. Click **File** > **Add Local Repository...** (`Ctrl + O`).
3. Select the folder:
   ```
   C:\Users\abhik\Desktop\scratch\assignment-7-auth-system
   ```
4. Click **Add Repository**.
5. Click **Publish repository** to push it to `https://github.com/Abhik-x11/assignment-7-auth-system`.

### Via Terminal / PowerShell:
```powershell
cd C:\Users\abhik\Desktop\scratch\assignment-7-auth-system
& "C:\Users\abhik\AppData\Local\GitHubDesktop\app-3.6.6\resources\app\git\cmd\git.exe" push -u origin main
```
