import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "¿Necesito conocimientos técnicos para usar el producto?",
    answer: "No, para nada. Nuestros productos están diseñados para que cualquier persona pueda configurarlos en menos de 2 minutos. Solo necesitas escanear el QR con tu móvil y seguir las instrucciones en pantalla para vincular tu enlace de Google, Instagram, WhatsApp o cualquier otra URL.",
  },
  {
    question: "¿Puedo cambiar el enlace después de configurarlo?",
    answer: "¡Por supuesto! Puedes cambiar el enlace de destino tantas veces como quieras desde tu panel de control online. No hay límites ni costos adicionales. Esto te permite usar el mismo expositor para diferentes campañas o promociones.",
  },
  {
    question: "¿Funciona sin internet?",
    answer: "El expositor en sí no necesita conexión a internet. Sin embargo, cuando un cliente escanea el código QR o toca con su teléfono (NFC), su dispositivo sí necesitará conexión para abrir el enlace de destino.",
  },
  {
    question: "¿Qué pasa si pierdo o daño el expositor?",
    answer: "Ofrecemos reemplazo con descuento para clientes existentes. Además, tus configuraciones se guardan en tu cuenta, por lo que si compras un nuevo expositor, puedes vincularlo a la misma configuración en segundos.",
  },
  {
    question: "¿Funciona con todos los teléfonos?",
    answer: "Sí. El código QR funciona con cualquier smartphone moderno (iPhone y Android). La tecnología NFC funciona con iPhone 7 o superior y la mayoría de teléfonos Android de los últimos 5 años. Si el NFC no está disponible, el cliente siempre puede usar el QR.",
  },
  {
    question: "¿Cuánto tarda en llegar mi pedido?",
    answer: "Procesamos los pedidos en 24-48 horas laborables. El envío estándar dentro de España peninsular tarda entre 2-4 días. También ofrecemos envío express para entregas urgentes.",
  },
  {
    question: "¿Puedo personalizar el diseño del expositor?",
    answer: "Actualmente ofrecemos varios diseños prediseñados optimizados para diferentes plataformas (Google, Instagram, WhatsApp, etc.). Para pedidos de más de 10 unidades, ofrecemos personalización con tu logo y colores corporativos. Contáctanos para más información.",
  },
  {
    question: "¿Hay algún costo mensual o suscripción?",
    answer: "No. Pagas una única vez por el producto físico y la configuración es gratuita para siempre. No hay suscripciones, cuotas mensuales ni costos ocultos. El panel de control online también es gratuito.",
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="py-16 md:py-24 hero-bg">
        <div className="section-container text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encuentra respuestas a las dudas más comunes sobre nuestros productos NFC y QR
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="section-container max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="bg-card rounded-xl px-6 border border-border/50 data-[state=open]:shadow-lg transition-shadow duration-200"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="section-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-muted-foreground mb-6">
            Escríbenos y te responderemos en menos de 24 horas
          </p>
          <a 
            href="mailto:hola@tapreview.com"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            hola@tapreview.com
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
