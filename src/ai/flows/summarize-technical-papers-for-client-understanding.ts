'use server';

/**
 * @fileOverview A flow to summarize technical papers for client understanding.
 *
 * - summarizeTechnicalPaper - A function that handles the summarization process.
 * - SummarizeTechnicalPaperInput - The input type for the summarizeTechnicalPaper function.
 * - SummarizeTechnicalPaperOutput - The return type for the summarizeTechnicalPaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTechnicalPaperInputSchema = z.object({
  paperTitle: z.string().describe('The title of the technical paper.'),
  paperAbstract: z.string().describe('The abstract of the technical paper.'),
});
export type SummarizeTechnicalPaperInput = z.infer<
  typeof SummarizeTechnicalPaperInputSchema
>;

const SummarizeTechnicalPaperOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A one-sentence summary of the technical paper, explaining its relevance to Toraaglobal clients.'
    ),
  progress: z.string().describe('Progress of the summarization process.'),
});
export type SummarizeTechnicalPaperOutput = z.infer<
  typeof SummarizeTechnicalPaperOutputSchema
>;

export async function summarizeTechnicalPaper(
  input: SummarizeTechnicalPaperInput
): Promise<SummarizeTechnicalPaperOutput> {
  return summarizeTechnicalPaperFlow(input);
}

const summarizeTechnicalPaperPrompt = ai.definePrompt({
  name: 'summarizeTechnicalPaperPrompt',
  input: {schema: SummarizeTechnicalPaperInputSchema},
  output: {schema: SummarizeTechnicalPaperOutputSchema},
  prompt: `You are an expert B2B copywriter specializing in High-Tech AI and Data Engineering firms.  Your goal is to summarize technical papers in a way that highlights their relevance to Toraaglobal's clients.

  Paper Title: {{{paperTitle}}}
  Paper Abstract: {{{paperAbstract}}}

  Provide a one-sentence summary explaining why this paper matters to Toraaglobal’s clients.`,
});

const summarizeTechnicalPaperFlow = ai.defineFlow(
  {
    name: 'summarizeTechnicalPaperFlow',
    inputSchema: SummarizeTechnicalPaperInputSchema,
    outputSchema: SummarizeTechnicalPaperOutputSchema,
  },
  async input => {
    const {output} = await summarizeTechnicalPaperPrompt(input);
    // Add progress information to the output.
    output!.progress = 'Generated a one-sentence summary of the technical paper.';
    return output!;
  }
);
