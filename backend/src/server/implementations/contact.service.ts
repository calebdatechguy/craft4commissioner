import { ServiceImplementationBuilder } from "zynapse/server";
import { contactService } from "../../api_schema/contact";
import { client as db } from "../../utils/db";
import { contacts } from "../../db/schema";

export const contactImplementation = new ServiceImplementationBuilder(contactService)
  .registerProcedureImplementation("SubmitInquiry", async (input) => {
    const { name, email, phone, subject, message } = input;

    const result = await db.insert(contacts).values({
      name,
      email,
      phone,
      subject,
      message,
    }).returning({ id: contacts.id });

    return {
      success: true,
      ticketId: result[0].id.toString(),
    };
  })
  .build();
