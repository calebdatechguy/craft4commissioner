# Political Campaign Platform - Documentation

## 1. Private Backend Dashboard Implementation

### Authentication & Security Infrastructure
A secure authentication layer protects administrative functionality with **Argon2 password hashing** and PostgreSQL `admin_users` table verification:

- **Login Page (`src/routes/login.tsx`)**: Uses `useAuthLoginMutation` with **redesigned high-contrast UI** and **explicit error messages** for authentication failures. **Password visibility toggle and refined typography** improve UX. Fixed infinite loading via proper promise catching in the `onSubmit` handler, ensuring `isSubmitting` state resolves correctly on 401 responses
- **Protected Dashboard (`src/routes/dashboard.tsx`)**: Implements authentication checks using `useAuthGetProfileQuery`, automatically redirecting unauthenticated users to login page. Includes Settings navigation with a "Settings" link using the `Settings` icon from `lucide-react`
- **Security Measures**: No public navigation links expose `/dashboard` or `/login` endpoints in the `Navbar` or `Footer` components

### Dashboard Management Views

#### Welcome Dashboard (`src/routes/dashboard/index.tsx`)
Provides an overview of available management sections for authenticated administrators.

#### Donation Leads Management (`src/routes/donations.tsx`)
Comprehensive donation lead administration featuring:
- **Paginated Data Table**: Displays leads using `useDonationGetDonationLeadsQuery`
- **CRUD Operations**:
  - **Delete Functionality**: Uses `useDonationDeleteDonationLeadMutation` for removing leads
  - **Create Functionality**: "Add Lead" dialog utilizes the public `useDonationCaptureDonationLeadMutation` for manual lead entry

#### Newsletter Subscription Management (`src/routes/dashboard/newsletter.tsx`)
Full newsletter subscriber management including:
- **Subscriber Table**: Paginated display using `useNewsletterGetSubscriptionsQuery`
- **Subscription Management**:
  - **Delete**: Implemented via `useNewsletterDeleteSubscriptionMutation`
  - **Create**: "Add Subscriber" dialog uses public `useNewsletterSubscribeMutation`

#### Settings Page (`src/routes/dashboard/settings.tsx`)
Secure password change functionality for authenticated administrators:
- **Password Change Form**: Implements TanStack Forms with Zod validation
- **Form Fields**: `newPassword` and `confirmPassword` with client-side validation
- **Validation Rules**: Password must be at least 6 characters and both fields must match
- **Mutation Integration**: Uses `useAuthUpdatePasswordMutation` from `@/_generated/auth.service.ts` with **Argon2 hashing**
- **User Feedback**: Visual feedback via `sonner` toast notifications for success/error states
- **UI Components**: Uses `lucide-react` icons and `shadcn/ui` components (`Card`, `Button`, `Input`, `Label`)

#### Donation Confirmation Email Template Management (`src/routes/dashboard/donation-confirmation-template.tsx`)
A private dashboard page for donation confirmation email templates with refactored modular design for WinRed platform injection:

- **New Private Route**: Created as part of the protected `/dashboard` layout, requiring administrative authentication
- **Modular Structural Refactoring**:
  - **Removed all outer HTML structural elements**: No `<!DOCTYPE html>`, `<html>`, `<head>`, or `<body>` tags
  - **Eliminated global `<style>` blocks**: Replaced with strict inline CSS to prevent style conflicts
  - **Stripped outer background wrappers**: Removed `#f1f5f9` full-width `div` and redundant shadow containers
- **Core Branded Content Isolation**:
  - **Email Container**: Central content in a clean `div` with `max-width: 600px`
  - **Campaign Logo Integration**: **Logo URL updated to**: `https://cdn.craft4commissioner.com/img/Artboard%201_1%4072x.webp`
  - **Logo Styling**: Inline CSS ensures proper scaling and spacing within nested environments
- **Color Palette** (implemented via inline styles):
  - **Blue 900 (`#1e3a8f`) and Blue 800 accents, Orange Red 500 (`#ef4444`)**: Used for key emphasis text
  - **Typography**: Unified font-family stack with more refined spacing
- **Dynamic Placeholders**: Template integrates requested placeholders for post-donation automation:
  - `-first_name-` for personalized donor greetings
  - `$-amount-` for transaction clarity
  - `-candidate_name-` for consistent brand signature
- **Updated Wording**: **The `emailHtml` definition within the `useMemo` hook now incorporates:**
  - Personalized greeting using `${firstName}` placeholder
  - Core message emphasizing "responsible leadership, strong families, and doing the right thing at all costs"
  - Concluding paragraph focusing on the impact of every dollar for the race in "Barrow County"
  - Signature changed from "Team -candidate_name-" to strictly "-candidate_name-" (removed "Team" prefix)
- **Content Cleanup**:
  - **Removed non-essential elements**: No tracking artifacts, external download buttons, or complex tables
  - **Simplified footer**: Modular block containing only mandatory legal disclosure text
- **Template Management UI**:
  - **Preview Mode**: Live rendering of the self-contained, branded block
  - **Code Mode**: Syntax-highlighted view of the refined modular HTML
  - **Copy to Clipboard**: "Copy Code" utility provides code optimized for WinRed injection, with `sonner` toast notifications
- **Dashboard Integration**: `emailHtml` `useMemo` hook updates "Preview" and "View HTML" modes seamlessly
- **Email Best Practices**: HTML uses inline styles and container-based layouts optimized for nested rendering in platforms like WinRed

