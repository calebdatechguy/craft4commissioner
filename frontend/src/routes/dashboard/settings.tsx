import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useAuthUpdatePasswordMutation } from "@/_generated/auth.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { mutateAsync: updatePassword } = useAuthUpdatePasswordMutation();

  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onChange: z.object({
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Confirm password is required"),
      }).refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        await updatePassword({ newPassword: value.newPassword });
        toast.success("Password updated successfully");
        form.reset();
      } catch (error) {
        toast.error("Failed to update password");
        console.error(error);
      }
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-800">Settings</h2>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="newPassword"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>New Password</Label>
                  <Input
                    id={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length ? (
                    <p className="text-sm text-red-500">{field.state.meta.errors.map((e) => e?.message).join(", ")}</p>
                  ) : null}
                </div>
              )}
            />
            <form.Field
              name="confirmPassword"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Confirm Password</Label>
                  <Input
                    id={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length ? (
                    <p className="text-sm text-red-500">{field.state.meta.errors.map((e) => e?.message).join(", ")}</p>
                  ) : null}
                </div>
              )}
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
