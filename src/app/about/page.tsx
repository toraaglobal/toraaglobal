import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { team } from '@/lib/data';
import { CallToAction } from '@/components/cta';

export const metadata = {
  title: 'About Us | ToraaGlobal Solutions',
  description: 'Meet the expert team of data architects, AI researchers, and engineers driving innovation at Toraaglobal.',
};

export default function AboutPage() {
  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            The Minds Behind the <span className="text-primary">Data</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            We are a team of passionate technologists, researchers, and strategists
            dedicated to unlocking the transformative power of data and AI for our clients.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <Card key={member.name} className="group overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={`Portrait of ${member.name}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint="man portrait"
                />
              </div>
              <CardHeader className="pb-2">
                <h3 className="text-xl font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary">{member.title}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{member.niche}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <CallToAction />
    </>
  );
}
