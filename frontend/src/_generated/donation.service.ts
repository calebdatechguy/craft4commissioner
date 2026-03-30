import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { z } from "zod";

// ---- Service Name: Donation ----
export const DonationGetDonationConfigQueryInputSchema = z.object({}).strict();
export type DonationGetDonationConfigOutputType = {
  /** The primary external donation URL (WinRed) */
  externalDonationUrl: string;
};

export function useDonationGetDonationConfigQuery(
  args: z.infer<typeof DonationGetDonationConfigQueryInputSchema>,
  extraOptions?: Omit<
    UseQueryOptions<
      DonationGetDonationConfigOutputType,
      Error,
      DonationGetDonationConfigOutputType,
      Array<string | z.infer<typeof DonationGetDonationConfigQueryInputSchema>>
    >,
    "queryKey" | "queryFn"
  >,
  headers?: HeadersInit,
) {
  /*Retrieves the configuration for donations. The returned 'externalDonationUrl' MUST be used for all donation buttons and links across the application. Any navigation to the local '/donate' route should also perform a redirect to this URL (https://secure.winred.com/craft4commissioner/donate-today).*/
  return useQuery({
    queryKey: ["Donation", "GetDonationConfig", args],
    queryFn: async () => {
      const validationResult =
        await DonationGetDonationConfigQueryInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on input validation of GetDonationConfig",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const targetURL = new URL(
        "/_api/Donation/GetDonationConfig",
        window.location.origin,
      );
      const stringifiedArguments = JSON.stringify(validationResult.data);
      const encodedArguments = encodeURIComponent(stringifiedArguments);
      targetURL.searchParams.set("payload", encodedArguments);

      const response = await fetch(targetURL, {
        method: "GET",
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
          "Query: GetDonationConfig Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();
      return rawResponse["data"] as DonationGetDonationConfigOutputType;
    },
    ...extraOptions,
  });
}

export type DonationCreateDonationOutputType = {
  success: boolean;
  transactionId: string;
  message: string;
};
export const DonationCreateDonationInputSchema = z
  .object({
    amount: z.number().gte(1, "Donation amount must be at least 1"),
    donor: z
      .object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        address: z
          .object({
            street: z.string().min(1),
            city: z.string().min(1),
            state: z.string().min(2).max(2),
            zipCode: z.string().min(5),
          })
          .strict(),
        employer: z.string().optional(),
        occupation: z.string().optional(),
      })
      .strict(),
    /**Payment processor token (e.g., Stripe token)*/
    paymentToken: z
      .string()
      .describe("Payment processor token (e.g., Stripe token)"),
  })
  .strict();
export function useDonationCreateDonationMutation(
  extraOptions?: Omit<
    UseMutationOptions<
      DonationCreateDonationOutputType,
      Error,
      z.infer<typeof DonationCreateDonationInputSchema>,
      unknown
    >,
    "mutationFn"
  >,
  headers?: HeadersInit,
) {
  /*Process a new campaign donation locally. DEPRECATED: New donations should be directed to WinRed at https://secure.winred.com/craft4commissioner/donate-today.*/
  return useMutation({
    ...extraOptions,
    mutationFn: async (
      args: z.infer<typeof DonationCreateDonationInputSchema>,
    ) => {
      const validationResult =
        await DonationCreateDonationInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on validating mutation input ",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const response = await fetch("/_api/Donation/CreateDonation", {
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
          "Mutation: CreateDonation Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();

      return rawResponse["data"] as DonationCreateDonationOutputType;
    },
  });
}

export type DonationCaptureDonationLeadOutputType = {
  success: boolean;
  leadId: string;
};
export const DonationCaptureDonationLeadInputSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("A valid email address is required"),
    /**The amount the user says they expect or intend to donate*/
    expectedAmount: z
      .number()
      .gt(0)
      .describe("The amount the user says they expect or intend to donate"),
  })
  .strict();
export function useDonationCaptureDonationLeadMutation(
  extraOptions?: Omit<
    UseMutationOptions<
      DonationCaptureDonationLeadOutputType,
      Error,
      z.infer<typeof DonationCaptureDonationLeadInputSchema>,
      unknown
    >,
    "mutationFn"
  >,
  headers?: HeadersInit,
) {
  /*Captures a lead from the 'Join our giving List' form. This procedure stores the user's donor info and expected donation amount in the database, and automatically triggers the Newsletter/Subscribe logic to add the contact to the Mailchimp list. The provided name is mapped to 'firstName' and 'lastName' as required by the newsletter service.*/
  return useMutation({
    ...extraOptions,
    mutationFn: async (
      args: z.infer<typeof DonationCaptureDonationLeadInputSchema>,
    ) => {
      const validationResult =
        await DonationCaptureDonationLeadInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on validating mutation input ",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const response = await fetch("/_api/Donation/CaptureDonationLead", {
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
          "Mutation: CaptureDonationLead Non ok response: " +
            backendErrorMessage,
        );
      }

      const rawResponse = await response.json();

      return rawResponse["data"] as DonationCaptureDonationLeadOutputType;
    },
  });
}

