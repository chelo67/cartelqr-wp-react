import { Link } from "react-router-dom";
import { Smartphone, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  productos: [
    { label: "Expositores NFC", href: "/productos" },
    { label: "Tarjetas NFC", href: "/productos" },
    { label: "Packs empresariales", href: "/productos" },
  ],
  soporte: [
    { label: "Cómo funciona", href: "/como-funciona" },
    { label: "Preguntas frecuentes", href: "/faq" },
    { label: "Contacto", href: "/contacto" },
  ],
  legal: [
    { label: "Términos y condiciones", href: "/terminos" },
    { label: "Política de privacidad", href: "/privacidad" },
    { label: "Política de envíos", href: "/envios" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">TapReview</span>
            </Link>
            <p className="text-background/70 text-sm mb-6">
              Expositores y tarjetas NFC + QR para impulsar las reseñas de tu negocio.
            </p>
            <div className="space-y-3">
              <a href="mailto:hola@tapreview.com" className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors">
                <Mail className="w-4 h-4" />
                hola@tapreview.com
              </a>
              <a href="tel:+34900123456" className="flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors">
                <Phone className="w-4 h-4" />
                +34 900 123 456
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Productos</h4>
            <ul className="space-y-3">
              {footerLinks.productos.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Soporte</h4>
            <ul className="space-y-3">
              {footerLinks.soporte.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/60">
              © {new Date().getFullYear()} TapReview. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-background/40">Hecho con ❤️ en España</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
