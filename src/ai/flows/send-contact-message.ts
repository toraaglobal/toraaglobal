'use server';
/**
 * @fileOverview A flow for sending a contact message.
 *
 * - sendContactMessage - A function that handles sending the contact message.
 * - SendContactMessageInput - The input type for the sendContactMessage function.
 * - SendContactMessageOutput - The return type for the sendContactMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SendContactMessageInputSchema = z.object({
  name: z.string().describe('The name of the person sending the message.'),
  email: z.string().email().describe('The email of the person sending the message.'),
  message: z.string().describe('The message content.'),
});
export type SendContactMessageInput = z.infer<
  typeof SendContactMessageInputSchema
>;

export const SendContactMessageOutputSchema = z.object({
  success: z.boolean(),
});
export type SendContactMessageOutput = z.infer<
  typeof SendContactMessageOutputSchema
>;

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
