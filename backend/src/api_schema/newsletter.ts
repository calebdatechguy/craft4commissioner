import { Service } from "zynapse/schema";
import { z } from "zod";

// COMMENT: Newsletter service specifically designed for Mailchimp integration.
// Handles the submission of new subscribers from the global newsletter form.
// The form is integrated site-wide to maintain the campaign's "Patriotic Design" visual identity.
export const newsletterService = new Service("Newsletter")
  .addProcedure({
    method: "MUTATION",
    name: "Subscribe",
    description: "Submit a subscription request to the Mailchimp newsletter list using a backend-driven API call. This replaces the legacy form embed method. The procedure validates the input, logs the subscription to the local PostgreSQL database (newsletter_subscriptions table) for consistency, and then adds the member to the Mailchimp list using environment variables for API keys and list IDs. The 'firstName' and 'lastName' are mapped to Mailchimp's 'FNAME' and 'LNAME' merge fields respectively.",
    input: z.object({
      email: z.string().email("Please provide a valid email address."),
      firstName: z.string().min(1, "First name is required."),
      lastName: z.string().min(1, "Last name is required."),
    }),
    output: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  })
  .addProcedure({
    method: "QUERY",
    name: "GetSubscriptions",
    description: "Retrieves a paginated list of newsletter subscriptions. PROTECTED: Requires valid 'auth_session' cookie.",
    input: z.object({
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }),
    output: z.object({
      subscriptions: z.array(z.object({
        id: z.number(),
        email: z.string().email(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        createdAt: z.coerce.date(), // Use coerce to handle JSON string dates
      })),
      total: z.number(),
    }),
  })
  .addProcedure({
    method: "MUTATION",
    name: "DeleteSubscription",
    description: "Deletes a newsletter subscription by ID. PROTECTED: Requires valid 'auth_session' cookie.",
    input: z.object({
      id: z.number(),
    }),
    output: z.object({
      success: z.boolean(),
    }),
  });
