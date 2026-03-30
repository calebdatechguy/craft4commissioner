import { client as db } from "../../utils/db";
import { newsletterSubscriptions } from "../../db/schema";

interface SubscribeProps {
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Handles newsletter subscription by persisting to local database
 * and syncing with Mailchimp API.
 */
export async function subscribeToNewsletter({ email, firstName, lastName }: SubscribeProps) {
  // 1. Persist to local PostgreSQL database
  try {
    await db.insert(newsletterSubscriptions).values({
      email,
      firstName,
      lastName,
    }).onConflictDoUpdate({
      target: newsletterSubscriptions.email,
      set: { 
        firstName, 
        lastName,
      }
    });
    console.log(`[NEWSLETTER] User ${email} persisted to local database.`);
  } catch (error) {
    console.error("[NEWSLETTER] Local database persistence failed:", error);
  }

  // 2. Mailchimp API Integration
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) {
    console.warn("[NEWSLETTER] MAILCHIMP_API_KEY or MAILCHIMP_LIST_ID is not set. Mailchimp sync skipped.");
    return {
      success: true,
      message: "Thank you for subscribing! Your interest has been recorded.",
    };
  }

  const dc = apiKey.split("-")[1];
  if (!dc) {
    console.error("[NEWSLETTER] Invalid Mailchimp API Key format. Expected 'key-dc'.");
    return {
      success: false,
      message: "A configuration error occurred. Please try again later.",
    };
  }

  const mailchimpApiUrl = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;

  try {
    const authHeader = Buffer.from(`anyString:${apiKey}`).toString("base64");
    
    const response = await fetch(mailchimpApiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      }),
    });

    const responseData = (await response.json()) as {
      title?: string;
      detail?: string;
    };

    if (!response.ok) {
      if (responseData.title === "Member Exists") {
        console.log(`[NEWSLETTER] User ${email} already present in Mailchimp list.`);
        return {
          success: true,
          message: "You are already subscribed to our newsletter. Thank you for your continued support!",
        };
      }

      console.error("[NEWSLETTER] Mailchimp API Error:", responseData);
      throw new Error(responseData.detail || "Failed to sync with Mailchimp.");
    }

    console.log(`[NEWSLETTER] Successfully added ${email} to Mailchimp list ${listId}.`);
    return {
      success: true,
      message: "Thank you for subscribing to the Eric Craft for Commissioner newsletter!",
    };
  } catch (error) {
    console.error("[NEWSLETTER] Mailchimp API Integration failed:", error);
    return {
      success: true,
      message: "Thank you for subscribing! We've received your request.",
    };
  }
}
