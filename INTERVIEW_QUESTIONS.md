# Interview Questions - Task Management System

This document covers interview questions from basics to advanced level based on this project.

---

## 📚 Table of Contents

1. [JavaScript/TypeScript Fundamentals](#javascripttypescript-fundamentals)
2. [React & Next.js](#react--nextjs)
3. [Node.js & Express](#nodejs--express)
4. [Database & Prisma](#database--prisma)
5. [Authentication & Security](#authentication--security)
6. [API Design & REST](#api-design--rest)
7. [State Management](#state-management)
8. [Performance & Optimization](#performance--optimization)
9. [Testing](#testing)
10. [Deployment & DevOps](#deployment--devops)
11. [System Design](#system-design)
12. [Code Review & Best Practices](#code-review--best-practices)

---

## JavaScript/TypeScript Fundamentals

### Q1: What is the difference between `let`, `const`, and `var`?
**Answer:**
- `var`: Function-scoped, hoisted, can be redeclared
- `let`: Block-scoped, not hoisted, can be reassigned
- `const`: Block-scoped, not hoisted, cannot be reassigned (but objects/arrays can be mutated)

**Example from project:**
```typescript
const TASKS_PER_PAGE = 9; // Constant value
let currentPage = 1; // Can be reassigned
```

### Q2: Explain closures in JavaScript.
**Answer:**
A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.

**Example from project:**
```typescript
// In apiClient.ts - tokenManager uses closures
export const tokenManager = {
    getAccessToken: () => accessToken, // Accesses outer scope variable
    setAccessToken: (token: string | null) => {
        accessToken = token;
    }
};
```

### Q3: What are Promises and async/await?
**Answer:**
- **Promise**: An object representing eventual completion/failure of an async operation
- **async/await**: Syntactic sugar for Promises, makes async code look synchronous

**Example from project:**
```typescript
// In authService.ts
async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.LOGIN,
        credentials
    );
    return response.data;
}
```

### Q4: Explain TypeScript interfaces vs types.
**Answer:**
- **Interface**: Can be extended, merged, better for object shapes
- **Type**: More flexible, can represent unions, intersections, primitives

**Example from project:**
```typescript
// Interface - better for object shapes
interface User {
    id: string;
    email: string;
    name: string;
}

// Type - for unions
type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
```

### Q5: What is destructuring in JavaScript?
**Answer:**
Extracting values from arrays/objects into distinct variables.

**Example from project:**
```typescript
const { user, logout, isAuthenticated } = useAuth();
const { email, password } = registerSchema.parse(req.body);
```

---

## React & Next.js

### Q6: Explain React Hooks (useState, useEffect, useCallback).
**Answer:**
- **useState**: Manages component state
- **useEffect**: Handles side effects (API calls, subscriptions)
- **useCallback**: Memoizes functions to prevent unnecessary re-renders

**Example from project:**
```typescript
// In useTasks.ts
const [tasks, setTasks] = useState<Task[]>([]);
const fetchTasks = useCallback(async () => {
    // ... fetch logic
}, [page, limit, search, status]);

useEffect(() => {
    fetchTasks();
}, [fetchTasks]);
```

### Q7: What is the difference between Server Components and Client Components in Next.js?
**Answer:**
- **Server Components**: Rendered on server, no JavaScript sent to client, can access databases directly
- **Client Components**: Rendered on client, interactive, use `'use client'` directive

**Example from project:**
```typescript
// Client Component (needs interactivity)
'use client';
export default function DashboardPage() { ... }

// Server Component (default in App Router)
export default function RootLayout() { ... }
```

### Q8: Explain React Context API.
**Answer:**
Provides a way to pass data through the component tree without prop drilling.

**Example from project:**
```typescript
// AuthContext.tsx
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState<User | null>(null);
    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
```

### Q9: What is the App Router in Next.js 13+?
**Answer:**
File-system based routing where folders define routes. Uses Server Components by default, supports layouts, loading states, and error boundaries.

**Example from project:**
```
app/
  ├── page.tsx          → /
  ├── login/page.tsx    → /login
  ├── register/page.tsx → /register
  └── dashboard/page.tsx → /dashboard
```

### Q10: How does Next.js handle API routes?
**Answer:**
In App Router, API routes are in `app/api/` directory. Each route file exports HTTP method handlers (GET, POST, etc.).

**Note:** This project uses a separate Express backend, not Next.js API routes.

---

## Node.js & Express

### Q11: What is middleware in Express?
**Answer:**
Functions that execute during the request-response cycle. Can modify request/response, end the cycle, or call next middleware.

**Example from project:**
```typescript
// In index.ts
app.use(cors());        // CORS middleware
app.use(helmet());      // Security middleware
app.use(express.json()); // Body parser middleware

// Custom middleware
router.use(authenticate); // Protect all task routes
```

### Q12: Explain Express routing.
**Answer:**
Routes define endpoints and HTTP methods. Can use parameters, query strings, and middleware.

**Example from project:**
```typescript
// authRoutes.ts
router.post('/register', register);
router.post('/login', login);

// taskRoutes.ts
router.get('/:id', getTask);
router.patch('/:id', updateTask);
```

### Q13: What is the difference between `app.use()` and `app.get()`?
**Answer:**
- `app.use()`: Matches all HTTP methods, used for middleware
- `app.get()`: Matches only GET requests, used for routes

**Example from project:**
```typescript
app.use('/api/auth', authRoutes); // Middleware for all methods
app.get('/', (req, res) => { ... }); // GET route only
```

### Q14: How do you handle errors in Express?
**Answer:**
Use try-catch blocks, error middleware, or return error responses with appropriate status codes.

**Example from project:**
```typescript
export const register = async (req: Request, res: Response) => {
    try {
        // ... logic
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};
```

### Q15: What is CORS and why is it needed?
**Answer:**
Cross-Origin Resource Sharing. Allows browsers to make requests to different origins. Needed when frontend and backend are on different domains/ports.

**Example from project:**
```typescript
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3001',
    credentials: true,
}));
```

---

## Database & Prisma

### Q16: What is an ORM and why use Prisma?
**Answer:**
- **ORM**: Object-Relational Mapping - maps database tables to objects
- **Prisma**: Type-safe, auto-generated client, migrations, great DX

**Example from project:**
```typescript
// Instead of raw SQL:
// SELECT * FROM tasks WHERE userId = ? AND status = ?

// Prisma:
const tasks = await prisma.task.findMany({
    where: { userId, status: 'PENDING' }
});
```

### Q17: Explain Prisma migrations.
**Answer:**
Migrations track database schema changes. `prisma migrate dev` creates and applies migrations.

**Example from project:**
```bash
npx prisma migrate dev --name add_user_name_field
```

### Q18: What is a database transaction?
**Answer:**
A sequence of operations that either all succeed or all fail (atomicity).

**Example from project:**
```typescript
// In authController.ts - token rotation
await prisma.$transaction([
    prisma.refreshToken.update({ ... }), // Revoke old token
    prisma.refreshToken.create({ ... }), // Create new token
]);
```

### Q19: How do you handle database relationships in Prisma?
**Answer:**
Use `@relation` directive to define relationships between models.

**Example from project:**
```prisma
model User {
    tasks Task[]
}

model Task {
    userId String
    user   User @relation(fields: [userId], references: [id])
}
```

### Q20: What is database indexing and why is it important?
**Answer:**
Indexes speed up queries by creating a data structure that allows faster lookups. Important for frequently queried fields.

**Example:**
```prisma
model User {
    email String @unique // Creates index automatically
}
```

---

## Authentication & Security

### Q21: Explain JWT (JSON Web Tokens).
**Answer:**
A compact, URL-safe token format. Contains payload (claims), signature, and header. Stateless authentication.

**Structure:**
```
header.payload.signature
```

**Example from project:**
```typescript
// Generate token
const accessToken = jwt.sign({ userId }, SECRET, { expiresIn: '15m' });

// Verify token
const decoded = jwt.verify(token, SECRET);
```

### Q22: Why use both Access Token and Refresh Token?
**Answer:**
- **Access Token**: Short-lived (15 min), used for API requests, less damage if stolen
- **Refresh Token**: Long-lived (7 days), stored securely, used to get new access tokens

**Example from project:**
```typescript
// Access token - short-lived
generateAccessToken(userId); // 15 minutes

// Refresh token - long-lived
generateRefreshToken(userId); // 7 days
```

### Q23: How does password hashing work?
**Answer:**
One-way function that converts password to hash. bcrypt adds salt (random data) to prevent rainbow table attacks.

**Example from project:**
```typescript
// Hash password
const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Q24: What is token rotation and why is it important?
**Answer:**
Issuing a new refresh token on each refresh. Prevents token reuse attacks. Old token is revoked, new one is issued.

**Example from project:**
```typescript
// Revoke old token, create new one
await prisma.$transaction([
    prisma.refreshToken.update({ where: { id }, data: { revoked: true } }),
    prisma.refreshToken.create({ data: { token: newRefreshToken, ... } }),
]);
```

### Q25: How do you protect API routes?
**Answer:**
Use authentication middleware that verifies JWT tokens before allowing access.

**Example from project:**
```typescript
// authMiddleware.ts
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.user = { userId: decoded.userId };
    next();
};

// Protect routes
router.use(authenticate); // All routes below require auth
```

---

## API Design & REST

### Q26: What are RESTful principles?
**Answer:**
- Use HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Resource-based URLs (`/api/tasks/:id`)
- Stateless requests
- JSON responses
- Proper status codes

**Example from project:**
```typescript
GET    /api/tasks      // List all
POST   /api/tasks      // Create
GET    /api/tasks/:id  // Get one
PATCH  /api/tasks/:id  // Update
DELETE /api/tasks/:id  // Delete
```

### Q27: What is the difference between PUT and PATCH?
**Answer:**
- **PUT**: Replace entire resource
- **PATCH**: Partial update

**Example from project:**
```typescript
// PATCH - partial update
router.patch('/:id', updateTask); // Only updates provided fields
```

### Q28: How do you handle pagination in APIs?
**Answer:**
Use query parameters (`page`, `limit`) and return metadata (total, totalPages).

**Example from project:**
```typescript
// Query: GET /api/tasks?page=1&limit=10
const { page = '1', limit = '10' } = req.query;
const skip = (parseInt(page) - 1) * parseInt(limit);

res.json({
    tasks,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
});
```

### Q29: What are HTTP status codes?
**Answer:**
- **2xx**: Success (200 OK, 201 Created, 204 No Content)
- **4xx**: Client errors (400 Bad Request, 401 Unauthorized, 404 Not Found)
- **5xx**: Server errors (500 Internal Server Error)

**Example from project:**
```typescript
res.status(201).json({ ... }); // Created
res.status(400).json({ errors }); // Bad Request
res.status(401).json({ message: 'Unauthorized' }); // Unauthorized
res.status(404).json({ message: 'Not found' }); // Not Found
```

### Q30: How do you validate API requests?
**Answer:**
Use validation libraries like Zod to validate request body, query params, and route params.

**Example from project:**
```typescript
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
});

const { email, password, name } = registerSchema.parse(req.body);
```

---

## State Management

### Q31: When to use Context API vs Redux?
**Answer:**
- **Context API**: Simple state, small apps, auth state
- **Redux**: Complex state, large apps, time-travel debugging

**Example from project:**
```typescript
// Context API for auth (simple, global state)
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

### Q32: What is prop drilling and how to avoid it?
**Answer:**
Passing props through multiple components. Avoid with Context API, component composition, or state management libraries.

**Example from project:**
```typescript
// Without Context (prop drilling):
<App user={user} setUser={setUser} />
  <Dashboard user={user} setUser={setUser} />
    <Header user={user} />

// With Context (no prop drilling):
<AuthProvider>
  <Dashboard /> // Can use useAuth() hook
</AuthProvider>
```

### Q33: Explain custom hooks.
**Answer:**
Reusable functions that use React hooks. Encapsulate logic and state.

**Example from project:**
```typescript
// useTasks.ts - custom hook
export function useTasks(options) {
    const [tasks, setTasks] = useState<Task[]>([]);
    // ... logic
    return { tasks, isLoading, createTask, updateTask, ... };
}

// Usage
const { tasks, createTask } = useTasks({ page: 1, limit: 9 });
```

### Q34: What is the difference between state and props?
**Answer:**
- **State**: Internal component data, can change, triggers re-render
- **Props**: External data passed to component, read-only

**Example from project:**
```typescript
// State
const [tasks, setTasks] = useState<Task[]>([]);

// Props
function TaskCard({ task, onEdit, onDelete }: TaskCardProps) { ... }
```

---

## Performance & Optimization

### Q35: How do you optimize React performance?
**Answer:**
- `React.memo()` - Memoize components
- `useMemo()` - Memoize expensive calculations
- `useCallback()` - Memoize functions
- Code splitting
- Lazy loading

**Example from project:**
```typescript
// useCallback to prevent unnecessary re-renders
const fetchTasks = useCallback(async () => {
    // ... logic
}, [page, limit, search, status]);
```

### Q36: What is code splitting?
**Answer:**
Splitting code into smaller chunks loaded on demand. Reduces initial bundle size.

**Example:**
Next.js automatically code-splits by route and dynamic imports.

### Q37: How do you handle API request optimization?
**Answer:**
- Debounce search inputs
- Cache responses
- Pagination
- Request cancellation
- Request queuing (for token refresh)

**Example from project:**
```typescript
// Request queuing during token refresh
let failedQueue = [];
if (isRefreshing) {
    failedQueue.push({ resolve, reject });
}
```

### Q38: What is lazy loading?
**Answer:**
Loading components/resources only when needed.

**Example:**
```typescript
const TaskModal = lazy(() => import('@/components/TaskModal'));
```

### Q39: How do you optimize database queries?
**Answer:**
- Use indexes
- Select only needed fields
- Use pagination
- Avoid N+1 queries
- Use transactions for related operations

**Example from project:**
```typescript
// Select only needed fields
const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true },
});
```

---

## Testing

### Q40: What types of testing exist?
**Answer:**
- **Unit**: Test individual functions/components
- **Integration**: Test component interactions
- **E2E**: Test full user flows
- **Snapshot**: Test UI doesn't change unexpectedly

### Q41: How would you test an API endpoint?
**Answer:**
Use testing frameworks like Jest, Supertest. Test status codes, response data, error cases.

**Example:**
```typescript
describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123', name: 'Test' });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('accessToken');
    });
});
```

### Q42: How would you test React components?
**Answer:**
Use React Testing Library. Test user interactions, not implementation details.

**Example:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';

test('should create task on form submit', () => {
    render(<TaskModal isOpen={true} />);
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('Create Task'));
    // Assert task created
});
```

---

## Deployment & DevOps

### Q43: What is CI/CD?
**Answer:**
- **CI**: Continuous Integration - automatically test code on push
- **CD**: Continuous Deployment - automatically deploy on merge

### Q44: How do you handle environment variables?
**Answer:**
Store in `.env` files (not committed), use different values for dev/staging/prod.

**Example from project:**
```typescript
// Backend
const PORT = process.env.PORT || 3000;

// Frontend (must start with NEXT_PUBLIC_)
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

### Q45: What is Docker and why use it?
**Answer:**
Containerization platform. Ensures consistent environments across dev/staging/prod.

### Q46: How do you monitor production applications?
**Answer:**
- Error tracking (Sentry)
- Logging (Winston, Pino)
- Performance monitoring (New Relic)
- Analytics

---

## System Design

### Q47: How would you scale this application?
**Answer:**
- **Horizontal scaling**: Multiple server instances, load balancer
- **Database**: Read replicas, connection pooling
- **Caching**: Redis for sessions, frequently accessed data
- **CDN**: For static assets
- **Database sharding**: If needed

### Q48: How would you handle high traffic?
**Answer:**
- Load balancing
- Caching (Redis)
- Database optimization
- Rate limiting
- CDN for static assets
- Auto-scaling

### Q49: What is database normalization?
**Answer:**
Organizing data to reduce redundancy. Normal forms (1NF, 2NF, 3NF) define rules.

**Example from project:**
```prisma
// Normalized - User and Task are separate tables
model User {
    tasks Task[]
}

model Task {
    userId String
    user   User @relation(...)
}
```

### Q50: Explain microservices vs monolith.
**Answer:**
- **Monolith**: Single application (like this project)
- **Microservices**: Separate services for different features

**This project is a monolith** - good for small/medium apps, easier to develop and deploy.

---

## Code Review & Best Practices

### Q51: What makes code maintainable?
**Answer:**
- Clear naming
- DRY (Don't Repeat Yourself)
- Single Responsibility Principle
- Comments for complex logic
- Consistent formatting
- Type safety

**Example from project:**
```typescript
// Good: Clear naming, single responsibility
export function useTasks(options: UseTasksOptions) {
    // ... focused on task management only
}

// Good: Reusable component
export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    // ... focused on displaying one task
}
```

### Q52: What is SOLID?
**Answer:**
- **S**: Single Responsibility
- **O**: Open/Closed
- **L**: Liskov Substitution
- **I**: Interface Segregation
- **D**: Dependency Inversion

### Q53: How do you handle errors gracefully?
**Answer:**
- Try-catch blocks
- Error boundaries (React)
- User-friendly error messages
- Logging errors
- Fallback UI

**Example from project:**
```typescript
try {
    await taskService.createTask(data);
    toast.success('Task created!');
} catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to create task';
    toast.error(errorMessage);
}
```

### Q54: What is the difference between authentication and authorization?
**Answer:**
- **Authentication**: Who you are (login)
- **Authorization**: What you can do (permissions)

**Example from project:**
```typescript
// Authentication - verify user identity
const decoded = verifyAccessToken(token);
req.user = { userId: decoded.userId };

// Authorization - check if user owns the task
const task = await prisma.task.findFirst({ where: { id, userId } });
if (!task) return res.status(404).json({ message: 'Task not found' });
```

### Q55: How do you ensure code quality?
**Answer:**
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Code reviews
- Testing
- Linting in CI/CD

---

## Advanced Questions

### Q56: Explain the token refresh flow in detail.
**Answer:**
1. Access token expires (401 response)
2. Client sends refresh token to `/api/auth/refresh`
3. Server verifies refresh token, checks if revoked
4. Server generates new access + refresh tokens
5. Server revokes old refresh token (rotation)
6. Client stores new tokens
7. Client retries original request with new access token

**Example from project:**
```typescript
// In apiClient.ts - response interceptor
if (error.response?.status === 401 && !originalRequest._retry) {
    // Queue request
    // Refresh token
    // Retry original request
}
```

### Q57: How would you implement real-time updates?
**Answer:**
- WebSockets (Socket.io)
- Server-Sent Events (SSE)
- Polling (less efficient)

### Q58: How do you prevent SQL injection?
**Answer:**
- Use parameterized queries (Prisma does this automatically)
- Never concatenate user input into SQL
- Validate and sanitize inputs

**Example:**
```typescript
// ❌ Bad (SQL injection risk)
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Good (Prisma - parameterized)
const user = await prisma.user.findUnique({ where: { email } });
```

### Q59: What is XSS and how to prevent it?
**Answer:**
Cross-Site Scripting - injecting malicious scripts. Prevent by:
- Sanitizing user input
- Using React's built-in escaping
- Content Security Policy (CSP)

**React automatically escapes** user input in JSX.

### Q60: How would you implement rate limiting?
**Answer:**
Limit number of requests per IP/user. Use middleware like `express-rate-limit`.

**Example:**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Project-Specific Questions

### Q61: Why did you choose Prisma over TypeORM?
**Answer:**
- Better TypeScript support
- Auto-generated types
- Better developer experience
- Simpler migrations
- Great documentation

### Q62: Why use custom hooks instead of putting logic in components?
**Answer:**
- Reusability
- Separation of concerns
- Easier testing
- Cleaner components

**Example from project:**
```typescript
// Instead of logic in DashboardPage, use custom hook
const { tasks, createTask, updateTask } = useTasks({ page, limit });
```

### Q63: How does the token refresh interceptor work?
**Answer:**
Axios interceptor catches 401 errors, attempts token refresh, queues failed requests, retries them after refresh.

**Example from project:**
```typescript
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Refresh token logic
            // Queue requests
            // Retry original request
        }
    }
);
```

### Q64: Why separate client and server folders?
**Answer:**
- Clear separation of concerns
- Independent deployment
- Different dependencies
- Industry standard monorepo structure

### Q65: How would you add file upload functionality?
**Answer:**
- Use `multer` middleware (Express)
- Store files in cloud storage (S3) or local filesystem
- Update Prisma schema with file URL field
- Handle file validation and size limits

---

## Conclusion

These questions cover the fundamentals to advanced concepts in full-stack development. Practice explaining each concept clearly and provide examples from this project or your experience.

**Tips for interviews:**
1. Start with high-level explanation
2. Provide concrete examples
3. Mention trade-offs and alternatives
4. Show understanding of best practices
5. Be honest about what you don't know

Good luck! 🚀

