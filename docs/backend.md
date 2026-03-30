# Eric Craft Campaign Website Backend Implementation

**Technical Implementation Details:**

## Database Schema & Migrations

The backend uses PostgreSQL with Drizzle ORM for database management.

**Migration 000002 - Campaign Tables**:
*   Created `migrations/000002_add_campaign_tables.up.sql` and corresponding down migration
*   **Tables added**:
    *   `donations`: Stores donor details (name, address, employer), donation amount, payment token, and timestamps
    *   `contacts`: Stores contact inquiries with subject, message, and contact timestamps
    *   `newsletter_subscriptions`: Stores email subscriptions with uniqueness constraint

**Migration 000003 - Homepage Content**:
*   Created `migrations/000003_add_campaign_content.up.sql` and corresponding down migration
*   **Tables added**:
    *   `candidate_profile`: Stores candidate bio, image URL, residency years, and key values
    *   `campaign_priorities`: Stores structured priority data with descriptions for Public Safety, Education (SROs), and Fiscal Responsibility

**Migration 000004 - Hero Section**:
*   **Created migration `000004_add_hero_section_table.up.sql` to add the `hero_section` table**
*   **Image Optimization**: Included `max_width`, `max_height`, and `object_fit` columns in the table to explicitly define CSS constraints for the hero image at the API level
*   **Initialized with family photo**: Seeded the table with the specific family photo URL: `https://cdn.craft4commissioner.com/img/01-11-25%20Craft%20Family-5.jpg`

**Migration 000005 - Donation Lead Capture**:
*   **Created migration `000005_add_donation_leads_table.up.sql` and corresponding down migration**
*   **Added `donation_leads` table with columns**: `id` (UUID as primary key), `email` (VARCHAR), `expected_amount` (INTEGER), and `created_at` (TIMESTAMP WITH TIME ZONE)
*   **Updated the Drizzle schema in `src/db/schema.ts`** to include the new `donationLeads` table definition

**Migration 000006 - Newsletter Enhancement**:
*   **Created migration `000006_add_lastname_to_newsletter.up.sql`**: Added the `last_name` column to the `newsletter_subscriptions` table to support full name capture required by **Mailchimp integration**
*   **Updated Drizzle Schema**: Modified `src/db/schema.ts` to include the `lastName` field and maintain the unique constraint on `email`

**Migration 000007 - Donation Lead Names**:
*   **Created migration `migrations/000007_add_names_to_donation_leads.up.sql`** to add `first_name` and `last_name` columns to the `donation_leads` table
*   **Updated Drizzle Schema**: Re-generated `src/db/schema.ts` to include the new `firstName` and `lastName` fields in the `donationLeads` table definition, ensuring full type safety for database operations

**Migration 000008 - Admin Users**:
*   Created `migrations/000008_add_admin_users.up.sql` to add the `admin_users` table.
*   Table structure: `id` (SERIAL), `username` (VARCHAR), `password_hash` (VARCHAR), `created_at` (TIMESTAMP).

**Migration 000009 - Sessions**:
*   Created `migrations/000009_add_sessions_table.up.sql` to add the `sessions` table for managing user sessions.
*   Table structure: `id` (UUID), `user_id` (INTEGER FK), `expires_at` (TIMESTAMP), `created_at` (TIMESTAMP).

**Drizzle Client Update**:
*   Updated `src/utils/db.ts` to include the schema definition in the Drizzle client initialization, enabling the use of the query builder API (`db.query`).

## Service Implementations

**Auth Service** (`src/server/implementations/auth.service.ts`):
*   **`Login`**: Authenticates users against the `admin_users` table using `Bun.password.verify` (Argon2).
    *   **Robust Error Handling**: Refactored with comprehensive `try-catch` blocks and detailed server-side logging to resolve authentication hanging issues
    *   **Explicit Status Codes**: Failures now throw errors with assigned status codes (401 for invalid credentials, 500 for internal failures)
    *   **Query Stability**: Uses explicit `db.select().from().limit(1)` pattern for consistent authentication lookup
    *   **Auto-Seeding**: Automatically creates a default admin user (`admin` / `admin123`) if the `admin_users` table is empty
    *   **Session Management**: Creates a session in the database and sets a secure, HTTP-only `auth_session` cookie valid for 24 hours with explicit checks for successful session creation
