import { Server } from "zynapse/server";
import apiSchema from "@/api.schema";
import { donationImplementation } from "./implementations/donation.service";
import { contactImplementation } from "./implementations/contact.service";
import { campaignImplementation } from "./implementations/campaign.service";
import { newsletterImplementation } from "./implementations/newsletter.service";
import { authImplementation } from "./implementations/auth.service";

const server = new Server(apiSchema, {
  Donation: donationImplementation,
  Contact: contactImplementation,
  Campaign: campaignImplementation,
  Newsletter: newsletterImplementation,
  Auth: authImplementation,
});

server.registerWebhookHandler(async function (req) {
  console.log(`Webhook received\n${await req.text()}`);
  return new Response(null, {
    status: 200,
  });
});

server.start();
