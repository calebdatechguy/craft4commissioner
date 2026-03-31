import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function AboutSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative order-2 md:order-1">
            <div className="absolute -inset-4 bg-blue-100 rounded-xl transform -rotate-2"></div>
            <div className="relative bg-slate-200 rounded-lg aspect-[4/5] overflow-hidden shadow-xl">
              <img
                src="https://cdn.craft4commissioner.com/img/EricWebsitePics-5.avif"
                alt="Eric Craft"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-6 order-1 md:order-2">
            <div className="inline-block bg-blue-100 text-blue-900 px-4 py-1 rounded-full font-bold text-sm tracking-wide uppercase">
              Meet The Candidate
            </div>
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">
              Dedicated to <span className="text-blue-900">Service</span>,<br />
              Committed to <span className="text-red-600">Community</span>.
            </h2>

            <div className="text-lg text-slate-600 space-y-4 leading-relaxed">
              <p>
                With 23 years of history in Barrow County and a deep commitment to public safety, Eric Craft understands the challenges and opportunities facing our community.
              </p>
              <p>
                As a family man and dedicated resident for over 22 years, Eric is ready to bring integrity and faith-based values to the commission. He believes in a government that listens to its people and acts with fiscal responsibility.
              </p>
            </div>

            <div className="pt-4">
              <Link to="/about">
                <Button variant="outline" className="border-blue-900 text-blue-900 hover:bg-blue-50 font-bold px-8 py-6 text-lg">
                  READ FULL BIO
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
