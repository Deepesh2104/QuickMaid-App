# QuickMaid-App

Native mobile apps for the QuickMaid platform — **Customer** and **Partner** (React Native + Expo).

## Repositories

| Repo | Purpose |
|------|---------|
| [QuickMaid](https://github.com/Deepesh2104/QuickMaid) | Web marketing + admin console |
| **QuickMaid-App** (this repo) | Customer + Partner mobile apps |
| QuickMaid-API | Backend API (Phase 3) |

## Apps & screens

| App | Screens | Status |
|-----|---------|--------|
| Customer | 42 planned | **Step 1 in progress** (auth + main tabs) |
| Partner | 32 planned | Not started |

## Customer app — run locally

```bash
cd apps/customer
npm install
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS).

### Demo flow

1. Splash → Onboarding → City (Raipur)
2. Login with any 10-digit number
3. OTP: `123456`
4. Name + permissions → Home tabs

## Structure

```
QuickMaid-App/
├── apps/
│   └── customer/     # Customer app (Expo Router)
└── README.md
```
