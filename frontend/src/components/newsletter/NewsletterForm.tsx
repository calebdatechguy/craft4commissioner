import React, { useCallback, useState, useMemo } from 'react';
import { useForm, revalidateLogic } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useNewsletterSubscribeMutation, NewsletterSubscribeInputSchema } from '@/_generated/newsletter.service';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * NewsletterForm Component
 * 
 * Modernized Mailchimp integration:
 * 1. Uses TanStack Forms + Zod for robust client-side validation.
 * 2. Leverages the backend-driven API integration via useNewsletterSubscribeMutation.
 * 3. Removes all legacy jQuery/Mailchimp script dependencies.
 * 4. Maintains patriotic campaign design identity.
 */
export const NewsletterForm: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const subscribeMutation = useNewsletterSubscribeMutation();

  const form = useForm({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: NewsletterSubscribeInputSchema,
    },
    onSubmit: async ({ value }) => {
      setErrorMessage(null);
      try {
        const result = await subscribeMutation.mutateAsync(value);
        if (result.success) {
          setIsSuccess(true);
        } else {
          setErrorMessage(result.message || 'Something went wrong. Please try again.');
        }
      } catch (error) {
        console.error('Subscription failed:', error);
        setErrorMessage('Unable to process your subscription at this time. Please try again later.');
      }
    },
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }, [form]);

  // Memoized success UI
  const SuccessCard = useMemo(() => (
    <section className="bg-slate-50 py-16 border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="bg-white p-12 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">You're on the list!</h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Thank you for joining Eric Craft's campaign. We've sent a confirmation email to your inbox.
          </p>
          <Button 
            variant="outline" 
            className="mt-8"
            onClick={() => setIsSuccess(false)}
          >
            Back to site
          </Button>
        </div>
      </div>
    </section>
  ), []);

  if (isSuccess) return SuccessCard;

  return (
    <section className="bg-slate-50 py-16 border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
            Stay Connected to <span className="text-red-600">The Cause</span>
          </h2>
          <div className="w-32 h-1.5 bg-blue-900 mx-auto mb-6"></div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Join Eric Craft's movement for Barrow County. Receive critical campaign updates, event notifications, and mission progress.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative">
          {/* Patriotic Accent Header */}
          <div className="h-2 w-full bg-gradient-to-r from-blue-900 via-slate-200 to-red-600" />
          
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <form.Field
                  name="firstName"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name} className="text-slate-800 font-bold text-xs uppercase tracking-widest">
                        First Name <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id={field.name}
                        placeholder="John"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={cn(
                          "h-14 border-slate-300 focus:border-blue-900 focus:ring-blue-900 text-lg transition-all shadow-sm",
                          field.state.meta.isTouched && field.state.meta.errors.length > 0 && "border-red-500"
                        )}
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-red-600 text-xs font-bold mt-1">
                          {field.state.meta.errors.map(err => String(err)).join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                />

                <form.Field
                  name="lastName"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name} className="text-slate-800 font-bold text-xs uppercase tracking-widest">
                        Last Name <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id={field.name}
                        placeholder="Doe"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={cn(
                          "h-14 border-slate-300 focus:border-blue-900 focus:ring-blue-900 text-lg transition-all shadow-sm",
                          field.state.meta.isTouched && field.state.meta.errors.length > 0 && "border-red-500"
                        )}
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-red-600 text-xs font-bold mt-1">
                          {field.state.meta.errors.map(err => String(err)).join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                />

                <form.Field
                  name="email"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label htmlFor={field.name} className="text-slate-800 font-bold text-xs uppercase tracking-widest">
                        Email Address <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id={field.name}
                        type="email"
                        placeholder="john.doe@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={cn(
                          "h-14 border-slate-300 focus:border-blue-900 focus:ring-blue-900 text-lg transition-all shadow-sm",
                          field.state.meta.isTouched && field.state.meta.errors.length > 0 && "border-red-500"
                        )}
                      />
                      {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                        <p className="text-red-600 text-xs font-bold mt-1">
                          {field.state.meta.errors.map(err => String(err)).join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4 border-t border-slate-100">
                <div className="text-slate-500 text-sm max-w-md">
                  <p className="leading-relaxed">
                    By subscribing, you agree to receive campaign communications. 
                    <span className="block font-bold mt-1 text-slate-700">Freedom & Integrity for Barrow County.</span>
                  </p>
                </div>

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button
                      type="submit"
                      disabled={!canSubmit || subscribeMutation.isLoading}
                      className="w-full md:w-auto h-16 px-12 bg-red-600 hover:bg-red-700 text-white font-black text-xl uppercase tracking-tighter rounded-xl shadow-xl transition-all hover:scale-[1.03] active:scale-[0.97]"
                    >
                      {isSubmitting || subscribeMutation.isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Secure Your Update'
                      )}
                    </Button>
                  )}
                />
              </div>
            </form>
          </div>
        </div>
        
        <p className="mt-8 text-center text-slate-400 text-sm font-medium">
          Official Campaign Newsletter of Eric Craft for Commissioner. &copy; {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
};

