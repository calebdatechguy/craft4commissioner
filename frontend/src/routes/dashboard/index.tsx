import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-800">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Donation Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Manage people who have pledged to donate.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Newsletter Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Manage your newsletter subscribers.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
