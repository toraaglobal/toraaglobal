'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { blogs } from '@/lib/data';
import { CalendarDays, User } from 'lucide-react';

export default function BlogPage() {
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
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 sm:py-32 bg-primary/5">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold tracking-tight sm:text-6xl"
                    >
                        Insights & <span className="text-primary">News</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto"
                    >
                        Expert perspectives on data engineering, artificial intelligence, and digital strategy. Stay ahead of the curve with our latest articles.
                    </motion.p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4 max-w-7xl">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-50px' }}
                        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {blogs.map((blog) => (
                            <motion.div key={blog.id} variants={item}>
                                <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card">
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                                {blog.category}
                                            </Badge>
                                        </div>
                                        <CardTitle className="line-clamp-2 text-xl">{blog.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-muted-foreground line-clamp-3 mb-4">
                                            {blog.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                <span>{blog.author}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CalendarDays className="h-3 w-3" />
                                                <span>{blog.date}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <Button asChild className="w-full">
                                            <Link href={`/blog/${blog.id}`}>Read Article</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
