import { useEffect, useState } from "react";
import { useDonationGetRecentDonationLeadsQuery } from "@/_generated/donation.service";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

export function SocialProofBubbles() {
  const { data } = useDonationGetRecentDonationLeadsQuery({ limit: 10 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!data?.leads || data.leads.length === 0) return;

    // Start the cycle
    setIsVisible(true);

    // Hide bubble after 4 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    // Move to next lead after 5 seconds (allowing 1s for fade out)
    const nextTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % data.leads.length);
    }, 5000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [currentIndex, data?.leads]);

  if (!data?.leads || data.leads.length === 0) return null;

  const currentLead = data.leads[currentIndex];

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-opacity duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <Card className="flex items-center gap-3 p-4 pr-6 bg-white/95 backdrop-blur shadow-xl border-blue-100 rounded-full">
        <div className="bg-red-100 p-2 rounded-full">
          <Heart className="w-5 h-5 text-red-600 fill-red-600" />
        </div>
        <div className="text-sm">
          <span className="font-bold text-blue-900 block">{currentLead.firstName} {currentLead.lastName}</span>
          <span className="text-slate-600 text-xs">Joined the giving list</span>
        </div>
      </Card>
    </div>
  );
}
