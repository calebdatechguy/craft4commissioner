import { Link } from "@tanstack/react-router";
import { Shield, GraduationCap, Users, DollarSign, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PRIORITIES = [
  {
    title: "Public Safety First",
    description: "Full support for PD, EMS, and Fire departments. Ensuring they have the resources they need to keep us safe.",
    category: "Public Safety",
  },
  {
    title: "School Security",
    description: "Increasing School Resource Officers (SROs) and enhancing security measures in our educational institutions.",
    category: "Education",
  },
  {
    title: "Fiscal Responsibility",
    description: "Addressing county allocations with a 'People Over Pockets' mindset, ensuring tax dollars are spent wisely.",
    category: "Fiscal",
  },
];

function getIcon(category: string) {
  switch (category) {
    case "Public Safety": return <Shield className="h-6 w-6 text-red-600" />;
    case "Education": return <GraduationCap className="h-6 w-6 text-blue-900" />;
    case "Community": return <Users className="h-6 w-6 text-green-600" />;
    case "Fiscal": return <DollarSign className="h-6 w-6 text-yellow-600" />;
    default: return <Shield className="h-6 w-6 text-slate-600" />;
  }
}

export function PrioritiesSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Key Priorities</h2>
          <p className="text-lg text-slate-600">
            Focused on the issues that matter most to the families of District 4.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PRIORITIES.map((priority, index) => (
            <Card key={index} className="border-t-4 border-t-red-600 shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {getIcon(priority.category)}
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">{priority.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">{priority.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/priorities" className="inline-flex items-center text-red-600 font-bold hover:text-red-700 text-lg group">
            View All Priorities
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
