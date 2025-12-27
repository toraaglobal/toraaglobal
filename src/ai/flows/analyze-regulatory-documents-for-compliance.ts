'use server';

/**
 * @fileOverview A regulatory compliance analysis AI agent.
 *
 * - analyzeRegulatoryDocumentsForCompliance - A function that handles the regulatory document analysis process.
 * - AnalyzeRegulatoryDocumentsForComplianceInput - The input type for the analyzeRegulatoryDocumentsForCompliance function.
 * - AnalyzeRegulatoryDocumentsForComplianceOutput - The return type for the analyzeRegulatoryDocumentsForCompliance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeRegulatoryDocumentsForComplianceInputSchema = z.object({
  regulatoryDocumentDataUri: z
    .string()
    .describe(
      "A regulatory document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeRegulatoryDocumentsForComplianceInput = z.infer<typeof AnalyzeRegulatoryDocumentsForComplianceInputSchema>;

const AnalyzeRegulatoryDocumentsForComplianceOutputSchema = z.object({
  complianceAnalysis: z.string().describe('The analysis of the regulatory documents for compliance.'),
});
export type AnalyzeRegulatoryDocumentsForComplianceOutput = z.infer<typeof AnalyzeRegulatoryDocumentsForComplianceOutputSchema>;

export async function analyzeRegulatoryDocumentsForCompliance(input: AnalyzeRegulatoryDocumentsForComplianceInput): Promise<AnalyzeRegulatoryDocumentsForComplianceOutput> {
  return analyzeRegulatoryDocumentsForComplianceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeRegulatoryDocumentsForCompliancePrompt',
  input: {schema: AnalyzeRegulatoryDocumentsForComplianceInputSchema},
  output: {schema: AnalyzeRegulatoryDocumentsForComplianceOutputSchema},
  prompt: `You are an expert in regulatory compliance.

You will analyze the provided regulatory document to ensure compliance with industry standards.

Regulatory Document: {{media url=regulatoryDocumentDataUri}}`,
});

const analyzeRegulatoryDocumentsForComplianceFlow = ai.defineFlow(
  {
    name: 'analyzeRegulatoryDocumentsForComplianceFlow',
    inputSchema: AnalyzeRegulatoryDocumentsForComplianceInputSchema,
    outputSchema: AnalyzeRegulatoryDocumentsForComplianceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
