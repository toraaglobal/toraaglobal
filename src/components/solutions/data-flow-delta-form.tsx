'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generatePythonScript, GeneratePythonScriptOutput } from '@/ai/flows/generate-python-script-from-requirements';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  requirements: z.string().min(20, { message: 'Requirements must be at least 20 characters.' }),
});

export function DataFlowDeltaForm() {
  const [result, setResult] = useState<GeneratePythonScriptOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requirements: 'Create a Python script that reads a CSV file named "input.csv", filters rows where the "age" column is greater than 30, and saves the result to a new CSV file named "output.csv". The script should use the pandas library.',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setResult(null);
    try {
      const output = await generatePythonScript(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate script. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Data Flow Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., A script to read a CSV, process it with pandas, and save the output..."
                    rows={8}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Script...
              </>
            ) : (
              'Generate Python Script'
            )}
          </Button>
        </form>
      </Form>
      {result && (
        <div>
          <h3 className="text-xl font-semibold mt-8 mb-4">Generated Python Script</h3>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code className="font-code text-sm">{result.script}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
