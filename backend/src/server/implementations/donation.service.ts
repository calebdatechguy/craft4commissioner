import { ServiceImplementationBuilder } from "zynapse/server";
import { donationService } from "../../api_schema/donations";
import { client as db } from "../../utils/db";
import { donations, donationLeads } from "../../db/schema";
import { subscribeToNewsletter } from "../utils/newsletter";
import { requireAuth } from "../utils/auth";
import { desc, eq, sql } from "drizzle-orm";

export const donationImplementation = new ServiceImplementationBuilder(donationService)
  .registerProcedureImplementation("GetDonationConfig", async () => {
    return {
      externalDonationUrl: "https://secure.winred.com/craft4commissioner/donate-today"
    };
  })
  .registerProcedureImplementation("CreateDonation", async (input) => {
    const { amount, donor, paymentToken } = input;

    // In a real application, we would process the payment here using the paymentToken
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Save donation to database (maintained for legacy data consistency if called)
    await db.insert(donations).values({
      amount,
      firstName: donor.firstName,
      lastName: donor.lastName,
      email: donor.email,
      phone: donor.phone,
      street: donor.address.street,
      city: donor.address.city,
      state: donor.address.state,
      zipCode: donor.address.zipCode,
      employer: donor.employer,
      occupation: donor.occupation,
      paymentToken,
    });

    return {
      success: true,
      transactionId,
      message: "Thank you for your donation! Your support helps us put People Over Pockets.",
    };
  })
  .registerProcedureImplementation("CaptureDonationLead", async (input) => {
    const { firstName, lastName, email, expectedAmount } = input;

    // 1. Save donation lead to local database
    const [insertedLead] = await db.insert(donationLeads).values({
      firstName,
      lastName,
      email,
      expectedAmount,
    }).returning({
      id: donationLeads.id,
    });

    // 2. Automatically trigger Newsletter/Subscribe logic
    console.log(`[DONATION] Triggering newsletter subscription for lead: ${email}`);
    await subscribeToNewsletter({
      email,
      firstName,
      lastName,
    });

    return {
      success: true,
      leadId: insertedLead.id,
    };
  })
  .registerProcedureImplementation("GetDonationLeads", async (input, request) => {
    await requireAuth(request);
    const { limit, offset } = input;

    const leads = await db.select().from(donationLeads)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(donationLeads.createdAt));

    const [{ count }] = await db.select({ count: sql<number>`cast(count(*) as integer)` }).from(donationLeads);

    return {
      leads: leads.map(lead => ({
        ...lead,
        firstName: lead.firstName || "",
        lastName: lead.lastName || "",
        createdAt: new Date(lead.createdAt),
      })),
      total: count,
    };
  })
  .registerProcedureImplementation("DeleteDonationLead", async (input, request) => {
    await requireAuth(request);
    const { id } = input;
    await db.delete(donationLeads).where(eq(donationLeads.id, id));
    return { success: true };
  })
  .registerProcedureImplementation("GetRecentDonationLeads", async (input) => {
    const { limit } = input;
    const leads = await db.select({
      firstName: donationLeads.firstName,
      lastName: donationLeads.lastName,
    }).from(donationLeads)
      .orderBy(desc(donationLeads.createdAt))
      .limit(limit);

    return {
      leads: leads.map(l => ({
        firstName: l.firstName || "Anonymous",
        lastName: l.lastName || "",
      })),
    };
  })
  .build();
