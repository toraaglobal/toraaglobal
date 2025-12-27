import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';

export const metadata = {
  title: 'Contact Us | ToraaGlobal Solutions',
  description: 'Get in touch with the Toraaglobal team to discuss your data and AI needs. Find our contact details and office location.',
};

export default function ContactPage() {
  return (
    <div className="py-20 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Let's Build the <span className="text-primary">Future</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            Have a project in mind or just want to learn more about our services?
            We'd love to hear from you.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
            <p className="mt-4 text-muted-foreground">
              Our team is ready to answer your questions and explore how we can help your business grow.
            </p>
            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">Our Office</h3>
                  <p className="text-muted-foreground">
                    123 Innovation Drive<br />
                    Laguna Beach, CA 92651<br />
                    United States
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">Email Us</h3>
                  <a href="mailto:contact@toraaglobal.com" className="text-muted-foreground hover:text-primary">
                    contact@toraaglobal.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 flex-shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">Call Us</h3>
                  <a href="tel:+15551234567" className="text-muted-foreground hover:text-primary">
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
