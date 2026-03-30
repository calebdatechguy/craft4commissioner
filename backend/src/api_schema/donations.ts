import { Service } from "zynapse/schema";
import { z } from "zod";

// COMMENT: Service for handling campaign donations.
// NOTE: All primary donation CTAs should now link to the external WinRed URL:
// https://secure.winred.com/craft4commissioner/donate-today
export const donationService = new Service("Donation")
  .addProcedure({
    method: "QUERY",
    name: "GetDonationConfig",
    description: "Retrieves the configuration for donations. The returned 'externalDonationUrl' MUST be used for all donation buttons and links across the application. Any navigation to the local '/donate' route should also perform a redirect to this URL (https://secure.winred.com/craft4commissioner/donate-today).",
    input: z.object({}),
    output: z.object({
      externalDonationUrl: z.string().url().describe("The primary external donation URL (WinRed)"),
    })
  })
  .addProcedure({
    method: "MUTATION",
    name: "CreateDonation",
    description: "Process a new campaign donation locally. DEPRECATED: New donations should be directed to WinRed at https://secure.winred.com/craft4commissioner/donate-today.",
    input: z.object({
      amount: z.number().positive().min(1, "Donation amount must be at least 1"),
      donor: z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        address: z.object({
          street: z.string().min(1),
          city: z.string().min(1),
          state: z.string().length(2),
          zipCode: z.string().min(5),
        }),
        // Campaign finance often requires employer info for donations over a certain amount
        employer: z.string().optional(),
        occupation: z.string().optional(),
      }),
      paymentToken: z.string().describe("Payment processor token (e.g., Stripe token)"),
    }),
    output: z.object({
      success: z.boolean(),
      transactionId: z.string(),
      message: z.string(),
    }),
  })
  .addProcedure({
    method: "MUTATION",
    name: "CaptureDonationLead",
    description: "Captures a lead from the 'Join our giving List' form. This procedure stores the user's donor info and expected donation amount in the database, and automatically triggers the Newsletter/Subscribe logic to add the contact to the Mailchimp list. The provided name is mapped to 'firstName' and 'lastName' as required by the newsletter service.",
    input: z.object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      email: z.string().email("A valid email address is required"),
      expectedAmount: z.number().positive().describe("The amount the user says they expect or intend to donate"),
    }),
    output: z.object({
      success: z.boolean(),
      leadId: z.string().uuid(),
    }),
  })
  .addProcedure({
    method: "QUERY",
    name: "GetDonationLeads",
    description: "Retrieves a paginated list of donation leads. PROTECTED: Requires valid 'auth_session' cookie.",
    input: z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }),
    output: z.object({
      leads: z.array(z.object({
        id: z.string().uuid(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        expectedAmount: z.number(),
        createdAt: z.coerce.date(), // Use coerce to handle JSON string dates
      })),
      total: z.number(),
    }),
  })
  .addProcedure({
    method: "MUTATION",
    name: "DeleteDonationLead",
    description: "Deletes a donation lead by ID. PROTECTED: Requires valid 'auth_session' cookie.",
    input: z.object({
      id: z.string().uuid(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
  })
  .addProcedure({
    method: "QUERY",
    name: "GetRecentDonationLeads",
    description: "Retrieves a list of recent donation leads for social proof bubbles. Public endpoint.",
    input: z.object({
      limit: z.number().min(1).max(10).default(5),
    }),
    output: z.object({
      leads: z.array(z.object({
        firstName: z.string(),
        lastName: z.string(),
      })),
    }),
  });
