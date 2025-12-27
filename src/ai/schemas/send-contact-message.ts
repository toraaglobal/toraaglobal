import {z} from 'genkit';

/**
 * @fileOverview Schemas for sending a contact message.
 *
 * - SendContactMessageInputSchema - The input schema for the sendContactMessage function.
 * - SendContactMessageInput - The input type for the sendContactMessage function.
 * - SendContactMessageOutputSchema - The output schema for the sendContactMessage function.
 * - SendContactMessageOutput - The return type for the sendContactMessage function.
 */

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
