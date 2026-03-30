import { createFileRoute } from "@tanstack/react-router";
import { 
  useCampaignGetCandidateProfileQuery,
  useCampaignGetHeroSectionQuery 
} from "@/_generated/campaign.service";
import { Loader2 } from "lucide-react";
import { AboutSection } from "@/components/home/AboutSection";
import { PrioritiesSection } from "@/components/home/PrioritiesSection";
import SocialMediaSection from "@/components/home/SocialMediaSection";
import Hero from "@/components/layout/Hero";

function IndexComponent() {
  const { data: profile, isLoading: isProfileLoading } = useCampaignGetCandidateProfileQuery({});
  const { data: heroData, isLoading: isHeroLoading } = useCampaignGetHeroSectionQuery({});
  
  const isLoading = isProfileLoading || isHeroLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen border-none">
      {/* Hero Section */}
      <Hero
        variant="homepage"
        showLogo={true}
        subtitle={heroData?.subheadline || profile?.slogan || "Faith. Family. Responsibility."}
        className="border-none"
        title={heroData?.headline ? (
          heroData.headline
        ) : (
          <>
            Eric Craft for <br />
            <span className="text-red-500">District 4 Commissioner</span>
          </>
        )}
        description="A proven leader dedicated to public safety, fiscal responsibility, and our community's future."
        ctaText={heroData?.ctaText || "MEET ERIC"}
        ctaLink="/about"
        secondaryCtaText="DONATE NOW"
        secondaryCtaLink={heroData?.ctaUrl || "https://secure.winred.com/craft4commissioner/donate-today"}
        backgroundImage="https://cdn.craft4commissioner.com/img/EricWebsitePics-2.avif"
      />

      {/* About Section */}
      <AboutSection profile={profile} />

      {/* Priorities Section */}
      <PrioritiesSection />

      {/* Social Media Section */}
      <SocialMediaSection />
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: IndexComponent,
});
