# GrowIn

A modern platform connecting startups with investors, built with Next.js 16 and MongoDB.

## Features

- 🚀 **Startup Management** - Complete CRUD operations for startups
- 👥 **User Authentication** - Secure auth with NextAuth.js
- 🔍 **Advanced Search** - Filter and search startups by category, industry
- 📱 **Responsive Design** - Built with Tailwind CSS
- 🗄️ **Database Integration** - MongoDB with Mongoose ODM

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- pnpm (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/farooqsanaullah/GrowIn.git
   cd GrowIn
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create `.env.local`:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Startup Management
- `GET /api/startups` - List all startups (with pagination)
- `POST /api/startups` - Create new startup
- `GET /api/startups/[id]` - Get startup by ID
- `PUT /api/startups/[id]` - Update startup
- `DELETE /api/startups/[id]` - Delete startup
- `GET /api/startups/founder/[founderId]` - Get startups by founder

### Authentication
- `POST /api/auth/signup` - User registration
- `GET /api/auth/check-username` - Check username availability

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utilities and configurations
│   ├── models/           # Database models
│   ├── utils/            # Helper functions
│   └── auth/             # Authentication logic
└── types/                # TypeScript type definitions
```

## Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Amrood Labs.

---

**Built with ❤️ by the GrowIn Team**
