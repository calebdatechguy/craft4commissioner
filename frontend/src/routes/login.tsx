import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthLoginMutation, AuthLoginInputSchema } from "@/_generated/auth.service";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { mutateAsync: login, error: loginError } = useAuthLoginMutation();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: AuthLoginInputSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await login(value);
        navigate({ to: "/dashboard" });
      } catch (e) {
        // Explicitly handle the error to ensure the spinner stops and user gets feedback
        console.error("Login failed", e);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-blue-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold text-center text-blue-900">Admin Login</CardTitle>
          <p className="text-center text-slate-500 text-sm">Campaign Dashboard Access</p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            <form.Field
              name="username"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-700 font-semibold">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter your admin username"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="focus:ring-blue-500 border-slate-300"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-xs font-medium">{field.state.meta.errors[0]?.message}</p>
                  )}
                </div>
              )}
            />
            <form.Field
              name="password"
              children={(field) => (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="focus:ring-blue-500 border-slate-300"
                  />
                  {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                    <p className="text-red-500 text-xs font-medium">{field.state.meta.errors[0]?.message}</p>
                  )}
                </div>
              )}
            />
            
            {(loginError || (form.state.isSubmitted && !form.state.isValid)) && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium animate-in fade-in duration-300">
                {loginError ? "Login failed. Please check your credentials and try again." : "Please correct the errors in the form."}
              </div>
            )}

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button 
                  type="submit" 
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold h-12 text-lg shadow-lg hover:shadow-xl transition-all"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Authenticating...
                    </>
                  ) : (
                    "Login to Dashboard"
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
