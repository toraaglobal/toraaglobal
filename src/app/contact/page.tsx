'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { ContactForm } from '@/components/contact-form';

export default function ContactPage() {
  return (
    <div className="py-20 sm:py-32 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            Let's Build the <span className="text-primary">Future</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground"
          >
            Have a project in mind or just want to learn more about our services?
            We'd love to hear from you.
          </motion.p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
            <p className="mt-4 text-muted-foreground">
              Our team is ready to answer your questions and explore how we can help your business grow.
            </p>
            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <MapPin className="h-6 w-6 flex-shrink-0 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Our Office</h3>
                  <p className="text-muted-foreground">
                    1968 S. Coast Hwy #1571<br />
                    Laguna Beach, CA 92651<br />
                    United States
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Mail className="h-6 w-6 flex-shrink-0 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Email Us</h3>
                  <a href="mailto:info@toraaglobal.com" className="text-muted-foreground hover:text-primary transition-colors">
                    info@toraaglobal.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Phone className="h-6 w-6 flex-shrink-0 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Call Us</h3>
                  <a href="tel:+19254789859" className="text-muted-foreground hover:text-primary transition-colors">
                    +1 (925) 478-9859
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
