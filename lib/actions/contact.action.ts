'use server';

import { sendContactUsEmail } from "@/lib/nodemailer";

export async function submitContactForm(data: { name: string; email: string; message: string }) {
    try {
        if (!data.name || !data.email || !data.message) {
            return { success: false, error: 'All fields are required.' };
        }

        // Call our internal backend logic via Nodemailer to send securely
        await sendContactUsEmail({
            name: data.name,
            email: data.email,
            message: data.message,
        });

        return { success: true };
    } catch (error: any) {
        console.error('Failed to submit contact form:', error);
        return { success: false, error: error?.message || 'Failed to submit the form.' };
    }
}
