'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { assessCreditRisk, AssessCreditRiskOutput } from '@/ai/flows/assess-credit-risks-with-ai-data-analysis';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  file: z.any().refine(file => file?.length > 0, 'Financial data file is required.'),
});

export function CreditWiseForm() {
  const [result, setResult] = useState<AssessCreditRiskOutput | null>(null);
  const [isSubmitting, setIsSubmitting] =useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const fileRef = form.register("file");

  const readFileAsDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setResult(null);
    try {
      const file = values.file[0];
      const financialDataUri = await readFileAsDataURI(file);
      const output = await assessCreditRisk({ financialDataUri });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to assess credit risk. Please try again.',
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
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Financial Data</FormLabel>
                <FormControl>
                  <Input type="file" {...fileRef} accept=".csv,.json,.xls,.xlsx" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assessing Risk...
              </>
            ) : (
              'Assess Credit Risk'
            )}
          </Button>
        </form>
      </Form>
      {result && (
        <div>
          <h3 className="text-xl font-semibold mt-8 mb-4">Credit Risk Assessment</h3>
           <div className="bg-muted p-4 rounded-md space-y-4">
            <p className="text-sm whitespace-pre-wrap">{result.riskAssessment}</p>
          </div>
        </div>
      )}
    </div>
  );
}