## 2. Social Proof Features Integration

### Social Proof Component (`src/components/donations/SocialProofBubbles.tsx`)
Created dynamic social proof element that:
- **Fetches Recent Activity**: Uses `useDonationGetRecentDonationLeadsQuery` to retrieve latest donors
- **Animated Display**: Implements floating bubble animations cycling through recent donors
- **Positioning**: **Updated from bottom-left to bottom-right** of the viewport using `right-4` positioning
- **Message Format**: Displays "(Name) Joined the giving list" for each donor
- **Integration Point**: Embedded within the Donate page (`src/routes/donate.tsx`) to provide real-time social validation

## 3. Google Analytics Integration

**Google Analytics tracking script** (ID: `G-4J481GBBDM`) has been implemented by direct injection into `index.html`, enabling comprehensive visitor analytics and conversion tracking across all platform features.

## 4. Global Toast Notifications (`src/routes/__root.tsx`)

**Added `Toaster` component from `sonner`** to the root layout to ensure toast notifications display correctly across the application, supporting the password change feedback system.

## 5. Social Media Integration

### Homepage Social Media Section (`src/components/home/SocialMediaSection.tsx`)
A responsive component integrated into the homepage (`src/routes/index.tsx`) after the Priorities section:

- **Social Connectivity Cards**: High-impact call-to-action cards for:
  - **Facebook**: `https://www.facebook.com/profile.php?id=61586773749795`
  - **Instagram**: `https://www.instagram.com/craft4commissioner/`

- **Removed Features**: The Instagram feed gallery has been removed from the component:
  - **Deleted Components**: 1 column (mobile) / 4 columns (desktop) responsive grid
  - **Removed Elements**: `instagramPosts` data structure, `InstagramPost` interface, hover states with engagement metrics
  - **Cleaned Dependencies**: Deleted `useMemo`, `Hheart`, and `MessageCircle` imports from `lucide-react`

- **Visual Design**: Uses brand-specific styling with Facebook blue, Instagram gradients, and consistent campaign colors
- **Performance Optimizations**:
  - **React 18 Best Practices**: Component wrapped in `React.memo`
  - **Iconography**: Integrated `lucide-react` for brand-consistent social icons and `ExternalLink` indicators

## 6. Global Donation Redirection System

**Comprehensive redirection ensures all donation traffic directs to the external WinRed platform**:

### Route-Level Redirect (`src/routes/donate.tsx`)
Implemented `beforeLoad` hook using TanStack Router's `redirect` function. Any attempt to access the local `/donate` route now results in an immediate `301` redirect to `https://secure.winred.com/craft4commissioner/donate-today`.

### Frontend Donation CTA Integration

**All donation CTA links unified to WinRed platform**, **centralized through backend configuration**:

- **Homepage Hero (`src/routes/index.tsx`)**: The secondary CTA button ("DONATE NOW") dynamically uses `heroData.ctaUrl` from the `useCampaignGetHeroSectionQuery`. It falls back to the official WinRed URL: `https://secure.winred.com/craft4commissioner/donate-today`
- **Global Navigation (`src/components/layout/Navbar.tsx`)**: Implemented `useDonationGetDonationConfigQuery` to retrieve the `externalDonationUrl`. Both desktop and mobile "Donate" buttons now link directly to the WinRed page with `target="_blank"` and `rel="noopener noreferrer"` for security
- **Site Footer (`src/components/layout/Footer.tsx`)**: Updated the "Donate" quick link to use the dynamic `externalDonationUrl` from the Donation service configuration
- **About Page (`src/routes/about.tsx`)**: The Hero CTA ("DONATE TO THE CAUSE") updated to fetch and use the dynamic WinRed URL
- **Legacy Redirect**: **Removed standalone "/donate" page** to simplify user flow to a single external donation platform

## Technical Architecture & Backend Updates

### Technology Stack
- **Core Framework**: React 18, TanStack Router with file-based routing
- **State Management**: TanStack Query v4 for server state, `useState` for local UI state
- **Forms**: TanStack Forms with Zod validation
- **Notifications**: `sonner` for toast notifications and notifications management
- **Password Hashing**: **Argon2** for secure password storage in PostgreSQL `admin_users` table

### API Integration Patterns
- **Generated Services**: All form schemas directly imported from `@/_generated/` (no local copies)
- **Backend Proxies**: All external service calls (authentication, analytics) routed through backend API endpoints for security
- **Authentication**: **Refactored error handling**: no success flags, using HTTP status codes for the `Login` procedure
- **Password Management**: Backend `UpdatePassword` procedure handles secure hashing with **Argon2**
- **Validation**: TanStack Forms integrated with **Zod** schema `AuthLoginInputSchema` ensures strict input validation before authentication attempts

### Security Implementation
- **Centralized config**: Donation and campaign hero URLs are server-side configurable
- **Route Protection**: Authentication required for all dashboard routes
- **API-Level Security**: Backend handles all external service authentication (no client-side secrets)
- **Session Management**: Profile query validates session before grant dashboard access with JWT
- **Password Security**: Backend procedure updates hashed passwords in `admin_users` table during password change

**Key Updates**: The platform now features **Argon2 password hashing** for enhanced security, **comprehensive WinRed redirection** eliminating local donation capture, and **robust authentication error handling** preventing infinite loading states.