*   **`Logout`**: Invalidates the session by deleting it from the database and clearing the cookie
*   **`GetProfile`**: Returns the authenticated user's profile based on the active session
*   **`UpdatePassword`**: Securely hashes the provided password using Argon2 and updates the `password_hash` for the currently authenticated user in the `admin_users` table. Requires a valid session cookie with enhanced error handling and logging
*   **Middleware**: Implemented middleware to validate the `auth_session` cookie and attach the user to the request context

**Campaign Service** (`src/server/implementations/campaign.service.ts`):
*   **Updated `GetCandidateProfile`**: **Now fetches from `candidate_profile` table instead of hardcoded values**, returning bio, image URL, residency (22 years), and key values ("Faith. Family. Responsibility.", "People Over Pockets")
*   **Updated `GetPriorities`**: **Now fetches from `campaign_priorities` table**, returning structured priority data
*   **`GetEndorsements`**: Returns endorsement data
*   **`GetHeroSection`**: **Fetches hero section data from the database**, returning headline, subheadline, CTA text, and image with optimization constraints (maxWidth: "100%", maxHeight: "600px", objectFit: "cover")
    *   **Fixed Critical Bug**: Added missing `ctaUrl` field to response, now explicitly returns `https://secure.winred.com/craft4commissioner/donate-today` for the primary Call to Action
    *   **WinRed Integration**: Enforces global donation redirection through mandatory external URL usage

**Donation Service** (`src/server/implementations/donation.service.ts`):
*   **`CreateDonation`**: Validates donation input, saves to `donations` table, generates mock transaction ID for future payment provider integration
*   **`CaptureDonationLead`**: **Takes `firstName`, `lastName`, `email`, and `expectedAmount` from input, saves to the `donation_leads` table, and automatically subscribes the user to the newsletter via the shared `subscribeToNewsletter` utility**
*   **`GetDonationLeads` (Protected)**: Fetches paginated donation leads from the database, ordered by creation date. Returns total count for pagination
*   **`DeleteDonationLead` (Protected)**: Deletes a specific donation lead by ID
*   **`GetRecentDonationLeads` (Public)**: Fetches the 5 most recent donation leads (first name and last name only) for the "Social Proof" feature on the Donate page
*   **Auth Protection**: Uses shared `requireAuth` utility to enforce authentication on protected procedures
*   **`GetDonationConfig`**: Returns the correct `externalDonationUrl` with updated description reflecting the requirement that any navigation to local `/donate` path should result in external redirect to WinRed

**Newsletter Service** (`src/server/implementations/newsletter.service.ts`):
*   **`Subscribe` Procedure**: Refactored to utilize the shared `subscribeToNewsletter` utility from `src/server/utils/newsletter.ts`
*   **`GetSubscriptions` (Protected)**: Fetches paginated newsletter subscriptions from the database. Returns total count
*   **`DeleteSubscription` (Protected)**: Deletes a specific subscription by ID
*   **Auth Protection**: Uses shared `requireAuth` utility
*   **Shared Newsletter Utility**: **Created `src/server/utils/newsletter.ts`** with reusable `subscribeToNewsletter` function
    - **Local Persistence**: Saves or updates contacts in the `newsletter_subscriptions` table using `onConflictDoUpdate`
    - **Mailchimp Integration**: Uses the **Mailchimp Marketing API (v3.0)** via server-side `fetch` with **Basic Authentication**
    - **Authentication**: Implemented using `MAILCHIMP_API_KEY` with automatic Data Center (DC) resolution from the API key
    - **API Endpoint**: Performs a `POST` request to `https://<dc>.api.mailchimp.com/3.0/lists/<list_id>/members`
    - **Field Mapping**: Maps `firstName` to Mailchimp's `FNAME` and `lastName` to `LNAME` merge tags
    - **Local Persistence**: Saves the subscriber's `email`, `firstName`, and `lastName` to the PostgreSQL database using `onConflictDoUpdate` to refresh names if a user re-subscribes while preserving their original subscription timestamp
    - **Resilience**: Implements intelligent error handling that recognizes the "Member Exists" Mailchimp response as a success state, preventing redundant error messages
    - **Graceful Degradation**: Ensures that even if the third-party Mailchimp API is unreachable, local database persistence still occurs, and the user receives a success confirmation to prevent lead loss

