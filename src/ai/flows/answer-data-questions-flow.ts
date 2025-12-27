'use server';

/**
 * @fileOverview An AI flow to answer questions about data engineering and data warehousing.
 *
 * - answerDataQuestion - A function that answers a user's question.
 * - AnswerDataQuestionInput - The input type for the answerDataQuestion function.
 * - AnswerDataQuestionOutput - The return type for the answerDataQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerDataQuestionInputSchema = z.object({
  question: z.string().describe('The user\'s question about data engineering or data warehousing.'),
});
export type AnswerDataQuestionInput = z.infer<typeof AnswerDataQuestionInputSchema>;

const AnswerDataQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the question.'),
});
export type AnswerDataQuestionOutput = z.infer<typeof AnswerDataQuestionOutputSchema>;

export async function answerDataQuestion(input: AnswerDataQuestionInput): Promise<AnswerDataQuestionOutput> {
  return answerDataQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerDataQuestionPrompt',
  input: {schema: AnswerDataQuestionInputSchema},
  output: {schema: AnswerDataQuestionOutputSchema},
  prompt: `You are an expert data engineer and data warehousing specialist from ToraaGlobal. Your purpose is to answer questions from potential clients to demonstrate your deep expertise in these fields.

  When answering, be clear, concise, and professional. Start with a direct answer, then provide a brief, helpful explanation.

  User's Question: {{{question}}}
  `,
});

const answerDataQuestionFlow = ai.defineFlow(
  {
    name: 'answerDataQuestionFlow',
    inputSchema: AnswerDataQuestionInputSchema,
    outputSchema: AnswerDataQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
