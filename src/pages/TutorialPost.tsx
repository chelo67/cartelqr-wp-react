import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getWordPressPostBySlug } from "@/lib/wordpress";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WordPressContent } from "@/components/WordPressContent";
import { ChevronLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function TutorialPost() {
    const { slug } = useParams<{ slug: string }>();

    const { data: post, isLoading, error } = useQuery({
        queryKey: ["wp-post", slug],
        queryFn: () => getWordPressPostBySlug(slug || ""),
        enabled: !!slug,
    });

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="section-container py-12">
                <div className="max-w-4xl mx-auto">
                    <Link to="/tutoriales">
                        <Button variant="ghost" size="sm" className="mb-8 -ml-2 text-muted-foreground hover:text-primary">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Volver a artículos
                        </Button>
                    </Link>

                    {isLoading ? (
                        <div className="space-y-8">
                            <Skeleton className="h-12 w-3/4" />
                            <div className="flex gap-4">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="aspect-video w-full rounded-3xl" />
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                    ) : error || !post ? (
                        <div className="text-center py-24 border rounded-3xl bg-destructive/5">
                            <h2 className="text-2xl font-bold text-destructive mb-2">No pudimos encontrar este tutorial</h2>
                            <p className="text-muted-foreground mb-8">Parece que el enlace es incorrecto o el post ha sido eliminado.</p>
                            <Link to="/tutoriales">
                                <Button variant="hero">Explorar otros tutoriales</Button>
                            </Link>
                        </div>
                    ) : (
                        <article className="animate-fade-in">
                            {/* Header */}
                            <header className="mb-10 text-center">
                                <h1
                                    className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6"
                                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                />
                                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{format(new Date(post.date), "d 'de' MMMM, yyyy", { locale: es })}</span>
                                    </div>
                                </div>
                            </header>

                            {/* Featured Image */}
                            {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                                <div className="relative aspect-video mb-12 rounded-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src={post._embedded['wp:featuredmedia'][0].source_url}
                                        alt={post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-lg">
                                <WordPressContent content={post.content.rendered} />
                            </div>
                        </article>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
