'use server';

/**
 * @fileOverview This file defines a Genkit flow that analyzes operational data and provides strategic recommendations for business optimization.
 *
 * - provideStrategicRecommendations - An async function that takes operational data as input and returns strategic recommendations.
 * - StrategicRecommendationsInput - The input type for the provideStrategicRecommendations function.
 * - StrategicRecommendationsOutput - The output type for the provideStrategicRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StrategicRecommendationsInputSchema = z.object({
  operationalData: z
    .string()
    .describe(
      'The operational data to be analyzed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /* Data URI for operational data */
    ),
  industry: z.string().describe('The industry of the business.'),
  businessGoals: z.string().describe('The specific goals of the business.'),
});
export type StrategicRecommendationsInput = z.infer<typeof StrategicRecommendationsInputSchema>;

const StrategicRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('Strategic recommendations for optimizing business operations based on the analyzed data.'),
});
export type StrategicRecommendationsOutput = z.infer<typeof StrategicRecommendationsOutputSchema>;

export async function provideStrategicRecommendations(
  input: StrategicRecommendationsInput
): Promise<StrategicRecommendationsOutput> {
  return provideStrategicRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'strategicRecommendationsPrompt',
  input: {schema: StrategicRecommendationsInputSchema},
  output: {schema: StrategicRecommendationsOutputSchema},
  prompt: `You are an AI-powered strategic advisor. Your task is to analyze operational data and provide strategic recommendations for optimizing business operations, which should align with the given business goals. Use the information to provide recommendations.

Industry: {{{industry}}}
Business Goals: {{{businessGoals}}}
Operational Data: {{media url=operationalData}}

Provide strategic recommendations for optimizing the business operations:
`,
});

const provideStrategicRecommendationsFlow = ai.defineFlow(
  {
    name: 'provideStrategicRecommendationsFlow',
    inputSchema: StrategicRecommendationsInputSchema,
    outputSchema: StrategicRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
