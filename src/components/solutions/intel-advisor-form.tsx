'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { provideStrategicRecommendations, StrategicRecommendationsOutput } from '@/ai/flows/provide-strategic-recommendations-from-operational-data';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  file: z.any().refine(file => file?.length > 0, 'Operational data file is required.'),
  industry: z.string().min(3, { message: 'Industry must be at least 3 characters.' }),
  businessGoals: z.string().min(10, { message: 'Business goals must be at least 10 characters.' }),
});

export function IntelAdvisorForm() {
  const [result, setResult] = useState<StrategicRecommendationsOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: 'E-commerce',
      businessGoals: 'Increase customer retention by 15% and reduce operational costs by 10% in the next quarter.',
    },
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
      const operationalData = await readFileAsDataURI(file);
      const output = await provideStrategicRecommendations({
        operationalData,
        industry: values.industry,
        businessGoals: values.businessGoals,
      });
      setResult(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to generate recommendations. Please try again.',
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Industry</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Finance, Healthcare" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Operational Data</FormLabel>
                  <FormControl>
                    <Input type="file" {...fileRef} accept=".csv,.json,.xls,.xlsx" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="businessGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Business Goals</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Increase efficiency, reduce churn..." rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Recommendations...
              </>
            ) : (
              'Get Strategic Recommendations'
            )}
          </Button>
        </form>
      </Form>
      {result && (
        <div>
          <h3 className="text-xl font-semibold mt-8 mb-4">Strategic Recommendations</h3>
          <div className="bg-muted p-4 rounded-md space-y-4">
             <p className="text-sm whitespace-pre-wrap">{result.recommendations}</p>
          </div>
        </div>
      )}
    </div>
  );
}
