'use server';

/**
 * @fileOverview An AI-powered credit risk assessment flow.
 *
 * - assessCreditRisk - A function that handles the credit risk assessment process.
 * - AssessCreditRiskInput - The input type for the assessCreditRisk function.
 * - AssessCreditRiskOutput - The return type for the assessCreditRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessCreditRiskInputSchema = z.object({
  financialDataUri: z
    .string()
    .describe(
      'The financial data as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'  
    ),
});
export type AssessCreditRiskInput = z.infer<typeof AssessCreditRiskInputSchema>;

const AssessCreditRiskOutputSchema = z.object({
  riskAssessment: z.string().describe('The AI-assessed credit risk and potential defaults.'),
});
export type AssessCreditRiskOutput = z.infer<typeof AssessCreditRiskOutputSchema>;

export async function assessCreditRisk(input: AssessCreditRiskInput): Promise<AssessCreditRiskOutput> {
  return assessCreditRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessCreditRiskPrompt',
  input: {schema: AssessCreditRiskInputSchema},
  output: {schema: AssessCreditRiskOutputSchema},
  prompt: `You are an AI expert in financial risk assessment. Analyze the provided financial data to assess credit risks and potential defaults.

Financial Data: {{media url=financialDataUri}}

Provide a detailed risk assessment based on the data.`, 
});

const assessCreditRiskFlow = ai.defineFlow(
  {
    name: 'assessCreditRiskFlow',
    inputSchema: AssessCreditRiskInputSchema,
    outputSchema: AssessCreditRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
