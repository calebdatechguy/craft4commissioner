import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useDonationGetDonationConfigQuery } from "@/_generated/donation.service";

export function Navbar() {
  const { data: donationConfig } = useDonationGetDonationConfigQuery({});
  const donateUrl = donationConfig?.externalDonationUrl || "https://secure.winred.com/craft4commissioner/donate-today";

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="https://cdn.craft4commissioner.com/img/Artboard%201_1%4072x.webp" 
            alt="Eric Craft for Barrow County Commissioner" 
            className="hidden sm:block h-12 md:h-14 w-auto object-contain"
          />
          <img 
            src="https://cdn.craft4commissioner.com/img/Artboard%201_1%4072x.webp" 
            alt="Eric Craft" 
            className="block sm:hidden h-10 w-auto object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-blue-900 font-medium [&.active]:text-blue-900 [&.active]:font-bold"
          >
            Home
          </Link>
          <Link 
            to="/priorities" 
            className="text-gray-600 hover:text-blue-900 font-medium [&.active]:text-blue-900 [&.active]:font-bold"
          >
            Priorities
          </Link>
          <Link 
            to="/about" 
            className="text-gray-600 hover:text-blue-900 font-medium [&.active]:text-blue-900 [&.active]:font-bold"
          >
            About Me
          </Link>
          <a 
            href={donateUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button variant="destructive" className="font-bold bg-red-700 hover:bg-red-800">
              DONATE
            </Button>
          </a>
        </div>

        <div className="md:hidden flex gap-2">
             <Link to="/priorities" className="text-sm font-medium text-gray-600 p-2">Priorities</Link>
             <a 
               href={donateUrl} 
               target="_blank" 
               rel="noopener noreferrer"
             >
                <Button size="sm" variant="destructive" className="bg-red-700">Donate</Button>
             </a>
        </div>
      </div>
    </nav>
  );
}
