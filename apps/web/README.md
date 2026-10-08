# React + Vite

## Menjalankan aplikasi dengan API

1. Salin `../api/.env.example` menjadi `../api/.env`, lalu isi `DATABASE_URL` dan `JWT_SECRET`.
2. Salin `.env.example` menjadi `.env`. Nilai `VITE_API_URL=/api` memakai proxy Vite ke API lokal di `http://localhost:3000`.
3. Pastikan database sudah disiapkan, lalu jalankan `pnpm dev` dari root repository untuk menjalankan web dan API.

Untuk deployment, atur `VITE_API_URL` ke URL API yang dapat dijangkau browser dan diakhiri `/api`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
