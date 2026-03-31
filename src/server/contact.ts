import { HttpStatusCode } from "#/constants/http";
import { jsonOk } from "#/constants/json";
import { env } from "#/constants/env";
import { badRequestError } from "#/errors/app-error";
import { catchAsyncFn } from "#/errors/error-handler";
import { sendEmail } from "#/lib/mailer";
import type { ServerOk } from "#/server/_types";
import { contactSchema } from "#/validation/contact.schema";
import { createServerFn } from "@tanstack/react-start";

const MIN_FORM_FILL_MS = 1_500;

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator(contactSchema)
  .handler(
    catchAsyncFn(async ({ data }): ServerOk<{ delivered: boolean }> => {
      // Bots often fill and submit instantly; we silently accept honeypot hits.
      if (data.honeypot?.trim()) {
        return jsonOk({
          data: { delivered: true },
          status: HttpStatusCode.CREATED,
          message: "Message sent successfully",
        });
      }

      if (Date.now() - data.formStartedAt < MIN_FORM_FILL_MS) {
        throw badRequestError("Please wait a moment and try again.");
      }

      if (!env.CONTACT_TO_EMAIL) {
        throw badRequestError("Contact inbox is not configured.");
      }

      const escapedMessage = data.message
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\n", "<br />");

      await sendEmail({
        to: env.CONTACT_TO_EMAIL,
        subject: `[StoryNest Contact] ${data.subject}`,
        html: `
          <h2>New StoryNest contact message</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong><br/>${escapedMessage}</p>
        `,
        replyTo: data.email,
      });

      return jsonOk({
        data: { delivered: true },
        status: HttpStatusCode.CREATED,
        message: "Message sent successfully",
      });
    }),
  );
