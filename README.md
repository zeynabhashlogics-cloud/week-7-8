# Task Management App

A full-stack task management application built with **Next.js**, **TypeScript**, **Express.js**, **Prisma**, and **PostgreSQL**.

The application allows users to create accounts, securely log in, and manage their own tasks. Authentication is handled using **JWT**, while passwords are securely hashed using **bcrypt**.

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Next.js App Router

### Backend

* Node.js
* Express.js
* JWT
* bcrypt
* Prisma ORM

### Database

* PostgreSQL

## Authentication

The application uses email/password authentication.

### Registration Flow

1. User enters their name, email, and password.
2. Frontend validates the input.
3. Data is sent to `POST /auth/register`.
4. Backend cleans the email using `trim()` and `toLowerCase()`.
5. Backend checks whether the email already exists.
6. Password is hashed using bcrypt.
7. A new user is created in PostgreSQL through Prisma.
8. The backend creates a JWT containing the user's ID and email.
9. The user is redirected to the login page.

Frontend validation includes:

* Required name, email, and password.
* Name must contain at least 2 characters.
* Password must contain at least 6 characters.

### Login Flow

1. User enters their email and password.
2. Frontend validates the input.
3. Data is sent to `POST /auth/login`.
4. Backend finds the user by email.
5. bcrypt compares the entered password with the stored password hash.
6. If valid, the backend creates a JWT.
7. The JWT is returned to the frontend.
8. The frontend stores the JWT in `localStorage`.
9. The user can access protected task routes.

The JWT currently expires after **10 days**.

## JWT Authentication

The JWT acts as proof that the user has been authenticated.

After login, the frontend retrieves the token from local storage:

```tsx
const token = localStorage.getItem("token");
```

When accessing protected routes, it sends the token using the Authorization header:

```tsx
headers: {
  Authorization: `Bearer ${token}`,
}
```

The backend authentication middleware verifies the token:

```js
const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);

req.user = decoded;
```

The decoded user information can then be used by protected routes.

If the JWT is valid, the user can access their tasks. If it has expired or is invalid, the request is rejected and the user must authenticate again.

## Task Management

Authenticated users can manage their own tasks.

Task information includes:

* `id`
* `title`
* `description`
* `status`
* `priority`
* `dueDate`
* `createdAt`
* `userId`

### CRUD Operations

The backend supports:

* **GET** — retrieve tasks
* **POST** — create a task
* **PUT/PATCH** — update a task
* **DELETE** — delete a task

Protected task routes use the authenticated user's ID:

```js
const tasks = await prisma.tasks.findMany({
  where: {
    userId: req.user.id,
  },
  orderBy: {
    id: "asc",
  },
});
```

This ensures that each logged-in user sees **only their own tasks**.

For example:

```text
User 1 → User 1's tasks
User 2 → User 2's tasks
```

Users cannot access another user's tasks simply by being authenticated.

## Search and Filtering

The task page supports searching and filtering.

Users can search tasks by **title** and filter tasks by:

* Status
* Priority

The frontend sends the appropriate search/filter parameters to the backend, which uses them to return the matching tasks.

## Frontend User Experience

The application includes several UI states:

* Loading state
* Disabled submit buttons while requests are processing
* Validation errors
* Backend error messages
* Registration success message
* Empty task state
* Retry/error handling
* Login/register prompt for unauthenticated users
* Logout functionality

The header contains navigation for:

* Home
* About
* Tasks

A logout option removes the stored authentication token and returns the user to the home page.

## Database Structure

The main database relationship is between users and tasks:

```text
User
 │
 ├── id
 ├── name
 ├── email
 ├── password
 │
 └── tasks
       │
       ├── title
       ├── description
       ├── status
       ├── priority
       ├── dueDate
       ├── createdAt
       └── userId
```

Each task belongs to a specific user through `userId`.

## Security

The project includes several basic security practices:

* Passwords are never stored as plain text.
* bcrypt is used to hash passwords.
* JWT is used for authentication.
* Protected routes require a valid Bearer token.
* JWTs have an expiration time.
* Users can only access tasks belonging to their authenticated account.
* Email addresses are normalized before database operations.
* Frontend validation improves user experience, while backend validation protects the API.

## Current Authentication Flow

```text
REGISTER
   ↓
Frontend validation
   ↓
POST /auth/register
   ↓
Backend validation
   ↓
bcrypt password hashing
   ↓
Create user in PostgreSQL
   ↓
Create JWT
   ↓
Redirect to Login


LOGIN
   ↓
Frontend validation
   ↓
POST /auth/login
   ↓
Find user
   ↓
bcrypt.compare()
   ↓
Create JWT
   ↓
Save JWT in localStorage
   ↓
Access protected routes
   ↓
Authorization: Bearer <JWT>
   ↓
Auth Middleware
   ↓
req.user.id
   ↓
User's own tasks
```

## Project Goal

The goal of this project is to build a functional full-stack task management system while learning practical concepts such as:

* REST APIs
* CRUD operations
* Authentication vs. authorization
* JWT authentication
* Password hashing with bcrypt
* Express middleware
* Prisma ORM
* PostgreSQL relationships
* Protected API routes
* Frontend/backend communication
* Search and filtering
* Form validation
* User-specific data
