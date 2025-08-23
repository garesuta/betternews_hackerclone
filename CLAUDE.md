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

**Development Server**: http://localhost:3000

## Architecture Overview

This is a Hacker News clone built with:

- **Runtime**: Bun
- **Web Framework**: Hono (lightweight web framework)
- **Database**: PostgreSQL via Docker Compose
- **Language**: TypeScript with strict configuration
- **Code Quality**: ESLint + Prettier + Drizzle ORM linting

**Project Structure**:

- `server/` - Backend application code
  - `index.ts` - Main Hono application entry point
  - `eslint.config.mjs` - ESLint configuration
- `shared/` - Shared code between frontend/backend (referenced in tsconfig paths)

**Import Paths**:

- `@/*` maps to `./server/*`
- `@/shared/*` maps to `./shared/*`

**Key Configuration**:

- TypeScript configured for ESNext with bundler mode resolution
- ESLint includes Drizzle ORM plugin for database query linting
- Prettier with import sorting plugin
- Strict TypeScript settings enabled

The application currently serves a basic "Hello Hono!" response at the root endpoint and is set up for database-driven development with PostgreSQL.
