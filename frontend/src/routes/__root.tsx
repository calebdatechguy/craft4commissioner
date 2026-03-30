import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { Toaster } from "@/components/ui/sonner";

function RootComponent() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 border-none">
      <Navbar />
      <main className="flex-grow border-none">
        <Outlet />
      </main>
      <NewsletterForm />
      <Footer />
      <Toaster />
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
