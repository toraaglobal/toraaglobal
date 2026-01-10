'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { services, solutions } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CallToAction } from '@/components/cta';
import { cn } from '@/lib/utils';

export default function Home() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero-background');

  return (
    <div className="flex flex-col overflow-hidden">
      <HeroSection heroImage={heroImage} />
      <ServicesSection />
      <SolutionsSection />
      <CallToAction />
    </div>
  );
}

function HeroSection({ heroImage }: { heroImage: any }) {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
      {heroImage && (
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container max-w-7xl text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            Optimizing Solutions with{' '}
            <span className="text-primary block sm:inline">Data Expertise.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground sm:text-xl"
          >
            From Raw Data to AI-Driven Growth: We architect the future of your
            business, bridging the gap between complex data engineering and
            Generative AI.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" asChild className="group">
              <Link href="/solutions">
                Explore Our Solutions <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Schedule a Consultation</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 sm:py-32 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-semibold text-primary"
          >
            Our Services
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            A Complete Data & AI Ecosystem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
          >
            We provide end-to-end solutions to manage, analyze, and monetize
            your data.
          </motion.p>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={item}>
              <Card className="flex flex-col text-center items-center bg-card hover:border-primary transition-colors duration-300 h-full">
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SolutionsSection() {
  const homePageSolutions = solutions.slice(0, 4);
  return (
    <section id="solutions" className="py-20 sm:py-32 bg-card/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-semibold text-primary"
          >
            Innovation Lab
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Turn-Key AI Solutions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-4 max-w-2xl text-lg text-muted-foreground lg:mx-auto"
          >
            Explore our ready-to-deploy AI tools designed to solve your most
            pressing business challenges.
          </motion.p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 md:grid-cols-2">
          {homePageSolutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card
                className={cn("group relative flex flex-col p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full",
                  index % 2 !== 0 ? "md:translate-y-10" : ""
                )}
              >
                <div className="flex items-start gap-4 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <solution.icon
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 flex flex-col h-full">
                    <h3 className="text-lg font-semibold leading-6 text-foreground">
                      {solution.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-primary">
                      Problem Solved: {solution.problem}
                    </p>
                    <p className="mt-2 text-base text-muted-foreground flex-grow">
                      {solution.description}
                    </p>
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <Button variant="link" asChild className="p-0 text-primary h-auto font-semibold">
                        <Link href={solution.href}>
                          Try the Demo <span aria-hidden="true" className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
