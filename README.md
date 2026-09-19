# Personal Notes App - Next.js

A Next.js frontend for the Personal Notes application.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)

## 🌐 Live Demo

[https://longsmoke1001.github.io/nextjs-notes/](https://longsmoke1001.github.io/nextjs-notes/)

**Login**: `admin` / `password`

## ✨ Features

- 🔐 JWT Authentication (Login / Logout)
- 📝 Notes CRUD (Create / Read / Update / Delete)
- 📄 Pagination
- 🏷️ Categories (General / Diary / Password)
- 📱 Responsive Design (Tailwind CSS)

## 🛠️ Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **`fetch`**

## 📁 Project Structure

```
nextjs-notes/
  ├── app/
  │     ├── layout.tsx          ← Root Layout
  │     ├── page.tsx            ← Home Page
  │     ├── login/
  │     │     └── page.tsx      ← /login
  │     └── notes/
  │           └── page.tsx      ← /notes
  ├── components/
  │     ├── AddNote.tsx         ← Add Note Form
  │     └── EditNote.tsx        ← Edit Note Form
  └── lib/
        └── api.ts              ← API Configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Git

### 1. Clone the repository

```bash
git clone https://github.com/longsmoke1001/nextjs-notes.git
cd nextjs-notes
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=https://personal-notes-api-eeh2exdphmcccaat.germanywestcentral-01.azurewebsites.net
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

`.env.local`:

```
NEXT_PUBLIC_API_URL=https://personal-notes-api-eeh2exdphmcccaat.germanywestcentral-01.azurewebsites.net
```

**Note**: `.env.local` is not committed to GitHub. For production, environment variables are set in the GitHub Actions workflow.

## 🚢 Deployment

This project is automatically deployed to GitHub Pages via GitHub Actions.

```bash
git add .
git commit -m "Update"
git push
```

The workflow will:
1. Install dependencies
2. Build the Next.js app
3. Deploy to GitHub Pages

## 🔗 Related Repositories

- **Backend API + React Version**: [DotNetRepo](https://github.com/longsmoke1001/DotNetRepo)

## 📝 License

MIT License

## 👤 Author

**Huang Long Yin, Leo**
- GitHub: [@longsmoke1001](https://github.com/longsmoke1001)
