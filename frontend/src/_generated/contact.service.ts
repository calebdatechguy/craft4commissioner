import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { z } from "zod";

// ---- Service Name: Contact ----
export type ContactSubmitInquiryOutputType = {
  success: boolean;
  ticketId: string;
};
export const ContactSubmitInquiryInputSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z
      .enum(["General", "Volunteer", "Press", "Endorsement", "Other"])
      .default("General"),
    message: z.string().min(10, "Message must be at least 10 characters"),
  })
  .strict();
export function useContactSubmitInquiryMutation(
  extraOptions?: Omit<
    UseMutationOptions<
      ContactSubmitInquiryOutputType,
      Error,
      z.infer<typeof ContactSubmitInquiryInputSchema>,
      unknown
    >,
    "mutationFn"
  >,
  headers?: HeadersInit,
) {
  /*Submit a general contact form or inquiry to the campaign.*/
  return useMutation({
    ...extraOptions,
    mutationFn: async (
      args: z.infer<typeof ContactSubmitInquiryInputSchema>,
    ) => {
      const validationResult =
        await ContactSubmitInquiryInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on validating mutation input ",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const response = await fetch("/_api/Contact/SubmitInquiry", {
        method: "POST",
        body: JSON.stringify(validationResult.data),
        headers: headers,
      });

      if (!response.ok) {
        let backendErrorMessage = "";
        try {
          backendErrorMessage = await response.text();
        } catch {
          backendErrorMessage = "No Error message returned from backen";
        }
        throw new Error(
          "Mutation: SubmitInquiry Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();

      return rawResponse["data"] as ContactSubmitInquiryOutputType;
    },
  });
}
//----
