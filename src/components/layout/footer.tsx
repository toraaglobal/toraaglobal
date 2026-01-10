import Link from 'next/link';
import { Logo } from './logo';
import { Button } from '../ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';

const navItems = [
  { href: '/solutions', label: 'Innovation Lab' },
  { href: '/about', label: 'About Us' },
  { href: '/resources', label: 'Knowledge Base' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex flex-col items-center gap-6 md:items-start">
              <Logo />
              <p className="max-w-xs text-center text-muted-foreground md:text-left">
                Bridging the gap between complex data engineering and Generative AI.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-3 md:text-left">
              <div>
                <h3 className="font-semibold text-foreground">Company</h3>
                <ul className="mt-4 space-y-2">
                  {navItems.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-muted-foreground hover:text-primary">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Connect</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary">LinkedIn</a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-primary">Twitter</a>
                  </li>
                  <li>
                    <a href="https://github.com/toraaglobal" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">GitHub</a>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h3 className="font-semibold text-foreground">Location</h3>
                <p className="mt-4 text-muted-foreground">
                  1968 S. Coast Hwy #1571 <br />
                  Laguna Beach, CA 92651 <br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/40 py-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ToraaGlobal LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/toraaglobal" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github className="h-5 w-5" /></a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
