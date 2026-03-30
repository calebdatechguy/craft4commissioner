import { APISchema } from "zynapse/schema";
import { donationService } from "./api_schema/donations";
import { contactService } from "./api_schema/contact";
import { campaignService } from "./api_schema/campaign";
import { newsletterService } from "./api_schema/newsletter";
import { authService } from "./api_schema/auth";

// COMMENT: Main API Schema for the Eric Craft Campaign Website.
// Integrates services for donations, contact forms, campaign content, newsletter, and authentication.
const apiSchema = new APISchema({
  Donation: donationService,
  Contact: contactService,
  Campaign: campaignService,
  Newsletter: newsletterService,
  Auth: authService,
});

export default apiSchema;
