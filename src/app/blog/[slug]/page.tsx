import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { blogs } from '@/lib/data';

export function generateStaticParams() {
    return blogs.map((blog) => ({
        slug: blog.id,
    }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const blog = blogs.find((b) => b.id === params.slug);

    if (!blog) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-background py-20 sm:py-32">
            <div className="container mx-auto px-4 max-w-4xl">
                <Button asChild variant="ghost" className="mb-8 hover:bg-transparent hover:text-primary pl-0">
                    <Link href="/blog" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Insights
                    </Link>
                </Button>

                <header className="mb-10 text-center">
                    <Badge className="mb-4">{blog.category}</Badge>
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
                        {blog.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{blog.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <span>{blog.date}</span>
                        </div>
                    </div>
                </header>

                <div
                    className="prose prose-lg dark:prose-invert max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
            prose-strong:text-foreground
            prose-li:text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <hr className="my-12 border-border" />

                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Share this article</p>
                        <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Share2 className="h-4 w-4" />
                                Share
                            </Button>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href="/contact">Discuss this Topic</Link>
                    </Button>
                </div>
            </div>
        </article>
    );
}
