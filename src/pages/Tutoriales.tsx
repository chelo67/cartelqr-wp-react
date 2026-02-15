import { useQuery } from "@tanstack/react-query";
import { getWordPressPosts } from "@/lib/wordpress";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

export default function Tutoriales() {
    const { data: posts, isLoading, error } = useQuery({
        queryKey: ["wp-posts"],
        queryFn: getWordPressPosts,
    });

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="section-container py-12">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
                        Artículos
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Aprende a sacar el máximo provecho de tus carteles inteligentes y descubre las últimas novedades.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="aspect-video w-full rounded-2xl" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-10 w-28" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12 border rounded-2xl bg-destructive/5">
                        <p className="text-destructive font-medium">Error al cargar los tutoriales. Por favor, inténtalo de nuevo más tarde.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts?.map((post) => {
                            const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.svg';

                            return (
                                <div key={post.id} className="group relative bg-card rounded-2xl overflow-hidden card-interactive flex flex-col h-full border border-border/50">
                                    {/* Image container */}
                                    <div className="relative aspect-video bg-secondary/50 overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt={post.title.rendered}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3
                                            className="text-xl font-bold text-foreground mb-3 line-clamp-2"
                                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                        />
                                        <div
                                            className="text-sm text-muted-foreground mb-6 line-clamp-3 prose prose-sm dark:prose-invert"
                                            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                                        />

                                        <div className="mt-auto">
                                            <Link to={`/tutoriales/${post.slug}`}>
                                                <Button variant="hero" className="w-full sm:w-auto">
                                                    Leer más
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
