import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useAuthGetProfileQuery, useAuthLogoutMutation } from "@/_generated/auth.service";
import { Button } from "@/components/ui/button";
import { Loader2, LayoutDashboard, Users, Mail, LogOut, Settings, FileText } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useAuthGetProfileQuery({});
  const { mutateAsync: logout } = useAuthLogoutMutation();

  useEffect(() => {
    if (isError) {
      navigate({ to: "/login" });
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-900" />
      </div>
    );
  }

  if (!profile) {
    return null; // Will redirect via useEffect
  }

  const handleLogout = async () => {
    await logout({});
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold">Campaign Admin</h1>
          <p className="text-sm text-blue-200 mt-1">Welcome, {profile.username}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            activeProps={{ className: "bg-blue-800 text-white" }}
            inactiveProps={{ className: "text-blue-100 hover:bg-blue-800 hover:text-white" }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          >
            <LayoutDashboard size={20} />
            Overview
          </Link>
          <Link
            to="/dashboard/donations"
            activeProps={{ className: "bg-blue-800 text-white" }}
            inactiveProps={{ className: "text-blue-100 hover:bg-blue-800 hover:text-white" }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          >
            <Users size={20} />
            Donation Leads
          </Link>
          <Link
            to="/dashboard/newsletter"
            activeProps={{ className: "bg-blue-800 text-white" }}
            inactiveProps={{ className: "text-blue-100 hover:bg-blue-800 hover:text-white" }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          >
            <Mail size={20} />
            Newsletter
          </Link>
          <Link
            to="/dashboard/donation-confirmation-template"
            activeProps={{ className: "bg-blue-800 text-white" }}
            inactiveProps={{ className: "text-blue-100 hover:bg-blue-800 hover:text-white" }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          >
            <FileText size={20} />
            Email Template
          </Link>
          <Link
            to="/dashboard/settings"
            activeProps={{ className: "bg-blue-800 text-white" }}
            inactiveProps={{ className: "text-blue-100 hover:bg-blue-800 hover:text-white" }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
          >
            <Settings size={20} />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-blue-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-blue-100 hover:bg-blue-800 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-auto min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