**Contact Service** (`src/server/implementations/contact.service.ts`):
*   **`SubmitInquiry`**: Saves contact form submissions to `contacts` table
*   **~~`SubscribeToNewsletter`~~**: **REMOVED** - Functionality moved to dedicated Newsletter service

**Shared Utilities**:
*   **`src/server/utils/auth.ts`**: Created a reusable `requireAuth` function that validates the session cookie and retrieves the user, throwing an error if unauthorized

## Server Configuration

Updated `src/server/index.ts` to register new service implementations:
- Registered: Campaign, Donation, Contact, **Newsletter**, **Auth** services
- Removed: Greeting and Todo services, **Contact.SubscribeToNewsletter** procedure

## Files Created/Modified

*   `migrations/000002_add_campaign_tables.up.sql`
*   `migrations/000002_add_campaign_tables.down.sql`
*   `migrations/000003_add_homepage_content.up.sql`
*   `migrations/000003_add_homepage_content.down.sql`
*   `migrations/000004_add_hero_section_table.up.sql`
*   `migrations/000004_add_hero_section_table.down.sql`
*   `migrations/000005_add_donation_leads_table.up.sql`
*   `migrations/000005_add_donation_leads_table.down.sql`
*   **migrations/000006_add_lastname_to_newsletter.up.sql**
*   **migrations/000006_add_lastname_to_newsletter.down.sql**
*   **migrations/000007_add_names_to_donation_leads.up.sql**
*   **migrations/000007_add_names_to_donation_leads.down.sql**
*   **migrations/000008_add_admin_users.up.sql**
*   **migrations/000009_add_sessions_table.up.sql**
*   `src/db/schema.ts` (auto-generated from migrations)
*   `src/utils/db.ts` (updated to include schema definition)
*   `src/server/implementations/campaign.service.ts` (updated for dynamic data fetching and WinRed integration)
*   `src/server/implementations/donation.service.ts`
*   `src/server/implementations/contact.service.ts` (refactored to remove newsletter functionality)
*   **src/server/implementations/newsletter.service.ts** (refactored to use shared utility)
*   **src/server/implementations/auth.service.ts** (new authentication service with enhanced error handling)
*   **src/server/utils/newsletter.ts** (new shared newsletter utility)
*   **src/server/utils/auth.ts** (new shared authentication utility)
*   `src/server/index.ts`
*   `src/api_schema/donations.ts` (updated to match implementation with required `firstName` and `lastName` fields)

## API Endpoints

**Auth**:
*   `POST /_api/Auth/Login`: `{ username, password }` -> `{ success, user }`
    *   **Enhanced**: Now includes comprehensive error handling and explicit status codes
*   `POST /_api/Auth/Logout`: `{}` -> `{ success }`
*   `GET /_api/Auth/GetProfile`: `{}` -> `{ id, username }`
*   **`POST /_api/Auth/UpdatePassword`**: `{ newPassword }` -> `{ success }`
  *   **Security**: Uses `Bun.password.hash` (Argon2) for secure password hashing
  *   **Authorization**: Protected by existing Auth middleware, verifies `auth_session` cookie
  *   **Context**: Retrieves current user's ID from request context (`context.get("user")`)
  *   **Enhanced**: Improved with detailed logging and error handling

**Campaign**:
- **Campaign/GetHeroSection**: `POST /_api/Campaign/GetHeroSection` (Zynapse protocol)
  *   **Updated**: Now includes `ctaUrl` field returning `https://secure.winred.com/craft4commissioner/donate-today`
- **Campaign/GetCandidateProfile**: `POST /_api/Campaign/GetCandidateProfile`
- **Campaign/GetPriorities**: `POST /_api/Campaign/GetPriorities`
- **Campaign/GetDonationConfig**: Returns `externalDonationUrl` with mandatory WinRed URL usage

**Donation**:
- **Donation/CaptureDonationLead**: `POST /_api/Donation/CaptureDonationLead`
  *   **Input**: `{ "firstName": "string", "lastName": "string", "email": "string", "expectedAmount": number }`
  *   **Output**: `{ "success": boolean, "leadId": "string" }`
*   `GET /_api/Donation/GetDonationLeads`: `{ limit, offset }` -> `{ leads, total }` (Protected)
*   `POST /_api/Donation/DeleteDonationLead`: `{ id }` -> `{ success }` (Protected)
*   `GET /_api/Donation/GetRecentDonationLeads`: `{ limit }` -> `{ leads }` (Public)

