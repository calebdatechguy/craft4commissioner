import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle, Mail } from "lucide-react";
import Hero from "@/components/layout/Hero";
import { useState, useCallback, useMemo } from "react";
import { 
  useDonationCaptureDonationLeadMutation,
  DonationCaptureDonationLeadInputSchema
} from "@/_generated/donation.service";

import { SocialProofBubbles } from "@/components/donations/SocialProofBubbles";

export const Route = createFileRoute("/donate")({
  beforeLoad: () => {
    throw redirect({
      href: "https://secure.winred.com/craft4commissioner/donate-today",
      code: 301,
    });
  },
  component: Donate,
});

const leadSchema = DonationCaptureDonationLeadInputSchema;

function Donate() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutateAsync: captureLead } = useDonationCaptureDonationLeadMutation();

  const handleSubmit = useCallback(async ({ value }: { value: z.infer<typeof leadSchema> }) => {
    try {
      await captureLead(value);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Lead capture failed:", error);
    }
  }, [captureLead]);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      expectedAmount: 50,
    },
    validators: {
      onChange: leadSchema,
    },
    onSubmit: handleSubmit,
  });

  const successContent = useMemo(() => (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-900">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Success!</h2>
        <p className="text-slate-600 mb-6">
          Thank you! We will email you as soon as online giving is live.
        </p>
        <Button 
          onClick={() => {
            setIsSubmitted(false);
            form.reset();
          }}
          className="bg-blue-900 hover:bg-blue-800"
        >
          Back to Donate Page
        </Button>
      </div>
    </div>
  ), [form]);

  if (isSubmitted) {
    return (
      <div className="bg-white min-h-screen">
        <Hero
          showLogo={true}
          title="Support the Campaign"
          subtitle="Coming Soon"
          description="Online giving will be available shortly. Join our notification list to be the first to know."
          backgroundImage="https://cdn.craft4commissioner.com/img/EricWebsitePics-2.avif"
        />
        {successContent}
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Hero
        showLogo={true}
        title="Support the Campaign"
        subtitle="Online Giving Coming Soon"
        description="We are currently setting up our secure payment system. Please let us know if you'd like to be notified as soon as we're live."
        backgroundImage="https://cdn.craft4commissioner.com/img/EricWebsitePics-2.avif"
      />

      <div className="bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
              <Mail className="h-8 w-8 text-blue-900" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Join Our Giving List</h2>
            <p className="text-slate-600 text-lg">
              Enter your email and let us know your planned contribution amount. We'll reach out once we can accept your gift.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="shadow-lg border-t-4 border-red-600">
              <CardHeader>
                <CardTitle>Register Your Interest</CardTitle>
                <CardDescription>We'll notify you when online giving is available.</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.Field
                      name="firstName"
                      children={(field) => (
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
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
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
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
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
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

                  <div>
                    <Label className="text-base font-semibold mb-3 block">Planned Donation Amount</Label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[25, 50, 100, 250, 500, 1000].map((amt) => (
                        <form.Field
                          key={amt}
                          name="expectedAmount"
                          children={(field) => (
                            <Button
                              type="button"
                              variant={field.state.value === amt ? "default" : "outline"}
                              className={field.state.value === amt ? "bg-blue-900 hover:bg-blue-800" : ""}
                              onClick={() => field.handleChange(amt)}
                            >
                              ${amt}
                            </Button>
                          )}
                        />
                      ))}
                    </div>
                    <form.Field
                      name="expectedAmount"
                      children={(field) => (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-bold">$</span>
                          <Input
                            type="number"
                            placeholder="Other Amount"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                          />
                        </div>
                      )}
                    />
                    <form.Field
                      name="expectedAmount"
                      children={(field) => (
                        field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
                          <p className="text-red-500 text-xs mt-1">{field.state.meta.errors[0]?.message}</p>
                        ) : null
                      )}
                    />
                  </div>

                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                      <Button 
                        type="submit" 
                        disabled={!canSubmit || isSubmitting}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg mt-6"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Notify Me"
                        )}
                      </Button>
                    )}
                  />
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <SocialProofBubbles />
    </div>
  );
}
