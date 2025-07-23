# Link Shortener

A modern URL shortening service built with [Next.js](https://nextjs.org), providing fast, reliable, and privacy-friendly link shortening. Easily create, manage, and track short links with a user-friendly dashboard.

---

## Features

- 🔗 Shorten long URLs quickly and easily
- 📊 Track link statistics (clicks, QR codes, etc.)
- 🛡️ Secure authentication and user management
- 🖥️ Dashboard to manage your links
- 🌗 Light/Dark mode toggle
- 🧩 Built with Next.js, Prisma, and modern tooling

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Frontend:** React, Next.js App Router
- **Styling:** Tailwind CSS, PostCSS
- **Database:** PostgreSQL (via Prisma ORM)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Testing:** Jest
- **Deployment:** Vercel (recommended)
- **Other:** TypeScript, ESLint, Prettier

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/link-shortner.git
cd link-shortner/web
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in the required values (database URL, authentication secrets, etc.).

### 4. Run database migrations

```bash
npx prisma migrate deploy
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

## License

This project is licensed under the MIT License.
