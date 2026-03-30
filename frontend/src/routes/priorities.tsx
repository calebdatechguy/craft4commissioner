import { createFileRoute } from "@tanstack/react-router";
import { useCampaignGetPrioritiesQuery } from "@/_generated/campaign.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, GraduationCap, Users, DollarSign, Heart } from "lucide-react";
import { Loader2 } from "lucide-react";
import Hero from "@/components/layout/Hero";

export const Route = createFileRoute("/priorities")({
  component: Priorities,
});

function Priorities() {
  const { data, isLoading, error } = useCampaignGetPrioritiesQuery({});

  const getIcon = (category: string) => {
    switch (category) {
      case "Public Safety": return <Shield className="h-8 w-8 text-red-600" />;
      case "Education": return <GraduationCap className="h-8 w-8 text-blue-900" />;
      case "Community": return <Users className="h-8 w-8 text-green-600" />;
      case "Fiscal": return <DollarSign className="h-8 w-8 text-yellow-600" />;
      case "Faith": return <Heart className="h-8 w-8 text-purple-600" />;
      default: return <Shield className="h-8 w-8 text-slate-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-600">
        Error loading priorities. Please try again later.
      </div>
    );
  }

  const priorities = data?.priorities || [
    // Fallback data if API returns empty or for preview purposes if API isn't running
    { title: "Backing Public Safety", description: "Full support for PD, EMS, and Fire departments to ensure rapid response and community safety.", category: "Public Safety" },
    { title: "School Security", description: "Increasing School Resource Officers (SROs) and enhancing security measures in our educational institutions.", category: "Education" },
    { title: "Fiscal Responsibility", description: "Addressing county allocations with a 'People Over Pockets' mindset.", category: "Fiscal" },
    { title: "Community Listening", description: "Being an accessible commissioner who listens to the needs of District 4 residents.", category: "Community" },
    { title: "Faith-Based Values", description: "Leading with integrity and values rooted in faith.", category: "Faith" }
  ];

  return (
    <div className="bg-white min-h-screen">
      <Hero
        showLogo={true}
        title="Goals & Priorities"
        subtitle="Our Campaign Platform"
        description="Eric Craft is committed to a safer, stronger, and more prosperous Barrow County. Here is where we stand."
        ctaText="JOIN THE MOVEMENT"
        ctaLink="/"
        backgroundImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2000&auto=format&fit=crop"
      />

      <div className="bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {priorities.map((priority, index) => (
            <Card key={index} className="border-t-4 border-t-blue-900 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-3 bg-slate-100 rounded-full">
                  {getIcon(priority.category)}
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">{priority.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">
                  {priority.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-blue-900 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Unity Under the Constitution</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            We believe in governing with respect for our founding principles, ensuring liberty and justice for all residents of Barrow County.
          </p>
        </div>
      </div>
    </div>
  </div>
  );
}
