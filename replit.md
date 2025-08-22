# FitTrack - Fitness Tracking Application

## Overview

FitTrack is a full-stack fitness tracking application that allows users to log workouts, track progress, set fitness goals, and browse exercise libraries. The application features a modern React frontend with a luxury gradient design system, backed by an Express.js server with PostgreSQL database integration. The app supports both dark and light themes and provides real-time data visualization for fitness metrics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **UI Library**: Comprehensive component system using Radix UI primitives with custom styling
- **Styling**: TailwindCSS with custom CSS variables for theming, featuring luxury gradient designs and glass morphism effects
- **State Management**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom theme provider supporting light/dark modes with localStorage persistence

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **API Design**: RESTful endpoints following conventional patterns
- **Data Storage**: In-memory storage implementation with interfaces for easy database migration
- **Session Management**: Express sessions with PostgreSQL session store support
- **Request Logging**: Custom middleware for API request/response logging

### Database Schema Design
- **Users**: Basic user authentication with username/password
- **Workouts**: Exercise logging with duration, calories, intensity, and timestamps
- **Exercises**: Pre-seeded exercise library with categories and calorie calculations
- **Goals**: Fitness goal tracking with progress monitoring

The schema uses UUID primary keys and proper foreign key relationships for data integrity.

### Component Architecture
- **Modular Design**: Highly reusable UI components following atomic design principles
- **Type Safety**: Full TypeScript integration with shared types between frontend and backend
- **Accessibility**: Built on Radix UI for WCAG compliance and keyboard navigation
- **Responsive Design**: Mobile-first approach with breakpoint-aware components

### Development Workflow
- **Monorepo Structure**: Organized with separate client, server, and shared directories
- **Hot Reloading**: Vite development server with HMR for rapid development
- **Build Process**: Separate build processes for client (Vite) and server (esbuild)
- **Type Checking**: Shared TypeScript configuration across all packages

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI & Styling
- **Radix UI**: Complete set of accessible UI primitives for complex components
- **TailwindCSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Modern icon library with tree-shaking support
- **Framer Motion**: Animation library for smooth transitions and micro-interactions
- **Embla Carousel**: Carousel component for content galleries

### Development & Build Tools
- **Vite**: Fast build tool with development server and hot module replacement
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility

### Data Management
- **TanStack React Query**: Server state management with caching, synchronization, and background updates
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation for runtime type safety and form validation
- **date-fns**: Date manipulation library for workout scheduling and progress tracking

### Replit Integration
- **Replit Vite Plugins**: Development environment optimization with error overlays and cartographer support for enhanced debugging experience