import { Service } from "zynapse/schema";
import { z } from "zod";

// COMMENT: Service for handling user authentication for the private dashboard.
// Uses cookie-based sessions.
export const authService = new Service("Auth")
  .setMiddlewareDescription("Requires 'auth_session' cookie with valid session. Session must contain 'userId'.")
  .addProcedure({
    method: "MUTATION",
    name: "Login",
    description: "Authenticates a user with username and password. Sets 'auth_session' cookie valid for 24h. The backend MUST correctly verify password hashes (using Argon2) against the 'admin_users' table. It MUST always return a response (success with user data or 401 Unauthorized) to prevent the client from hanging or infinite loading.",
    input: z.object({
      username: z.string().min(1, "Username is required"),
      password: z.string().min(1, "Password is required"),
    }),
    output: z.object({
      user: z.object({
        id: z.number(),
        username: z.string(),
      }),
    }),
  })
  .addProcedure({
    method: "MUTATION",
    name: "Logout",
    description: "Invalidates current session by clearing the 'auth_session' cookie.",
    input: z.object({}),
    output: z.object({
      success: z.boolean(),
    }),
  })
  .addProcedure({
    method: "QUERY",
    name: "GetProfile",
    description: "Get current user profile based on session cookie. Returns 401 if no valid session found.",
    input: z.object({}),
    output: z.object({
      id: z.number(),
      username: z.string(),
    }),
  })
  .addProcedure({
    method: "MUTATION",
    name: "UpdatePassword",
    description: "Updates the password for the currently authenticated user in the 'admin_users' table. The backend MUST use Argon2 to securely hash the new password before storage to ensure compatibility with the Login verification logic.",
    input: z.object({
      newPassword: z.string().min(1, "New password is required"),
    }),
    output: z.object({
      success: z.boolean(),
    }),
  });
