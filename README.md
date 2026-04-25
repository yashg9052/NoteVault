# Notes Management Application - Project Overview

## 🎯 Objective

Build a full-stack Notes Management application with authentication and advanced note handling features. This application demonstrates a complete web application development workflow from backend API design to frontend UI implementation with proper security measures and modern development practices.

**Deadline**: 28 April 2026

---

## 📋 Core Features

### 1. Authentication System ✅
- **User Registration**: New users can create an account with name, email, and password
- **User Login**: Existing users can authenticate with email and password
- **User Logout**: Users can securely logout from the application
- **Password Security**: Bcrypt hashing with 10 rounds for secure password storage
- **JWT Authentication**: 7-day token expiration for session management
- **Protected Routes**: Both backend API endpoints and frontend routes are JWT-protected

### 2. Notes Management ✅
- **Create Note**: Users can create notes with title, content, and optional category
- **View All Notes**: Fetch user-specific notes only (no cross-user access)
- **Update Note**: Edit existing notes with full capability
- **Delete Note**: Remove notes with confirmation dialog
- **Pagination**: Display 6 notes per page with navigation controls

### 3. Advanced Features ✅
- **Search Notes**: Case-insensitive search by title or content with debouncing (400ms)
- **Filter by Category**: Dropdown filter to view notes by category
- **Transfer Notes**: Transfer note ownership to another registered user
- **Categories/Tags**: Organize notes with color-coded categories

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **Database**: PostgreSQL (via Prisma Adapter)
- **ORM**: Prisma (v7.8.0)
- **Authentication**: JWT (jsonwebtoken v9.0.3)
- **Password Security**: Bcryptjs (v3.0.3)
- **Validation**: Zod (v4.3.6)
- **Security**: CORS (v2.8.6), Rate Limiting (express-rate-limit v8.4.1)
- **Environment**: Dotenv (v17.4.2)

### Frontend
- **Library**: React.js (v19.2.5)
- **Styling**: Tailwind CSS (v4.2.4)
- **Build Tool**: Vite (v8.0.10)
- **Router**: React Router DOM (v7.14.2)
- **Icons**: Lucide React (v1.9.0)
- **HTTP Client**: Axios
- **State Management**: Context API
- **Utilities**: js-cookie (v3.0.5) for token management

### Development & Testing
- **Backend Package Manager**: npm
- **Development Server**: Nodemon
- **Testing**: Jest
- **Linting**: ESLint
- **Code Quality**: Babel transpiler for frontend

---

## 📁 Project Structure

```
notes-project/
├── backend/
│   ├── server.js                 # Entry point
│   ├── prisma.config.js          # Prisma configuration
│   ├── jest.config.js            # Jest test configuration
│   ├── package.json              # Dependencies
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   └── src/
│       ├── app.js                # Express app setup
│       ├── controllers/          # Business logic
│       │   ├── auth.controller.js
│       │   └── notes.controller.js
│       ├── routes/               # API endpoints
│       │   ├── auth.routes.js
│       │   └── notes.routes.js
│       ├── middlewares/          # Custom middleware
│       │   ├── auth.middleware.js
│       │   ├── rateLimit.middleware.js
│       │   └── validate.middleware.js
│       ├── validators/           # Input validation schemas
│       │   ├── auth.validator.js
│       │   ├── auth.validator.test.js
│       │   ├── notes.validator.js
│       │   └── notes.validator.test.js
│       └── lib/
│           └── prisma.js         # Prisma client instance
│
├── frontend/
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind configuration
│   ├── jest.config.js            # Jest test configuration
│   ├── .babelrc                  # Babel configuration
│   ├── jest.setup.js             # Jest setup file
│   ├── eslint.config.js          # ESLint configuration
│   ├── index.html                # Entry HTML
│   ├── package.json              # Dependencies
│   ├── public/                   # Static assets
│   └── src/
│       ├── main.jsx              # React entry point
│       ├── App.jsx               # Main component
│       ├── App.css               # Global styles
│       ├── index.css             # Base styles
│       ├── api/
│       │   └── axios.js          # Axios instance
│       ├── assets/               # Images, fonts, etc.
│       ├── components/           # React components
│       │   ├── Footer.jsx
│       │   ├── NoteCard.jsx
│       │   ├── NoteCard.test.jsx
│       │   ├── NoteDetailModal.jsx
│       │   ├── NoteModal.jsx
│       │   ├── Pagination.jsx
│       │   ├── SearchBar.jsx
│       │   ├── SearchBar.test.jsx
│       │   ├── Sidebar.jsx
│       │   ├── ThemeToggle.jsx
│       │   ├── TransferModal.jsx
│       │   └── mobileSideBar.jsx
│       ├── context/              # Context providers
│       │   ├── AuthContext.jsx
│       │   └── ThemeContext.jsx
│       └── pages/                # Page components
│           ├── AuthPage.jsx
│           ├── Dashboard.jsx
│           └── TransferHistory.jsx
│
├── .gitignore                    # Git ignore rules
├── TESTS_README.md               # Testing documentation
├── PROJECT_ASSESSMENT.md         # Features checklist
└── README.md                     # Setup and deployment guide
```

---

## 🔒 Security Features

