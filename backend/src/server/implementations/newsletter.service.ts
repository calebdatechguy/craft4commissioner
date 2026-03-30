import { ServiceImplementationBuilder } from "zynapse/server";
import { newsletterService } from "../../api_schema/newsletter";
import { subscribeToNewsletter } from "../utils/newsletter";
import { client as db } from "../../utils/db";
import { newsletterSubscriptions } from "../../db/schema";
import { requireAuth } from "../utils/auth";
import { desc, eq, sql } from "drizzle-orm";

/**
 * Implementation of the Newsletter service.
 * Handles local persistence of subscribers and integrates with the official Mailchimp API.
 */
export const newsletterImplementation = new ServiceImplementationBuilder(newsletterService)
  .registerProcedureImplementation("Subscribe", async (input) => {
    return await subscribeToNewsletter(input);
  })
  .registerProcedureImplementation("GetSubscriptions", async (input, request) => {
    await requireAuth(request);
    const { limit, offset } = input;

    const subs = await db.select().from(newsletterSubscriptions)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(newsletterSubscriptions.createdAt));

    const [{ count }] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(newsletterSubscriptions);

    return {
      subscriptions: subs.map(sub => ({
        ...sub,
        firstName: sub.firstName || undefined,
        lastName: sub.lastName || undefined,
        createdAt: new Date(sub.createdAt),
      })),
      total: count,
    };
  })
  .registerProcedureImplementation("DeleteSubscription", async (input, request) => {
    await requireAuth(request);
    const { id } = input;
    await db.delete(newsletterSubscriptions).where(eq(newsletterSubscriptions.id, id));
    return { success: true };
  })
  .build();