export const DonationGetDonationLeadsQueryInputSchema = z
  .object({
    limit: z.number().gte(1).lte(100).default(20),
    offset: z.number().gte(0).default(0),
  })
  .strict();
export type DonationGetDonationLeadsOutputType = {
  leads: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    expectedAmount: number;
    createdAt: Date;
  }[];
  total: number;
};

export function useDonationGetDonationLeadsQuery(
  args: z.infer<typeof DonationGetDonationLeadsQueryInputSchema>,
  extraOptions?: Omit<
    UseQueryOptions<
      DonationGetDonationLeadsOutputType,
      Error,
      DonationGetDonationLeadsOutputType,
      Array<string | z.infer<typeof DonationGetDonationLeadsQueryInputSchema>>
    >,
    "queryKey" | "queryFn"
  >,
  headers?: HeadersInit,
) {
  /*Retrieves a paginated list of donation leads. PROTECTED: Requires valid 'auth_session' cookie.*/
  return useQuery({
    queryKey: ["Donation", "GetDonationLeads", args],
    queryFn: async () => {
      const validationResult =
        await DonationGetDonationLeadsQueryInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on input validation of GetDonationLeads",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const targetURL = new URL(
        "/_api/Donation/GetDonationLeads",
        window.location.origin,
      );
      const stringifiedArguments = JSON.stringify(validationResult.data);
      const encodedArguments = encodeURIComponent(stringifiedArguments);
      targetURL.searchParams.set("payload", encodedArguments);

      const response = await fetch(targetURL, {
        method: "GET",
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
          "Query: GetDonationLeads Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();
      return rawResponse["data"] as DonationGetDonationLeadsOutputType;
    },
    ...extraOptions,
  });
}

export type DonationDeleteDonationLeadOutputType = {
  success: boolean;
};
export const DonationDeleteDonationLeadInputSchema = z
  .object({ id: z.string().uuid() })
  .strict();
export function useDonationDeleteDonationLeadMutation(
  extraOptions?: Omit<
    UseMutationOptions<
      DonationDeleteDonationLeadOutputType,
      Error,
      z.infer<typeof DonationDeleteDonationLeadInputSchema>,
      unknown
    >,
    "mutationFn"
  >,
  headers?: HeadersInit,
) {
  /*Deletes a donation lead by ID. PROTECTED: Requires valid 'auth_session' cookie.*/
  return useMutation({
    ...extraOptions,
    mutationFn: async (
      args: z.infer<typeof DonationDeleteDonationLeadInputSchema>,
    ) => {
      const validationResult =
        await DonationDeleteDonationLeadInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on validating mutation input ",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const response = await fetch("/_api/Donation/DeleteDonationLead", {
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
          "Mutation: DeleteDonationLead Non ok response: " +
            backendErrorMessage,
        );
      }

      const rawResponse = await response.json();

      return rawResponse["data"] as DonationDeleteDonationLeadOutputType;
    },
  });
}

export const DonationGetRecentDonationLeadsQueryInputSchema = z
  .object({ limit: z.number().gte(1).lte(10).default(5) })
  .strict();
export type DonationGetRecentDonationLeadsOutputType = {
  leads: {
    firstName: string;
    lastName: string;
  }[];
};

export function useDonationGetRecentDonationLeadsQuery(
  args: z.infer<typeof DonationGetRecentDonationLeadsQueryInputSchema>,
  extraOptions?: Omit<
    UseQueryOptions<
      DonationGetRecentDonationLeadsOutputType,
      Error,
      DonationGetRecentDonationLeadsOutputType,
      Array<
        string | z.infer<typeof DonationGetRecentDonationLeadsQueryInputSchema>
      >
    >,
    "queryKey" | "queryFn"
  >,
  headers?: HeadersInit,
) {
  /*Retrieves a list of recent donation leads for social proof bubbles. Public endpoint.*/
  return useQuery({
    queryKey: ["Donation", "GetRecentDonationLeads", args],
    queryFn: async () => {
      const validationResult =
        await DonationGetRecentDonationLeadsQueryInputSchema.safeParseAsync(
          args,
        );
      if (validationResult.error) {
        console.error(
          "Error on input validation of GetRecentDonationLeads",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const targetURL = new URL(
        "/_api/Donation/GetRecentDonationLeads",
        window.location.origin,
      );
      const stringifiedArguments = JSON.stringify(validationResult.data);
      const encodedArguments = encodeURIComponent(stringifiedArguments);
      targetURL.searchParams.set("payload", encodedArguments);

      const response = await fetch(targetURL, {
        method: "GET",
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
          "Query: GetRecentDonationLeads Non ok response: " +
            backendErrorMessage,
        );
      }

      const rawResponse = await response.json();
      return rawResponse["data"] as DonationGetRecentDonationLeadsOutputType;
    },
    ...extraOptions,
  });
}
//----
