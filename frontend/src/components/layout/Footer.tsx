import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";

const DONATE_URL = "https://secure.winred.com/craft4commissioner/donate-today";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <img
              src="https://cdn.craft4commissioner.com/img/Artboard%201_1%4072x.webp"
              alt="Eric Craft for Barrow"
              className="h-16 w-auto mb-4 object-contain brightness-0 invert"
            />
            <p className="text-slate-400 mb-4">
              Faith. Family. Responsibility.
              <br />
              Dedicated to serving Barrow County.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-400 hover:text-white">Home</Link></li>
              <li><Link to="/priorities" className="text-slate-400 hover:text-white">Goals & Priorities</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white">About Eric</Link></li>
              <li>
                <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">
                  Donate
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-lg">Contact</h4>
            <p className="text-slate-400 mb-4">
              Email: eric@craft4commissioner.com<br />
              Phone: (678) 233-7220
            </p>
            <div className="flex space-x-4">
              <Link to="/facebook" className="text-slate-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={24} />
              </Link>
              <Link to="/instagram" className="text-slate-400 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={24} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p className="mb-2 border border-slate-700 inline-block px-4 py-1 rounded">
            Paid for by Craft For Commissioner
          </p>
          <p>
            &copy; {new Date().getFullYear()} Eric Craft for Commissioner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
