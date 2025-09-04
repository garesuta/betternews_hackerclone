# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: This project uses Bun as the package manager and runtime.

- `bun install` - Install dependencies
- `bun run dev` - Start development server with hot reload (runs server/index.ts)
- `bun run format:write` - Format code using Prettier
- `bun run format:check` - Check code formatting

**Database**:

- `docker compose up -d` - Start PostgreSQL database (port 5432)
  - Database: hackernewclonedb
  - User: user
  - Password: password
- `bunx drizzle-kit generate` - Generate database migrations
- `bunx drizzle-kit push` - Push schema changes to database
- `bunx drizzle-kit studio` - Open Drizzle Studio for database management

**Development Server**: http://localhost:3000

## Architecture Overview

This is a Hacker News clone built with:

- **Runtime**: Bun
- **Web Framework**: Hono (lightweight web framework)
- **Database**: PostgreSQL via Docker Compose with Drizzle ORM
- **Authentication**: Lucia Auth with session-based authentication
- **Language**: TypeScript with strict configuration
- **Validation**: Zod schemas for request/response validation
- **Code Quality**: ESLint + Prettier + Drizzle ORM linting

**Project Structure**:

- `server/` - Backend application code
  - `index.ts` - Main Hono application entry point
  - `routes/` - API route handlers (posts, comments, auth)
  - `db/schema/` - Database schema definitions
  - `adapter.ts` - Database connection and Lucia auth adapter setup
  - `middleware/` - Authentication and other middleware
- `shared/` - Shared TypeScript types between frontend/backend
- `drizzle/` - Database migrations and metadata

**Database Schema**:

- `auth` - User accounts and sessions (Lucia Auth)
- `posts` - Blog posts with title, content/URL, voting, and comments
- `comments` - Nested comments with depth tracking and voting
- `upvotes` - Separate tables for post and comment upvotes

**API Routes**:

- `POST /posts` - Create new post
- `GET /posts` - List posts with pagination, sorting, filtering
- `GET /posts/:id` - Get single post
- `POST /posts/:id/upvote` - Toggle post upvote
- `POST /posts/:id/comment` - Add comment to post
- `GET /posts/:id/comments` - Get post comments (with optional nested children)
- `POST /comments/:id` - Reply to comment
- `POST /comments/:id/upvote` - Toggle comment upvote

**Import Paths**:

- `@/*` maps to `./server/*`
- `@/shared/*` maps to `./shared/*`

**Key Configuration**:

- TypeScript configured for ESNext with bundler mode resolution
- ESLint includes Drizzle ORM plugin for database query linting
- Prettier with import sorting plugin
- Drizzle ORM with PostgreSQL adapter and schema validation
- Zod schemas for type-safe API validation
