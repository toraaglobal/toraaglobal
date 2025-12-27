import Link from 'next/link';
import { Book, FileText, ArrowUpRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { resources } from '@/lib/data';
import { CallToAction } from '@/components/cta';

export const metadata = {
  title: 'Knowledge Base | ToraaGlobal Solutions',
  description: 'Explore curated technical papers and resources on Generative AI, Data Engineering, and more, selected by the Toraaglobal team.',
};

export default function ResourcesPage() {
  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Our Knowledge <span className="text-primary">Base</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            A curated selection of influential papers and resources that shape our
            approach to data and AI. We believe in standing on the shoulders of giants.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Card
              key={resource.title}
              className="flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <CardHeader>
                <div className="mb-4">
                  {resource.href.includes('amazon.com') || resource.href.includes('kimballgroup.com') ? (
                    <Book className="h-8 w-8 text-primary" />
                  ) : (
                    <FileText className="h-8 w-8 text-primary" />
                  )}
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <span className="font-semibold text-primary">Why it matters:</span>{' '}
                  {resource.summary}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Link
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center font-semibold text-primary hover:underline"
                >
                  Read More
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <CallToAction />
    </>
  );
}
