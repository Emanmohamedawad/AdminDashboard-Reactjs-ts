# Admin Dashboard - Role-Based Access Control System

A full-stack React + TypeScript admin dashboard with role-based access control, authentication, and user management. Built with React 19, Redux Toolkit, React Router, and Tailwind CSS.

## 🎯 Project Overview

This project implements a complete admin dashboard system with:

- **Authentication Flow**: Login/Register with email and password validation
- **Role-Based Access Control (RBAC)**: Admin and User roles with route-level protection
- **Dashboard**: Landing page showing user information
- **Users Management**: Admin-only page to view, search, and manage users
- **Profile Management**: View and edit own profile; admins can edit any user
- **Mock Backend**: JSON Server with full CRUD API endpoints
- **State Management**: Redux Toolkit for auth, users, and profile states
- **Form Validation**: React Hook Form with Zod schema validation
- **Styling**: Responsive design with Tailwind CSS v4
- **Testing**: Unit tests for auth flow with Vitest and React Testing Library

## 📋 Requirements Compliance

### ✅ Screens (4/5 Implemented)

- [x] **Login & Register**: Email/password with client-side validation
- [x] **Dashboard**: Shows current user info and role
- [x] **Users List (Admin-only)**: Searchable, sortable table with pagination
- [x] **User Profile**: View/edit own profile; admins can edit any user
- [ ] Activity Log (Optional - can be added)

### ✅ Functionality

- [x] **Authentication**: Login/Register with JWT token persistence (localStorage)
- [x] **Protected Routing**: Authenticated users redirected to /dashboard; unauthenticated redirected to /login
- [x] **Logout**: Clears token and redirects to login
- [x] **Role-Based UI**: Conditional rendering based on user.role
- [x] **API Integration**: Mock REST API with error handling
- [x] **401 Error Handling**: Auto-logout on unauthorized responses
- [x] **Loading States**: Form loading indicators during API calls
- [x] **Error Display**: User-friendly error messages in forms

### ✅ Technical Stack

- React 19 + TypeScript
- React Router v7 for navigation
- Redux Toolkit for state management
- React Hook Form + Zod for validation
- Tailwind CSS v4 for styling
- Axios for HTTP requests
- Vitest + React Testing Library for testing
- JSON Server for mock API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd AdminDashboard-Reactjs-ts

# Install dependencies
npm install
```

### Running the Project

#### Option 1: Run Frontend + Backend Together

```bash
npm run dev:all
```

This will start:

- **Frontend**: http://localhost:5174 (or next available port)
- **Backend**: http://localhost:3000

#### Option 2: Run Separately

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

### Testing

```bash
# Run all tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run tests with UI
npm run test:ui
```

### Building for Production

```bash
npm run build
npm run preview
```

## 📚 API Endpoints

### Authentication

- `POST /auth/login` - Login with email/password

  ```json
  {
    "email": "admin@example.com",
    "password": "admin123"
  }
  ```

  Response: `{ user: User, token: string }`

- `POST /auth/register` - Register new user

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "john123"
  }
  ```

- `GET /auth/profile` - Get current user profile (requires auth token)

### Users (Admin Only)

- `GET /users` - List all users with pagination, search, and sorting
  - Query params: `page`, `limit`, `search`, `sortBy`, `sortOrder`
  - Example: `/users?page=1&limit=10&search=john&sortBy=name&sortOrder=asc`

- `GET /users/:id` - Get single user
- `PUT /users/:id` - Update user (name, email, role)
- `DELETE /users/:id` - Delete user

### Profile (Current User)

- `GET /profile` - Get current user profile
- `PUT /profile` - Update current user (name, email)

### Activities (Optional)

- `GET /activities` - Get activity logs

## 🔐 Authentication Details

### Token Persistence

- **Method**: localStorage
- **Key**: "token"
- **Why**: Simple, suitable for development/demo; in production, consider httpOnly cookies for better security

### Login Flow

1. User enters email/password on login form
2. Frontend validates with Zod schema
3. POST request to `/auth/login`
4. Backend verifies credentials
5. Returns `{ user, token }` on success
6. Frontend stores token in localStorage
7. Redux auth state updated
8. User redirected to `/dashboard`

### Logout Flow

1. User clicks logout button
2. Redux dispatch `logout()` action
3. localStorage cleared
4. State reset to initial
5. User redirected to `/login`

### 401 Handling

- API interceptor catches 401 responses
- localStorage cleared
- Redux state reset
- User automatically redirected to `/login`

## 🔑 Role-Based Access Control

