import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { StepCard } from "@/components/StepCard";
import { BenefitItem } from "@/components/BenefitItem";
import { TestimonialCard } from "@/components/TestimonialCard";
import { ShoppingCart, Play, CreditCard, Smartphone, QrCode, Star, Zap, Globe, Edit, RefreshCcw } from "lucide-react";

// Import images
import heroImage from "@/assets/hero-display.jpg";
import productDisplay1 from "@/assets/product-display-1.jpg";
import productDisplay2 from "@/assets/product-display-2.jpg";
import productCard1 from "@/assets/product-card-1.jpg";

const products = [
  {
    image: productDisplay2,
    title: "Expositor Google Reseñas NFC + QR",
    description: "Aumenta tus reseñas en Google con un tap o escáner",
    price: 29.99,
    badge: "Más vendido",
  },
  {
    image: productDisplay1,
    title: "Expositor Universal NFC + QR",
    description: "Configúralo para cualquier destino: web, redes, menú...",
    price: 24.99,
  },
  {
    image: productCard1,
    title: "Tarjeta NFC Premium",
    description: "Compacta y elegante. Perfecta para entregar o dejar en mesa",
    price: 14.99,
    badge: "Nuevo",
  },
];

const testimonials = [
  {
    quote: "Aumenté mis reseñas en Google de 15 a 87 en solo 3 semanas. Mis clientes lo usan sin problema.",
    author: "María García",
    business: "Peluquería Estilo",
  },
  {
    quote: "Simple, efectivo y profesional. Mis clientes quedan impresionados con la tecnología.",
    author: "Carlos Ruiz",
    business: "Restaurante El Rincón",
  },
  {
    quote: "La mejor inversión que he hecho para mi negocio. Se paga solo con las nuevas reseñas.",
    author: "Ana Martínez",
    business: "Café Central",
  },
];

const benefits = [
  "No necesita app ni instalación",
  "Se configura una sola vez en 2 minutos",
  "Puedes editar el enlace cuando quieras",
  "Funciona con iPhone y Android",
  "Diseño profesional y duradero",
  "Soporte incluido de por vida",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-bg">
        <div className="section-container py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Tecnología NFC + QR
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
                Convierte cada visita en una{" "}
                <span className="text-gradient">reseña o contacto</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Expositores y tarjetas NFC + QR listos para usar en tu negocio. 
                Sin apps. Sin complicaciones. Solo resultados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="hero" size="xl">
                  <ShoppingCart className="w-5 h-5" />
                  Comprar ahora
                </Button>
                <Button variant="heroOutline" size="xl">
                  <Play className="w-5 h-5" />
                  Ver cómo funciona
                </Button>
              </div>
              
              {/* Social proof mini */}
              <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-bold border-2 border-background">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-primary">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-muted-foreground">+500 negocios confían en nosotros</span>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative animate-fade-in-up lg:order-last">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
                <img 
                  src={heroImage} 
                  alt="Expositor NFC en mostrador de café" 
                  className="w-full h-auto"
                />
                {/* Floating badge */}
                <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-foreground">+1 reseña recibida</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="section-container">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Simple y rápido</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              En 3 sencillos pasos tendrás tu expositor funcionando y recibiendo reseñas
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <StepCard 
              step={1}
              icon={<CreditCard className="w-10 h-10" />}
              title="Compra tu expositor"
              description="Elige el diseño que mejor se adapte a tu negocio y recíbelo en casa"
            />
            <StepCard 
              step={2}
              icon={<Smartphone className="w-10 h-10" />}
              title="Escanea y activa"
              description="Configura el enlace de destino con nuestro panel online en segundos"
            />
            <StepCard 
              step={3}
              icon={<Star className="w-10 h-10" />}
              title="Recibe reseñas"
              description="Colócalo en tu mostrador y empieza a conseguir más reseñas automáticamente"
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Catálogo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Productos destacados
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Diseñados para durar y causar una excelente impresión en tus clientes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <ProductCard key={i} {...product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Ver todos los productos
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Ventajas</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                ¿Por qué elegir TapReview?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Diseñamos productos que simplemente funcionan. Sin complicaciones técnicas, 
                sin necesidad de apps, sin suscripciones.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((benefit, i) => (
                  <BenefitItem key={i} text={benefit} />
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-card rounded-2xl p-6 card-interactive">
                    <QrCode className="w-12 h-12 text-primary mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">QR Universal</h4>
                    <p className="text-sm text-muted-foreground">Compatible con todas las cámaras de móvil</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 card-interactive">
                    <Globe className="w-12 h-12 text-primary mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">Sin fronteras</h4>
                    <p className="text-sm text-muted-foreground">Funciona en cualquier país del mundo</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-card rounded-2xl p-6 card-interactive">
                    <Edit className="w-12 h-12 text-primary mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">Editable</h4>
                    <p className="text-sm text-muted-foreground">Cambia el enlace cuando quieras</p>
                  </div>
                  <div className="bg-card rounded-2xl p-6 card-interactive">
                    <RefreshCcw className="w-12 h-12 text-primary mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">Reutilizable</h4>
                    <p className="text-sm text-muted-foreground">Úsalo para diferentes campañas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonios</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Más de 500 negocios ya confían en TapReview para impulsar sus reseñas
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={i} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-accent">
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            ¿Listo para conseguir más reseñas?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Únete a más de 500 negocios que ya usan TapReview para impulsar su reputación online
          </p>
          <Button 
            variant="heroOutline" 
            size="xl"
            className="bg-background text-foreground hover:bg-background/90 border-0"
          >
            <ShoppingCart className="w-5 h-5" />
            Comprar ahora
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
