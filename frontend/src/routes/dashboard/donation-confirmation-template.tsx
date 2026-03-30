import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Copy, Eye, Code, FileText } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/donation-confirmation-template")({
  component: DonationConfirmationTemplate,
});

function DonationConfirmationTemplate() {
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");

  const candidateName = "-candidate_name-";
  const firstName = "-first_name-";
  const amount = "$-amount-";

  const emailHtml = useMemo(() => `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #1e3a8a; padding: 40px 20px; text-align: center; color: white;">
        <img src="https://cdn.craft4commissioner.com/img/Artboard%201_1%4072x.webp" alt="Campaign Logo" style="max-width: 150px; height: auto; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 0.1em;">Platform for <span style="color: #ef4444;">${candidateName}</span></h1>
    </div>
    <div style="padding: 40px;">
        <p>Dear ${firstName},</p>
        <p>Thank you so much for your generous support of our campaign! Your contribution is more than just a donation; it's an investment in the future of our community.</p>
        
        <div style="background-color: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
            <div style="font-size: 14px; color: #64748b; margin-bottom: 5px;">Your Contribution Amount</div>
            <div style="font-size: 32px; font-weight: bold; color: #1e3a8a;">${amount}</div>
        </div>

        <p>Because of supporters like you, we are able to reach more voters, share our vision, and fight for what truly matters: responsible leadership, strong families, and doing the right thing at all costs.</p>
        
        <p>Every dollar helps us spread the word to win this race and ensure a better future for Barrow County. From the bottom of our hearts, thank you for standing with us. We couldn’t do this without you.</p>

        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <p style="margin: 0; font-weight: bold;">Sincerely,</p>
            <p style="margin: 0; color: #1e3a8a;">${candidateName}</p>
        </div>
    </div>
    <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 10px 0;">&copy; 2024 Paid for by the Committee to Elect ${candidateName}. All rights reserved.</p>
    </div>
</div>
  `.trim(), [candidateName, firstName, amount]);

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(emailHtml);
    toast.success("Template HTML copied to clipboard");
  }, [emailHtml]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-blue-900">Email Confirmation Template</h2>
          <p className="text-slate-600 mt-1">
            This template is sent to donors immediately after a successful contribution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "preview" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("preview")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant={viewMode === "code" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("code")}
          >
            <Code className="w-4 h-4 mr-2" />
            View HTML
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyCode}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Code
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {viewMode === "preview" ? (
          <div className="bg-slate-100 p-8 flex justify-center min-h-[600px]">
            <div 
              className="bg-white shadow-lg w-full max-w-[600px] h-fit rounded-lg overflow-hidden border border-slate-200"
              dangerouslySetInnerHTML={{ __html: emailHtml }}
            />
          </div>
        ) : (
          <div className="p-0">
            <pre className="p-6 bg-slate-950 text-slate-50 overflow-auto max-h-[700px] text-sm font-mono">
              {emailHtml}
            </pre>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-blue-600 w-5 h-5" />
            <h4 className="font-semibold text-blue-900">Placeholders Used</h4>
          </div>
          <ul className="text-sm space-y-2 text-blue-800">
            <li><code className="bg-blue-100 px-1 rounded">-first_name-</code> Donor's name</li>
            <li><code className="bg-blue-100 px-1 rounded">$-amount-</code> Donated amount</li>
            <li><code className="bg-blue-100 px-1 rounded">-candidate_name-</code> Campaign candidate</li>
          </ul>
        </div>
        <div className="col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-slate-900 mb-2">Usage Guidelines</h4>
          <p className="text-sm text-slate-600 italic">
            This HTML is structured for maximum compatibility across major email clients (Gmail, Outlook, Apple Mail). 
            It uses inline styles and a container-based layout to ensure consistent rendering. 
            The placeholders should be swapped out by the email delivery service before sending.
          </p>
        </div>
      </div>
    </div>
  );
}
