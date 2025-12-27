'use server';
/**
 * @fileOverview A flow for sending a contact message.
 *
 * - sendContactMessage - A function that handles sending the contact message.
 */

import {ai} from '@/ai/genkit';
import {
  SendContactMessageInputSchema,
  SendContactMessageOutputSchema,
  type SendContactMessageInput,
  type SendContactMessageOutput,
} from '@/ai/schemas/send-contact-message.ts';

export async function sendContactMessage(
  input: SendContactMessageInput
): Promise<SendContactMessageOutput> {
  return sendContactMessageFlow(input);
}

const sendContactMessageFlow = ai.defineFlow(
  {
    name: 'sendContactMessageFlow',
    inputSchema: SendContactMessageInputSchema,
    outputSchema: SendContactMessageOutputSchema,
  },
  async (input) => {
    // In a real application, you would integrate with an email sending service
    // like SendGrid, Resend, or AWS SES here.
    // For this example, we will just log the message to the console.
    console.log('New contact message:');
    console.log('Name:', input.name);
    console.log('Email:', input.email);
    console.log('Message:', input.message);
    console.log('Recipient: info@toraaglobal.com');

    // Simulate a successful email dispatch
    return { success: true };
  }
);
