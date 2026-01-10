'use client';

import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { solutions } from '@/lib/data';
import { DataFlowDeltaForm } from '@/components/solutions/data-flow-delta-form';
import { ReguAssistForm } from '@/components/solutions/regu-assist-form';
import { CreditWiseForm } from '@/components/solutions/credit-wise-form';
import { IntelAdvisorForm } from '@/components/solutions/intel-advisor-form';
import { DataWarehouseQaForm } from '@/components/solutions/data-warehouse-qa-form';

const solutionComponents: Record<string, React.ReactNode> = {
  'Data & Warehouse Q&A': <DataWarehouseQaForm />,
  'Data-Flow Delta': <DataFlowDeltaForm />,
  'Regu-Assist': <ReguAssistForm />,
  'Credit-Wise': <CreditWiseForm />,
  'Intel Advisor': <IntelAdvisorForm />,
  // 'DataGenius': <DataGeniusForm />, // Placeholder if needed
};

export default function SolutionsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
        >
          The ToraaGlobal <span className="text-primary">Innovation Lab</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground"
        >
          Interact with our live AI demos. Experience firsthand how our solutions
          can transform your business operations and drive intelligent growth.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16"
      >
        <Tabs defaultValue={solutions[0].title} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 h-auto">
            {solutions.map((solution) => (
              <TabsTrigger key={solution.title} value={solution.title} className="py-2.5">
                <div className="flex items-center gap-2">
                  <solution.icon className="h-5 w-5" />
                  <span>{solution.title}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          {solutions.map((solution) => (
            <TabsContent key={solution.title} value={solution.title}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-8 rounded-lg border bg-card p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-foreground">{solution.title}</h2>
                <p className="mt-2 text-muted-foreground">{solution.description}</p>
                <div className="mt-8">{solutionComponents[solution.title]}</div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  );
}
