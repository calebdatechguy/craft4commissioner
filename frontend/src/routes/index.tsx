import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/home/AboutSection";
import { PrioritiesSection } from "@/components/home/PrioritiesSection";
import SocialMediaSection from "@/components/home/SocialMediaSection";
import Hero from "@/components/layout/Hero";

function IndexComponent() {
  return (
    <div className="flex flex-col min-h-screen border-none">
      <Hero
        variant="homepage"
        showLogo={true}
        subtitle="Faith. Family. Responsibility."
        className="border-none"
        title={
          <>
            Eric Craft for <br />
            <span className="text-red-500">District 4 Commissioner</span>
          </>
        }
        description="A proven leader dedicated to public safety, fiscal responsibility, and our community's future."
        ctaText="MEET ERIC"
        ctaLink="/about"
        secondaryCtaText="DONATE NOW"
        secondaryCtaLink="https://secure.winred.com/craft4commissioner/donate-today"
        backgroundImage="https://cdn.craft4commissioner.com/img/EricWebsitePics-2.avif"
      />
      <AboutSection />
      <PrioritiesSection />
      <SocialMediaSection />
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: IndexComponent,
});
