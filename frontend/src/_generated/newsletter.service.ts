import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { z } from "zod";

// ---- Service Name: Newsletter ----
export type NewsletterSubscribeOutputType = {
  success: boolean;
  message: string;
};
export const NewsletterSubscribeInputSchema = z
  .object({
    email: z.string().email("Please provide a valid email address."),
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
  })
  .strict();
export function useNewsletterSubscribeMutation(
  extraOptions?: Omit<
    UseMutationOptions<
      NewsletterSubscribeOutputType,
      Error,
      z.infer<typeof NewsletterSubscribeInputSchema>,
      unknown
    >,
    "mutationFn"
  >,
  headers?: HeadersInit,
) {
  /*Submit a subscription request to the Mailchimp newsletter list using a backend-driven API call. This replaces the legacy form embed method. The procedure validates the input, logs the subscription to the local PostgreSQL database (newsletter_subscriptions table) for consistency, and then adds the member to the Mailchimp list using environment variables for API keys and list IDs. The 'firstName' and 'lastName' are mapped to Mailchimp's 'FNAME' and 'LNAME' merge fields respectively.*/
  return useMutation({
    ...extraOptions,
    mutationFn: async (
      args: z.infer<typeof NewsletterSubscribeInputSchema>,
    ) => {
      const validationResult =
        await NewsletterSubscribeInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on validating mutation input ",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const response = await fetch("/_api/Newsletter/Subscribe", {
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
          "Mutation: Subscribe Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();

      return rawResponse["data"] as NewsletterSubscribeOutputType;
    },
  });
}

export const NewsletterGetSubscriptionsQueryInputSchema = z
  .object({
    limit: z.number().gte(1).lte(100).default(20),
    offset: z.number().gte(0).default(0),
  })
  .strict();
export type NewsletterGetSubscriptionsOutputType = {
  subscriptions: {
    id: number;
    email: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
    createdAt: Date;
  }[];
  total: number;
};

export function useNewsletterGetSubscriptionsQuery(
  args: z.infer<typeof NewsletterGetSubscriptionsQueryInputSchema>,
  extraOptions?: Omit<
    UseQueryOptions<
      NewsletterGetSubscriptionsOutputType,
      Error,
      NewsletterGetSubscriptionsOutputType,
      Array<string | z.infer<typeof NewsletterGetSubscriptionsQueryInputSchema>>
    >,
    "queryKey" | "queryFn"
  >,
  headers?: HeadersInit,
) {
  /*Retrieves a paginated list of newsletter subscriptions. PROTECTED: Requires valid 'auth_session' cookie.*/
  return useQuery({
    queryKey: ["Newsletter", "GetSubscriptions", args],
    queryFn: async () => {
      const validationResult =
        await NewsletterGetSubscriptionsQueryInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on input validation of GetSubscriptions",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const targetURL = new URL(
        "/_api/Newsletter/GetSubscriptions",
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
          "Query: GetSubscriptions Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();
      return rawResponse["data"] as NewsletterGetSubscriptionsOutputType;
    },
    ...extraOptions,
  });
}

export type NewsletterDeleteSubscriptionOutputType = {
  success: boolean;
};
export const NewsletterDeleteSubscriptionInputSchema = z
  .object({ id: z.number() })
  .strict();
export function useNewsletterDeleteSubscriptionMutation(
  extraOptions?: Omit<
    UseMutationOptions<
      NewsletterDeleteSubscriptionOutputType,
      Error,
      z.infer<typeof NewsletterDeleteSubscriptionInputSchema>,
      unknown
    >,
    "mutationFn"
  >,
  headers?: HeadersInit,
) {
  /*Deletes a newsletter subscription by ID. PROTECTED: Requires valid 'auth_session' cookie.*/
  return useMutation({
    ...extraOptions,
    mutationFn: async (
      args: z.infer<typeof NewsletterDeleteSubscriptionInputSchema>,
    ) => {
      const validationResult =
        await NewsletterDeleteSubscriptionInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on validating mutation input ",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const response = await fetch("/_api/Newsletter/DeleteSubscription", {
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
          "Mutation: DeleteSubscription Non ok response: " +
            backendErrorMessage,
        );
      }

      const rawResponse = await response.json();

      return rawResponse["data"] as NewsletterDeleteSubscriptionOutputType;
    },
  });
}
//----
