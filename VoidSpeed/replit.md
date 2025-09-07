# Overview

This is a network security and speed testing dashboard application built with a full-stack architecture. The application provides real-time monitoring of internet connection speed, security threat analysis, and connection information. It features a dark-themed, space-inspired UI with animated star field backgrounds and displays metrics like download/upload speeds, ping times, threat levels, and ISP information.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with custom CSS variables for theming, featuring a dark space theme with animated components

## Backend Architecture
- **Framework**: Express.js server with TypeScript
- **API Design**: RESTful endpoints for speed tests, security analysis, and connection information
- **Development**: Hot module replacement (HMR) via Vite integration for development mode
- **Data Simulation**: Mock implementations for network testing and security analysis to simulate real-world scenarios

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for database schema management
- **Fallback Storage**: In-memory storage implementation for development/testing without database dependency
- **Schema**: Three main entities - speed tests (download/upload speeds, ping), security analysis (threat levels, risk scores), and connection info (ISP, ASN, proxy detection)

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Security**: Basic session-based authentication mechanism ready for implementation

## External Dependencies
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **UI Components**: Extensive Radix UI component library for accessible, customizable components
- **Development Tools**: ESBuild for production builds, TSX for development server
- **Fonts**: Google Fonts integration (Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter)
- **Styling**: PostCSS with Autoprefixer for CSS processing

## Key Features
- **Real-time Monitoring**: Auto-refreshing dashboards with configurable intervals (5s-5min depending on data type)
- **Animated UI**: Custom star field background with twinkling effects and smooth animations
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Mock Data Generation**: Realistic simulation of network metrics and security analysis
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Component Architecture**: Modular React components with proper separation of concerns