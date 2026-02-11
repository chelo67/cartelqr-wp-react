import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { StepCard } from "@/components/StepCard";
import { 
  ShoppingCart, 
  CreditCard, 
  Smartphone, 
  Star, 
  QrCode, 
  Wifi,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

import heroImage from "@/assets/hero-display.jpg";
import productDisplay2 from "@/assets/product-display-2.jpg";

const steps = [
  {
    step: 1,
    icon: <CreditCard className="w-10 h-10" />,
    title: "Compra tu expositor",
    description: "Elige el diseño que mejor se adapte a tu negocio. Recíbelo en casa en 2-4 días laborables.",
  },
  {
    step: 2,
    icon: <Smartphone className="w-10 h-10" />,
    title: "Escanea el código de activación",
    description: "Con tu móvil, escanea el QR de la caja y accede a tu panel de configuración personal.",
  },
  {
    step: 3,
    icon: <QrCode className="w-10 h-10" />,
    title: "Introduce tu enlace de destino",
    description: "Pega la URL de tu página de reseñas, Instagram, WhatsApp o cualquier enlace que desees.",
  },
  {
    step: 4,
    icon: <Star className="w-10 h-10" />,
    title: "¡Listo! Colócalo y recibe reseñas",
    description: "Pon el expositor en tu mostrador. Tus clientes solo tienen que acercar el móvil o escanear.",
  },
];

const techSpecs = [
  { label: "Tecnología NFC", value: "NTAG215 compatible con iOS y Android" },
  { label: "Código QR", value: "Alta densidad, legible desde 30cm" },
  { label: "Material", value: "Acrílico premium de 3mm" },
  { label: "Dimensiones", value: "10cm x 15cm x 5cm (base)" },
  { label: "Durabilidad", value: "Resistente a agua y arañazos" },
  { label: "Garantía", value: "2 años de garantía incluida" },
];

export default function ComoFunciona() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="py-16 md:py-24 hero-bg relative overflow-hidden">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Tutorial</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-6">
                Así de fácil es conseguir más reseñas
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Nuestros expositores NFC + QR están diseñados para que cualquier persona 
                pueda configurarlos en menos de 2 minutos. Sin apps. Sin complicaciones.
              </p>
              <Button variant="hero" size="lg">
                <ShoppingCart className="w-5 h-5" />
                Comprar ahora
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Expositor NFC en uso" 
                className="rounded-2xl shadow-2xl shadow-primary/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Steps Timeline */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              4 pasos y listo
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Desde que recibes el paquete hasta que empiezas a recibir reseñas
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <StepCard {...step} />
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/4 right-0 translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How NFC/QR Works */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">La tecnología</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                NFC + QR: doble compatibilidad
              </h2>
              <p className="text-muted-foreground mb-8">
                Cada expositor combina dos tecnologías para garantizar que todos tus clientes 
                puedan usarlo sin importar su dispositivo.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Wifi className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">NFC (Near Field Communication)</h4>
                    <p className="text-sm text-muted-foreground">
                      Solo acerca el móvil y se abre automáticamente el enlace. 
                      Compatible con iPhone 7+ y mayoría de Android.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Código QR</h4>
                    <p className="text-sm text-muted-foreground">
                      Alternativa universal. Escanea con la cámara del móvil 
                      y accede al enlace en un segundo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={productDisplay2} 
                alt="Expositor con Google Reviews" 
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Specs */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Especificaciones técnicas
            </h2>
          </div>
          
          <div className="max-w-2xl mx-auto bg-card rounded-2xl p-8 shadow-lg">
            <div className="space-y-4">
              {techSpecs.map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span className="font-medium text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-accent">
        <div className="section-container text-center">
          <CheckCircle2 className="w-16 h-16 text-primary-foreground mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            ¿Convencido?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Empieza hoy a conseguir más reseñas para tu negocio
          </p>
          <Button 
            variant="heroOutline" 
            size="xl"
            className="bg-background text-foreground hover:bg-background/90 border-0"
          >
            <ShoppingCart className="w-5 h-5" />
            Ver productos
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
