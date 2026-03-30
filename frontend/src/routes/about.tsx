import { createFileRoute } from "@tanstack/react-router";
import { useCampaignGetCandidateProfileQuery } from "@/_generated/campaign.service";
import { useDonationGetDonationConfigQuery } from "@/_generated/donation.service";
import { Loader2 } from "lucide-react";
import Hero from "@/components/layout/Hero";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const { data: profile, isLoading: isProfileLoading } = useCampaignGetCandidateProfileQuery({});
  const { data: donationConfig, isLoading: isDonationLoading } = useDonationGetDonationConfigQuery({});

  const isLoading = isProfileLoading || isDonationLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  const donateUrl = donationConfig?.externalDonationUrl || "https://secure.winred.com/craft4commissioner/donate-today";

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <Hero
        showLogo={true}
        title="About Eric Craft"
        subtitle="Meet the Candidate"
        description="A husband, father, and dedicated servant to Barrow County with over 23 years of history in our community."
        ctaText="DONATE TO THE CAUSE"
        ctaLink={donateUrl}
        backgroundImage="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2000&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Image Side */}
          <div className="bg-slate-200 rounded-lg aspect-[3/4] overflow-hidden shadow-xl">
            <img 
              src="https://cdn.craft4commissioner.com/img/EricWebsitePics-5.avif" 
              alt="Eric Craft" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bio Content */}
          <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
            <h2 className="text-3xl font-bold text-blue-900">More Than a Politician</h2>
            <p>
              Eric Craft isn't a career politician. He's a family man with a normal job who understands the daily struggles and triumphs of the people in District 4.
            </p>
            <p>
              Having called Barrow County home for over <strong>{profile?.bio.residencyYears || 22} years</strong>, Eric has deep roots in our community. He has seen it grow and change, and he is committed to ensuring that growth benefits everyone.
            </p>
            <p>
              His commitment to service extends beyond politics. As a board member of the <strong>Salvation Army</strong>, Eric has worked tirelessly to support those in need, embodying the spirit of "People Over Pockets."
            </p>
            
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-900 mt-8">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Core Principles</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Integrity over Ambition</li>
                <li>Faith-Based Leadership</li>
                <li>Community First</li>
                <li>Fiscal Responsibility</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
