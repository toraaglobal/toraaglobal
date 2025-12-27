'use server';
/**
 * @fileOverview Generates a Python script based on user-provided data flow requirements.
 *
 * - generatePythonScript - A function that generates a Python script from requirements.
 * - GeneratePythonScriptInput - The input type for the generatePythonScript function.
 * - GeneratePythonScriptOutput - The return type for the generatePythonScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePythonScriptInputSchema = z.object({
  requirements: z
    .string()
    .describe('The data flow requirements for the Python script.'),
});
export type GeneratePythonScriptInput = z.infer<typeof GeneratePythonScriptInputSchema>;

const GeneratePythonScriptOutputSchema = z.object({
  script: z
    .string()
    .describe('The generated Python script that automates the data flow.'),
});
export type GeneratePythonScriptOutput = z.infer<typeof GeneratePythonScriptOutputSchema>;

export async function generatePythonScript(input: GeneratePythonScriptInput): Promise<GeneratePythonScriptOutput> {
  return generatePythonScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePythonScriptPrompt',
  input: {schema: GeneratePythonScriptInputSchema},
  output: {schema: GeneratePythonScriptOutputSchema},
  prompt: `You are an AI expert in generating Python scripts for automating data flow processes.

  Based on the following requirements, generate a Python script that addresses them:

  Requirements: {{{requirements}}}

  Ensure the script is well-documented and efficient.
  Do not include libraries that are not commonly used in similar data transformations.
  If the requirements mention a specific library, be sure to include it.
  `,
});

const generatePythonScriptFlow = ai.defineFlow(
  {
    name: 'generatePythonScriptFlow',
    inputSchema: GeneratePythonScriptInputSchema,
    outputSchema: GeneratePythonScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
