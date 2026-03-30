import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { z } from "zod";

// ---- Service Name: Campaign ----
export const CampaignGetHeroSectionQueryInputSchema = z.object({}).strict();
export type CampaignGetHeroSectionOutputType = {
  headline: string;
  subheadline?: string | undefined;
  ctaText?: string | undefined;
  /** The destination URL for the CTA button. For donation buttons, use: https://secure.winred.com/craft4commissioner/donate-today */
  ctaUrl: string;
  heroImage: {
    /** URL of the family photo: https://cdn.craft4commissioner.com/img/01-11-25%20Craft%20Family-5.jpg */
    url: string;
    altText: string;
    layoutConstraints: {
      /** CSS constraint (e.g., '100%') to prevent oversized rendering */
      maxWidth: string;
      /** CSS constraint (e.g., '600px') for layout stability */
      maxHeight: string;
      /** Image fitting strategy for the hero section */
      objectFit: "cover" | "contain" | "fill" | "none" | "scale-down";
    };
  };
};

export function useCampaignGetHeroSectionQuery(
  args: z.infer<typeof CampaignGetHeroSectionQueryInputSchema>,
  extraOptions?: Omit<
    UseQueryOptions<
      CampaignGetHeroSectionOutputType,
      Error,
      CampaignGetHeroSectionOutputType,
      Array<string | z.infer<typeof CampaignGetHeroSectionQueryInputSchema>>
    >,
    "queryKey" | "queryFn"
  >,
  headers?: HeadersInit,
) {
  /*Retrieves homepage hero section data, including the featured family image and its layout constraints for performance and visual integrity.*/
  return useQuery({
    queryKey: ["Campaign", "GetHeroSection", args],
    queryFn: async () => {
      const validationResult =
        await CampaignGetHeroSectionQueryInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on input validation of GetHeroSection",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const targetURL = new URL(
        "/_api/Campaign/GetHeroSection",
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
          "Query: GetHeroSection Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();
      return rawResponse["data"] as CampaignGetHeroSectionOutputType;
    },
    ...extraOptions,
  });
}

export const CampaignGetCandidateProfileQueryInputSchema = z
  .object({})
  .strict();
export type CampaignGetCandidateProfileOutputType = {
  name: string;
  title: string;
  district: string;
  slogan: string;
  /** URL to the candidate's profile picture */
  imageUrl: string;
  bio: {
    /** Short bio summary for the homepage */
    summary: string;
    historyYears: number;
    residencyYears: number;
    background: string;
    familyInfo: string;
    jobDescription: string;
  };
  values: string[];
};

export function useCampaignGetCandidateProfileQuery(
  args: z.infer<typeof CampaignGetCandidateProfileQueryInputSchema>,
  extraOptions?: Omit<
    UseQueryOptions<
      CampaignGetCandidateProfileOutputType,
      Error,
      CampaignGetCandidateProfileOutputType,
      Array<
        string | z.infer<typeof CampaignGetCandidateProfileQueryInputSchema>
      >
    >,
    "queryKey" | "queryFn"
  >,
  headers?: HeadersInit,
) {
  /*Get the main profile information for Eric Craft.*/
  return useQuery({
    queryKey: ["Campaign", "GetCandidateProfile", args],
    queryFn: async () => {
      const validationResult =
        await CampaignGetCandidateProfileQueryInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on input validation of GetCandidateProfile",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const targetURL = new URL(
        "/_api/Campaign/GetCandidateProfile",
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
          "Query: GetCandidateProfile Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();
      return rawResponse["data"] as CampaignGetCandidateProfileOutputType;
    },
    ...extraOptions,
  });
}

export const CampaignGetPrioritiesQueryInputSchema = z.object({}).strict();
export type CampaignGetPrioritiesOutputType = {
  priorities: {
    title: string;
    description: string;
    category: "Public Safety" | "Education" | "Community" | "Fiscal" | "Faith";
  }[];
};

export function useCampaignGetPrioritiesQuery(
  args: z.infer<typeof CampaignGetPrioritiesQueryInputSchema>,
  extraOptions?: Omit<
    UseQueryOptions<
      CampaignGetPrioritiesOutputType,
      Error,
      CampaignGetPrioritiesOutputType,
      Array<string | z.infer<typeof CampaignGetPrioritiesQueryInputSchema>>
    >,
    "queryKey" | "queryFn"
  >,
  headers?: HeadersInit,
) {
  /*Get the list of campaign priorities and goals.*/
  return useQuery({
    queryKey: ["Campaign", "GetPriorities", args],
    queryFn: async () => {
      const validationResult =
        await CampaignGetPrioritiesQueryInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on input validation of GetPriorities",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const targetURL = new URL(
        "/_api/Campaign/GetPriorities",
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
          "Query: GetPriorities Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();
      return rawResponse["data"] as CampaignGetPrioritiesOutputType;
    },
    ...extraOptions,
  });
}

export const CampaignGetEndorsementsQueryInputSchema = z.object({}).strict();
export type CampaignGetEndorsementsOutputType = {
  endorsements: {
    name: string;
    title?: string | undefined;
    quote?: string | undefined;
  }[];
};

export function useCampaignGetEndorsementsQuery(
  args: z.infer<typeof CampaignGetEndorsementsQueryInputSchema>,
  extraOptions?: Omit<
    UseQueryOptions<
      CampaignGetEndorsementsOutputType,
      Error,
      CampaignGetEndorsementsOutputType,
      Array<string | z.infer<typeof CampaignGetEndorsementsQueryInputSchema>>
    >,
    "queryKey" | "queryFn"
  >,
  headers?: HeadersInit,
) {
  /*Get the list of endorsements.*/
  return useQuery({
    queryKey: ["Campaign", "GetEndorsements", args],
    queryFn: async () => {
      const validationResult =
        await CampaignGetEndorsementsQueryInputSchema.safeParseAsync(args);
      if (validationResult.error) {
        console.error(
          "Error on input validation of GetEndorsements",
          validationResult.error,
        );
        throw new Error(validationResult.error.message);
      }

      const targetURL = new URL(
        "/_api/Campaign/GetEndorsements",
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
          "Query: GetEndorsements Non ok response: " + backendErrorMessage,
        );
      }

      const rawResponse = await response.json();
      return rawResponse["data"] as CampaignGetEndorsementsOutputType;
    },
    ...extraOptions,
  });
}
//----
