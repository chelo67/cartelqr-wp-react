import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createWooCommerceOrder } from "@/lib/woocommerce";
import { ShoppingBag, ArrowRight, CheckCircle2, Loader2, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, totalPrice, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState<any>(null);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        address: "",
        city: "",
        state: "",
        postcode: "",
        phone: "",
    });

    // Update form if user logs in while on page
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || prev.firstName,
                lastName: user.lastName || prev.lastName,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    if (cart.length === 0 && !orderComplete) {
        navigate("/productos");
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const orderPayload = {
            payment_method: "bacs",
            payment_method_title: "Transferencia bancaria directa",
            set_paid: false,
            billing: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                address_1: formData.address,
                city: formData.city,
                state: formData.state,
                postcode: formData.postcode,
                country: "AR",
                email: formData.email,
                phone: formData.phone,
            },
            line_items: cart.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
            })),
        };

        try {
            const order = await createWooCommerceOrder(orderPayload);
            setOrderComplete(order);
            clearCart();
            toast.success("¡Pedido realizado con éxito!");
        } catch (error: any) {
            toast.error(error.message || "Error al procesar el pedido");
        } finally {
            setLoading(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center animate-fade-in">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">¡Gracias por tu compra!</h1>
                        <p className="text-muted-foreground mb-6">
                            Tu pedido <span className="font-bold text-foreground">#{orderComplete.id}</span> ha sido recibido correctamente. Te hemos enviado un correo con los detalles.
                        </p>
                        <Button variant="hero" className="w-full" onClick={() => navigate("/")}>
                            Volver al inicio
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 section-container py-12">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
                    {/* Form Section */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                            <ShoppingBag className="w-8 h-8 text-primary" />
                            Finalizar Pedido
                        </h1>

                        {!isAuthenticated && (
                            <div className="bg-secondary/20 border border-border rounded-xl p-4 mb-8 flex items-center justify-between">
                                <p className="text-sm">¿Ya tienes una cuenta?</p>
                                <Link to="/login" state={{ from: location }}>
                                    <Button variant="outline" size="sm">Iniciar Sesión</Button>
                                </Link>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Datos de Contacto</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Nombre</Label>
                                        <Input id="firstName" name="firstName" required value={formData.firstName} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Apellido</Label>
                                        <Input id="lastName" name="lastName" required value={formData.lastName} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Correo Electrónico</Label>
                                        <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Teléfono</Label>
                                        <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Dirección de Envío</h2>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <Input id="address" name="address" required value={formData.address} onChange={handleInputChange} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Ciudad</Label>
                                        <Input id="city" name="city" required value={formData.city} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">Provincia</Label>
                                        <Input id="state" name="state" required value={formData.state} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="postcode">C.P.</Label>
                                        <Input id="postcode" name="postcode" required value={formData.postcode} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </section>

                            <div className="pt-6">
                                <Button type="submit" variant="hero" size="lg" className="w-full text-lg gap-2 h-14" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Confirmar Pedido (${totalPrice.toFixed(2)})
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Summary Section */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>
                            <div className="space-y-4 mb-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-muted-foreground">Cant: {item.quantity}</span>
                                                <span className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Separator className="mb-4" />
                            <div className="space-y-2">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground text-sm italic">
                                    <span>Envío</span>
                                    <span>Calculado al procesar</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2">
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
