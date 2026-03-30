import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { z } from "zod";

// ---- Service Name: Auth ----
export type AuthLoginOutputType = {
  user: {
    id: number;
    username: string;
  };
};
export const AuthLoginInputSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  })
  .strict();
export function useAuthLoginMutation(
  extraOptions?: Omit<
    UseMutationOptions<
      AuthLoginOutputType,
      Error,
      z.infer<typeof AuthLoginInputSchema>,
      unknown
    >,
    "mutationFn"
  >,
  headers?: HeadersInit,
) {
  /*Authenticates a user with username and password. Sets 'auth_session' cookie valid for 24h. The backend MUST correctly verify password hashes (using Argon2) against the 'admin_users' table. It MUST always return a response (success with user data or 401 Unauthorized) to prevent the client from hanging or infinite loading.*/
  return useMutation({
    ...extraOptions,
    mutationFn: async (args: z.infer<typeof AuthLoginInputSchema>) => {
      const validationResult = await AuthLoginInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on validating mutation input ",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const response = await fetch("/_api/Auth/Login", {
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
          "Mutation: Login Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();

      return rawResponse["data"] as AuthLoginOutputType;
    },
  });
}

export type AuthLogoutOutputType = {
  success: boolean;
};
export const AuthLogoutInputSchema = z.object({}).strict();
export function useAuthLogoutMutation(
  extraOptions?: Omit<
    UseMutationOptions<
      AuthLogoutOutputType,
      Error,
      z.infer<typeof AuthLogoutInputSchema>,
      unknown
    >,
    "mutationFn"
  >,
  headers?: HeadersInit,
) {
  /*Invalidates current session by clearing the 'auth_session' cookie.*/
  return useMutation({
    ...extraOptions,
    mutationFn: async (args: z.infer<typeof AuthLogoutInputSchema>) => {
      const validationResult = await AuthLogoutInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on validating mutation input ",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const response = await fetch("/_api/Auth/Logout", {
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
          "Mutation: Logout Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();

      return rawResponse["data"] as AuthLogoutOutputType;
    },
  });
}

export const AuthGetProfileQueryInputSchema = z.object({}).strict();
export type AuthGetProfileOutputType = {
  id: number;
  username: string;
};

export function useAuthGetProfileQuery(
  args: z.infer<typeof AuthGetProfileQueryInputSchema>,
  extraOptions?: Omit<
    UseQueryOptions<
      AuthGetProfileOutputType,
      Error,
      AuthGetProfileOutputType,
      Array<string | z.infer<typeof AuthGetProfileQueryInputSchema>>
    >,
    "queryKey" | "queryFn"
  >,
  headers?: HeadersInit,
) {
  /*Get current user profile based on session cookie. Returns 401 if no valid session found.*/
  return useQuery({
    queryKey: ["Auth", "GetProfile", args],
    queryFn: async () => {
      const validationResult =
        await AuthGetProfileQueryInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on input validation of GetProfile",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const targetURL = new URL(
        "/_api/Auth/GetProfile",
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
          "Query: GetProfile Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();
      return rawResponse["data"] as AuthGetProfileOutputType;
    },
    ...extraOptions,
  });
}

export type AuthUpdatePasswordOutputType = {
  success: boolean;
};
export const AuthUpdatePasswordInputSchema = z
  .object({ newPassword: z.string().min(1, "New password is required") })
  .strict();
export function useAuthUpdatePasswordMutation(
  extraOptions?: Omit<
    UseMutationOptions<
      AuthUpdatePasswordOutputType,
      Error,
      z.infer<typeof AuthUpdatePasswordInputSchema>,
      unknown
    >,
    "mutationFn"
  >,
  headers?: HeadersInit,
) {
  /*Updates the password for the currently authenticated user in the 'admin_users' table. The backend MUST use Argon2 to securely hash the new password before storage to ensure compatibility with the Login verification logic.*/
  return useMutation({
    ...extraOptions,
    mutationFn: async (args: z.infer<typeof AuthUpdatePasswordInputSchema>) => {
      const validationResult =
        await AuthUpdatePasswordInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on validating mutation input ",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const response = await fetch("/_api/Auth/UpdatePassword", {
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
          "Mutation: UpdatePassword Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();

      return rawResponse["data"] as AuthUpdatePasswordOutputType;
    },
  });
}
//----
