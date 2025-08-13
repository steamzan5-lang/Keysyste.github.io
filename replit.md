# Overview

This is a React-based web application that implements a multi-step verification system with key generation functionality. The application guides users through a 3-step verification process (typically involving Linkvertise challenges) and generates temporary access keys upon completion. It features a modern UI built with shadcn/ui components and uses both client-side and server-side functionality to manage the verification flow and key lifecycle.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: wouter for lightweight client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for key verification and generation
- **Request Logging**: Custom middleware for API request/response logging
- **Error Handling**: Centralized error handling middleware

## Data Storage Solutions
- **Primary Storage**: In-memory storage using Map data structure
- **Database Schema**: Drizzle ORM configured for PostgreSQL (schema defined but using memory storage)
- **Key Management**: Automatic cleanup of expired keys via interval-based garbage collection
- **Data Models**: Zod schemas for type-safe data validation

## Authentication and Authorization
- **Key-Based Access**: Temporary access keys with expiration timestamps
- **Verification Flow**: Multi-step process requiring completion of external challenges
- **Key Generation**: Random 16-character alphanumeric keys
- **Session Management**: No traditional sessions - stateless key-based verification

## External Dependencies
- **Database**: Configured for Neon PostgreSQL (via @neondatabase/serverless)
- **ORM**: Drizzle ORM for database operations and migrations
- **UI Framework**: Radix UI primitives for accessible component building
- **Build Tools**: Vite for frontend bundling, esbuild for server bundling
- **Development**: tsx for TypeScript execution, Replit-specific plugins for development environment
- **Verification Services**: Integration points for Linkvertise-style verification challenges (simulated in current implementation)