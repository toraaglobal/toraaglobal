import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { services, solutions } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CallToAction } from '@/components/cta';
import { cn } from '@/lib/utils';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <div className="flex flex-col">
      <HeroSection heroImage={heroImage} />
      <ServicesSection />
      <SolutionsSection />
      <CallToAction />
    </div>
  );
}

function HeroSection({ heroImage }: { heroImage: any }) {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Optimizing Solutions with{' '}
            <span className="text-primary">Data Expertise.</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl">
            From Raw Data to AI-Driven Growth: We architect the future of your
            business, bridging the gap between complex data engineering and
            Generative AI.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/solutions">
                Explore Our Solutions <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Schedule a Consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="font-semibold text-primary">Our Services</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A Complete Data & AI Ecosystem
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We provide end-to-end solutions to manage, analyze, and monetize
            your data.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title} className="flex flex-col text-center items-center bg-card hover:border-primary transition-colors duration-300">
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionsSection() {
  return (
    <section id="solutions" className="py-20 sm:py-32 bg-card/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <p className="font-semibold text-primary">Innovation Lab</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Turn-Key AI Solutions
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground lg:mx-auto">
            Explore our ready-to-deploy AI tools designed to solve your most
            pressing business challenges.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 md:grid-cols-2">
          {solutions.map((solution, index) => (
            <Card
              key={solution.title}
              className={cn("group relative flex flex-col p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
                index % 2 !== 0 ? "md:translate-y-10" : ""
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <solution.icon
                    className="h-6 w-6 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold leading-6 text-foreground">
                    {solution.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-primary">
                    Problem Solved: {solution.problem}
                  </p>
                  <p className="mt-2 text-base text-muted-foreground">
                    {solution.description}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="link" asChild className="p-0 text-primary">
                  <Link href={solution.href}>
                    Try the Demo <span aria-hidden="true" className="ml-2">→</span>
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}