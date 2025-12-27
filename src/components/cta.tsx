import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-card p-8 text-center shadow-lg md:p-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Ready to Scale?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Let's build your data-driven future together. Unlock the power of
            your data and accelerate your growth with our expertise in Data
            Engineering and Generative AI.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild size="lg">
              <Link href="/contact">
                Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
