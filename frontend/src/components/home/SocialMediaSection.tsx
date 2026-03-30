import React from 'react';
import { Facebook, Instagram, ExternalLink } from 'lucide-react';

const SocialMediaSection: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 tracking-tight">Stay Connected</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Follow the campaign on social media for real-time updates, event photos, and direct access to Eric. 
            Join the conversation as we work together to build a better future for our district.
          </p>
        </div>

        {/* Primary Social Links */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
          <a
            href="https://www.facebook.com/profile.php?id=61586773749795"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center p-8 bg-blue-600 rounded-3xl text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="bg-white/20 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
              <Facebook size={32} />
            </div>
            <span className="text-2xl font-bold mb-1">Facebook</span>
            <span className="text-blue-100 flex items-center gap-1">
              Follow Eric Craft <ExternalLink size={14} />
            </span>
          </a>

          <a
            href="https://www.instagram.com/craft4commissioner/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center p-8 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-3xl text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="bg-white/20 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
              <Instagram size={32} />
            </div>
            <span className="text-2xl font-bold mb-1">Instagram</span>
            <span className="text-purple-100 flex items-center gap-1">
              @craft4commissioner <ExternalLink size={14} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default React.memo(SocialMediaSection);