**Newsletter**:
*   `GET /_api/Newsletter/GetSubscriptions`: `{ limit, offset }` -> `{ subscriptions, total }` (Protected)
*   `POST /_api/Newsletter/DeleteSubscription`: `{ id }` -> `{ success }` (Protected)
- **✨ Newsletter/Subscribe**: `POST /_api/Newsletter/Subscribe`
  *   **Input**: `{ "email": "string", "firstName": "string", "lastName": "string" }`
  *   **Output**: `{ "success": boolean, "message": "string" }`

## Technical Dependencies

- **Zynapse**: For API service and procedure implementation with enhanced error handling and WinRed integration
- **Drizzle ORM**: For database interactions and schema management
- **PostgreSQL**: As the underlying data store for campaign content and donation leads
- **Bun**: Runtime for the TypeScript backend with Argon2 password hashing
- **Argon2**: For password hashing and verification in authentication with consistent implementation across all auth operations

⚠️ **USER ACTION REQUIRED** ⚠️

1.  **Default Admin Credentials**:
    *   The system has automatically created a default admin user.
    *   **Username**: `admin`
    *   **Password**: `admin123`
    *   **Action**: Log in to the dashboard immediately and change the password using the new `UpdatePassword` endpoint or update the `password_hash` in the `admin_users` table manually using a secure hash.

2.  **Database Configuration**:
    *   Set `DATABASE_URL` in your `.env` file or deployment environment
    *   Format: `postgresql://user:password@host:port/database`

3.  **Payment Processing**:
    *   Replace mock payment logic in `src/server/implementations/donation.service.ts` with real payment provider (Stripe, PayPal, etc.)

4.  **Candidate Image**:
    *   **Update placeholder image URL** in `candidate_profile` table
    *   Current: `https://placehold.co/600x400`
    *   Required: Actual candidate photo URL

5.  **Verify Hero Section Content**:
    *   Review the default values inserted into the `hero_section` table. You can update the `headline`, `subheadline`, and `cta_text` directly in the database to match your campaign messaging requirements
    *   Current default headline: "Faith. Family. Responsibility."
    *   Current default subheadline: "Building a Better Future for Our Community"

6.  **Frontend Implementation**: 
    *   **Updated requirement**: Ensure the donation page lead capture form on the frontend is configured to call the `Donation/CaptureDonationLead` procedure with the user's **first name, last name, email**, and the amount they intend to donate.

7.  **Mailchimp API Credentials**:
    *   **Required**: `MAILCHIMP_API_KEY` (format: `xxx-usX`)
    *   **Required**: `MAILCHIMP_LIST_ID` (Audience ID)
    *   **Deprecated**: `MAILCHIMP_ACTION_URL` (no longer used)

8.  **Mailchimp Configuration**:
    - Obtain your **API Key** from the Mailchimp Dashboard (Account → Extras → API keys)
    - Obtain your **Audience ID** (List ID) from the Audience settings (Audience dashboard → Manage Audience → Settings → Audience name and defaults)
    - Ensure your Mailchimp Audience is configured with merge tags `FNAME` (First Name) and `LNAME` (Last Name) for proper field mapping

9.  **Shared Subscription Logic**:
    *   **Integration Complete**: Both standard newsletter signups and donation lead captures now use the same robust Mailchimp integration via the shared `subscribeToNewsletter` utility, ensuring consistent behavior and preventing lead loss

10. **Frontend Implementation**: Implement the "Change Password" form in the admin dashboard.
    - **Where**: A new "Security" or "Settings" page in the admin area.
    - **Details**: Create a form that accepts a new password (and confirmation). On submit, call the `Auth/UpdatePassword` mutation.
    - **Validation**: Ensure the frontend validates that the password and confirmation match before sending the request.

11. **Global Donation Redirection**:
    *   **WinRed Integration**: The system now globally enforces the use of the external WinRed URL `https://secure.winred.com/craft4commissioner/donate-today`
    *   **Frontend Navigation**: Any navigation to the local `/donate` path should result in an external redirect to the WinRed donation page
    *   **Validation Fixed**: The critical bug causing Zod validation failures has been resolved with proper `ctaUrl` field inclusion

12. **Authentication Stability**:
    *   **Resolved Hanging Issues**: The authentication system has been hardened with comprehensive error handling and explicit HTTP status codes
    *   **Enhanced Logging**: Server-side logging provides better traceability for login and password update operations