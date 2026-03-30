import { Service } from "zynapse/schema";
import { z } from "zod";

// COMMENT: Service for handling public inquiries and volunteer sign-ups.
export const contactService = new Service("Contact")
  .addProcedure({
    method: "MUTATION",
    name: "SubmitInquiry",
    description: "Submit a general contact form or inquiry to the campaign.",
    input: z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      subject: z.enum(["General", "Volunteer", "Press", "Endorsement", "Other"]).default("General"),
      message: z.string().min(10, "Message must be at least 10 characters"),
    }),
    output: z.object({
      success: z.boolean(),
      ticketId: z.string().uuid(),
    }),
  });
