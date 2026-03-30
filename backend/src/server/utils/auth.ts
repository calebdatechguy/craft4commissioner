import { client as db } from "../../utils/db";
import { sessions, adminUsers } from "../../db/schema";
import { eq } from "drizzle-orm";

interface RequestWithCookies {
  cookies: {
    get(name: string): string | null | undefined;
  }
}

export async function requireAuth(request: RequestWithCookies) {
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

  const user = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.id, session.userId)
  });

  if (!user) {
    throw new Error("Unauthorized: User not found");
  }

  return user;
}
