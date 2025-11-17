# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Olympus-front is a React + TypeScript CRM frontend application built with Vite. It manages leads, opportunities, and sales processes for an educational institution (IMB). The application integrates with a .NET backend API and handles JWT-based authentication with automatic token expiration management.

## Development Commands

```bash
# Development server (uses .env.development)
npm run dev

# Build for production (uses .env.production)
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Architecture

### Authentication Flow

The application uses a dual-layer JWT authentication system:

1. **App-level token validation** (`src/App.tsx:18-103`): Runs every 2 seconds to check token expiration and automatically logs out users when tokens expire. Redirects authenticated users away from `/login` to `/leads/SalesProcess`.

2. **Route-level protection** (`src/componentes/PrivateRoute.tsx`): Guards private routes using `Outlet` pattern. All protected routes must be nested under `<PrivateRoute />`.

3. **Token management**: JWT tokens are stored in cookies and decoded to extract user claims. The token contains .NET-specific claim types:
   - `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier` - User ID
   - `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name` - User name
   - `http://schemas.microsoft.com/ws/2008/06/identity/claims/role` - User role

### Route Structure

The app uses React Router v7 with a nested layout pattern:

```
/ → redirects to /login
/login → Public route (LoginPage)
[PrivateRoute wrapper]
  └─ [MainLayout wrapper with sidebar/header]
      ├─ /dashboard → Dashboard
      ├─ /leads/Opportunities → OpportunitiesInterface
      ├─ /leads/SalesProcess → CRMSalesProcess
      ├─ /leads/oportunidades/:id → Leads (table/process view)
      └─ /leads/oportunidad/:id → Oportunidad (individual opportunity detail)
```

### API Integration

- **Base configuration**: `src/servicios/api.ts` - Axios instance with `baseURL` from `VITE_API_URL` environment variable and `withCredentials: true`.
- **API routes**: Defined in `src/config/rutasApi.ts` as constants (e.g., `API_OPORTUNIDADES_LISTAR`, `API_USUARIO_LOGIN`).
- **Service layer**: Services like `AutenticacionServicio.ts` wrap API calls with TypeScript types.
- **Note**: `src/hooks/useLogin.ts:28` currently has a hardcoded API URL (`http://localhost:7020/api/SegModLogin/login`) instead of using the configured base URL.

### Environment Variables

Two environment files exist:
- `.env.development` - Used with `npm run dev` (currently points to `https://localhost:44329`)
- `.env.production` - Used with `npm run build`

Required variable:
- `VITE_API_URL` - Backend API base URL

### Component Structure

The codebase follows a feature-based organization:

- `src/paginas/` - Page components organized by feature (Leads, Login, Opportunities, SalesProcess, Inicio)
- `src/componentes/` - Shared components (PrivateRoute, CallProgressBar)
- `src/layouts/` - Layout wrappers (MainLayout with collapsible sidebar)
- `src/hooks/` - Custom React hooks (useLogin)
- `src/servicios/` - API service layer
- `src/modelos/` - TypeScript interfaces/types
- `src/config/` - Constants and API route definitions
- `src/utils/` - Utility functions (cookie management)

### Leads Module Architecture

The Leads section (`src/paginas/Leads/`) is the core feature with multiple sub-views:

- **Main views**: `Leads.tsx`, `Oportunidad.tsx` - Route entry points
- **Process views**: `VistaProceso.tsx`, `VistaProceso2.tsx`, `VistaTabla.tsx` - Different visualization modes
- **Components**:
  - `ClienteProducto.tsx` - Client/product card
  - `OportunidadPanel.tsx`, `OportunidadActual.tsx` - Opportunity panels
  - `HistorialEstados.tsx`, `HistorialInteraccion.tsx` - History tracking
  - `ModalLead.tsx` - Lead creation/editing modal
  - `Estados/` directory - State-specific components (EstadoCalificado, EstadoMatriculado, etc.)
  - `InformacionProductoModales/` directory - Product information modals (ModalDocentes, ModalHorarios, ModalInversion)

### UI Framework

The application uses Ant Design v5 (`antd`) for UI components. Common patterns:
- Layout components: `Row`, `Col` for grid system
- `Dropdown`, `Button`, `Modal` for interactions
- Icons from `@ant-design/icons`
- Custom inline styles with design tokens (e.g., `#1677ff` for primary blue, `#f9fafb` for background)

### Styling Approach

The codebase uses **inline styles** exclusively - no CSS modules or styled-components. All styling is done via the `style` prop with JavaScript objects. Common design tokens:
- Sidebar width: 200px
- Header height: 44px
- Background color: `#f9fafb`
- Primary color: `#1677ff`
- Border radius: 8-12px for cards

## Key Technical Considerations

1. **Token Expiration**: When working on authentication, remember the dual validation system. Changes to token logic may need updates in both `App.tsx` and `PrivateRoute.tsx`.

2. **API Integration**: When adding new API endpoints, follow the pattern: define route constant in `rutasApi.ts`, create typed service in `servicios/`, consume in components/hooks.

3. **State Management**: Currently uses React hooks (useState, useEffect) without a global state library. Complex state is managed at the component level or passed via props.

4. **Dynamic Routing**: The Leads module uses URL parameters (`:id`) to load different opportunities. Ensure API calls use these route params correctly.

5. **Cookie Security**: Cookies are set with `secure` and `samesite=strict` flags in `useLogin.ts:39`.

## Common Development Patterns

### Adding a New Protected Route

1. Define the page component in `src/paginas/[Feature]/`
2. Add route in `src/App.tsx` inside the `<PrivateRoute><MainLayout>` nesting
3. Add navigation menu item in `src/layouts/MainLayout.tsx` if needed

### Adding a New API Endpoint

1. Add constant to `src/config/rutasApi.ts`
2. Create/update service function in `src/servicios/`
3. Define TypeScript types in `src/modelos/`
4. Use in component via service function

### Working with JWT Claims

When extracting user data from tokens, use the full .NET claim URIs (see MainLayout.tsx:24-26 for examples). Use `jwt-decode` or manual base64 decoding (see App.tsx:24-40).
