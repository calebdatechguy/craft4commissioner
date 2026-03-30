import { ServiceImplementationBuilder } from "zynapse/server";
import { authService } from "../../api_schema/auth";
import { client as db } from "../../utils/db";
import { adminUsers, sessions } from "../../db/schema";
import { eq } from "drizzle-orm";

// Helper to ensure default admin exists
async function ensureDefaultAdmin() {
  const users = await db.select().from(adminUsers).limit(1);
  if (users.length === 0) {
    // Create default admin: admin / admin123
    // Hash for 'admin123' using Argon2 (Bun default)
    const passwordHash = await Bun.password.hash("admin123");
    await db.insert(adminUsers).values({
      username: "admin",
      passwordHash: passwordHash,
    });
    console.log("Default admin user created: admin / admin123");
  }
}

export const authImplementation = new ServiceImplementationBuilder(authService)
  .setMiddleware(async (request, procedureName, context) => {
    // Skip middleware for Login procedure to avoid infinite loop or blocking login
    if (procedureName === "Login") {
      return;
    }

    const sessionId = request.cookies.get("auth_session");
    if (!sessionId) {
      throw new Error("Unauthorized: No session");
    }

    const session = await db.query.sessions.findFirst({
      where: eq(sessions.id, sessionId),
    });

    if (!session || new Date(session.expiresAt) < new Date()) {
      throw new Error("Unauthorized: Invalid or expired session");
    }

    // Fetch user details
    const user = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.id, session.userId)
    });

    if (!user) {
      throw new Error("Unauthorized: User not found");
    }

    context.set("user", user);
    context.set("sessionId", sessionId);
  })
  .registerProcedureImplementation("Login", async (input, request) => {
    console.log(`[AUTH] Login attempt for user: ${input.username}`);
    // Ensure admin user exists for first-time use
    await ensureDefaultAdmin();

    try {
      // 1. Fetch user by username using PostgreSQL dialect
      const users = await db.select().from(adminUsers).where(eq(adminUsers.username, input.username)).limit(1);
      const user = users[0];

      if (!user) {
        console.log(`[AUTH] User not found: ${input.username}`);
        // Throw 401 as per schema description and Zynapse standard for failures
        const error = new Error("Invalid username or password") as Error & { status?: number };
        error.status = 401;
        throw error;
      }

      // 2. Verify password with Argon2
      // If password was recently updated, Bun.password.verify correctly handles the new hash
      console.log(`[AUTH] Verifying password for user: ${input.username}`);
      const isValid = await Bun.password.verify(input.password, user.passwordHash);
      if (!isValid) {
        console.log(`[AUTH] Invalid password for user: ${input.username}`);
        const error = new Error("Invalid username or password") as Error & { status?: number };
        error.status = 401;
        throw error;
      }

      // 3. Session issuance procedure
      // Ensure session creation completes successfully and returns the session object
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      console.log(`[AUTH] Creating session in DB for user ID: ${user.id}`);
      // Using explicit returning clause for PostgreSQL consistency
      const insertedSessions = await db.insert(sessions).values({
        userId: user.id,
        expiresAt: expiresAt.toISOString(),
      }).returning();
      
      const session = insertedSessions[0];

      if (!session) {
        console.error(`[AUTH] Failed to create session for user ID: ${user.id}`);
        const error = new Error("Failed to issue session") as Error & { status?: number };
        error.status = 500;
        throw error;
      }

      // 4. Set cookie
      console.log(`[AUTH] Setting session cookie for user: ${input.username}`);
      request.cookies.set("auth_session", session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: expiresAt,
      });

      console.log(`[AUTH] Login successful for user: ${input.username}`);
      return {
        user: {
          id: user.id,
          username: user.username,
        },
      };
    } catch (error: unknown) {
      const err = error as Error & { status?: number };
      console.error(`[AUTH] Login error for user ${input.username}:`, err.message);
      // Ensure we re-throw if it's already an error with status (like 401), otherwise throw new 500
      if (typeof err.status === 'number') throw err;
      
      const sessionError = new Error(err.message || "Internal server error during login") as Error & { status?: number };
      sessionError.status = 500;
      throw sessionError;
    }
  })
  .registerProcedureImplementation("Logout", async (input, request, context) => {
    const sessionId = context.get("sessionId");
    if (sessionId) {
      await db.delete(sessions).where(eq(sessions.id, sessionId));
    }
    
    request.cookies.delete("auth_session");
    return { success: true };
  })
  .registerProcedureImplementation("GetProfile", async (input, request, context) => {
    const user = context.get("user");
    return {
      id: user.id,
      username: user.username,
    };
  })
  .registerProcedureImplementation("UpdatePassword", async (input, request, context) => {
    const user = context.get("user");
    console.log(`[AUTH] Updating password for user: ${user.username}`);
    
    try {
      // Hash the new password using Argon2 (Bun.password.hash uses Argon2 by default)
      const passwordHash = await Bun.password.hash(input.newPassword);
      console.log(`[AUTH] New password hashed for user: ${user.username}`);
  
      // Update the user's password record
      await db.update(adminUsers)
        .set({ passwordHash: passwordHash })
        .where(eq(adminUsers.id, user.id));
      
      console.log(`[AUTH] Password updated successfully in DB for user: ${user.username}`);
  
      return { success: true };
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`[AUTH] Failed to update password for user ${user.username}:`, err.message);
      throw new Error(`Failed to update password: ${err.message}`);
    }
  })
  .build();
