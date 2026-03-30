import { ServiceImplementationBuilder } from "zynapse/server";
import { campaignService } from "../../api_schema/campaign";
import { client as db } from "../../utils/db";
import { candidateProfile, campaignPriorities, heroSection } from "../../db/schema";

export const campaignImplementation = new ServiceImplementationBuilder(campaignService)
  .registerProcedureImplementation("GetHeroSection", async () => {
    const heroData = await db.select().from(heroSection).limit(1);

    if (!heroData || heroData.length === 0) {
      throw new Error("Hero section data not found");
    }

    const h = heroData[0];

    return {
      headline: h.headline,
      subheadline: h.subheadline ?? undefined,
      ctaText: h.ctaText ?? undefined,
      ctaUrl: h.ctaUrl ?? "https://secure.winred.com/craft4commissioner/donate-today",
      heroImage: {
        url: h.heroImageUrl,
        altText: h.heroImageAltText,
        layoutConstraints: {
          maxWidth: h.maxWidth,
          maxHeight: h.maxHeight,
          objectFit: h.objectFit as "cover" | "contain" | "fill" | "none" | "scale-down",
        },
      },
    };
  })
  .registerProcedureImplementation("GetCandidateProfile", async () => {
    const profile = await db.select().from(candidateProfile).limit(1);

    if (!profile || profile.length === 0) {
      throw new Error("Candidate profile not found");
    }

    const p = profile[0];

    return {
      name: p.name,
      title: p.title,
      district: p.district,
      slogan: p.slogan,
      imageUrl: p.imageUrl,
      bio: {
        summary: p.bioSummary,
        historyYears: p.bioHistoryYears,
        residencyYears: p.bioResidencyYears,
        background: p.bioBackground,
        familyInfo: p.bioFamilyInfo,
        jobDescription: p.bioJobDescription,
      },
      values: p.values as string[],
    };
  })
  .registerProcedureImplementation("GetPriorities", async () => {
    const priorities = await db.select().from(campaignPriorities);

    return {
      priorities: priorities.map((p) => ({
        title: p.title,
        description: p.description,
        category: p.category as "Public Safety" | "Education" | "Community" | "Fiscal" | "Faith",
      })),
    };
  })
  .registerProcedureImplementation("GetEndorsements", async () => {
    return {
      endorsements: [
        {
          name: "Judd Smith",
          title: "Local Leader",
          quote: "Eric Craft is the leader we need for District 4.",
        },
        {
          name: "Billy",
          title: "Community Member",
          quote: "I trust Eric to do what's right for our families.",
        },
      ],
    };
  })
  .build();
