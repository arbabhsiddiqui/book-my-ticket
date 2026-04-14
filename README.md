# Booking System

A modern full-stack booking application built with Node.js and Express, featuring user authentication, seat management, and email notifications.

## Overview

This booking system allows users to register, log in, and manage seat bookings. The application is designed with a focus on security, scalability, and ease of use. It includes comprehensive authentication features, email notifications via MailHog, and a PostgreSQL database for persistent data storage.

## Features

- **User Authentication**
  - User registration with email validation
  - Secure login with JWT tokens
  - Password encryption using bcrypt
  - Cookie-based session management
- **Booking Management**
  - View available seats
  - Book seats for events
  - Real-time seat availability tracking
- **Email Notifications**
  - Confirmation emails for bookings
  - Password reset notifications
  - Integrated with MailHog for development

- **Security**
  - Input validation with Joi
  - CORS protection
  - JWT-based authentication
  - Secure password hashing

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Email**: Nodemailer with MailHog support
- **Validation**: Joi
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker and Docker Compose
- Node.js 24+ (for local development)
- npm or pnpm

## Installation

### Using Docker (Recommended)

1. Clone the repository:

```bash
git clone <repository-url>
cd booking-system
```

2. Create a `.env` file in the root directory:

```env
PORT=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_REFRESH_SECRET=
JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=
```

3. Start the application:

```bash
docker-compose up
```

The application will be available at `http://localhost:8080`

### Local Development

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables in a `.env` file (see above)

3. Start the development server:

```bash
npm run dev
```

## Services

### API Server

- **Port**: 8080
- **Entry Point**: `index.mjs`
- Watch mode enabled for development changes

### PostgreSQL Database

- **Port**: 5440
- **Host**: localhost (or `db` in Docker)
- **Default Database**: sql_class_2_db

### MailHog (Email Testing)

- **SMTP Port**: 1025
- **Web UI**: http://localhost:8025

## API Endpoints

### Authentication Routes (`/api/auth`)

- **POST** `/register` - Register a new user
  - Body: `{ email, password, confirmPassword }`
- **POST** `/login` - Log in an existing user
  - Body: `{ email, password }`

### Additional Features (Available/Commented)

- GET `/me` - Get authenticated user profile
- GET `/verify-email/:token` - Verify user email
- POST `/logout` - Log out user
- POST `/forgot-password` - Initiate password reset
- POST `/reset-password` - Reset password with token
- POST `/change-password` - Change password for authenticated users

## Project Structure

```
├── auth/                      # Authentication module
│   ├── auth.controller.js    # Auth business logic
│   ├── auth.middleware.js    # Auth middleware (JWT verification)
│   ├── auth.routes.js        # Auth endpoints
│   ├── auth.service.js       # Auth services
│   └── dto/                  # Data Transfer Objects
│       ├── login.dto.js
│       ├── register.dto.js
│       └── ...
├── common/                    # Shared utilities
│   ├── config/               # Configuration files
│   │   └── email.js
│   ├── dto/                  # Base DTOs
│   ├── middleware/           # Global middleware
│   └── utils/                # Utility functions
├── index.mjs                 # Application entry point
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose setup
└── package.json              # Project dependencies
```

### Watch Mode

Run the development server with file watching:

```bash
npm run dev
```

### Database Connection

The application uses a PostgreSQL connection pool with:

- Max connections: 20
- SSL enabled for remote connections
- Connection and idle timeout management

## Security Considerations

- JWT tokens are used for stateless authentication
- Passwords are hashed with bcryptjs (salt rounds configured)
- CORS is enabled for cross-origin requests
- Input validation is performed on all endpoints
- Environment variables store sensitive configuration

## Email Configuration

The application uses Nodemailer with MailHog for email testing:

- During development, emails are captured in MailHog
- Access the MailHog UI at `http://localhost:8025` to view emails
- For production, configure real SMTP settings in environment variables
