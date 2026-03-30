import { Service } from "zynapse/schema";
import { z } from "zod";

// COMMENT: Service for retrieving static campaign content.
// This allows the frontend to fetch the specific text and configuration for the pages.
export const campaignService = new Service("Campaign")
  .addProcedure({
    method: "QUERY",
    name: "GetHeroSection",
    description: "Retrieves homepage hero section data, including the featured family image and its layout constraints for performance and visual integrity.",
    input: z.object({}),
    output: z.object({
      headline: z.string(),
      subheadline: z.string().optional(),
      ctaText: z.string().optional(),
      ctaUrl: z.string().url().describe("The destination URL for the CTA button. For donation buttons, use: https://secure.winred.com/craft4commissioner/donate-today"),
      heroImage: z.object({
        url: z.string().url().describe("URL of the family photo: https://cdn.craft4commissioner.com/img/01-11-25%20Craft%20Family-5.jpg"),
        altText: z.string(),
        layoutConstraints: z.object({
          maxWidth: z.string().describe("CSS constraint (e.g., '100%') to prevent oversized rendering"),
          maxHeight: z.string().describe("CSS constraint (e.g., '600px') for layout stability"),
          objectFit: z.enum(["cover", "contain", "fill", "none", "scale-down"]).describe("Image fitting strategy for the hero section")
        })
      })
    })
  })
  .addProcedure({
    method: "QUERY",
    name: "GetCandidateProfile",
    description: "Get the main profile information for Eric Craft.",
    input: z.object({}),
    output: z.object({
      name: z.string(),
      title: z.string(),
      district: z.string(),
      slogan: z.string(),
      imageUrl: z.string().url().describe("URL to the candidate's profile picture"),
      bio: z.object({
        summary: z.string().describe("Short bio summary for the homepage"),
        historyYears: z.number(),
        residencyYears: z.number(),
        background: z.string(),
        familyInfo: z.string(),
        jobDescription: z.string(),
      }),
      values: z.array(z.string()),
    }),
  })
  .addProcedure({
    method: "QUERY",
    name: "GetPriorities",
    description: "Get the list of campaign priorities and goals.",
    input: z.object({}),
    output: z.object({
      priorities: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          category: z.enum(["Public Safety", "Education", "Community", "Fiscal", "Faith"]),
        })
      ),
    }),
  })
  .addProcedure({
    method: "QUERY",
    name: "GetEndorsements",
    description: "Get the list of endorsements.",
    input: z.object({}),
    output: z.object({
      endorsements: z.array(
        z.object({
          name: z.string(),
          title: z.string().optional(),
          quote: z.string().optional(),
        })
      ),
    }),
  });
