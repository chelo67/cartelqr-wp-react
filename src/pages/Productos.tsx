import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Filter, Loader2, AlertCircle } from "lucide-react";
import { getWooCommerceProducts, WooProduct } from "@/lib/woocommerce";

export default function Productos() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getWooCommerceProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("No se pudieron cargar los productos. Por favor, inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    if (filter === "all") return true;
    return product.categories.some(cat => cat.slug === filter);
  });

  const categories = [
    { id: "all", name: "Todos" },
    { id: "expositor", name: "Expositores" },
    { id: "tarjeta", name: "Tarjetas" },
    { id: "pack", name: "Packs" },
  ];

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="py-16 md:py-20 hero-bg">
        <div className="section-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nuestros Productos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expositores y tarjetas NFC + QR diseñados para impulsar las reseñas y visitas de tu negocio
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border/50">
        <div className="section-container">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filtrar:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={filter === cat.id ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setFilter(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Cargando productos...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h3 className="text-xl font-semibold mb-2">Error de conexión</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>Reintentar</Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    image={product.images[0]?.src || "/placeholder.svg"}
                    title={product.name}
                    description={stripHtml(product.short_description)}
                    price={parseFloat(product.price)}
                    badge={parseFloat(product.sale_price) < parseFloat(product.regular_price) ? "Oferta" : undefined}
                    buttonText="Ver Producto"
                    onBuy={() => navigate(`/producto/${product.id}`)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-muted-foreground text-lg">No se encontraron productos en esta categoría.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Bulk Order CTA */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="section-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            ¿Necesitas pedidos en volumen?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Ofrecemos precios especiales para pedidos de más de 10 unidades.
            También personalizamos con tu logo y colores corporativos.
          </p>
          <Button variant="outline" size="lg">
            Contactar para mayoristas
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
