import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getWooCommerceProductById, WooProduct } from "@/lib/woocommerce";
import { Loader2, AlertCircle, ArrowLeft, ShoppingCart, Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function ProductoDetalle() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [product, setProduct] = useState<WooProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            quantity: 1,
            image: product.images[0]?.src || "/placeholder.svg"
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getWooCommerceProductById(id);
                setProduct(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching product detail:", err);
                setError("No se pudo cargar la información del producto.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const stripHtml = (html: string) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground">Cargando detalles del producto...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Producto no encontrado</h2>
                    <p className="text-muted-foreground mb-6">{error || "El producto que buscas no existe."}</p>
                    <Button onClick={() => navigate("/productos")}>
                        Volver a la tienda
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="section-container py-12">
                <Button
                    variant="ghost"
                    className="mb-8 gap-2"
                    onClick={() => navigate("/productos")}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a productos
                </Button>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-secondary/30 rounded-3xl overflow-hidden">
                            <img
                                src={product.images[0]?.src || "/placeholder.svg"}
                                alt={product.images[0]?.alt || product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.slice(1).map((img, i) => (
                                    <div key={i} className="aspect-square bg-secondary/30 rounded-xl overflow-hidden">
                                        <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-primary">
                                ${parseFloat(product.price).toFixed(2)}
                            </span>
                            {parseFloat(product.sale_price) < parseFloat(product.regular_price) && (
                                <span className="text-xl text-muted-foreground line-through">
                                    ${parseFloat(product.regular_price).toFixed(2)}
                                </span>
                            )}
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none mb-4 text-muted-foreground">
                            <p>{stripHtml(product.short_description)}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                                <p>{stripHtml(product.description)}</p>
                            </div>
                        </div>

                        <div className="mt-auto space-y-4">
                            <Button
                                variant={added ? "secondary" : "hero"}
                                size="lg"
                                className="w-full gap-2 text-lg"
                                onClick={handleAddToCart}
                            >
                                {added ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        ¡Añadido!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5" />
                                        Añadir al carrito
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full gap-2 text-lg"
                                onClick={() => window.open(`https://koonetix.shop/producto/${product.sku}`, '_blank')}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Comprar ahora
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                Serás redirigido a nuestra tienda oficial para completar el pago de forma segura.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
