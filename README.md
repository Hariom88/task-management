# Task Management System

A full-stack task management application built with Next.js, Express, TypeScript, and Prisma. This project demonstrates industry-standard practices for building scalable web applications with authentication, CRUD operations, and modern UI/UX.

## 🚀 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS 4** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors
- **react-hot-toast** - Toast notifications
- **React Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Zod** - Schema validation

## 📁 Project Structure

```
Assignment/
├── client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   │   ├── dashboard/ # Dashboard page
│   │   │   ├── login/     # Login page
│   │   │   ├── register/  # Registration page
│   │   │   └── page.tsx   # Landing page
│   │   ├── components/    # Reusable components
│   │   │   ├── dashboard/ # Dashboard-specific components
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskModal.tsx
│   │   ├── contexts/      # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   │   └── useTasks.ts
│   │   ├── services/      # API service layer
│   │   │   ├── authService.ts
│   │   │   └── taskService.ts
│   │   ├── lib/           # Utilities
│   │   │   └── apiClient.ts
│   │   ├── config/        # Configuration
│   │   │   └── api.ts
│   │   └── types/         # TypeScript types
│   │       └── index.ts
│   └── package.json
│
├── server/                # Express Backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   │   ├── authController.ts
│   │   │   └── taskController.ts
│   │   ├── middlewares/   # Custom middlewares
│   │   │   └── authMiddleware.ts
│   │   ├── routes/         # API routes
│   │   │   ├── authRoutes.ts
│   │   │   └── taskRoutes.ts
│   │   ├── utils/         # Utilities
│   │   │   ├── jwt.ts
│   │   │   └── prisma.ts
│   │   └── index.ts       # Entry point
│   ├── prisma/            # Database schema
│   │   └── schema.prisma
│   └── package.json
│
└── package.json           # Root (Monorepo scripts)
```

## ✨ Features

### Authentication
- ✅ User registration with name, email, and password
- ✅ Secure login with JWT tokens
- ✅ Access token (15 minutes) + Refresh token (7 days)
- ✅ Automatic token refresh on expiry
- ✅ Secure logout with token revocation
- ✅ Password hashing with bcrypt

### Task Management
- ✅ Create, Read, Update, Delete tasks
- ✅ Task status management (Pending, In Progress, Completed)
- ✅ One-click status toggle (cycles through all statuses)
- ✅ Search tasks by title
- ✅ Filter tasks by status
- ✅ Pagination support
- ✅ User-specific tasks (data isolation)

### UI/UX
- ✅ Modern, responsive design
- ✅ Glassmorphism effects
- ✅ Smooth animations and transitions
- ✅ Toast notifications
- ✅ Loading states
- ✅ Empty states
- ✅ Error handling
- ✅ Mobile-friendly

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use SQLite for development)
- npm or yarn package manager

### 1. Install Dependencies

```bash
# Install all dependencies (root, client, and server)
npm run install:all

# Or install manually:
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Database Setup

```bash
cd server

# Create .env file
# Add the following:
# DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
# JWT_SECRET="your-secret-key-min-32-characters"
# JWT_REFRESH_SECRET="your-refresh-secret-min-32-characters"
# PORT=3000
# CLIENT_URL="http://localhost:3001"

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 3. Frontend Setup

```bash
cd client

# Create .env.local file
# Add the following:
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. Run the Application

**Option 1: Run both servers together (Recommended)**
```bash
# From root directory
npm run dev
```

**Option 2: Run servers separately**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:3001

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register  - Register new user
POST   /api/auth/login     - Login user
POST   /api/auth/refresh   - Refresh access token
POST   /api/auth/logout    - Logout and revoke token
```

### Tasks (Protected - Requires Authentication)
```
GET    /api/tasks          - Get all tasks (with pagination, search, filter)
POST   /api/tasks          - Create new task
GET    /api/tasks/:id      - Get single task
PATCH  /api/tasks/:id      - Update task
DELETE /api/tasks/:id      - Delete task
PATCH  /api/tasks/:id/toggle - Toggle task status
```

### Query Parameters (GET /api/tasks)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by title (case-insensitive)
- `status` - Filter by status (PENDING, IN_PROGRESS, COMPLETED)

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // Hashed with bcrypt
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
  refreshTokens RefreshToken[]
}
```

### Task Model
```prisma
model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  userId      String
  user        User       @relation(fields: [userId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}
```

### RefreshToken Model
```prisma
model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  expiresAt DateTime
  createdAt DateTime @default(now())
  revoked   Boolean  @default(false)
}
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds 10
- **JWT Tokens**: Short-lived access tokens (15 min) + Long-lived refresh tokens (7 days)
- **Token Rotation**: Refresh tokens are rotated on each use
- **Token Revocation**: Logout revokes refresh tokens
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: React's built-in protection

## 🏗️ Architecture Patterns

### Frontend
- **Component-Based Architecture**: Reusable, composable components
- **Custom Hooks**: Business logic separation (`useTasks`)
- **Service Layer**: API calls abstracted in services
- **Context API**: Global state management for auth
- **Type Safety**: Full TypeScript coverage

### Backend
- **MVC Pattern**: Controllers, Routes, Models separation
- **Middleware Pattern**: Authentication, validation, error handling
- **Repository Pattern**: Prisma as data access layer
- **Validation Layer**: Zod schemas for request validation
- **Error Handling**: Consistent error responses

## 📦 Available Scripts

### Root Level
```bash
npm run dev              # Run both client and server
npm run dev:client       # Run only client
npm run dev:server       # Run only server
npm run build            # Build both client and server
npm run start            # Start production servers
npm run install:all      # Install all dependencies
```

### Client
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Server
```bash
npm run dev              # Start with nodemon (auto-reload)
npm run build            # Compile TypeScript
npm start                # Start production server
```

## 🚀 Deployment

### Backend Deployment (Example: Railway/Render)
1. Connect your GitHub repository
2. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `PORT`
   - `CLIENT_URL`
3. Run migrations: `npx prisma migrate deploy`

### Frontend Deployment (Example: Vercel)
1. Connect your GitHub repository
2. Set environment variable:
   - `NEXT_PUBLIC_API_URL` (your backend URL)
3. Deploy automatically on push

## 🧪 Testing the Application

1. **Register a new user** at `/register`
2. **Login** at `/login`
3. **Create tasks** from the dashboard
4. **Search tasks** by title
5. **Filter tasks** by status
6. **Toggle task status** by clicking the status badge
7. **Edit tasks** using the edit button
8. **Delete tasks** using the delete button
9. **Navigate pages** using pagination

## 🐛 Troubleshooting

### Backend Issues
- **Database connection fails**: Check `DATABASE_URL` in `.env`
- **JWT errors**: Verify `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
- **Port already in use**: Change `PORT` in `.env` or kill the process

### Frontend Issues
- **Cannot connect to API**: Check `NEXT_PUBLIC_API_URL` and ensure backend is running
- **CORS errors**: Verify `CLIENT_URL` in server `.env` matches frontend URL
- **Token refresh fails**: Clear localStorage and login again

## 📝 Code Quality

- ✅ TypeScript strict mode enabled
- ✅ ESLint configured
- ✅ Consistent code formatting
- ✅ Component-based architecture
- ✅ Separation of concerns
- ✅ Reusable custom hooks
- ✅ Proper error handling
- ✅ Loading and empty states

## 📄 License

MIT License - Free to use for learning and production.

---

**Built with ❤️ using Next.js, Express, TypeScript, and Prisma**
