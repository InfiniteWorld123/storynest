import { env } from "#/constants/env";
import { Resend } from "resend";
import { handleError } from "./error-handler";

const resend = new Resend(env.RESEND);

type SendEmailProps = {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailProps) => {
    try {
        const { error } = await resend.emails.send({
            from: "Yaman Warda <noreply@yamanwarda.dev>",
            to,
            subject,
            html,
        })
        if (error) throw error;
    } catch (error) {
        throw handleError(error);
    }
}