### Authentication
- ✅ **JWT Tokens**: Secure, stateless authentication
- ✅ **Token Expiration**: 7-day validity period
- ✅ **Password Hashing**: Bcrypt with 10 rounds
- ✅ **Protected Routes**: All sensitive endpoints require JWT
- ✅ **CORS Protection**: Cross-Origin Resource Sharing configured

### Validation
- ✅ **Input Validation**: Zod schemas for all user inputs
- ✅ **Error Messages**: Meaningful, non-revealing error responses
- ✅ **Type Safety**: Validated request/response data types

### Rate Limiting
- ✅ **API Rate Limiting**: Express rate limit middleware
- ✅ **Brute Force Protection**: Prevents credential stuffing attacks

### Authorization
- ✅ **Ownership Verification**: Users can only access their own notes
- ✅ **Role-Based Access**: Transfer operations validated
- ✅ **HTTP Status Codes**: Proper error codes (401, 403, 404)

---

## 📊 Database Schema

### Users Table
```prisma
model User {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  password  String
  notes     Note[]
  received  Note[]    @relation("Transfer")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

### Notes Table
```prisma
model Note {
  id          String    @id @default(cuid())
  title       String
  content     String
  category    String?
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  transferTo  String?
  receiver    User?     @relation("Transfer", fields: [transferTo], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

---

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Notes
- `GET /api/notes` - Get all user notes (paginated)
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/search?q=query` - Search notes
- `GET /api/notes/category/:category` - Filter by category
- `POST /api/notes/:id/transfer` - Transfer note to user

---

## ✨ Bonus Features Implemented

1. ✅ **Note Categories/Tags**: Color-coded categories with CRUD operations
2. ✅ **Debounced Search**: 400ms debounce to reduce API calls
3. ✅ **Dark/Light Mode**: Theme toggle with Context API persistence
4. ✅ **Unit Tests**: Jest tests for validators and components
5. ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS
6. ✅ **Loading States**: Skeleton loaders and loading indicators
7. ✅ **Error Handling**: User-friendly error messages
8. ✅ **Pagination**: 6 notes per page with navigation

---

## 📈 Performance Optimizations

- **Frontend**:
  - Debounced search input (400ms)
  - Component memoization
  - Lazy loading for images
  - CSS-in-JS with Tailwind (optimized bundle)

- **Backend**:
  - Database query optimization with Prisma
  - Pagination to limit data transfer
  - Rate limiting to prevent abuse
  - JWT for stateless authentication

---

## 🧪 Testing

### Test Coverage
- **Backend**: 21 tests covering validators and error handling
- **Frontend**: 15 tests covering components and user interactions
- **Total**: 36 tests ✅ All Passing

### Test Categories
- Input validation (positive and negative cases)
- Component rendering and props
- User event handling and callbacks
- Error message validation

**See [TESTS_README.md](TESTS_README.md) for detailed testing documentation.**

---

## 📋 Requirements Checklist

### Backend ✅
- [x] Proper MVC folder structure
- [x] Input validation with meaningful errors
- [x] Error handling with proper HTTP status codes
- [x] Secure API design with JWT middleware
- [x] Prisma ORM with structured schema
- [x] Database relationships (User ↔ Note)
- [x] Rate limiting middleware
- [x] CORS configuration

### Frontend ✅
- [x] Clean and modern UI design
- [x] Responsive design (desktop, tablet, mobile)
- [x] Context API for state management
- [x] Axios API integration
- [x] Loading and error states
- [x] Form validation
- [x] Authentication context
- [x] Protected routes

### Advanced Features ✅
- [x] Note categories with color coding
- [x] Search with debouncing
- [x] Dark/light mode toggle
- [x] Note transfer to other users
- [x] Pagination system
- [x] Unit tests (Jest)

---

## 🚀 Deployment

### Backend Deployment
- **Platform**: Render
- **Live URL**: https://notevault-k83t.onrender.com/api
- **Database**: Postgresql and Prisma via neon Db.

### Frontend Deployment
- **Platform**: Netlify
- **Live URL**: https://note-vault-project.netlify.app/
- **Build**: Vite optimized production build

---

## 📝 Setup Instructions

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with database credentials
npx prisma migrate dev
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

---

## 👨‍💻 Development Team

**Lead Developer**: Yash Gupta  
**Project Duration**: April 23 - 28, 2026  
**Status**: ✅ In Development

---

## 📚 Key Decisions

### Why Zod for Validation?
- Type-safe validation
- Clear error messages
- Composable schemas
- Works with both Node.js and Browser

### Why Prisma?
- Type safety with generated types
- Migration system
- Query optimization
- Great DX with intellisense

### Why Context API?
- No external dependencies
- Perfect for authentication state
- Theme management
- Lighter bundle size

### Why Tailwind CSS?
- Utility-first approach
- Great for responsive design
- Built-in dark mode support
- Fast development

---

## 🔗 Repository Structure

```
notes-project/
├── README.md                    # This file (Setup guide)
├── PROJECT_ASSESSMENT.md        # Features implementation status
├── TESTS_README.md              # Testing documentation
└── [Backend & Frontend folders]
```

---

**Last Updated**: April 26, 2026  
**Status**: ✅ Feature Complete & Tested

---

**API Documentation**: Check backend README for endpoint details

