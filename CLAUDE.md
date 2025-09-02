# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `docker compose up -d` - Start the proxy service (required for API requests)
- `npm run dev` - Start the development server
- `npm run build` - Build the application (includes TypeScript compilation)
- `npm run typecheck` - Fast TypeScript error checking without build
- `npm run preview` - Build and preview the application locally

### Dependencies
- `npm run update:deps` - Interactive dependency updates using npm-check-updates

## Architecture Overview

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Core SDK**: OneFront (@1f/react-sdk) - Custom framework for modular applications
- **UI Components**: @vapor/v3-components, @emotion/react for styling
- **State Management**: @tanstack/react-query for server state, React Context for client state
- **Forms**: react-hook-form with yup validation

### Application Structure

This is a **OneFront modular application** built around a feature-based architecture:

#### Core Entry Point (`src/main.tsx`)
- Configures OneFront.run() with features, services, and settings
- Sets up proxy configuration for API calls
- Registers all features in the features array

#### Feature Architecture
Each feature is a self-contained module in `src/features/`:
- **Dashboard** - Main landing page with welcome message and AI drawer
- **Customers** - Customer management for sales users
- **Quotes** - Quote management with filtering and drawer views
- **Catalog** - Product catalog with drawer-based configuration
- **Migration** - Product migration workflows
- **Admin Features** - User management, customer management, admin quotes
- **React Root Wrapper** - Provides app-level context providers in correct order

#### Context Providers (Critical Order)
The `react_root_wrapper` feature sets up providers in this specific order:
1. `AppQueryProvider` - TanStack Query setup
2. `AppAuthRedirectGate` - Authentication handling
3. `AppDemoRoleProvider` - Demo role configuration
4. `AppUserProvider` - User context
5. `AppRoleProvider` - Role-based access control

#### Role-Based Architecture
- **ADMIN** - Full access including user management, customer admin, quote admin
- **SALES** - Customer and quote management, catalog access
- **BACKOFFICE** - Limited dashboard access
- Multi-role support with admin features grouped under "Amministrazione"

#### Component Architecture
- **Generic Components**: Reusable UI components in `src/components/`
- **Feature Components**: Feature-specific components within each feature directory
- **Grid System**: Generic data grid (`GenericDataGrid.tsx`) with configurable columns
- **CRUD Hooks**: Standardized data management with `useGenericCRUD.ts` and specialized hooks

#### Key Patterns
- **Feature Registration**: Each feature exports a function returning OneFront handlers
- **Route Protection**: `ProtectedRoute` component with role-based access control
- **Configuration-Driven Grids**: Grid configurations in `src/config/` define columns, sorting, filtering
- **Drawer Pattern**: Consistent drawer UI for detailed views (quotes, products, users)
- **Hook Composition**: Custom hooks for data fetching, CRUD operations, and permissions

### Development Notes

#### API Integration
- Proxy service handles API requests to backend
- TanStack Query manages server state and caching
- Custom CRUD hooks provide standardized data operations

#### Type System
- TypeScript throughout with strict configuration
- Shared types in `src/types/` organized by domain
- Grid-specific types for configuration and data handling

#### Styling
- Emotion for CSS-in-JS styling
- Vapor component library for consistent UI
- FontAwesome Pro icons for navigation and UI elements

### Adding New Features
1. Create feature directory in `src/features/`
2. Implement feature export function with OneFront handlers
3. Add feature to the features array in `main.tsx`
4. Configure routes and permissions in relevant config files
5. Add navigation items to `menuConfig.ts` if needed