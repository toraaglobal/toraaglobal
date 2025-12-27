'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { answerDataQuestion, AnswerDataQuestionOutput } from '@/ai/flows/answer-data-questions-flow';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  question: z.string().min(10, { message: 'Question must be at least 10 characters.' }),
});

export function DataWarehouseQaForm() {
  const [result, setResult] = useState<AnswerDataQuestionOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: 'What is the difference between a data warehouse and a data lake?',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setResult(null);
    try {
      const output = await answerDataQuestion(values);
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to get an answer. Please try again.',
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
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Your Question</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., What are the benefits of a cloud data warehouse?"
                    rows={4}
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
                Getting Answer...
              </>
            ) : (
              'Ask Our AI Expert'
            )}
          </Button>
        </form>
      </Form>
      {result && (
        <div>
          <h3 className="text-xl font-semibold mt-8 mb-4">Expert Answer</h3>
          <div className="bg-muted p-4 rounded-md space-y-4">
             <p className="text-sm whitespace-pre-wrap">{result.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
