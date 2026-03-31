import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, GraduationCap, Users, DollarSign, Heart } from "lucide-react";
import Hero from "@/components/layout/Hero";

export const Route = createFileRoute("/priorities")({
  component: Priorities,
});

const PRIORITIES = [
  {
    title: "Public Safety First",
    description: "Unwavering support for our Police Department, EMS, and Fire services. Ensuring they have the resources they need to keep us safe.",
    category: "Public Safety",
  },
  {
    title: "School Security",
    description: "Increasing the presence of School Resource Officers (SROs) to protect our children and educators.",
    category: "Education",
  },
  {
    title: "Community Listening",
    description: "A commitment to listening to the concerns of District 4 residents and acting on them.",
    category: "Community",
  },
  {
    title: "Fiscal Responsibility",
    description: "Addressing county allocations with a 'People Over Pockets' mindset, ensuring tax dollars are spent wisely.",
    category: "Fiscal",
  },
  {
    title: "Faith-Based Values",
    description: "Leading with integrity and values rooted in faith.",
    category: "Faith",
  },
];

function getIcon(category: string) {
  switch (category) {
    case "Public Safety": return <Shield className="h-8 w-8 text-red-600" />;
    case "Education": return <GraduationCap className="h-8 w-8 text-blue-900" />;
    case "Community": return <Users className="h-8 w-8 text-green-600" />;
    case "Fiscal": return <DollarSign className="h-8 w-8 text-yellow-600" />;
    case "Faith": return <Heart className="h-8 w-8 text-purple-600" />;
    default: return <Shield className="h-8 w-8 text-slate-600" />;
  }
}

function Priorities() {
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
            {PRIORITIES.map((priority, index) => (
              <Card key={index} className="border-t-4 border-t-blue-900 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-3 bg-slate-100 rounded-full">
                    {getIcon(priority.category)}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">{priority.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{priority.description}</p>
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