### Roles

- **admin**: Full access to all features
- **user**: Limited access (profile only, cannot manage other users)

### Protected Routes

```tsx
// Authenticated users only
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// Admin only (non-admins redirected to /dashboard)
<ProtectedRoute requiredRole="admin">
  <Users />
</ProtectedRoute>
```

### Test Credentials

| Role  | Email             | Password |
| ----- | ----------------- | -------- |
| Admin | admin@example.com | admin123 |
| Admin | bob@example.com   | bob123   |
| User  | john@example.com  | john123  |
| User  | jane@example.com  | jane123  |

## 📁 Project Structure

```
src/
├── app/
│   └── store.ts                 # Redux store configuration
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx  # Route protection
│   │   ├── PublicRoute.tsx     # Redirect authenticated users
│   │   └── *.test.tsx          # Auth tests
│   ├── forms/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── *.test.tsx          # Form tests
│   └── layout/
│       └── Layout.tsx           # Navigation & header
├── features/
│   ├── auth/
│   │   ├── authSlice.ts        # Redux auth reducer
│   │   └── authSlice.test.ts   # Auth state tests
│   ├── users/
│   │   └── usersSlice.ts       # Users management state
│   └── profile/
│       └── profileSlice.ts     # Profile state
├── pages/
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   └── Users.tsx
├── services/
│   ├── api.ts                  # Axios instance with interceptors
│   └── authAPI.ts              # API endpoints
├── types/
│   └── index.ts                # TypeScript interfaces
└── main.tsx                    # App entry point
```

## 🛠️ State Management

### Redux Slices

#### Auth State

```typescript
{
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
```

#### Users State

```typescript
{
  users: User[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}
```

#### Profile State

```typescript
{
  profile: User | null;
  loading: boolean;
  error: string | null;
}
```

## 🧪 Testing

### Test Coverage

- **authSlice.test.ts**: Redux reducer logic for login, logout, error handling
- **ProtectedRoute.test.tsx**: Route protection, role-based access
- **LoginForm.test.tsx**: Form validation, error display, submission

### Running Tests

```bash
npm test                  # Watch mode
npm test -- --run        # Single run
npm run test:ui          # Vitest UI dashboard
```

### Example Test

```typescript
it("should redirect to login when no token is present", () => {
  renderWithRedux(
    <Routes>
      <Route path="/protected" element={<ProtectedRoute><div>Protected</div></ProtectedRoute>} />
      <Route path="/login" element={<div>Login</div>} />
    </Routes>
  );

  expect(screen.getByText("Login Page")).toBeInTheDocument();
});
```

## 🎨 Styling

- **Tailwind CSS v4** for responsive, utility-first styling
- **@tailwindcss/postcss** for modern CSS pipeline
- Responsive breakpoints: `sm`, `md`, `lg`, `xl`
- Custom color scheme in `src/index.css`

## 🐛 Known Limitations

1. **Mock Backend**: All data is stored in-memory; resets on server restart
2. **No Real Authentication**: JWT tokens are fake; in production, use real token generation
3. **Single Device**: Sessions not synced across tabs/windows
4. **No Refresh Tokens**: Implement refresh token rotation for production

## 📝 Future Enhancements

- [ ] Refresh token implementation
- [ ] Activity log display
- [ ] Light/dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Email verification
- [ ] Password reset flow
- [ ] Two-factor authentication
- [ ] Audit logs
- [ ] Role hierarchy (superadmin > admin > user)

## 📦 Dependencies

### Core

- react: 19.2.5
- react-router-dom: 7.14.2
- @reduxjs/toolkit: 2.11.2
- react-redux: 9.2.0

### Forms & Validation

- react-hook-form: 7.73.1
- zod: 4.3.6
- @hookform/resolvers: 5.2.2

### HTTP & API

- axios: 1.15.2
- json-server: 0.17.4

### Styling

- tailwindcss: 4.2.4
- @tailwindcss/postcss: 4.2.4
- autoprefixer: 10.5.0

### Testing

- vitest: 4.1.5
- @testing-library/react: 16.3.2
- @testing-library/jest-dom: 6.9.1
- @testing-library/user-event: latest
- jsdom: latest

### Development

- typescript: ~6.0.2
- vite: 8.0.9
- eslint: 9.39.4
- concurrently: 9.0.0

## 🚢 Deployment

### Build

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist /app/dist
RUN npm i -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

## 📞 Support

For issues or questions, please open an issue on GitHub.

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using React, TypeScript, and Redux Toolkit**
