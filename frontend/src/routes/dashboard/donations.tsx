import { createFileRoute } from "@tanstack/react-router";
import { useDonationGetDonationLeadsQuery, useDonationDeleteDonationLeadMutation, useDonationCaptureDonationLeadMutation, DonationCaptureDonationLeadInputSchema } from "@/_generated/donation.service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useForm } from "@tanstack/react-form";

export const Route = createFileRoute("/dashboard/donations")({
  component: DonationLeads,
});

function DonationLeads() {
  const [page, setPage] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const limit = 20;
  
  const { data, isLoading, refetch } = useDonationGetDonationLeadsQuery({
    limit,
    offset: page * limit,
  });

  const { mutateAsync: deleteLead } = useDonationDeleteDonationLeadMutation();
  const { mutateAsync: createLead } = useDonationCaptureDonationLeadMutation();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      await deleteLead({ id });
      refetch();
    }
  };

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      expectedAmount: 0,
    },
    validators: {
      onChange: DonationCaptureDonationLeadInputSchema,
    },
    onSubmit: async ({ value }) => {
      await createLead(value);
      setIsCreateOpen(false);
      form.reset();
      refetch();
    },
  });

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Donation Leads</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-900 hover:bg-blue-800">
              <Plus className="mr-2 h-4 w-4" /> Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Donation Lead</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="firstName"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-red-500 text-xs">{field.state.meta.errors[0]?.message}</p>
                      )}
                    </div>
                  )}
                />
                <form.Field
                  name="lastName"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-red-500 text-xs">{field.state.meta.errors[0]?.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
              <form.Field
                name="email"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-xs">{field.state.meta.errors[0]?.message}</p>
                    )}
                  </div>
                )}
              />
              <form.Field
                name="expectedAmount"
                children={(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="expectedAmount">Expected Amount</Label>
                    <Input
                      id="expectedAmount"
                      type="number"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-xs">{field.state.meta.errors[0]?.message}</p>
                    )}
                  </div>
                )}
              />
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                    Save Lead
                  </Button>
                )}
              />
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{format(new Date(lead.createdAt), "MMM d, yyyy")}</TableCell>
                <TableCell>{lead.firstName} {lead.lastName}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>${lead.expectedAmount}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(lead.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data?.leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No donation leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-slate-600">
          Page {page + 1}
        </span>
        <Button
          variant="outline"
          disabled={!data || data.leads.length < limit}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
